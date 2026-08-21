#!/usr/bin/env node
// スレッド長の警告。Stop フックとして動く（捏造ガードとは別ファイル・別役割）。
//
// 目的：コンテキストの要約（コンパクション）が起きる「前」に知らせる。
//
// なぜ要約前に知らせる必要があるか（2026-07-28 に決定）：
//   コンテキストが埋まると古い部分は要約に置き換わる。すると e-Gov から取得した
//   「逐語の条文」が「要約された条文」に変わり、鉄則Aが禁じる『要約版を原文と
//   思い込む』状態へ自動的に落ちる。取得済みの根拠が静かに劣化するため、
//   気づいてからでは遅い。だから閾値に達したら能動的に警告する。
//
// 測り方：transcript の生バイト数はスクリーンショット等の base64 画像で歪むため
//   （2026-07-26 の過去問セッションは 6.3MB だがテキストは 82.5万字）、
//   **テキスト文字数**と**メッセージ数**で測る。data / source キーは除外する。
//
// 較正の根拠（2026-07-28 実測・このリポジトリの全 transcript）：
//   今日のスレッド      910 msgs / 71.5万字  → 重いが完走できた（＝上限の目安）
//   過去の最大        1,645 msgs / 135.3万字 → この規模なら要約は確実に起きていた
//
// 出し方（2026-08-12 改定）：
//   LEVEL1・LEVEL2 とも **1セッションで1回だけ**ブロックして確実に会話へ出す。
//   旧 LEVEL1 は systemMessage による非ブロック通知だったが、**systemMessage は
//   ユーザーの画面にしか出ず、Claude のコンテキストには入らない**。文面は「終了処理を
//   行い次回は新しいスレッドを立てる」＝**Claude がやる行動**を指示しているのに、
//   **行動する側に届かない**設計だった（2026-08-12 に実際に発火したが Claude は
//   気づかず、その後もノート追記・exam_v6 改修・終了処理まで進んだ。さらに同じ日に
//   「警告は出ていない」と断定した）。**到達性は「ユーザーに届くか」でなく
//   「その行動をする主体に届くか」で判定する。**
//     ブロックは内容の破棄を伴うため、書き直し指示で「同じ内容を再送してよい」と明示する。
//     一度出したらサイドカーに記録し、以後そのレベルでは二度とブロックしない。
//
// 文面（2026-08-21 改定）：
//   旧版は「①区切るか②続けるかを提案し、判断はユーザーに委ねる」と指示していたが、
//   これは **CLAUDE.md 行動トリガー表と食い違っていた**——同表の「スレッド長の警告
//   （LEVEL1）が出た」の行は「その日の区切りで終了処理を行い、次は新スレッド。
//   『終了処理か継続か』を聞き直さない（決まっている＝鉄則D）」。この行自体、
//   2026-08-15 に同じ2択を出して鉄則D違反と指摘された結果として入ったもので、
//   **フック側の文面がルール改定前のまま残っていた**（8/20・8/21 と2回、CLAUDE.md を
//   優先して2択を出さずに終了処理へ入り、その都度この食い違いを記録することになった）。
//   → LEVEL1・LEVEL2 とも「終了処理へ進む／2択を出さない」に統一した。
//   ※ LEVEL2 は実際には一度も発火していないが、同じ2択の文面を残すと発火した瞬間に
//     同じ食い違いが再生するため、あわせて直した（この判断は 8/21 の保守枠のもの。
//     CLAUDE.md の行が名指ししているのは LEVEL1 だけ）。

const fs = require('fs');

const LEVEL1 = { chars: 450000, msgs: 650 }; // 注意（非ブロック）
const LEVEL2 = { chars: 700000, msgs: 900 }; // 警告（1回だけブロック）

// base64 画像などを除いたテキスト量を数える
function textLen(x) {
  if (typeof x === 'string') return x.length;
  let t = 0;
  if (Array.isArray(x)) {
    for (const i of x) t += textLen(i);
  } else if (x && typeof x === 'object') {
    for (const [k, v] of Object.entries(x)) {
      if (k === 'data' || k === 'source') continue; // 画像の base64 は数えない
      t += textLen(v);
    }
  }
  return t;
}

function guardPath(tp) {
  return tp + '.ctxguard';
}
function readGuard(tp) {
  try {
    return JSON.parse(fs.readFileSync(guardPath(tp), 'utf8'));
  } catch {
    return { l1: false, l2: false };
  }
}
function writeGuard(tp, state) {
  try {
    fs.writeFileSync(guardPath(tp), JSON.stringify(state));
  } catch {
    /* 書けなくても検査は続行する */
  }
}

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    process.exit(0);
  }

  const tp = input.transcript_path;
  if (!tp || !fs.existsSync(tp)) process.exit(0);

  let lines;
  try {
    lines = fs.readFileSync(tp, 'utf8').split('\n').filter(Boolean);
  } catch {
    process.exit(0);
  }

  let msgs = 0;
  let chars = 0;
  for (const l of lines) {
    let o;
    try {
      o = JSON.parse(l);
    } catch {
      continue;
    }
    msgs++;
    if (o.message) chars += textLen(o.message.content);
  }

  const guard = readGuard(tp);
  const hit2 = chars >= LEVEL2.chars || msgs >= LEVEL2.msgs;
  const hit1 = chars >= LEVEL1.chars || msgs >= LEVEL1.msgs;

  const stat =
    '現在 ' + msgs + ' メッセージ / テキスト ' + Math.round(chars / 1000) + '千字';

  // LEVEL2：1回だけブロックして確実に会話へ出す
  if (hit2 && !guard.l2) {
    writeGuard(tp, { l1: true, l2: true }); // 先に記録（書き直しで再ブロックさせない）
    const reason = [
      '【スレッド長の警告】' + stat + '（LEVEL2）',
      '',
      'コンテキストの要約が入る領域に近づいています。要約が入ると、これまで e-Gov から',
      '取得した逐語の条文が「要約された条文」に置き換わり、鉄則Aが禁じる「要約版を原文と',
      '思い込む」状態に自動的に落ちます。',
      '',
      '書き直しの指示：',
      '1. **さっき書こうとした内容はそのまま書き直して送ってよい**（内容の問題ではない）。',
      '2. ただしメッセージの冒頭で、この警告をユーザーに伝えること（' + stat + '）。',
      '3. **その日の区切りで終了処理へ進む**（study_notes 追記 → 日次ログ → index.md →',
      '   宿題.md → コミット＆プッシュ）。**次は新しいスレッドを立てる。**',
      '4. **「終了処理か継続か」の2択をユーザーに出さない。**CLAUDE.md 行動トリガー表',
      '   「スレッド長の警告（LEVEL1）が出た」の行ですでに決まっている＝鉄則D',
      '   （決まっていることをユーザーに委ねる確認をしない）。',
    ].join('\n');
    process.stdout.write(JSON.stringify({ decision: 'block', reason }));
    process.exit(0);
  }

  // LEVEL1：1回だけブロックして確実に会話へ出す（2026-08-12 改定・旧版は非ブロック通知）
  if (hit1 && !guard.l1) {
    writeGuard(tp, { l1: true, l2: guard.l2 }); // 先に記録（書き直しで再ブロックさせない）
    process.stderr.write('[context-length-warn] LEVEL1 ' + stat + '\n');
    const reason = [
      '【スレッド長の注意】' + stat + '（LEVEL1）',
      '',
      '要約が入る前に区切るのが安全です。要約が入ると、これまで e-Gov から取得した逐語の',
      '条文が「要約された条文」に置き換わり、鉄則Aが禁じる状態に自動的に落ちます。',
      '',
      '書き直しの指示：',
      '1. **さっき書こうとした内容はそのまま書き直して送ってよい**（内容の問題ではない）。',
      '2. ただしメッセージの中で、この注意をユーザーに伝えること（' + stat + '）。',
      '3. **その日の区切りで終了処理へ進む**（study_notes 追記 → 日次ログ → index.md →',
      '   宿題.md → コミット＆プッシュ）。**次は新しいスレッドを立てる**',
      '   （引き継ぎは study_log/index.md にあるのでスレッドを跨いでも失われない）。',
      '4. **「終了処理か継続か」の2択をユーザーに出さない。**CLAUDE.md 行動トリガー表',
      '   「スレッド長の警告（LEVEL1）が出た」の行ですでに決まっている＝鉄則D',
      '   （決まっていることをユーザーに委ねる確認をしない）。',
    ].join('\n');
    process.stdout.write(JSON.stringify({ decision: 'block', reason }));
    process.exit(0);
  }

  process.exit(0);
});
