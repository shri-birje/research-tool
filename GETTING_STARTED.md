# 🚀 Getting Started - Research Portal

Welcome! This guide will get you up and running in **5 minutes locally** and **10 minutes to production**.

## What You Have

A complete, deployable **AI-powered research portal** with:
- 📄 Document upload system
- 💰 Financial statement extraction tool
- 📞 Earnings call analysis tool
- 🎨 Professional web interface
- ☁️ Ready-to-deploy configuration

## Quick Start (Local Testing)

### Before You Begin
- Have Node.js 16+ installed (`node --version`)
- Get an OpenAI API key from https://platform.openai.com/api-keys
- You need ~100MB disk space

### Step 1: Setup (2 minutes)

```bash
# Navigate to project
cd "d:/research tool"

# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create environment file
cd backend
copy .env.example .env
# Edit .env and add your OpenAI API key
```

### Step 2: Run (3 minutes)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
You should see: `Research Portal API running on port 3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Open browser to: http://localhost:3000

### Step 3: Test

1. **Upload a PDF** (use a financial statement or earnings call transcript)
2. **Select a tool:**
   - 💰 Financial: Extracts income statement line items
   - 📞 Earnings: Analyzes management commentary
3. **See results** within 10-20 seconds
4. **Download Excel** (for financial extraction)

✅ **Done!** You're running the research portal locally.

---

## Deploy to Production (Free Tier)

### Prerequisites
- GitHub account
- Render account (free at https://render.com)
- OpenAI API key

### Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial research portal"
git remote add origin https://github.com/YOUR_USERNAME/research-portal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend (3 minutes)

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in:
   ```
   Name: research-portal-api
   Environment: Node
   Region: (any)
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && node dist/index.js
   ```
5. Click **Create Web Service**
6. Wait for "Live" status ⏳ (3-5 minutes)
7. Copy your service URL (e.g., `https://research-portal-api.onrender.com`)

### Step 3: Add API Key

1. In Render dashboard, go to your service
2. Click **Environment**
3. Add new variable:
   ```
   Key: OPENAI_API_KEY
   Value: sk_your_key_here
   ```
4. Service automatically restarts

### Step 4: Deploy Frontend (2 minutes)

1. Go back to Render dashboard
2. Click **New +** → **Static Site** (or **Web Service** for Node)
3. Connect same GitHub repository
4. Set:
   ```
   Name: research-portal-web
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
5. Click **Create Static Site**
6. Wait for deployment (1-2 minutes)

### Step 5: Test Deployment

1. Visit your frontend URL
2. Upload a test document
3. Select research tool
4. Verify results appear (allow 15-20 seconds for first request)

✅ **You're live!** Share the frontend URL with your team.

---

## Alternative: One-Click Deployment (Advanced)

### With Render Blueprint
```bash
# Environment variables needed:
OPENAI_API_KEY=sk_your_key
PORT=3001
NODE_ENV=production
```

File `render.yaml` is already configured in the repo.

---

## Understanding the Tools

### 💰 Financial Statement Extraction

**Input:** Annual report or financial statement PDF  
**Output:** Structured income statement line items

What it extracts:
- Revenue and operating expenses
- Operating income and net income
- Multiple years of data (if present)
- Currency and units (USD, millions, etc.)

**Example Output:**
| Item | Value | Currency | Period | Confidence |
|------|-------|----------|--------|-----------|
| Revenue | 150,000 | USD | 2023 | High |
| Operating Expenses | 35,000 | USD | 2023 | Medium |
| Net Income | 17,875 | USD | 2023 | High |

### 📞 Earnings Call Analysis

**Input:** Earnings call transcript or management commentary  
**Output:** Structured analysis of management sentiment and guidance

What it extracts:
- **Tone:** Optimistic/Cautious/Neutral/Pessimistic
- **Positives:** 3-5 key achievements or favorable outlooks
- **Concerns:** 3-5 key challenges or risks
- **Guidance:** Revenue, margin, capex outlook
- **Initiatives:** 2-3 new growth plans

**Example Output:**
- Tone: Optimistic (High confidence)
- Positives: Strong revenue growth, Market expansion, Record profitability
- Concerns: Supply chain delays, Rising costs, Regulatory challenges
- Guidance: 15-20% revenue growth expected in 2024
- Initiatives: New AI features, European expansion, Partnership announced

---

## Common Issues & Solutions

### "API Key not found" Error
```
→ Add OPENAI_API_KEY to Render environment variables
→ Wait 1-2 minutes for service restart
```

### Download button not working
```
→ Ensure backend is fully deployed
→ Check browser console for errors
→ Verify OpenAI API key is valid
```

### Slow first request (30+ seconds)
```
→ Normal on cold start (first request after 15 minutes)
→ Subsequent requests are faster (10-20 seconds)
```

### PDF extraction fails
```
→ Verify PDF has selectable text (not scanned image)
→ Try a different PDF
→ Check file size (<50MB limit)
```

### 502 Bad Gateway
```
→ Check Render service logs
→ Verify service has "Live" status
→ Check OPENAI_API_KEY is set correctly
```

---

## Project Structure Overview

```
research-portal/
├── backend/          Node.js + Express API
│   ├── src/
│   │   ├── index.ts          Server setup
│   │   ├── tools/            Research tools
│   │   └── utils/            PDF & LLM utilities
│   └── package.json          Dependencies
│
├── frontend/         React + Vite UI
│   ├── src/
│   │   ├── components/       React components
│   │   ├── App.tsx           Main app
│   │   └── main.tsx          Entry point
│   └── package.json          Dependencies
│
├── Documentation/
│   ├── README.md             Full documentation
│   ├── QUICKSTART.md         Local setup
│   ├── DEPLOYMENT.md         Detailed deploy guide
│   └── TESTING_CHECKLIST.md  QA checklist
│
└── Deployment/
    ├── Dockerfile            Container config
    ├── render.yaml           Render blueprint
    └── build.sh              Build script
```

---

## Key Decision Points

### Should I use GPT-4 or GPT-3.5-turbo?

| Aspect | GPT-4 | GPT-3.5-turbo |
|--------|-------|--------------|
| Accuracy | Higher | Good |
| Speed | Slower | Faster |
| Cost | $0.03/1K | $0.0005/1K |
| Hallucination | Lower | Higher |

**Recommendation:** Start with GPT-4 (higher accuracy), switch to GPT-3.5 if budget is tight.

Change in `backend/src/utils/llmService.ts`:
```typescript
const MODEL = 'gpt-3.5-turbo'; // or 'gpt-4-turbo-preview'
```

### Should I use Render, Vercel, or other?

| Provider | Best For | Cost |
|----------|----------|------|
| Render | Both backend + frontend | Free tier available |
| Vercel | Frontend only | Free tier available |
| AWS/GCP | Enterprise | Pay as you go |

**Recommendation:** Render for testing (this guide), AWS/GCP for production.

---

## Next Steps

### After Local Testing
1. ✅ Test both tools with sample documents
2. ✅ Verify results are accurate
3. ✅ Share feedback on any issues

### After Deployment
1. 📤 Share public URL with team
2. 📊 Gather accuracy feedback
3. 🔧 Fine-tune based on results
4. 🚀 Consider upgrading to Standard/Pro Render plan

### Future Enhancements
- [ ] Batch document processing
- [ ] Document comparison
- [ ] User authentication
- [ ] Document history/storage
- [ ] Custom extraction templates
- [ ] Email notifications
- [ ] API access for third-party integration

---

## File Reference

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| QUICKSTART.md | Local development |
| DEPLOYMENT.md | Detailed deploy guide |
| TESTING_CHECKLIST.md | QA checklist |
| IMPLEMENTATION_SUMMARY.md | Technical overview |
| verify-deployment.js | Deployment checker |

---

## Support Resources

**Documentation:**
- README.md - Full feature guide
- DEPLOYMENT.md - Render setup
- QUICKSTART.md - Local development
- TESTING_CHECKLIST.md - Verification

**External Links:**
- OpenAI Docs: https://platform.openai.com/docs/
- Render Docs: https://render.com/docs
- Express.js: https://expressjs.com/
- React: https://react.dev/

**Troubleshooting:**
1. Check release notes in README.md
2. Review known limitations in DEPLOYMENT.md
3. Test locally with verify-deployment.js
4. Check logs in Render dashboard

---

## Deployment Checklist

Before going live, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads and displays correctly
- [ ] OPENAI_API_KEY is set in Render
- [ ] Sample PDF uploads successfully
- [ ] Financial extraction works
- [ ] Earnings analysis works  
- [ ] Download Excel button works
- [ ] Error messages are clear
- [ ] No sensitive data in browser console
- [ ] Response time is acceptable (<30 seconds)

---

## Success Criteria

You're done when:
- ✅ Can upload documents
- ✅ Can select research tools
- ✅ Get analyzer results back
- ✅ Results are useful and accurate
- ✅ Can deploy to public URL
- ✅ Team can access and use it

---

**You're all set!** 🎉

Start with local testing (5 minutes), then deploy to Render (10 minutes), and you'll have a production-ready research portal.

Have questions? Check the documentation files or review the source code - it's extensively commented.

Happy researching! 📊
