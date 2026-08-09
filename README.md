# 宅建士 試験対策ポータル

税理士として**宅地建物取引士（宅建士）** 資格を取得し、相続・不動産コンサルティング業務への展開を図るための学習プロジェクト。

- **受験予定**：2026年10月18日（日）
- **目標スコア**：38点以上（例年合格ライン37点前後）

---

## 公開ページ（GitHub Pages）

| ページ | URL | 内容 |
|--------|-----|------|
| 📚 想起トレーナー | [exam_v6.html](https://makotize-dev.github.io/real-estate/exam_v6.html) | 全4科目の一問一答（137問）・誤答一覧の表示と `.md` 書き出し |
| 🗺️ ロードマップ | [roadmap.html](https://makotize-dev.github.io/real-estate/roadmap.html) | 螺旋型学習プラン・週配分ヒートマップ |
| 📝 学習ノート | [study_notes.html](https://makotize-dev.github.io/real-estate/study_notes.html) | 科目別の個人用リファレンス（Markdownビューワー） |
| 📅 学習ログ | [study_log.html](https://makotize-dev.github.io/real-estate/study_log.html) | 日次ログ・進捗サマリーのビューワー |

スマホのブラウザで開き「ホーム画面に追加」するとアプリとして使えます（PWA対応・オフライン動作）。

---

## ファイル構成

```
real-estate/
├── CLAUDE.md                 # Claude Code 用のプロジェクト指示（鉄則・セッション手順）
├── exam_v6.html              # 想起トレーナー（全4科目・137問）
├── roadmap.html              # 学習ロードマップ（螺旋型3ラウンド）
├── study_notes.html          # 学習ノートビューワー（study_notes/*.md を表示）
├── study_notes/              # 科目別個人用リファレンス（Git管理・Claude が追記）
│   └── {宅建業法|権利関係|法令制限|税・その他}.md
├── study_log.html            # 学習ログビューワー（study_log/*.md を表示）
├── study_log/                # 学習ログ
│   ├── index.md              #   進捗サマリー（毎セッション更新）
│   ├── 宿題.md                #   恒久的な宿題・未確認リスト（セッション開始時に読む）
│   ├── _template.md          #   日次ログの雛形
│   └── YYYY-MM-DD.md         #   日次ログ
├── past_exams/               # 実物の年度別過去問（PDFはgitignore・.mdのみ追跡）
│   ├── README.md             #   運用ルール
│   └── 過去問演習記録.md       #   結果・推移・誤答論点の恒久記録
├── laws.md                   # e-Gov API の URL テンプレート集
├── manifest.json             # PWAマニフェスト
├── sw.js                     # Service Worker（オフラインキャッシュ）
├── icon.svg                  # アプリアイコン
└── guide-to-be-certified/    # 詳細ガイド（全6章＋アウトライン）
    ├── takken_guide_outline.md       # 全4科目アウトライン
    ├── takken_chapter1_detailed.md   # 宅建士制度の概要
    ├── takken_chapter2_detailed.md   # 宅建士の実務
    ├── takken_chapter3_detailed.md   # 税理士が取得するメリット
    ├── takken_chapter4_detailed.md   # 試験制度の詳細
    ├── takken_chapter5_detailed.md   # 合格までの学習計画
    └── takken_chapter6_detailed.md   # 学習継続のコツ
```

---

## 学習プラン（螺旋型3ラウンド）

| フェーズ | 期間 | 方針 |
|----------|------|------|
| Round 1 | 5〜6月（週10h） | 全科目の条文を通読して骨格を作る |
| Round 2 | 7〜8月（週10h → 11h → **13.5h**） | 実物の年度別過去問で弱点を数値で把握し、未収録の条文をブロック学習で埋める |
| Round 3 | 9月（週11h） | 模擬試験・弱点集中・統計 |
| 直前期 | 10月 | R3 終了時に見直す |

週時間と科目配分は R2 の実測（実物過去問2回）にもとづき途中で2回改定した。**一次は [roadmap.html](roadmap.html)**、当週の日別計画は [study_log/index.md](study_log/index.md)。

### 科目別目標

| 科目 | 出題数 | 目標点 |
|------|--------|--------|
| 宅建業法 | 20問 | 16〜18点 |
| 権利関係 | 14問 | 10〜11点 |
| 法令上の制限 | 8問 | 6点 |
| 税・その他 | 8問 | 7点 |

---

## 各ツールの機能

### 📚 想起トレーナー（exam_v6.html）
- 全4科目の一問一答（**137問**）。実物過去問の失点から作った事例型が中心
- 誤答一覧の表示と `.md` 書き出し（ブラウザに閉じ込めず、記録として取り出せる）
- 混同しやすい項目の比較表（35条 vs 37条、媒介契約3類型など）・報酬計算の計算例
- ※ 誤答の母集団は localStorage にあり閲覧データ削除で消えるため、**恒久的な想起の対象は `study_log/宿題.md` に一本化**している

### 🗺️ ロードマップ（roadmap.html）
- 試験日までのカウントダウン
- 月別・科目別の週時間配分ヒートマップ
- ラウンドごとのタスクリスト

### 📝 学習ノート（study_notes.html）
- `study_notes/*.md` を科目別タブで表示するMarkdownビューワー
- セッション末に Claude が内容を追記・Git管理（データが消えない）
- 宅建業法・権利関係・法令制限・税その他の4科目タブ

### 📅 学習ログ（study_log.html）
- `study_log/index.md`（進捗サマリー）と日次ログを表示
- 条文・出典は e-Gov で逐語確認したものだけを記録する運用（詳細は `CLAUDE.md` の「鉄則」）

---

## ローカルでの使い方

すべてスタンドアロン動作（サーバー・インストール不要）。

```bash
# Windows
start exam_v6.html

# macOS
open exam_v6.html
```

---

## 資格について

**宅地建物取引士（宅建士）** は不動産取引における唯一の国家資格。

- 毎年10月第3日曜日に実施、合格率 約15〜17%
- 独占業務：重要事項の説明（35条書面）、37条書面への記名押印
- 税理士との親和性：相続・譲渡所得・不動産取得税など税務知識が直接活用できる
