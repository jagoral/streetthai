# 06 — Thai Phonetics, Visual Tones & Pragmatics

[← MVP Schedule & Gates](https://linear.app/tomasz-goral/document/product-vision-05-mvp-build-schedule-and-validation-gates-2ce2e0437294) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: UX Wireframes & Core Flows →](./07-ux-wireframes-and-core-flows.md)

---

## 1. Canonical Phonetic System: Sound Spelling (derived from Paiboon conventions) `[MVP v1.0]`

Street-sign **RTGS** strips tones and vowel length, while ad-hoc spellings use `ph`/`th` (which English speakers misread as `f` and English `th`). StreetThai enforces **canonical Sound Spelling** across all studio packs, UI, docs, and marketing copy, guarded by an automated CI linter (with an explicit allowlist for English proper nouns, brands, and search-matched slugs: `Muay Thai`, `Kru`, `Chiang Mai`, `Phuket`, `Grab`, `LINE`, `7-Eleven`, `pad-kra-pao`, `khao-soi`).

### Unicode & Font Rendering Rules
- **Sound Spelling Storage & Font:** Stored in **Unicode NFC**, rendered in **Noto Sans** (verified on iOS Safari & Android Chrome so stacked combining diacritics on `ʉ̀`, `ɛ̂`, `ɔ̌`, `ə̀` never clip or collide).
- **Search Normalizer:** Indexed with an **ASCII-folded search normalizer** (`u`/`ue`→`ʉ`, `e`/`ae`→`ɛ`, `o`/`aw`→`ɔ`, stripping diacritics) so plain English keyboards always match.
- **Pasted Thai Script Normalization:** Handled in Step 0 by our TypeScript normalizer (reordering mistyped vowels/tone marks and stripping zero-width spaces while deliberately preserving chat elongations like `น้าาา`; see [Chapter 09](./09-nlp-pipeline-and-qa-eval.md)).

### A. Complete 42 Living Consonants, Unreleased Finals & Glottal Stops

| Sound Type | Sound Spelling | English Anchor | Pronunciation Rule |
| :--- | :---: | :--- | :--- |
| **Unaspirated Initial Stops** *(zero puff)* | **`bp`** (ป), **`dt`** (ต/ฏ), **`g`** (ก) | s**p**ot, s**t**op, s**k**y | Zero breath release. `dtà-gìap` (ตะเกียบ = chopsticks), `bplaa` (ปลา = fish) — never `tà-gìap` or `plaa`. |
| **Aspirated Initial Stops** *(strong puff)* | **`p`** (ผ/พ/ภ), **`t`** (ถ/ท/ธ/ฐ/ฑ/ฒ), **`k`** (ข/ค/ฆ) | **p**et, **t**in, **k**iss | **No `h`:** `p/t/k` (`pǒm`, `pèt`, `kráp`) avoids `ph`→`f` and `th`→`thin`. *(Rare Pali loans like `บัณฑิต` realize `ฑ` as `d`, handled in lexicon.)* |
| **Zero / Glottal Initial** | *(vowel onset)* (**อ**) | silent onset | `อ` is a silent mid-class carrier for vowel-initial syllables (`ao` เอา, `à-rɔ̀i` อร่อย). |
| **Unreleased Final Stops** | **`-p`**, **`-t`**, **`-k`** | stop-lip / stop-tongue | Close airflow cleanly at syllable end with zero breath puff (`kráp`, `pèt`, `bàat`, `yók`, `dtà-gìap`). |
| **Glottal Stop After Short Open Vowels** | *(unwritten `ʔ`)* | sharp catch ("uh-oh") | Short open syllables (`ná`, `kâ`, `sà-`) end abruptly with a crisp glottal stop rather than trailing off. |
| **Voiced Initial Stops** | **`b`** (บ), **`d`** (ด/ฎ) | **b**og, **d**og | Standard voiced `b`/`d`. |
| **Initial `ng`** | **`ng`** (ง) | si**ng** (syllable start) | Drilled via true minimal pair vs. `n-` in Lesson 0 (`ngaan` งาน vs. `naan` นาน). |
| **Affricates & Fricatives** | **`j`** (จ), **`ch`** (ฉ/ช/ฌ), **`s`** (ส/ศ/ษ/ซ), **`f`** (ฝ/ฟ), **`h`** (ห/ฮ) | **j**ar, **ch**at, **s**end, **f**og, **h**ave | `j` is unaspirated; `ch` is aspirated. |
| **Sonorants** | **`m`** (ม), **`n`** (น/ณ), **`y`** (ย/ญ), **`r`** (ร), **`l`** (ล/ฬ), **`w`** (ว) | Standard English | Local Tips note colloquial Bangkok `r`→`l` or cluster drops (`kráp` → `káp`). |

*(Complete tally: `1+2+1 + 3+6+3 + 1 + 1+2 + 1 + 1+3+4+2+2 + 1+2+2+1+2+1 = 42` living consonants; obsolete `ฃ` and `ฅ` excluded.)*

### B. Complete Vowel & Offglide Inventory
Doubled letters always signal a long vowel (~2× duration):

| Short | Long | Sound Cue | Short | Long | Sound Cue |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **`a`** | **`aa`** | f**a**ther (short vs. held) | **`u`** | **`uu`** | f**oo**d (short vs. held) |
| **`i`** | **`ii`** | mach**i**ne | **`e`** | **`ee`** | p**e**t / h**ey** (pure, no `-y`) |
| **`ʉ`** | **`ʉʉ`** | Say **"oo" (food) with lips spread wide into a smile** | **`ɛ`** | **`ɛɛ`** | c**a**t / b**a**d / c**a**re (wide mouth — distinct from `e`) |
| **`o`** | **`oo`** | g**o** (pure, no `-w`) | **`ɔ`** | **`ɔɔ`** | British **law** / **more** without `r` *(non-merged cue + audio)* |
| **`ə`** | **`əə`** | b**ir**d (British, no `r`) | **Diphthongs** | **`ia`**, **`ʉa`**, **`ua`** | `ia` (ear), `ʉa` (unrounded `ʉ` gliding to `-a`, `rʉa` เรือ), `ua` (tour) |

**Key Offglide & Length Rules:**
- **Standard offglides:** `ai`/`aai` (`mâi`, `jàai`), `ao`/`aao` (`ao`, `kàao`), `əəi` (`ləəi`), `ɔi`/`ɔɔi` (short **`ɔi`** in `-่อย`: `à-rɔ̀i` อร่อย, **`nɔ̀i`** หน่อย [matching Paiboon Dictionary] vs. long **`ɔɔi`**: `rɔ́ɔi` ร้อย, `kâao sɔɔi` ข้าวซอย [Mid tone], **`nɔ́ɔi`** น้อย), `ui` (`kui`), `ooi` (`dooi`), `iu` (`hǐu`), `eo`/`eeo` (`reo`), `ɛo`/`ɛɛo` (`lɛ́ɛo`).
- **Triphthong offglides:** `uai` (`muai`, `chûai`, `dûai`), `iao` (`dǐao`, `bprîao`), `ʉai` (`nʉ̀ai`).
- **Written-short, read-long words:** `ได้` (`dâai`), `ไม้` (`máai`, e.g., `ผลไม้` `pǒn-lá-máai`), `ใต้` (`dtâai`), `เก้า` (`gâao`), `เท้า` (`táao`), `เช้า` (`cháao`).
- **Standalone vs. Compound `น้ำ`:** Standalone stressed `น้ำ` is long (`náam`, e.g., `náam sɔ̌ɔng kùat`); compound-initial `น้ำ-` shortens to `nám-` (`nám-kɛ̌ng`, `nám-bplaa`).
- **Meaning-critical contrast:** `pèt nɔ́ɔi` (เผ็ดน้อย, High + long = *"less spicy"*) vs. `pèt nɔ̀i` (เผ็ดหน่อย, Low + short = *"a bit spicy, please"*).

---

## 2. Visual Tone System & Accessibility (WCAG 2.x + 1.4.11 Verified)

- **Default UI `[MVP v1.0]` = 2 clean cues:** **(1) Sound Spelling Diacritics** + **(2) WCAG AA Tone Colors**, rendered **per syllable** inside multi-syllable words (`[sà]`-`[gɛɛn]`, `[ngən]`-`[sòt]`).
- **Tappable Pill Borders (WCAG 1.4.11):** Both Light Mode (`>= 3.68:1` vs. `#FFFFFF`) and Dark Mode (`>= 3.75:1` vs. `#0F172A`) include `1px` borders so pills remain clearly bounded on every screen.
- **Color-Blind Honesty (Machado-2009 Deuteranopia Simulation + WCAG 1.4.1):** Low/High (blue vs. purple) are confusable (~ΔE 5–10), and Mid/Rising weaken in dark mode (~ΔE 17). Tone is therefore **NEVER encoded by color alone**: Stages 1–2 always display Sound Spelling diacritics, and **Stage 3 (when Sound Spelling moves behind `Peek`) makes compact pitch-contour icons MANDATORY**.
- **Single-Source-of-Truth Enum:** Every syllable renders from one strict enum (`tone: "mid" | "low" | "falling" | "high" | "rising"`), unit-tested so diacritic, color, border, and pitch icon cannot diverge.

| Tone | Diacritic | Light Mode Text / BG + **`1px` Border** *(vs. `#FFFFFF`)* | Dark Mode Text / BG + **`1px` Border** *(vs. `#0F172A`)* | Pitch Icon *(Opt v1.1; **Mandatory Stage 3**)* | Example |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **`mid`** | *(none)* | `#334155` on `#F1F5F9` (9.45:1) • Border `#64748B` (4.76:1) | `#CBD5E1` on `#1E293B` (9.85:1) • Border `#64748B` (3.75:1) | `━` | `maa` (มา), `ao` (เอา) |
| **`low`** | `à` | `#1D4ED8` on `#EFF6FF` (6.16:1) • Border `#3B82F6` (3.68:1) | `#93C5FD` on `#1E3A5F` (6.38:1) • Border `#60A5FA` (7.02:1) | `╲_` | `jàai` (จ่าย), `pèt` (เผ็ด) |
| **`falling`** | `â` | `#9A3412` on `#FFF7ED` (6.88:1) • Border `#C2410C` (5.18:1) | `#FDBA74` on `#431407` (9.28:1) • Border `#FB923C` (7.89:1) | `╭╲` | `mâi` (ไม่), `kâ` (ค่ะ) |
| **`high`** | `á` | `#7E22CE` on `#FAF5FF` (6.51:1) • Border `#9333EA` (5.38:1) | `#D8B4FE` on `#3B0764` (8.48:1) • Border `#C084FC` (6.76:1) | `‾╱` *(Bangkok `35/45`)* | `ná` (นะ), `kráp` (ครับ), `ká` (คะ) |
| **`rising`** | `ǎ` | `#065F46` on `#ECFDF5` (7.29:1) • Border `#059669` (3.77:1) | `#6EE7B7` on `#064E3B` (6.38:1) • Border `#34D399` (9.29:1) | `╰╱` | `mǔu` (หมู), `sǎam` (สาม) |

> **Never mix tone color and consonant class color:** Pill color always means **Spoken Syllable Tone**. In v1.5 Reading Path, Consonant Class uses neutral geometric badges (`▲ High`, `■ Mid`, `▼ Low`).

---

## 3. Street-Natural Pragmatics, Particles & Pronouns `[MVP v1.0]`

1. **Particle-First Onboarding (Not Binary Gender):** Onboarding asks **"Which polite particle do you use? `kráp` (ครับ) / `kâ` (ค่ะ/คะ)"** — immediately intuitive and matches how Thai actually works.
2. **Exact Female Polite Particle Rules (`ค่ะ` vs. `คะ`):**
   - **Statements, polite requests, answers & embedded-question statements → `ค่ะ` (`kâ`, Falling):** `mâi pèt kâ`, `pûut cháa cháa nɔ̀i kâ`, `mâi rúu wâa tâo-rài kâ` (*"I don't know how much"* = statement).
   - **Direct questions, immediately after `นะ`, calling attention & `สิ`/`ล่ะ` → `คะ` (`ká`, High):** `tâo-rài ká`, `jàai ruam gan ləəi ná ká`, `pîi ká!`, `kruu ká!`, `sì ká`.
3. **Strict Separation of User vs. Vendor Particles:**
   - **User speech & counter-replies** render **only** the user's chosen particle (`kráp` OR `kâ/ká` — never both side-by-side).
   - **Vendor / local audio & script** follow the **vendor's** voice and sentence type (`ครับ` for male vendor; `คะ` for female direct questions like `งั้นสแกนหรือเงินสดคะ?`, `ค่ะ` for female statements), dynamically synced to whichever M or F clip is playing.
4. **Context-Aware Pronouns & Kinship:**
   - **Pro-drop default** in short street requests.
   - When "I" is needed: teach **`pǒm`** (`ผม` — standard polite male "I") for `kráp` speakers and **`chán` / `nǔu` / own nickname** (`ฉัน` neutral female; `nǔu` younger; own nickname warm/casual) for `kâ` speakers — noting that while adult men sometimes use nicknames among close friends or family, with strangers and service staff they should default to `pǒm` or pro-drop.
   - Ban robotic bare `คุณ` (`kun`) in street/gym contexts; default to `pîi` (พี่) when unsure of age (`nɔ́ɔng` only if clearly younger; `kruu` for Muay Thai trainers); ban formal `dì-chǎn` (ดิฉัน) unless formal register is explicitly requested.

---

[← MVP Schedule & Gates](https://linear.app/tomasz-goral/document/product-vision-05-mvp-build-schedule-and-validation-gates-2ce2e0437294) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: UX Wireframes & Core Flows →](./07-ux-wireframes-and-core-flows.md)
