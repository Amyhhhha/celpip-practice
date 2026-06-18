[README.md](https://github.com/user-attachments/files/29105590/README.md)
# CELPIP Writing Practice — Deploy Guide

## Get a FREE Gemini API key (no credit card needed)

1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click **Get API key** → **Create API key**
4. Copy the key (starts with `AIza...`)

---

## Deploy to Vercel (free hosting)

### Step 1 — Upload to GitHub
1. Go to https://github.com → sign up / log in
2. Click **New repository** → name it `celpip-practice` → **Create repository**
3. Upload these 3 files (drag and drop onto the GitHub page):
   - `api/score.js`
   - `public/index.html`
   - `vercel.json`

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → **Sign up with GitHub**
2. Click **Add New Project** → select `celpip-practice` → **Import**
3. Click **Deploy** (keep all default settings)

### Step 3 — Add your Gemini API key
1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from above (starts with `AIza...`)
3. Click **Save**
4. Go to **Deployments** → three dots on latest → **Redeploy**

✅ Your site is now live at `https://your-project-name.vercel.app`

---

## File structure
```
celpip/
├── api/
│   └── score.js        ← Server function (calls Gemini API securely)
├── public/
│   └── index.html      ← The full website
├── vercel.json         ← Routing config
└── README.md           ← This file
```

## Gemini free tier limits
- 15 requests per minute
- 1,500 requests per day
- Completely free, no credit card required
- More than enough for daily CELPIP practice
