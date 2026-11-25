# 08 — Progressive 4-Stage Thai Reading Path

[← UX Wireframes & Core Flows](./07-ux-wireframes-and-core-flows.md) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: Hybrid NLP & Native QA →](./09-nlp-pipeline-and-qa-eval.md)

---

## Overview

- **Timeline:** Stage 1 ships in **MVP v1.0**; Stage 2 **Batch 1a teaser** (core Mid-Class + Thai digits `๐–๙`) ships in **v1.1 (M10)**; full **Stages 2–3** ship in **v1.5 (M15–M18)**; Stage 4 ships in **v2.0**.
- **Dependency Invariant:** Every living consonant (**42 total**, split `7 + 7 + 10 + 7 + 11 = 42`, obsolete `ฃ`/`ฅ` excluded), every vowel, every high-frequency true cluster, and every orthographic rule is introduced **before** any example word that uses it. All **66 example words** below have been programmatically verified for zero premature dependencies.

---

## Stage 1 — Speak First `[MVP Default]`
- **Card Display:** Large Sound Spelling tone pills on top + small Thai script underneath.
- **Goal:** Build passive visual familiarity with high-frequency shapes (`ครับ`, `ไม่`, `เอา`, `บาท`) while speaking and listening come first.

---

## Stage 2 — Class-Batch Micro-Modules `[Batch 1a M10 → Full v1.5 M15–18]`

5-minute micro-lessons; newly unlocked letters automatically highlight inside the learner's own saved phrases.

### Batch 1a *(M10 Teaser — Immediate Market Utility)*
- **Letters (7 Mid-Class):** `ก จ ด ต บ ป อ`
- **Vowels (7 open-syllable long base vowels):** `-า -ี -ู เ- แ- โ- -อ`
- **Digits:** Thai numerals `๐–๙` (immediate market price-tag utility)
- **Unlocked pure live words:** `ตา ปู ดี ดู ปี โต กา กอ`

### Batch 1b *(Diphthongs, Live `สระเกิน` & Mid-Class Tone Marks)*
- **Vowels:** `-ือ` (Mid-Class open word **`อือ`** `ʉʉ`), `เ-ีย เ-ือ -ัว เ-อ` (`เปีย เบื่อ ตัว เจอ`)
- **Live `สระเกิน` & Length Rule:** `ไ- ใ- เ-า -ำ` + written-short-read-long rule (`ได้ ใต้ เก้า`)
- **Tone Marks on Mid-Class:** `-่ -้ -๊ -๋`

### Batch 2 *(High-Class, Short Dead Vowels & Dead Finals)*
- **Letters (7 core High-Class):** `ข ฉ ถ ผ ฝ ส ห` *(flag obsolete `ฃ`)*
- **High-Class Live Rules:** Default Rising + `ไม้เอก` → Low, `ไม้โท` → Falling (`ไข่ ห้า สี่ สี ขา`)
- **Short Dead Vowels & Morphing:** `-ะ -ิ -ุ -ึ เ-ะ แ-ะ โ-ะ เ-าะ` + `เ-อะ` (`เจอะ`, `เถอะ`); hidden `โ-ะ` and `-ะ → -ั-`
- **Live vs. Dead & 3 Dead `มาตราตัวสะกด`:** Mid/High dead = Low; `แม่ กก กด กบ` + irregular sight word `ก็` (`gɔ̂ɔ`)
- **Unlocked pure Batch 1+2 words:** `กก กด กบ กับ ผัก ผัด สับ สิบ หก ตก จบ ไข่ ห้า สี่`

### Batch 3 *(Unpaired Low Sonorants, Live Finals, Mid/High Clusters & `ห นำ`)*
- **Letters (10 Unpaired Low sonorants):** `ง น ม ย ร ล ว` + `ญ ณ ฬ`
- **5 Live `มาตราตัวสะกด` & Non-Canonical Live Finals:** `แม่ กง กน กม เกย เกอว` (unlocks **`ข้าว`**) + `ร ล ญ ณ ฬ → -n`
- **Mid/High True Clusters:** `กร กล กว ปร ปล ตร ขร ขล ขว ผล` → unlocks **`ปลา กลาง ใกล้ ตรง ขวา แผล`** immediately
- **Inherent `-a-` & Double-Duty Linking Consonants:** `ผลไม้`, `ตุ๊กตา` *(explicitly contrasted with true cluster `แผล` so `ผล-` does not confuse learners)*
- **Leading Consonants:** `ห นำ`, `อ นำ` (`อย่า อยู่ อย่าง อยาก`), and 2-syllable `อักษรนำ` (`ตลาด อร่อย ขนม สนุก`)
- **Low-Class Tone Rules:** Live `-่` → Falling, `-้` → High; Dead short = High, long = Falling → unlocks **`มือ`**

### Batch 4a *(Paired Low, Low/Loanword Clusters, Non-Canonical Dead Finals & Morphing Vowels)*
- **Letters (7 core Paired Low):** `ค ช ซ ท พ ฟ ฮ` *(flag obsolete `ฅ`)*
- **Low-Class & Loanword Clusters:** `คร คล คว พร พล` + `ฟร บล` → unlocks **`ครับ พร้อม ฟรี บล็อก`**
- **Non-Canonical Dead Finals:** `ข ค → -k`, `ต จ ช ซ ส ถ ท → -t`, `ป พ ฟ → -p`
- **Remaining Morphing Vowels:** `-ือ → -ื-` (`มืด คืน`), `เ-าะ → -็อ-` (`ล็อก ช็อก`), **`-ัว → -ว-` (unlocking `ตรวจ` cleanly alongside `จ → -t`)**, `เ-อ+ย → เ-ย`, `เ-อ → เ-ิ-`, `เ-ะ → เ-็-`, `แ-ะ → แ-็-` (`แข็ง`)

### Batch 4b *(Special Patterns & Rare Short Diphthongs)*
- **`รร` (`ร หัน`):** `สรรหา`, `พรรค`
- **False Clusters & Special Finals:** Silent-`ร` (`จริง สร้าง เสร็จ สร้อย`), `ทร- → s` (`ทราย ทราบ`), silent final `ย` in `ไทย`
- **Symbols & Rare Short Diphthongs:** `การันต์` (`-์`), `ๆ`, `ฯ`, and `เ-ียะ เ-ือะ -ัวะ`

### Batch 4c *(Final 11 Living Consonants + `ฤ`)*
- **Letters (11 remaining living consonants + `ฤ`):** `ฎ ฏ ฐ ศ ษ ฆ ฌ ฑ ฒ ธ ภ` + `ฤ` (`อังกฤษ พฤหัส ฤดู`)
- **Remaining Non-Canonical Finals:** `ฎ ฏ ฐ ศ ษ ฑ ฒ ธ → -t` (`ครุฑ`), `ฆ → -k`, `ภ → -p`
- **Unlocked real-world words before Stage 3:** `กฎหมาย ปฏิเสธ ธนาคาร ภาษา ประเทศไทย ธรรมดา เศร้า ครุฑ`

---

## Stage 3 — Tone-Colored Thai Script `[v1.5]`
- **Card Display:** Large Thai script colored by **Spoken Syllable Tone** + **mandatory compact Pitch Icon (`━ ╲_ ╭╲ ‾╱ ╰╱`)** for WCAG 1.4.1 non-color redundancy; Sound Spelling moves behind 1-tap `Peek`.
- **Advanced Orthographic Visuals:**
  - **Non-Contiguous Grapheme-to-Syllable Coloring** (`แสดง`, `แมลง`, `เจริญ`)
  - **Split-Color Underline on Double-Duty Linking Consonants** (`ผลไม้` Rising→High, `ตุ๊กตา` High→Low, `ราชการ` Falling→High)
  - **Explicit `"spoken override"` dotted badge** whenever spoken tone differs from written rules (`เขา káo`, `ไหม mái`, `แกร็บ grɛ́p`)
  - **Looped vs. Modern Loopless Street Font Toggle** (trains menu & sign reading)

---

## Stage 4 — Native Reader `[v2.0]`
- Uncolored Thai script + tap-to-inspect **Tone Rule Breakdown** (automatically flagging spoken and loanword overrides) for independent reading of menus, signs, and chats.

---

[← UX Wireframes & Core Flows](./07-ux-wireframes-and-core-flows.md) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: Hybrid NLP & Native QA →](./09-nlp-pipeline-and-qa-eval.md)
