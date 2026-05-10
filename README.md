# 宅建士 試験対策ポータル

税理士として**宅地建物取引士（宅建士）** 資格を取得し、相続・不動産コンサルティング業務への展開を図るための学習プロジェクト。

- **受験予定**：2026年10月18日（日）
- **目標スコア**：38点以上（例年合格ライン37点前後）

---

## 公開ページ（GitHub Pages）

| ページ | URL | 内容 |
|--------|-----|------|
| 📚 知識ポータル | [exam_v6.html](https://makotize-dev.github.io/real-estate/exam_v6.html) | 宅建業法の知識カード・比較表・一問一答（30問） |
| 🗺️ ロードマップ | [roadmap.html](https://makotize-dev.github.io/real-estate/roadmap.html) | 螺旋型学習プラン・週10h配分ヒートマップ |
| 📝 学習ノート | [study_notes.html](https://makotize-dev.github.io/real-estate/study_notes.html) | 科目別の個人用リファレンス（Markdownビューワー） |

スマホのブラウザで開き「ホーム画面に追加」するとアプリとして使えます（PWA対応・オフライン動作）。

---

## ファイル構成

```
real-estate/
├── exam_v6.html              # 知識ポータル（宅建業法中心）
├── roadmap.html              # 学習ロードマップ（螺旋型3ラウンド）
├── study_notes.html          # 学習ノートビューワー（study_notes/*.md を表示）
├── study_notes/              # 科目別個人用リファレンス（Git管理・Claude が追記）
├── manifest.json             # PWAマニフェスト
├── sw.js                     # Service Worker（オフラインキャッシュ）
├── icon.svg                  # アプリアイコン
├── takken_guide_outline.md   # 全4科目アウトライン
└── guide-to-be-certified/    # 詳細ガイド（全6章）
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
| Round 2 | 7〜8月（週10h） | 過去問10年分を繰り返し、弱点を数値で把握 |
| Round 3 | 9月（週10h） | 模擬試験・弱点集中・チートシート確認 |
| 直前期 | 10月（週9h） | 最終確認・体調管理 |

### 科目別目標

| 科目 | 出題数 | 目標点 |
|------|--------|--------|
| 宅建業法 | 20問 | 16〜18点 |
| 権利関係 | 14問 | 10〜11点 |
| 法令上の制限 | 8問 | 6点 |
| 税・その他 | 8問 | 7点 |

---

## 各ツールの機能

### 📚 知識ポータル（exam_v6.html）
- 科目別の知識カード（宅建業法中心）
- 混同しやすい項目の比較表（35条 vs 37条、媒介契約3類型など）
- 一問一答クイズ（30問・正答率バー付き）
- 報酬計算・手付金保全措置の計算例

### 🗺️ ロードマップ（roadmap.html）
- 試験日までのカウントダウン
- 月別・科目別の週時間配分ヒートマップ
- ラウンドごとのタスクリスト

### 📝 学習ノート（study_notes.html）
- `study_notes/*.md` を科目別タブで表示するMarkdownビューワー
- セッション末に Claude が内容を追記・Git管理（データが消えない）
- 宅建業法・権利関係・法令制限・税その他の4科目タブ

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
