# eProcure Pro v5.1 – GitHub Pages Landing + Auto-Update – সম্পূর্ণ Deploy গাইড
## Developed by: Mohammad Shahin Hossain, Surveyor, LGED
### 01675350306 | srony25@gmail.com | https://shrony25.github.io/Shahin_1/

---

## ১) GitHub এ কি আলাদা ডোমেইন / আলাদা সাইট নিতে পারবেন?

**হ্যাঁ – ১০০% পারবেন – একই GitHub একাউন্ট (shrony25) দিয়ে আনলিমিটেড সাইট।**

৩ ধরনের ঠিকানা পাবেন – সব ফ্রি:

| টাইপ | উদাহরণ | খরচ |
|---|---|---|
| A. সাব-ফোল্ডার সাইট (Recommended – এখনই) | `https://shrony25.github.io/epro/` | ০ টাকা |
| B. সাব-ফোল্ডার – existing repo | `https://shrony25.github.io/Shahin_1/epro/` | ০ টাকা |
| C. নিজস্ব কাস্টম ডোমেইন | `https://www.eproshahin.com` | ডোমেইন ~1000-1500৳/বছর, হোস্টিং ০ টাকা |

আপনার জন্য আমি **Option A** রেডি করে দিয়েছি – সবচেয়ে সহজ।

---

## ২) নতুন GitHub Repo বানানো – ৩ মিনিট

১. https://github.com লগইন করুন – user: **shrony25**
২. উপরে ডান পাশে **+ → New repository**
   - Repository name: **`epro`**
     → ফলে সাইট হবে: `https://shrony25.github.io/epro/`
   - Description: `eProcure Auto Evaluation Pro v5.1 – by Mohammad Shahin Hossain, LGED`
   - ✅ Public
   - ✅ Add a README file
   - Create repository
৩. Settings → Pages (বাম মেনু)
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Save
   → ১-২ মিনিট পর সাইট লাইভ: `https://shrony25.github.io/epro/`

এটাই আপনার “ডোমেইন” – কোনো টাকা লাগে না, Lifetime ফ্রি।

চাইলে পরে নিজের ডোমেইন যোগ করতে পারবেন:
- Settings → Pages → Custom domain
- যেমন: `eproshahin.com` / `shahinepro.com`
- ডোমেইন কিনতে: namecheap.com / GoDaddy ~ $9-12/year
- DNS এ 4 টা A record বসালেই হবে – আমি করে দেব।

---

## ৩) ফাইল আপলোড – যেভাবে Buyer License হারাবে না

এই ফোল্ডারে (`epro-landing/`) যা যা আছে, হুবহু GitHub repo `epro` তে upload করবেন:

```
epro/
│
├─ index.html                    ← Landing page
├─ README.md                     ← এই ফাইল
│
├─ download/
│   ├─ eprocure-pro.user.js      ← Obfuscated DISTRIBUTION script
│   └─ eprocure-pro.meta.js      ← Auto-update header only
│
└─ docs/
    └─ User-Manual-EN.pdf        ← Buyer tutorial
```

**Upload পদ্ধতি (২ ভাবে):**

**সহজ – ওয়েবসাইট থেকে:**
1. github.com/shrony25/epro → **Add file → Upload files**
2. `index.html` drag-drop → Commit
3. `download/` ফোল্ডার বানিয়ে ভিতরে `eprocure-pro.user.js` + `eprocure-pro.meta.js` upload
4. `docs/` ফোল্ডার বানিয়ে `User-Manual-EN.pdf` upload
5. Done – 1-2 মিনিটে https://shrony25.github.io/epro/ লাইভ

**Pro – Git দিয়ে:**
```bash
git clone https://github.com/shrony25/epro.git
cd epro
# এখানে সব ফাইল কপি করুন
git add .
git commit -m "eProcure Pro v5.1 Lifetime – Shahin LGED – Initial Release"
git push origin main
```

---

## ৪) Auto-Update – কিভাবে কাজ করে, License হারাবে না যেভাবে

আপনার script header এ এই ৩ লাইন আছে:

```
// @version      5.1 Lifetime
// @updateURL    https://shrony25.github.io/epro/eprocure-pro.meta.js
// @downloadURL  https://shrony25.github.io/epro/eprocure-pro.user.js
```

**কিভাবে আপডেট দেবেন – Buyer License না হারিয়ে:**

1. **কখনোই বদলাবেন না:**
   - `SECRET_SALT = "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!"`
   - `SecureStore.prefix = "epro_shahin_v51_"`
   - `LicenseEngine.generateExpectedKey()` logic
   - `@namespace = shahin.lged.eprocure.pro`

2. **শুধু এগুলো বদলাবেন:**
   - `@version 5.1 Lifetime` → `5.1.1 Lifetime` → `5.2 Lifetime`
   - UI text, delay, reason text, bug fix

3. **Update deploy flow:**
   a. Master script edit → test locally
   b. Obfuscate → `eprocure-pro.user.js`
   c. `eprocure-pro.meta.js` এ version নম্বর আপডেট করুন (শুধু header)
   d. ২টা ফাইলই GitHub `epro` repo → `download/` এ upload / push
   e. Done

4. **Buyer কি দেখবে:**
   - Tampermonkey প্রতি 24 ঘন্টায় `updateURL` চেক করে
   - নতুন version পেলে Dashboard এ “Update” বাটন আসে
   - Buyer “Update” চাপে → নতুন code install → 
   - **License GM storage এ আলাদা সেভ করা – তাই অটো থাকে – re-activate লাগে না**
   - Panel খুলেই দেখবে: “✅ Lifetime Licensed – Shahin LGED”

**গুরুত্বপূর্ণ:** 
- `eprocure-pro.meta.js` এ সবসময় নতুন `@version` থাকতে হবে – Tampermonkey এটা দেখেই update detect করে
- `eprocure-pro.user.js` আর `eprocure-pro.meta.js` – ২টার version সবসময় মিল রাখবেন

---

## ৫) Landing Page এ কি কি আছে

`index.html` – Single file, no server needed:

- Hero: “e-GP Tender Evaluation – ঘণ্টার কাজ – এখন মিনিটে”
- Badges: ✅ LGED Tested | ⚡ Lifetime License | 🇧🇩 Made in Bangladesh
- Download buttons:
  - ⬇️ Download Pro v5.1 → `./download/eprocure-pro.user.js`
  - 📄 User Manual (PDF) → `./docs/User-Manual-EN.pdf`
  - 💬 WhatsApp Order → `https://wa.me/8801675350306`
- 6 Feature cards – Auto Eval / Clarification / JV / Finalize / Live Panel / License
- 3 Step Install – with links
- Pricing box – “৳ আলোচনা সাপেক্ষে” – WhatsApp CTA
- FAQ – License হারাবে? PC change? LGED ফ্রি?
- Footer – Developed by **Mohammad Shahin Hossain, Surveyor, LGED – 01675350306 – srony25@gmail.com – https://shrony25.github.io/Shahin_1/**
- Watermark top-right always visible
- Mobile responsive
- Auto-update URLs embedded in footer

সব text বাংলায় + ইংরেজিতে মিক্স – যাতে সবাই বোঝে।

---

## ৬) Buyer License না হারানোর – Final Checklist

প্রতি Update রিলিজের আগে:

```
[✓] SECRET_SALT অপরিবর্তিত?
    "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!"
[✓] SecureStore.prefix = "epro_shahin_v51_" ?
[✓] LicenseEngine.generateExpectedKey() untouched?
[✓] @namespace = "shahin.lged.eprocure.pro" ?
[✓] @version শুধু বাড়িয়েছি? 5.1 → 5.1.1
[✓] eprocure-pro.meta.js এও একই version?
[✓] Test: পুরাতন Activated Chrome এ নতুন script install → 
    License Gate আসে কি? → আসা যাবে না। "Licensed" থাকতে হবে।
[✓] Obfuscate করে DISTRIBUTION build করেছি?
[✓] GitHub epro repo তে eprocure-pro.user.js + eprocure-pro.meta.js ২টাই push করেছি?
```

সব ✓ হলে – ১০০% নিরাপদ – Buyer update পাবে, License হারাবে না।

---

## ৭) Quick Commands – Copy/Paste

নতুন রিলিজ push:
```bash
# 1. version bump in script
# 2. obfuscate
# 3. copy
cp dist/eprocure-pro-shahin-v5.1.1-OBFUSCATED.user.js epro-landing/download/eprocure-pro.user.js

# update meta version
nano epro-landing/download/eprocure-pro.meta.js
# change: // @version      5.1.1 Lifetime

# push to GitHub
cd ~/epro
cp -r /path/to/epro-landing/* .
git add .
git commit -m "eProcute Pro v5.1.1 – bugfix – Shahin LGED – lifetime license preserved"
git push origin main

# 2 min wait → https://shrony25.github.io/epro/ live
# Buyers get auto-update in 24h
```

License generate + CSV auto-save:
```bash
cd D:\Shahin-EPRO-Seller
node generate-license-shahin-v2.js SHAHIN-XXXX-XXXX-XXXX
# → interactive → customer info → auto save to license-tracker-shahin.csv
```

---

## যোগাযোগ – ডেভেলপার

**Mohammad Shahin Hossain**
Surveyor, Local Government Engineering Department (LGED)
Mobile / WhatsApp: **01675350306**
Email: **srony25@gmail.com**
Portfolio: **https://shrony25.github.io/Shahin_1/**
Product site: **https://shrony25.github.io/epro/**

© 2025 Mohammad Shahin Hossain – All Rights Reserved
eProcure Auto Evaluation Pro v5.1 Lifetime – Shahin Edition
Commercial – Single PC – Lifetime – Bangladesh Copyright Act 2000
