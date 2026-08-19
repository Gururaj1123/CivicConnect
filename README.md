# CivicConnect

A full-stack civic complaint management platform. Citizens report issues with
location + optional photo, get a unique Complaint ID, and track progress.
Authorities log in to a separate dashboard to review, assign, and resolve
complaints. Everything runs on free services — no paid plan required anywhere.

**Note:** this code was generated in a sandbox with no internet access, so it
has not been run against a live MongoDB/Cloudinary connection. It's built
carefully against each library's standard API, but budget time for the normal
first-run debugging any new project needs. The steps below are written so you
can get it running and fix anything that comes up.

---

## 1. What's free here, and why

| Piece | Service used | Cost |
|---|---|---|
| Database | MongoDB Atlas (M0 tier) | Free forever, no card required for the free tier |
| Photo storage | Cloudinary free tier | Free (25 credits/month, plenty for a demo) |
| Location | Browser Geolocation API | Free, built into every browser |
| Reverse geocoding (coords → address) | OpenStreetMap Nominatim | Free, no API key |
| AI priority engine | Rule-based (keyword + category matching) | Free, runs locally — see notes below |

**About "AI"**: the spec is explicit that a rule-based engine must not be
described as a real AI model. `server/services/aiPriorityService.js` is a
keyword/category classifier — fast, free, and good enough for a demo. It's
isolated behind one function so you can later swap in a real model (OpenAI,
Anthropic, Grok, a fine-tuned classifier, whatever) without touching any
other file — the rest of the app only ever sees `{ level, score, reason }`
coming back.

---

## 2. One-time account setup (10–15 minutes)

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0** cluster (any region close to you).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (fine for a demo).
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Replace `<password>` with your real password, and add `/civicconnect` right before the `?`, e.g.:
   `mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/civicconnect?retryWrites=true&w=majority`

### Cloudinary
1. Go to https://cloudinary.com/users/register/free and sign up (free tier).
2. Your **Dashboard** homepage shows `Cloud Name`, `API Key`, and `API Secret` directly — no extra steps needed.

---

## 3. Install and configure

```bash
# Backend
cd server
npm install
cp .env.example .env
# now open .env and paste in your MONGO_URI, JWT_SECRET (any random string),
# and the three CLOUDINARY_* values from your dashboard

# Frontend
cd ../client
npm install
cp .env.example .env
```

## 4. Run it

```bash
# Terminal 1 - backend
cd server
npm run dev
# should print: "MongoDB connected: ..." and "CivicConnect server running on port 5000"

# Terminal 2 - seed demo data (optional but recommended for the demo)
cd server
npm run seed
# creates CP-2026-0001 through CP-2026-0004 in different statuses

# Terminal 3 - frontend
cd client
npm run dev
# open http://localhost:5173
```

Authority demo login: **admin / admin123** (set in `server/.env`, change anytime).

---

## 5. Project structure

```
CivicConnect/
├── server/                     Express + MongoDB backend
│   ├── config/db.js            MongoDB connection
│   ├── models/                 Complaint.js, Authority.js (Mongoose schemas)
│   ├── routes/                 complaintRoutes.js, authRoutes.js
│   ├── controllers/            complaintController.js, authController.js
│   ├── services/aiPriorityService.js   rule-based priority engine (swap-in ready)
│   ├── middleware/              authMiddleware.js (JWT check), uploadMiddleware.js (Cloudinary)
│   ├── utils/                  complaintIdGenerator.js, cloudinary.js
│   └── seed/seedData.js        demo data for the dashboard
└── client/                     React + Vite frontend
    └── src/
        ├── components/         Navbar, ComplaintForm, PhotoUploader, LocationPicker,
        │                       StatusBadge, PriorityBadge, ProgressTimeline,
        │                       ComplaintCard, ComplaintTable, StatsCard
        ├── pages/               Home, ReportIssue, ComplaintSuccess, TrackComplaint,
        │                       AuthorityLogin, AuthorityDashboard, ComplaintReview
        └── services/api.js     all backend calls centralized here
```

---

## 6. Demo flow (matches the hackathon script)

1. Open the home page → **Report an Issue**
2. Pick **Road Damage**, type a description, tap **Use Current Location**
   (allow the browser's location permission prompt), optionally add a photo
3. Submit → you land on the success page with a fresh Complaint ID (e.g.
   `CP-2026-0005`), its AI priority, and status **REPORTED** — no authority
   controls appear here. If a similar complaint already exists nearby, a
   duplicate-warning banner shows up here too.
4. Go to **Authority Login** → sign in with `admin` / `admin123`
5. Dashboard shows the new complaint plus the 4 seeded ones, with live stats
6. Click **Review** on the new complaint → see full details, an embedded
   map of the exact location, photo, AI reason, and any nearby duplicates
7. **Assign to Department** → pick one → status becomes `ASSIGNED`
8. **Mark In Progress** → status becomes `IN_PROGRESS`
9. **Mark Resolved** → optionally attach a proof-of-work photo → status becomes `RESOLVED`
10. Go to **Track Complaint** (as a citizen, logged out) → enter the ID →
    see the same status, live from MongoDB, all four timeline steps checked
    off, the resolution photo (if added), and a star-rating box to leave feedback

### Citizen accounts (required to report an issue)

- Reporting an issue now requires a citizen account — **Login / Sign Up**
  (navbar) with name, email, and password. This is enforced on both the
  frontend (Report Issue redirects to login if you're not signed in) and
  the backend (`POST /api/complaints` rejects the request without a valid
  citizen token), so it can't be bypassed by calling the API directly.
- Every complaint you submit is automatically linked to your account
- **My Complaints** (navbar, once logged in) shows only your own complaints —
  clicking one opens it on the Track Complaint page
- **Tracking** a complaint by its Complaint ID stays public/anonymous —
  anyone with the ID can check status, exactly as before. Only *submitting*
  a new complaint requires login.

---

## 7. Real AI prioritization (Groq)

If `AI_API_KEY` in `server/.env` is a valid Groq key (free at
https://console.groq.com), submissions get a real LLM-based priority
assessment (Llama 3.1) instead of the rule-based fallback. The Review page
shows which one produced the result ("AI model (Groq)" vs "Rule-based (AI
unavailable)") so it's never misrepresented either way. If the key is
missing or the call fails for any reason, the rule-based engine kicks in
automatically — a submission never breaks because of this.

---

## 8. Known prototype limitations (called out in the code, not hidden)

- Authority login is a single hardcoded demo account, not per-user accounts.
  Real deployment needs `bcrypt` password hashing (the `Authority` model and
  `bcryptjs` dependency are already in place for that), refresh tokens, and
  role-based permissions.
- Citizen accounts use `bcrypt`-hashed passwords and JWTs already (this part
  is closer to production-ready), but still has no email verification,
  password reset, or rate limiting.
- No rate limiting or CORS allowlist yet — fine for a demo, not for production.
- AI priority calls Groq when a key is present, with an automatic rule-based
  fallback — see section 7.
- Background/hero images have been removed in favor of clean CSS gradient
  panels — no external image service is used anywhere in the UI.

## 9. If something doesn't connect

- **"MongoDB connection error"** → double check `MONGO_URI` in `server/.env`:
  password correct, `/civicconnect` present before the `?`, and your current
  IP is allowed under Atlas Network Access.
- **Photo upload fails** → check the three `CLOUDINARY_*` values in `server/.env`
  match your Cloudinary dashboard exactly.
- **Location button does nothing** → browsers only allow Geolocation on
  `localhost` or HTTPS, and the user must accept the permission prompt.
