// no-fabricated-turn.js の回帰テスト（2026-09-11 第2セッション）
// 合成 transcript を作って実際にフックを起動し、block / pass を確認する。
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = process.argv[2] || 'C:\\dev\\real-estate\\.claude\\hooks\\no-fabricated-turn.js';
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nft-'));

const human = (t) => ({ type: 'user', origin: { kind: 'human' }, message: { role: 'user', content: t } });
const asst = (t) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: t }] } });
const feedback = (t) => ({
  type: 'user', isMeta: true, origin: null, userType: 'external',
  message: { role: 'user', content: 'Stop hook feedback:\n' + t },
});

function run(name, objs) {
  const tp = path.join(DIR, name.replace(/\W+/g, '_') + '.jsonl');
  fs.writeFileSync(tp, objs.map((o) => JSON.stringify(o)).join('\n') + '\n', 'utf8');
  for (const sc of ['.nftguard']) { try { fs.unlinkSync(tp + sc); } catch {} }
  const out = execFileSync('node', [HOOK], {
    input: JSON.stringify({ transcript_path: tp }),
    encoding: 'utf8',
  });
  let decision = 'pass', reason = '';
  if (out.trim()) { const j = JSON.parse(out); decision = j.decision; reason = j.reason || ''; }
  return { decision, reason };
}

const CASES = [
  {
    name: '1 正常＝1解答に1採点',
    objs: [human('肢2です'), asst('正解です。根拠は…')],
    want: 'pass',
  },
  {
    name: '2 🔴 再現＝別フックに差し戻された採点を書き直した（旧版はここでブロックしていた）',
    objs: [
      human('肢2です'),
      asst('正解です。根拠は…'),
      feedback('【スレッド長の注意】現在 556 メッセージ（LEVEL1）'),
      asst('（スレッド長 LEVEL1 の注意）正解です。根拠は…'),
    ],
    want: 'pass',
  },
  {
    name: '3 自フックのブロック後の書き直しも通る（同じ採点1回）',
    objs: [
      human('肢2です'),
      asst('user: 肢2です\n正解です。'),
      feedback('【鉄則C（捏造禁止）違反を検出しました】A: 会話ロール記号の漏洩'),
      asst('正解です。根拠は…'),
    ],
    want: 'pass',
  },
  {
    name: '4 C の本来の検出＝差し戻しを挟まず採点が2回（ツール継続での捏造反復）',
    objs: [human('肢2です'), asst('正解です。'), asst('次の問。正解です。')],
    want: 'block',
  },
  {
    name: '5 差し戻し後に採点が2回でも検出する（リセットで検出力が落ちていない）',
    objs: [
      human('肢2です'),
      asst('正解です。'),
      feedback('【スレッド長の注意】LEVEL1'),
      asst('正解です。'),
      asst('次の問も正解です。'),
    ],
    want: 'block',
  },
  {
    name: '6 A ロール記号の漏洩は差し戻し後も検出する',
    objs: [
      human('肢2です'),
      asst('なにか'),
      feedback('【スレッド長の注意】LEVEL1'),
      asst('user：肢2です\nと答えましたね'),
    ],
    want: 'block',
  },
  {
    name: '7 B 出題の後ろに判定（同一メッセージ）',
    objs: [human('お願いします'), asst('次の4肢のうち誤りはどれか。番号と理由を答えてください。\n\n正解です。')],
    want: 'block',
  },
  {
    name: '8 D 出題の後ろに自作の解答',
    objs: [human('お願いします'), asst('○か×か答えてください。\n\n○ です')],
    want: 'block',
  },
];

let ng = 0;
for (const c of CASES) {
  const r = run(c.name, c.objs);
  const ok = r.decision === c.want || (c.want === 'pass' && r.decision !== 'block');
  if (!ok) ng++;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + c.name + '  → ' + r.decision + (c.want !== r.decision && r.decision === 'block' ? '\n        理由: ' + r.reason.split('\n').slice(2, 4).join(' / ') : ''));
  if (ok && r.decision === 'block') {
    const lines = r.reason.split('\n').filter((x) => /^[A-D]:/.test(x));
    console.log('        検出: ' + lines.join(' | '));
  }
}
console.log(ng === 0 ? '\n全' + CASES.length + '件 PASS' : '\n' + ng + '件 FAIL');
process.exit(ng ? 1 : 0);
