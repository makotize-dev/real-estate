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
- **盛土規制法**（宅地造成及び特定盛土等規制法）：https://laws.e-gov.go.jp/document?lawid=336AC0000000191

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
- 例（宅建業法11条）：`https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E4%BA%8C%E5%8D%81%E4%B8%83%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E7%99%BE%E4%B8%83%E5%8D%81%E5%85%AD%E5%8F%B7;article=11`
- 法令ID指定の全文取得：`https://laws.e-gov.go.jp/api/1/lawdata/{法令ID}`（量が多いと末尾切れあり）

ブラウザ表示用URL（`/document?lawid=...` や `/law/...`）は JavaScript レンダリングのため WebFetch では取得不可。
