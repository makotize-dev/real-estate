# 法令リンク集（e-Gov）

学習中に該当法令を確認するときに参照する一次情報リンク集。

**e-Gov 法令検索（全条文）**：https://laws.e-gov.go.jp/

---

## 🏠 宅建業法

- **宅地建物取引業法**：https://laws.e-gov.go.jp/document?lawid=327AC1000000176
- **宅地建物取引業法施行令**：https://laws.e-gov.go.jp/document?lawid=339CO0000000383
- **宅地建物取引業法施行規則**：https://laws.e-gov.go.jp/document?lawid=332M50004000012

---

## ⚖️ 権利関係

- **民法**：https://laws.e-gov.go.jp/document?lawid=129AC0000000089
- **借地借家法**：https://laws.e-gov.go.jp/document?lawid=403AC0000000090
- **区分所有法**（建物の区分所有等に関する法律）：https://laws.e-gov.go.jp/document?lawid=337AC0000000069
- **不動産登記法**：https://laws.e-gov.go.jp/document?lawid=416AC0000000123

---

## 🏙️ 法令上の制限

- **都市計画法**：https://laws.e-gov.go.jp/document?lawid=343AC0000000100
- **建築基準法**：https://laws.e-gov.go.jp/document?lawid=325AC0000000201
- **農地法**：https://laws.e-gov.go.jp/document?lawid=327AC0000000229
- **国土利用計画法**：https://laws.e-gov.go.jp/document?lawid=349AC1000000092
- **土地区画整理法**：https://laws.e-gov.go.jp/document?lawid=329AC0000000119
- **盛土規制法**（宅地造成及び特定盛土等規制法）：https://laws.e-gov.go.jp/document?lawid=336AC0000000191
- **盛土規制法施行令**（宅地造成及び特定盛土等規制法施行令）：https://laws.e-gov.go.jp/law/337CO0000000016

---

## 💴 税・その他

- **地方税法**（不動産取得税・固定資産税）：https://laws.e-gov.go.jp/document?lawid=325AC0000000226
- **租税特別措置法**：https://laws.e-gov.go.jp/document?lawid=332AC0000000026
- **印紙税法**：https://laws.e-gov.go.jp/document?lawid=342AC0000000023
- **登録免許税法**：https://laws.e-gov.go.jp/document?lawid=342AC0000000035
- **地価公示法**：https://laws.e-gov.go.jp/document?lawid=344AC0000000049
- **不動産鑑定評価法**（不動産の鑑定評価に関する法律）：https://laws.e-gov.go.jp/document?lawid=338AC0000000152

---

## 過去問・参考

- **RETIO 過去問**：https://www.retio.or.jp/exam/kakomon.html

---

## 補足：e-Gov API による条文取得（Claude側の運用）

Claude が条文を確認する際は、以下のAPIエンドポイントが利用可能：

- 個別条文取得：`https://laws.e-gov.go.jp/api/1/articles;lawNum={法令番号URLエンコード};article={条番号}`
- 法令ID指定の全文取得：`https://laws.e-gov.go.jp/api/1/lawdata/{法令ID}`（量が多いと末尾切れあり）

ブラウザ表示用URL（`/document?lawid=...` や `/law/...`）は JavaScript レンダリングのため WebFetch では取得不可。

### 主要法令の API URL テンプレート（コピー用）

漢字の手動エンコードでミスが頻発するため、**動作確認済みの URL を verbatim でコピー**して article 番号だけ差し替える運用にする。

| 法令 | 法令番号 | API URL テンプレート（articleを差し替え）|
|------|---------|---------------------------------------|
| 宅地建物取引業法 | 昭和27年法律第176号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%B8%83%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E7%99%BE%E4%B8%83%E5%8D%81%E5%85%AD%E5%8F%B7;article={N}` |
| 民法 | 明治29年法律第89号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%8E%E6%B2%BB%E4%BA%8C%E5%8D%81%E4%B9%9D%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E5%85%AB%E5%8D%81%E4%B9%9D%E5%8F%B7;article={N}` |
| 建築基準法 | 昭和25年法律第201号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%BA%94%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E4%BA%8C%E7%99%BE%E4%B8%80%E5%8F%B7;article={N}` |
| 宅地建物取引業法施行規則 | 昭和32年建設省令第12号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%B8%89%E5%8D%81%E4%BA%8C%E5%B9%B4%E5%BB%BA%E8%A8%AD%E7%9C%81%E4%BB%A4%E7%AC%AC%E5%8D%81%E4%BA%8C%E5%8F%B7;article={N}` |
| 農地法 | 昭和27年法律第229号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%B8%83%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E4%BA%8C%E7%99%BE%E4%BA%8C%E5%8D%81%E4%B9%9D%E5%8F%B7;article={N}`（51条で動作確認済）|
| 建築基準法施行令 | 昭和25年政令第338号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%BA%94%E5%B9%B4%E6%94%BF%E4%BB%A4%E7%AC%AC%E4%B8%89%E7%99%BE%E4%B8%89%E5%8D%81%E5%85%AB%E5%8F%B7;article={N}`（136条の2で動作確認済・lawdataは末尾切れ）|
| 土地区画整理法 | 昭和29年法律第119号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%B9%9D%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E7%99%BE%E5%8D%81%E4%B9%9D%E5%8F%B7;article={N}`（98条で動作確認済・lawid=329AC0000000119）|
| 都市計画法 | 昭和43年法律第100号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%9B%9B%E5%8D%81%E4%B8%89%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E7%99%BE%E5%8F%B7;article={N}`（29条で動作確認済・lawid=343AC0000000100）|
| 地方税法 | 昭和25年法律第226号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%BA%94%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E4%BA%8C%E7%99%BE%E4%BA%8C%E5%8D%81%E5%85%AD%E5%8F%B7;article={N}`（73条の17で動作確認済・lawid=325AC0000000226・**附則/別表は取得不可**）|
| 租税特別措置法 | 昭和32年法律第26号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%B8%89%E5%8D%81%E4%BA%8C%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E4%BA%8C%E5%8D%81%E5%85%AD%E5%8F%B7;article={N}`（72条の2で動作確認済・lawid=332AC0000000026・**附則/別表は取得不可**）|
| 印紙税法 | 昭和42年法律第23号 | `https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%9B%9B%E5%8D%81%E4%BA%8C%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E4%BA%8C%E5%8D%81%E4%B8%89%E5%8F%B7;article={N}`（8条で動作確認済・lawid=342AC0000000023・**別表第一は取得不可**）|

新しい法令を使うときは、初回に**正しいエンコードを確認してこの表に追加**してから利用すること（記憶ベースでエンコードしない）。

枝番付き条文（例：民法34条の2）の article パラメータは `34_2` の形式。

**後ろの条文が lawdata で末尾切れになる場合**（例：農地法51条）は、上表の **articles エンドポイント（個別条文取得）に切り替える**と取得できる。テンプレート未登録の法令は、初回に1条で動作確認してから上表に追加する。

**国土利用計画法**（昭和49年法律第92号・lawid=`349AC1000000092`）：articles テンプレートは未登録（法律番号の「四」のエンコードを記憶で確定しないため）。`https://laws.e-gov.go.jp/api/1/lawdata/349AC1000000092`（法令ID指定・漢字エンコード不要）で取得する。2026-06-10 に23条（柱書・各号・面積要件・適用除外）・14条1項定義・47条罰則を lawdata で取得済み（末尾切れなし）。articles 個別取得が必要になったら、初回に正しいエンコードを動作確認してから上表に追加する。

**盛土規制法**（lawid `336AC0000000191`）・**同施行令**（lawid `337CO0000000016`）：articles テンプレート未登録（法律番号の漢字エンコードを記憶で確定しないため）。`https://laws.e-gov.go.jp/api/1/lawdata/{lawid}`（漢字エンコード不要）で取得する。2026-06-17 に本体（2条定義・10/26条規制区域・12/30条許可・21/27/40条届出・15/34条開発許可みなし）と施行令3条・4条（規模要件）を lawdata で取得済み（末尾切れあり＝必要条文を指定して抽出）。
