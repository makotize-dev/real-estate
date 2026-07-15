#!/usr/bin/env node
// 鉄則C（捏造禁止）の機械的ガード。Stop フックとして動く。
//
// 直近の「実ユーザーターン（human 由来のテキスト発言）」以降に私が出した
// assistant メッセージ群を集め、次を検出したらブロックし書き直しを強制する：
//   A: 会話ロール記号の漏洩（行頭の user / human / assistant に日本語やコロンが続く）
//   B: 1つのメッセージ内で「出題」の後ろに「正誤判定」がある（解答を待たず採点）
//   C: 実ユーザーターン以降に「判定」を含む assistant メッセージが2つ以上ある
//      （＝ユーザーの解答が1回しかないのに複数回採点した＝ツール継続で捏造を反復した形）
//
// C を足した理由（2026-07-16 の違反）：無意味な Bash 呼び出しでターンを継続し、
// その継続の中で「ユーザーが答えた」と幻覚して採点+出題を繰り返した。旧版は
// ターン末尾の1メッセージしか見ず、途中の捏造メッセージを見逃した。

const fs = require('fs');

function textOf(o) {
  const m = o && o.message;
  if (!m) return '';
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) {
    return m.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');
  }
  return '';
}

// 実ユーザーの発言か（ツール結果や割り込みメッセージを除く）
function isRealUserTurn(o) {
  if (o.type !== 'user') return false;
  if (!(o.origin && o.origin.kind === 'human')) return false;
  const t = textOf(o).trim();
  if (!t) return false;
  if (t.startsWith('[Request interrupted')) return false;
  return true;
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
  if (input.stop_hook_active) process.exit(0); // ブロック後の無限ループ回避

  const tp = input.transcript_path;
  if (!tp || !fs.existsSync(tp)) process.exit(0);

  let lines;
  try {
    lines = fs.readFileSync(tp, 'utf8').split('\n').filter(Boolean);
  } catch {
    process.exit(0);
  }

  const objs = [];
  for (const l of lines) {
    try {
      objs.push(JSON.parse(l));
    } catch {
      /* skip */
    }
  }

  // 直近の実ユーザーターンの位置
  let lastUser = -1;
  for (let i = objs.length - 1; i >= 0; i--) {
    if (isRealUserTurn(objs[i])) {
      lastUser = i;
      break;
    }
  }

  // それ以降の assistant メッセージ（テキストを持つもの）を集める
  const assistantTexts = [];
  for (let i = lastUser + 1; i < objs.length; i++) {
    const o = objs[i];
    if (o.type === 'assistant') {
      const t = textOf(o);
      if (t.trim()) assistantTexts.push(t);
    }
  }
  if (assistantTexts.length === 0) process.exit(0);

  const roleRe = /^[ \t]*(user|human|assistant)[ \t]*(?:[:：]|[^\x00-\x7F])/im;
  const ASK = /(○か×か|答えてください|番号と理由)/g;
  const JUDGE = /(正解です|不正解です)/g;

  const problems = [];
  let judgeMsgCount = 0;

  for (const text of assistantTexts) {
    if (JUDGE.test(text)) judgeMsgCount++;
    JUDGE.lastIndex = 0;

    // A: ロール記号の漏洩
    const mA = text.match(roleRe);
    if (mA) {
      problems.push(
        'A: 会話ロール記号の漏洩 — 行頭に「' +
          mA[0].trim().slice(0, 20) +
          '」。相手のターンを自分で書いた痕跡です。'
      );
    }

    // B: 同一メッセージ内で「出題」の後ろに「判定」
    let lastAsk = -1;
    let m1;
    while ((m1 = ASK.exec(text)) !== null) lastAsk = m1.index;
    ASK.lastIndex = 0;
    if (lastAsk >= 0) {
      let m2;
      while ((m2 = JUDGE.exec(text)) !== null) {
        if (m2.index > lastAsk) {
          problems.push(
            'B: 出題のあとに正誤判定「' + m2[0] + '」が同じメッセージ内にあります。'
          );
          break;
        }
      }
      JUDGE.lastIndex = 0;
    }
  }

  // C: 実ユーザーターン以降に判定メッセージが2つ以上
  if (judgeMsgCount >= 2) {
    problems.push(
      'C: 直近のユーザー解答は1回だけなのに、正誤判定を含むメッセージが' +
        judgeMsgCount +
        '個あります。存在しない解答を採点した形です（ツール継続での捏造反復）。'
    );
  }

  if (problems.length === 0) process.exit(0);

  const reason = [
    '【鉄則C（捏造禁止）違反を検出しました。このメッセージは送信されません】',
    ...Array.from(new Set(problems)),
    '',
    '書き直しの指示：',
    '1. ユーザーの発言・解答を自分で書かない。書いた部分は削除する。',
    '2. 問いを出す回は、問いをメッセージの最後に置く。その後ろに解答・判定・解説・次の問いを書かない。',
    '3. ユーザーの実際の解答を受け取ってから、次の回で判定する。',
    '4. 出題中は無意味なツール呼び出し（echo 等）をしない。ターンを継続して解答を捏造する引き金になる。',
  ].join('\n');

  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
});
