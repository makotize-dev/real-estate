#!/usr/bin/env node
// 鉄則C（捏造禁止）の機械的ガード。
// Stop フックとして動き、直前の assistant メッセージに
//   A: 会話ロール記号の漏洩（行頭の user / human / assistant に日本語やコロンが続く）
//   B: 出題（問い）のあとに正誤判定が同一メッセージ内にある
// を検出したらブロックし、書き直しを強制する。
//
// A は「ユーザーの解答を自分の出力に書いた」ときの直接の痕跡
// （2026-07-15 の違反では assistant テキスト内に "user○　あらかじめ…" が出力された）。

const fs = require('fs');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    process.exit(0);
  }

  // ブロック後の再実行で無限ループにしない
  if (input.stop_hook_active) process.exit(0);

  const tp = input.transcript_path;
  if (!tp || !fs.existsSync(tp)) process.exit(0);

  let lines;
  try {
    lines = fs.readFileSync(tp, 'utf8').split('\n').filter(Boolean);
  } catch {
    process.exit(0);
  }

  // 直近の assistant メッセージのテキストを取り出す
  let text = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    let o;
    try {
      o = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    const m = o.message;
    if (o.type === 'assistant' && m && Array.isArray(m.content)) {
      const t = m.content
        .filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n');
      if (t.trim()) {
        text = t;
        break;
      }
    }
  }
  if (!text) process.exit(0);

  const problems = [];

  // A: ロール記号の漏洩。行頭の user/human/assistant の直後がコロンか非ASCII（日本語）なら漏洩。
  //    "the user is ..." のような英語散文（直後がASCII）や "userType" にはマッチしない。
  const roleRe = /^[ \t]*(user|human|assistant)[ \t]*(?:[:：]|[^\x00-\x7F])/im;
  const mA = text.match(roleRe);
  if (mA) {
    problems.push(
      'A: 会話ロール記号の漏洩 — 行頭に「' +
        mA[0].trim().slice(0, 20) +
        '」が出力されています。相手のターンを自分で書いた痕跡です。'
    );
  }

  // B: 最後の「出題」より後ろに「正誤判定」がある＝解答を捏造して自分で採点した形。
  //    正常な流れ（前問の判定 → 解説 → 次の問い）は判定が問いより前なのでマッチしない。
  const ASK = /(○か×か|答えてください|番号と理由)/g;
  const JUDGE = /(正解です|不正解です)/g;
  let lastAsk = -1;
  let m1;
  while ((m1 = ASK.exec(text)) !== null) lastAsk = m1.index;
  if (lastAsk >= 0) {
    let m2;
    while ((m2 = JUDGE.exec(text)) !== null) {
      if (m2.index > lastAsk) {
        problems.push(
          'B: 出題のあとに正誤判定「' +
            m2[0] +
            '」が同じメッセージ内にあります。解答を待たずに採点した形です。'
        );
        break;
      }
    }
  }

  if (problems.length === 0) process.exit(0);

  const reason = [
    '【鉄則C（捏造禁止）違反を検出しました。このメッセージは送信されません】',
    ...problems,
    '',
    '書き直しの指示：',
    '1. ユーザーの発言・解答を自分で書かない。書いてしまった部分は削除する。',
    '2. 問いを出す回は、問いをメッセージの最後に置く。その後ろに解答・判定・解説・次の問いを一切書かない。',
    '3. ユーザーの実際の解答を受け取ってから、次の回で判定する。',
  ].join('\n');

  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
});
