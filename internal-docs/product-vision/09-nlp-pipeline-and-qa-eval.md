# 09 — Hybrid NLP Pipeline & Native QA Protocol

[← Progressive Reading Path](./08-progressive-reading-path.md) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed)

---

## 1. Hybrid NLP Alignment Contract `[MVP v1.0 — 100% TypeScript Runtime Primary]`

The Paste-to-FSRS decoder uses a strict 4-step pipeline so the LLM handles chat pragmatics while a deterministic lexicon/G2P engine remains sole authority over tones and Sound Spelling.

**Primary Runtime Architecture (Single TypeScript Stack — Zero Fly.io Microservice):**
- **Build-Time (Local / CI Python Script, Run Offline):** Uses `TLTK` + commercial-safe Thai wordlists + our TFL-authored 500-lemma expat core & 400 loanwords to compile a **static JSON / Trie pronunciation dictionary** (`15,000–25,000` Thai words → structured Sound Spelling syllables & tones, ~1–2 MB gzipped).
- **Production Runtime (100% TypeScript on Vercel EU):** TanStack Start server routes ([ADR-0001](../../docs/adr/0001-frontend-framework.md)) run Steps 0-3 directly in Node.js/TypeScript with sub-5ms Trie lookups, eliminating the Fly.io Python service (`-$15/mo`, one fewer US GDPR sub-processor/CFR, single monorepo).
- **Gate-2 Fallback:** If Gate 2's 50-phrase spike shows `> 5%` OOV rate on real Thai chats, we activate the **Python FastAPI (`TLTK` + `PyThaiNLP 5.4.x`) on Fly.io EU (`+$15/mo`)** runtime fallback.

### Step 0 — TypeScript Thai Unicode Normalization + Elongation-Preserving Clamp + Offset Map
- **TypeScript Normalizer (~30 LOC):** Fixes out-of-order vowel/tone typing (`น ำ ้` → `น้ำ`, `ํ` + `า` → `ำ`), strips zero-width characters & spaces before tone marks, and deduplicates stacked tone marks — **deliberately preserving repeated vowels/consonants** so chat elongations like `ไปด้วยกันน้าาา` survive intact for Step 1! *(If Python fallback is used: pin PyThaiNLP `5.4.x` and call ONLY `reorder_vowels`, `remove_zw`, `remove_spaces_before_marks`, `remove_dangling` — NEVER `normalize()` wholesale because it calls `remove_repeat_vowels()` and collapses `น้าาา` → `น้า`!)*
- **Thai-Letter-Only Repeat Clamp:** Clamp 3+ repeated runs strictly on `[\u0E01-\u0E2E\u0E30-\u0E3A\u0E40-\u0E44\u0E47-\u0E4E]` down to 2 (`น้าาา` → `น้าา`, emitting an `elongated: true` flag) and expand unambiguous acronyms (`กทม.` → `กรุงเทพฯ`). Explicitly **excludes** `ฯ` (`U+0E2F`), `฿` (`U+0E3F`), `ๆ` (`U+0E46`), and all digits `0–9` / `๐–๙` (preserving `1000 บาท`, `ห้อง 555`, `0888123456`, `5555`).
- **Full Offset Map:** Tracks every deletion and reorder across both normalization and clamping so rendered tone chips align cleanly to pasted text.

### Step 1 — Lean AI SDK / TanStack AI Pragmatics + Simple `Intl.Segmenter` Fallback
- **Single Typed LLM Call (Vercel AI SDK `@ai-sdk/amazon-bedrock` or TanStack AI, AWS Bedrock EU ZDR):** Uses a strict Zod schema to normalize chat slang in context (`ไปด้วยกันน้าาา`→`นะ`, `คับ`, `5555`, `ป่าว`, `อยุ่`, `แร้ว`, `พน.`, `มปร.`, `ป่ะ`, warm `ค่า/ค้า` vs. `ค่าไฟ`/`ค้าขาย`) and return `{tokens: [{surface_raw, normalized_thai, gloss}], reply_suggestion, numeral_type}` with `ๆ` expansion.
- **Lean Deterministic Fallback:** If schema validation or `concat(surface_raw)` fails, fall back cleanly in TypeScript to **`Intl.Segmenter('th', { granularity: 'word' })`** and mark the card `low_confidence: true`. *(Custom POS rule taggers and hand-written position/collocation disambiguators for edge cases like `หรือ`/`สระ`/`[CLF]+หนึ่ง` are deliberately deferred until real post-launch paste logs show which edge cases users actually hit!)*
- **Deterministic Numeral Regex:** Simple regex checks (`น.` → clock; `บาท`/`฿`/`.-`/`k`/`หมื่น` → currency) guide Step-3 numeral formatting cleanly.

### Step 2 — Build-Time Compiled G2P Dictionary & Runtime Trie Lookup
- **License Gate (W1–3):** Verify exact commercial licenses for all build-time corpora before compiling the **15,000–25,000-word static JSON/Trie pronunciation dictionary** + TFL-authored 500-lemma expat core + 400-word loanword table.
- **Build-Time Slot-Classified IPA→Sound Spelling Compiler (Zero String-Cascade Bugs):** Our offline build script normalizes `TLTK` output into structured `{onset, nucleus, coda, tone}` syllable objects classifying `{position: onset|coda, aspiration: aspirated|unaspirated|voiced}` **before** emitting Sound Spelling graphemes into the static JSON:
  - **Onsets:** Unaspirated `p→bp, t→dt, k→g`; Aspirated `pʰ→p, tʰ→t, kʰ→k`; Voiced `b→b, d→d`; Affricates `tɕ→j, tɕʰ→ch`; Glides/Liquids `j→y, w→w, ŋ→ng`.
  - **Nuclei:** Centring diphthongs `iə/iːa→ia, ɯə/ɯːa→ʉa, uə/uːa→ua`; Vowels `ɯ→ʉ, ɤ→ə, ɛ→ɛ, ɔ→ɔ`, `ː→doubled vowel`; apply written-short-read-long & compound `น้ำ-` rules.
  - **Codas:** Unreleased stops `p̚/t̚/k̚→p/t/k` (never `krábp`); final palatal glide `/j/ → -i` (`jàai`, `mâi`, `rɔ́ɔi`, `ləəi`, `nʉ̀ai`); final labiovelar glide `/w/ → -o` after `/a, e, ɛ, ia/` (`ao`, `kàao`, `reo`, `lɛ́ɛo`, `bprîao`) and `-u` after `/i/` (`hǐu`); drop `ʔ`.
- **Runtime Longest-Match Trie Re-Merger & OOV:** Longest-match across Step-1 tokens (`ผลไม้`, `สระว่ายน้ำ`; ambiguities like `ตากลม` tie-broken by gloss/POS). Any unlisted OOV or `low_confidence: true` token renders a yellow **`Check tone`** chip + `"Ask a Thai friend to verify"` share.

### Step 3 — 3-Mode Numeral Verbalizer `[MVP v1.0]` & Privacy/Offline Audio Split
- Normalizes Thai digits `๐–๙` first. **v1.0 ships 3 core modes:**
  1. **Currency & Rent:** incl. `15,000.-`, `15k`, `1.5หมื่น` → `หมื่นห้า`, `สองหมื่นสอง` (22,000)
  2. **6-Hour Spoken Thai Clock:** `19.30 น.` → `หนึ่งทุ่มครึ่ง` / `ทุ่มครึ่ง`
  3. **Digit-by-Digit & Cardinals:** `ห้อง 305`, `ชั้น 12`, `ซอย 11` → `sɔɔi sìp-èt`, plates, phone numbers noting colloquial **`โท` (`too`)** for `2`  
  *(Dates/BE years & Decimals/Ordinals/Ranges deferred cleanly to v1.1.)*
- **Privacy & Offline Audio Split:** Studio MP3s cache in Cloudflare R2; server custom TTS streams ephemerally or caches per-user with 24h TTL in `Supabase Storage EU` (tagged with machine-readable ID3/C2PA metadata for **EU AI Act Art. 50(2)**); once saved, custom-card MP3s are **kept on the user's phone in IndexedDB** (with 1-tap re-download/regenerate if iOS clears low-space storage). Lazy on-tap TTS for `likely_replies[]`.

---

## 2. Native QA Evaluation Pipeline

### Formal QA Pass Bars & Decision Rules
1. **100% Double-Rating on All Small & Safety-Critical Strata + Syllable-Unit Gwet's AC1 (`227` Items):**
   - The calibrated independent second native double-rates **100%** of: 30 replies, 30 prices, 42 Lesson 0 words, 60 Pack pitch words, 20 Chiang Mai clips, AND **all 12 allergy/dietary/safety slots** (Peanut, No-Beans, Shellfish/Shrimp, Tree-Nut/Cashew, No-Egg, No-Soy, No-Fish-Sauce, No-Oyster-Sauce, No-Chili, Vegetarian, Vegan, `pèt nɔ́ɔi/nɔ̀i`) — plus 15% of Packs 1–3 (14 items) and remaining 122 dish/protein/modifier slots (19 items) = **`227` double-rated items**.
   - **Unit = syllable**; **Gwet's AC1 `>= 0.85`** across the **5 mutually exclusive tone classes** (`mid | low | falling | high | rising`), while **segment/gloss error rate** is tracked separately (**`<= 1%`**, with **0 unresolved disagreements** in any 100%-rated stratum).
2. **Independent 500-Lemma & 10% (`500`-Word) Lexicon Audit:**
   - Calibrated second native audits 100 words of the TFL-authored 500-lemma core + **5 defined 100-word strata** of the 5,000-word core lexicon (`<= 1` error per 100-word stratum → 95% Clopper-Pearson upper bound `5.45%`; `>= 2` errors triggers a full audit of that stratum).
3. **Independent 3-Dimension Naturalness & Gloss Rubric (Second Native Only):**
   - 30 stratified prompts scored 1–10 on **(1) Idiomaticity**, **(2) Register Fit**, and **(3) Particle & English-Gloss Accuracy** (`>= 9.0/10` overall, `>= 8.5/10` per dimension).
4. **Lean 50-Case CI Suite + Incremental Post-Launch `Beta Tone Card` Hardening:**
   - **Pre-Launch (`50`-case deterministic CI regression suite):** Covers `น ำ ้` vowel reordering, `1000 บาท`, `ห้อง 555`, `0888123456`, `5555`, `กรุงเทพฯ`, `15,000.-`, `15k`, `1.5หมื่น`, `ไปด้วยกันน้าาา`, `pèt nɔ́ɔi` vs. `pèt nɔ̀i`, final glides (`jàai`/`mâi`/`hǐu`/`kàao`), and the brand/slug allowlist.
   - **Honest Launch Badge & Incremental Verification:** Custom decoded cards launch transparently labeled **`Beta Tone Card (auto-generated)`** with yellow `Check tone` chips and `"Ask a Thai friend to verify"`. Rather than spending `$312.50` + ~28h pre-launch recruiting a synthetic 200-message eval set before seeing real demand, our monthly TFL retainer incrementally audits real `🚩`-flagged cards and top recurring user patterns post-launch, adding regression tests and graduating out of `Beta` once live sampling confirms `>= 96%` syllable accuracy.
5. **80-Clip Stock-TTS Blind Audio Protocol (Gate 2 — 2 Independent Native Raters, 40M + 40F):**
   - Two unexposed native raters independently complete **(a) Free Transcription** on 40 mixed clips AND **(b) Forced-Choice Isolated-Syllable Tone ID** on 40 minimal-pair clips.
   - **Pass Bar:** `>= 95%` syllable match, `>= 85%` zero-error clips, **`>= 38/40` (`95%`) forced-choice tone ID PER RATER** (pooled `>= 76/80`, Wilson LB `87.8%`), `0%` gender/`kâ-ká` errors.

---

[← Progressive Reading Path](./08-progressive-reading-path.md) · [↑ Back to Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed)
