# 07 — UX Wireframes, Core Flows & Offline Stack

[← Thai Phonetics & Tone System](./06-thai-phonetics-and-tone-system.md) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: Progressive Reading Path →](./08-progressive-reading-path.md)

---

## 1. Key Screen Wireframes `[MVP v1.0]`

### A. Cold-Visitor First 10 Seconds (Zero Signup Wall)
Cold pages lead with big Play buttons and plain English (Sound Spelling slightly smaller right beside `? Sound Guide` so symbols never intimidate first-time visitors). **Badge Discipline:** W6–7 preview pages display **`[TFL-Audited Preview Audio]`** until W9–13 studio recordings replace them with **`[Studio ✓]`**.

```text
┌─────────────────── /muay-thai (Cold QR) ──────────────────┐
│  What Your Kru Says Between Rounds       [ ? Sound Guide ]│
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ▶  TIRED?           nʉ̀ai mái?   (เหนื่อยไหม) [Studio✓]│ │
│  │  ▶  LIGHTER / EASY!  bao bao     (เบาๆ)              │ │
│  │  ▶  HARDER!          rɛɛng ìik   (แรงอีก)            │ │
│  │  ▶  ONE MORE ROUND!  ìik yók nʉng (อีกยกนึง)         │ │
│  └──────────────────────────────────────────────────────┘ │
│  [ 🥊 Quiz Yourself on 6 Kru Calls (No Signup) → ]        │
│  [ 🍎 Continue with Apple ]    [ G Continue with Google ] │
│  StreetThai • Free pocket tools • $19.99 90-day pass      │
│  (one-time, no auto-renew • unlocks full Muay Thai pack   │
│   + hands-free gym commute loop • runs in Safari)         │
└───────────────────────────────────────────────────────────┘

┌──────────────────── /prices (Cold Link) ──────────────────┐
│  🇹🇭 Can You Survive a Thai Street Market? (~90-Sec Test) │
│  Question 1 / 15 • Tap ▶ for real M/F vendor audio        │
│           [  ▶  Play Vendor Price (M/F)  ]                │
│     [ 45฿ ]     [ 145฿ ]     [ 150฿ ]     [ 105฿ ]        │
│  Finish all 15 → Get your shareable score card ("13/15")  │
│  StreetThai • Free 15-price drill or $19.99 90-day pass   │
└───────────────────────────────────────────────────────────┘

┌─────────────── /dishes/pad-kra-pao (Cold SEO) ────────────┐
│  Polite ending: [● kráp (ครับ)] [ kâ (ค่ะ)] [ ? Guide ]   │
│  SHOW THIS TO THE VENDOR                       [48pt 📱]  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        ผัดกะเพราหมูสับ ไม่ใส่พริก เพิ่มไข่ดาว ครับ        │ │
│  │  [pàt] [gà]-[prao] [mǔu] [sàp] [mâi] [sài] [prík]... │ │
│  └──────────────────────────────────────────────────────┘ │
│  Protein: [● mǔu sàp] [gài] [mǔu grɔ̀ɔp] [dtâo-hûu] [jee] │
│  Spice:   [● no chili] [less] [med] [very] [+ ⚠️ Allergy] │
│  [ 🖼️ Save Card PNG (Instant) ] [ 📲 Save Offline App ]   │
│  StreetThai • Allergy & Dietary Cards FREE forever        │
└───────────────────────────────────────────────────────────┘
```

### B. Clean Daily Home Screen (Day 14 vs. Day 70 — Strictly 3 Daily Actions)
```text
┌────────────────── Home (Day 14 — Pack Mode) ──────────────┐
│  StreetThai          [ Offline Ready ✓ ]    [ 🆘 Panic ]  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🎯 TODAY'S 2-MIN DRILL   (11 due • Packs 1–3)       │ │
│  │  [ ▶ Start Active Drill ]   [ 🎧 Gym Commute Loop ]  │ │
│  └──────────────────────────────────────────────────────┘ │
│  [ 🍜 Street Food Builder ]   [ 💰 Baht Prices (Street) ] │
│  [ 📋 Copy & Paste Phrase → Save to Memory ]              │
│  Bottom Tabs:  Home  •  Packs (1–5)  •  Food  •  Settings │
└───────────────────────────────────────────────────────────┘

┌────────────────── Home (Day 70 — Capture Mode) ───────────┐
│  StreetThai          [ Offline Ready ✓ ]    [ 🆘 Panic ]  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🎯 TODAY'S 2-MIN DRILL   (9 due • 42 Personal Cards)│ │
│  │  [ ▶ Start Active Drill ]   [ 🎧 Gym Commute Loop ]  │ │
│  └──────────────────────────────────────────────────────┘ │
│  💡 WEEKLY CAPTURE (3 / 5 done): "What did your Kru say   │
│     today, or one thing you wished you could say?"        │
│     [ + Type English or Paste Thai → Add Card ]           │
│  [ 🍜 Street Food Builder ]   [ 🏠 Pack 4 / 5 Condo/Gym ] │
│  Bottom Tabs:  Home  •  Packs (1–5)  •  Food  •  Settings │
└───────────────────────────────────────────────────────────┘
```

### C. Compact 550px Phrase Card (Per-Syllable Pills; Pitch Compare Inside Word-by-Word)
```text
┌──────────────────────────────────────────────────────────┐
│  ← Restaurants     [Audited: Kru Name ✓]     [🔖 Saved]  │
├──────────────────────────────────────────────────────────┤
│  "Let's just pay it all together"                        │
│  ( ▶ 1.0x )   ( 🐢 0.75x )   ( 🎙 Hold: A/B Compare )    │
│  Tip: Drop low on "jàai"; end "kráp" sharply (no puff)   │
│                                                          │
│  [jàai]   [ruam]   [gan]   [ləəi]   [ná]    [kráp]       │
│  (blue)   (gray)  (gray)   (gray)  (purple)(purple)      │
│  จ่ายรวมกันเลยนะครับ              [ 📱 Show to Local ]    │
│                                                          │
│  🗣️ LIKELY REPLY (1 of 2 • Tap +1 more)  [Voice: Male ▾]  │
│  "งั้นสแกนหรือเงินสดครับ?" ▶                              │
│  [ngán] [sà]-[gɛɛn] [rʉ̌ʉ] [ngən]-[sòt] [kráp]            │
│   → "QR scan or cash?"   [Your reply: sà-gɛɛn kráp]      │
│                                                          │
│  ▸ Word-by-Word (6 • Tap core words for Pitch Compare)   │
│  ▸ Local Tip 💡  •  [ 💬 ChatGPT Voice Roleplay ] [🚩]   │
└──────────────────────────────────────────────────────────┘
```

- **Duration-Gated Pitch-Contour Overlay:** Whole-phrase cards use `Hold: A/B` audio comparison (`Native 1.0x → 0.4s → User`) with no F0 clutter. Tapping core 1–2 syllable words inside `Word-by-Word` opens Pitch Compare against **`102` isolated studio citation words** (`204` clips): **~77 live/long-vowel words AND the gender-critical `kâ`/`ká` pair display the F0 contour** (3-sec calibration, semitone norm against median F0, DTW alignment, 1-line slope cue), while ultra-short stopped syllables (`< 90ms` voiced vowel like `bàt`, `dtàp`, `kráp`) are suppressed via a **duration gate** to `Hold: A/B` + stop cue. Zero server upload, zero fake % score.
- **Trust Badges:** `[Audited: Kru Name ✓]` appears **only** on studio cards; custom AI cards are transparently labeled **`Beta Tone Card (auto-generated)`** with yellow `Check tone` chips + `"Ask a Thai friend to verify"` share + **`Practise in ChatGPT Voice`** prompt copy button; synthetic TTS displays an `auto-voice` badge + ID3/C2PA metadata.

---

## 2. Lesson 0 — Dual-Voice Active Ear Quizzes (19 Cards, 42 Unique Words = 84 Clips) `[MVP v1.0]`

Active 2-AFC / 3-AFC forced-choice quizzes across both M & F studio voices (high-confusion tone pairs recycle into the 30% Receptive Listening FSRS pool; v1.1 optionally adds a 3rd/4th talker):

**Part 1 — Core Tones, Particles & 3-Way Stops (10 Cards, 23 unique words, ~3 min):**
1. Mid vs. Low: `gao` (เกา scratch) / `gào` (เก่า old)
2. High vs. Rising: `náa` (น้า aunt/uncle) / `nǎa` (หนา thick)
3. **Falling vs. High (Non-Particle):** `kâa` (ค่า cost/fee) / `káa` (ค้า trade/sell)
4. **Gender-Critical Particle:** `kâ` (ค่ะ statement, Falling) / `ká` (คะ question, High)
5. **Canonical Food Pair:** `kâao` (ข้าว rice, Falling) / `kǎao` (ขาว white, Rising)
6. **Distance Pair:** `glâi` (ใกล้ near, Falling) / `glai` (ไกล far, Mid)
7. 3-AFC Tones: `mâi` (ไม่ not) / **`mái` (ไหม-มั้ย short spoken question — never long `ไม้` `máai`)** / `mài` (ใหม่ new)
8. **3-Way Labial Stop Triplet (all Low):** `bàa` (บ่า shoulder) / `bpàa` (ป่า forest) / `pàa` (ผ่า cut)
9. **3-Way Alveolar Stop Triplet (all Mid):** `dii` (ดี good) / `dtii` (ตี hit) / `tii` (ที time/turn)
10. Velar Stop Contrast: `gài` (ไก่ chicken) / `kài` (ไข่ egg)

**Part 2 — Affricate, Vowel Length, `ng-`, Finals & Unfamiliar Vowels (9 Cards, 19 unique words, ~3 min):**
11. Affricate: `jaam` (จาม sneeze) / `chaam` (ชาม bowl)
12. Short vs. Long `a/aa`: `bàt` (บัตร card) / `bàat` (บาท baht)
13. Short vs. Long `ao/aao`: `kào` (เข่า knee) / `kàao` (ข่าว news)
14. Initial `ng-` vs. `n-`: `ngaan` (งาน work) / `naan` (นาน long time)
15. **Unreleased Final Stops (`-p/-t/-k`):** `dtàp` (ตับ liver) / `dtàt` (ตัด cut) / `dtàk` (ตัก scoop)
16. Unrounded `ʉʉ` vs. `uu`: `kʉʉn` (คืน night / return) / `kuun` (คูณ multiply)
17. Wide `ɛɛ` vs. `ee`: `lɛ̂ɛk` (แลก exchange money) / `lêek` (เลข number)
18. Pure `ɔɔ` vs. `oo`: `bɔ̀ɔk` (บอก tell) / `bòok` (โบก wave)
19. Central `əə` vs. `oo`: `təə` (เธอ you / she) / `too` (โทร call; `โท` "second" is a homophone)

---

## 3. Free-Forever Allergy & Dietary Street Food Builder, Prices & Quick-Copy `[MVP v1.0]`

### A. 3-Step Street Food Order Builder (Zero Credits)
- **Instant First-Visit Offline Backup:** 1-tap **`Save Card PNG`** right on the first visit + 2-frame visual Safari `Share ↑ → Add to Home Screen` guide + `"Offline ready ✓ / Re-download"` badge.
- **Step 1 — Top-100 Dishes (Fuzzy Search):** Indexed on 3+ romanization variants (`kaprao`/`krapow`/`gaprao`) + English keywords (`pàt gà-prao`, `kâao sɔɔi` [Mid `sɔɔi`], `sôm-dtam`, `dtôm-yam`, `pàt tai`, `kâao kài jiao`, iced tea/latte, boat noodles, etc.).
- **Step 2 — 10 Proteins & Dietary Options:** `mǔu sàp` (minced pork), `mǔu grɔ̀ɔp` (crispy pork), `gài` (chicken), `nʉ́a` (beef), `gûng` (shrimp), `tá-lee` (seafood), **`bplaa` (`ปลา` — fish)**, `dtâo-hûu` (tofu), **`mang-sà-wí-rát` (`มังสวิรัติ` — vegetarian, with explicit warning that stalls routinely add fish sauce, oyster sauce, shrimp paste [`gà-bpì` กะปิ] & dried shrimp [`gûng hɛ̂ɛng` กุ้งแห้ง] + 1-tap exclusion toggles)**, and **`jee` (`เจ` — strict Thai vegan: no meat, dairy, eggs, garlic, or onion)**.
- **Step 3 — 24 Modifiers & Dedicated Allergy Cards (Every One With Studio Audio; All 12 Safety Slots 100% Double-Rated):**
  - *Spice & Taste (11):* `mâi sài prík` (no chili), `mâi pèt ləəi` (zero spice; notes `mâi pèt`), `pèt nɔ́ɔi` (less spicy), `pèt glaang` (medium), `pèt mâak` (very spicy), `wǎan nɔ́ɔi` (less sweet), `mâi sài nám-dtaan` (no sugar), `nám-kɛ̌ng nɔ́ɔi` (less ice), `mâi sài nám-kɛ̌ng` (no ice), `mâi sài pàk-chii` (no coriander), `mâi sài pǒng-chuu-rót` (no MSG).
  - *Dedicated Allergy & Dietary Cards (8 — FREE FOREVER + Mandatory Red Cross-Contamination Warning Banner: "Thai stalls share woks, peanut oil, shrimp paste & sauces — never rely on an app alone for severe anaphylaxis."):*
    1. **`pɛ́ɛ tùa lí-sǒng run-rɛɛng`** (`แพ้ถั่วลิสงรุนแรง` — severe peanut allergy)
    2. **`mâi sài tùa`** (`ไม่ใส่ถั่ว` — **no peanuts/beans**; explicitly notes this does NOT cover cashews)
    3. **`pɛ́ɛ aa-hǎan tá-lee / pɛ́ɛ gûng`** (`แพ้อาหารทะเล / แพ้กุ้ง` — **shellfish/seafood & shrimp allergy**, noting dried shrimp `gûng hɛ̂ɛng` & shrimp paste `gà-bpì` in som tam/nam prik)
    4. **`pɛ́ɛ tùa bplʉ̀ak kɛ̌ng / mét má-mûang hǐm-má-paan`** (`แพ้ถั่วเปลือกแข็ง / เม็ดมะม่วงหิมพานต์` — **tree nuts & cashews allergy**)
    5. **`mâi sài kài`** (`ไม่ใส่ไข่` — no egg)
    6. **`mâi sài sii-íu / sɔ́ɔt tùa lʉ̌ang`** (`ไม่ใส่ซีอิ๊ว / ซอสถั่วเหลือง` — no soy sauce)
    7. **`mâi sài nám-bplaa`** (`ไม่ใส่น้ำปลา` — no fish sauce)
    8. **`mâi sài sɔ́ɔt hɔ̌i naang-rom`** (`ไม่ใส่ซอสหอยนางรม` — no oyster sauce)
  - *Portions & Serving (5):* `pí-sèet` (extra/large), `pə̂əm kài daao` (+ fried egg), `pə̂əm kài jiao` (+ Thai omelette), `gin tîi nîi` (eat here), `sài tǔng` (takeaway — *vendors also commonly say `glàp bâan` "take home"*).
- **Honest Offline vs. Online Audio Contract:** Offline (after A2HS) = fuzzy search, 48pt Show-to-Local, **48 standalone studio modifier/allergy clips** (`24 × 2`), and **6 top stall-reply clips** (`3 × 2`: `gin tîi nîi rʉ̌ʉ glàp bâan?`, `pèt mái?`, `sài pàk-chii mái?`). Online = full composed-sentence audio rendered in single-voice EU stock TTS (`auto-voice`), with all 134 base slots TFL-audited.

### B. 30-Price Dual-Voice Ear Drill + Street Mode (60 Studio Clips)
- Free `/prices` mini-drill uses **15 prices in both M & F voices**; Pro unlocks all **30 prices** plus **Street Mode** (client WebAudio light Bangkok street/wok ambient bed + 1.15× natural fast playback on prices & vendor replies).
- Drills 15–20 carrier phrases (`ทั้งหมด...บาทครับ/ค่ะ`), `14/40`, `15/50`, `16/60`, `เอ็ด`, `ร้อยนึง`, `ร้อยยี่` (120฿), `สองร้อยห้า` (250฿), `พันสอง` (1,200฿), `พันห้า` (1,500฿), `ยี่สิบ→ยิบ` *(TFL-verified)*, and natural **`nʉ̀ng rɔ́ɔi hâa bàat`** (105฿) vs. `rɔ́ɔi hâa-sìp rə̌ə kráp/ká?` (150฿).

### C. 6 Exact Quick-Copy Messages (WhatsApp / LINE / Condo Drawer)
1. *Drop-off:* `วางไว้ที่ล็อบบี้ได้เลยครับ/ค่ะ` (`waang wái tîi lɔ́p-bîi dâai ləəi kráp/kâ` — "Please leave it at the lobby.")
2. *Arriving soon:* `กำลังลงไปครับ/ค่ะ อีก 5 นาที` (`gam-lang long bpai kráp/kâ ìik hâa naa-tii` — "Coming down now, 5 minutes.")
3. *Condo repair:* `แอร์ไม่เย็นครับ/ค่ะ รบกวนส่งช่างมาดูหน่อยได้ไหมครับ/คะ` (`ɛɛ mâi yen kráp/kâ, róp-guan sòng châang maa duu nɔ̀i dâai mái kráp/ká` — "AC isn't cold; could you send a technician?")
4. *Rent paid:* `โอนค่าเช่าเรียบร้อยแล้วครับ/ค่ะ` (`oon kâa châo rîap-rɔ́ɔi lɛ́ɛo kráp/kâ` — "Transferred the rent already.")
5. *Laundry check:* `ซักผ้าเสร็จหรือยังครับ/คะ` (`sák pâa sèt rʉ̌ʉ yang kráp/ká` — "Is the laundry ready yet?")
6. *Scooter/pickup:* `พรุ่งนี้กี่โมงสะดวกครับ/คะ` (`prûng-níi gìi moong sà-dùak kráp/ká` — "What time works tomorrow?")

---

## 4. 5 Studio Packs, Weekly Challenges & Offline-First Stack

### A. 5 Pure-Studio Packs (90 Phrases + 30 Replies → 150 Phrases + 50 Replies by M10)
*Internal studio inventory: **`572` launch clips** (`180` Packs 1–3 + `60` replies + `60` prices + `84` Lesson 0 + `48` modifiers/allergy + `120` Pack pitch words + `20` female Chiang Mai `jâo` listening-only clips [Central tone colors disabled]) → **`732` clips by M10** (+80 Pack 4, +80 Pack 5). Customer copy shows honest phrase/reply counts.*

1. **Pack 1 `[Launch]` (30 phrases + 10 replies):** *Essentials, Condo & Everyday Banter* (`mâi`/`mâi châi`/`mâi mii`, `mâi dâai [V]` vs. `[V] mâi dâai`).
2. **Pack 2 `[Launch]` (30 phrases + 10 replies):** *Street Food, Cafes & Classifiers* (`náam kùat nʉng` vs. `náam sɔ̌ɔng kùat`, `pèt nɔ́ɔi` vs. `pèt nɔ̀i`, 9 core classifiers).
3. **Pack 3 `[Launch]` (30 phrases + 10 replies):** *Muay Thai, Gym & Recovery* (authentic Thai-English Kru banter `nʉ̀ai mái?`, `bao bao`, `rɛɛng ìik`, `sûu sûu`, `ìik yók nʉng`, counting / `"again again"`, soreness, massage).
4. **Pack 4 `[M7 Studio]` (30 phrases + 10 replies = 80 clips):** *Condo, Landlord, Scooter, Grab & Laundry*.
5. **Pack 5 `[M10 Studio]` (30 phrases + 10 replies = 80 clips):** *Clinic, Pharmacy, Immigration/90-Day Report & Social Banter*.

### B. 12 Concrete Weekly Challenges + Guided Weekly Capture Ritual
- **Weeks 1–12 Real-Life Missions:** W1 Order street food w/ 2 modifiers • W2 Catch a vendor price without looking • W3 Ask your Kru a pad-work/recovery question • W4 Pay together (`jàai ruam gan`) & choose scan/cash • W5 Send a condo/delivery Thai message • W6 Order iced coffee w/ exact sweetness & ice • W7 Capture 5 real phrases from your week • W8 Ask for a massage pressure adjustment • W9 Handle a Grab/taxi drop-off instruction • W10 Survive a 15-price Street-Mode drill at 80%+ • W11 Recognize Northern `jâo` at a Chiang Mai market • W12 Roleplay a 3-turn stall/gym dialogue via the ChatGPT Voice prompt button.
- **Day-45+ Retention Engine:** English-first weekly *"Capture 5 Real Phrases"* prompts (*"What did your Kru say today?"*, *"One thing you ordered tonight"*, *"One sentence you wished you could say"*) turn real life into personal offline FSRS decks.

### C. Local-First Offline Stack (TanStack DB + RxDB) & Commute Loop
- **Structured Offline-First State (`$0` License Cost):** All structured data (append-only `ts-fsrs` review logs, saved custom cards, pack progress, user particle/settings) runs on **TanStack DB (`@tanstack/rxdb-db-collection`, MIT) + RxDB Core (Apache 2.0) + `getRxStorageDexie()` (Apache 2.0)** with **RxDB Supabase Postgres Replication (RLS-enforced)** — giving instant reactive queries and conflict-resilient offline sync across both Phase 1 PWA and Phase 2 Capacitor.
- **Binary Audio Storage Split:** Binary MP3 blobs (**all 5 Studio Packs** + kept-on-phone saved custom-card audio w/ 1-tap re-download/regenerate if iOS clears low-space storage) live in **Workbox Cache Storage / dedicated IndexedDB blob store** so MP3 binaries never bloat RxDB JSON docs or replication.
- **Hands-Free Audio Commute Loop `[MVP v1.0]`:** Autoplays due FSRS/pack/saved-custom audio hands-free with **adjustable 2–4s recall pause + 2–3s shadowing repeat gap** (continuous-stream Blob fallback tested on iOS lock screen in Gate 2; screen-on fallback if iOS blocks background PWA audio). **FSRS Integrity Rule:** Passive commute listening logs cards as **`Heard (passive)`** — cards remain **due** until actively graded in a 2-minute tap review.
- **Daily Nudges Without Spam:** Free Web Push (`$0/mo`, zero Thai text in payloads) + Resend Pro Email **capped strictly at 3/week** with user-chosen routine anchors (*"before Muay Thai"*, *"before dinner"*) + `"Leaving Thailand"` FSRS Pause & `"Returning in 2 Weeks"` 5-day refresher.

---

[← Thai Phonetics & Tone System](./06-thai-phonetics-and-tone-system.md) · [Index](https://linear.app/tomasz-goral/document/product-vision-00-overview-e410c2fa17ed) · [Next: Progressive Reading Path →](./08-progressive-reading-path.md)
