# Quick Start Guide

## Local Development Setup (5 minutes)

### 1. Prerequisites
- Node.js 16+ installed
- OpenAI API key (get at https://platform.openai.com/api-keys)

### 2. Clone and Setup

```bash
# Navigate to project directory
cd "d:/research tool"

# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Configure Environment

```bash
# Create backend environment file
cd backend
cp .env.example .env

# Edit .env and add your OpenAI API key
# On Windows:
notepad .env

# Or manually add:
# OPENAI_API_KEY=sk_your_actual_key_here
# PORT=3001
# NODE_ENV=development
```

### 4. Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# Should show: Research Portal API running on port 3001
```

**Terminal 2 - Frontend UI:**
```bash
cd frontend
npm run dev
# Should show: VITE v5.0.0 running at http://localhost:3000
```

### 5. Open in Browser

Navigate to: **http://localhost:3000**

You should see the Research Portal homepage with upload options.

## Testing the Tools

### Option A: Test Financial Statement Extraction

1. **Obtain a test PDF:**
   - Download a sample annual report or financial statement
   - Or create a simple test document with financial data

2. **Upload and Process:**
   - Select "💰 Financial Statement Extraction"
   - Upload your PDF
   - Click "Analyze Document"
   - Wait 10-20 seconds for processing

3. **Review Results:**
   - Check the extracted line items
   - Verify currency and unit detection
   - Note any warnings about low-confidence items
   - Download as Excel for further analysis

4. **Success Indicators:**
   - ✅ Line items appear in table
   - ✅ Values are numeric and reasonable
   - ✅ Currency is correctly identified
   - ✅ Download button works

### Option B: Test Earnings Call Analysis

1. **Obtain a test transcript:**
   - Find an earnings call transcript (many available on investor relations websites)
   - Or use sample text with management commentary

2. **Upload and Process:**
   - Select "📞 Earnings Call Analysis"
   - Upload your PDF/transcript
   - Click "Analyze Document"
   - Wait 10-20 seconds for processing

3. **Review Results:**
   - Check management tone assessment
   - Verify key positives and concerns identified
   - Review forward guidance extraction
   - Note data quality indicators

4. **Success Indicators:**
   - ✅ Tone badge shows (Optimistic/Cautious/Neutral/Pessimistic)
   - ✅ 3-5 key positives listed
   - ✅ 3-5 key concerns listed
   - ✅ Forward guidance sections populated
   - ✅ Growth initiatives identified

## Sample Test Documents

### Financial Statement Example Structure

Create a simple test PDF with:

```
ABC Corporation
Annual Report 2023

CONSOLIDATED STATEMENTS OF INCOME
Year ended December 31, 2023 ($000s)

Revenue                        $150,000
Cost of Revenue                 (90,000)
Gross Profit                     60,000

Operating Expenses:
  Sales & Marketing             (15,000)
  General & Administrative      (12,000)
  Research & Development         (8,000)
Total Operating Expenses       (35,000)

Operating Income               25,000
Interest Expense                (2,000)
Other Income                       500
Income Tax Expense              (5,625)

Net Income                      $17,875

Earnings Per Share                $2.38
```

### Earnings Call Example Structure

```
ABC Corporation Earnings Call Transcript
Q4 2023 - January 30, 2024

OPENING REMARKS

Good morning everyone. Thank you for joining us. We're pleased to report 
strong Q4 results with revenue of $150 million, up 25% year-over-year.

POSITIVE DEVELOPMENTS
- Operating margins expanded by 200 basis points
- International markets grew 40% driven by Asian expansion
- New product line exceeded expectations with 15% market share

CHALLENGES DISCUSSED
- Supply chain pressures remain, expected to ease in Q2
- Customer acquisition costs rose due to competitive market
- Regulatory headwinds in Europe delaying some initiatives

FORWARD GUIDANCE
We expect 15-20% revenue growth in 2024, with margin expansion of 150-200 bps.
Capital expenditure will be 4-5% of revenue, focused on capacity expansion.

GROWTH INITIATIVES
1. AI-powered product features launching Q2
2. European market expansion with 3 new country entries
3. Strategic partnership with major distributor announced today
```

## Troubleshooting

### Backend won't start
```
Error: EADDRINUSE: address already in use :::3001
```
**Solution:** Kill process on port 3001
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

### OpenAI API errors
```
Error: 401 Unauthorized
```
**Solution:** 
- Verify API key is correct in `.env`
- Check key has access to GPT-4
- Ensure account has credits available

### CORS errors
**Solution:**
- Backend CORS is already configured for `*`
- If deploying separately, update CORS in `backend/src/index.ts`
- Ensure frontend and backend have matching domains

### PDF extraction fails
- Verify PDF is not corrupted
- Try a different PDF
- Check file size (max 50MB)
- Ensure PDF contains readable text (not scanned images)

## Next Steps

1. ✅ Test both tools with sample documents
2. 📊 Collect accuracy feedback
3. 🚀 Deploy to Render (see DEPLOYMENT.md)
4. 📝 Share public link with team
5. 🔄 Iterate based on feedback

## Support Resources

- **OpenAI Docs:** https://platform.openai.com/docs/
- **Express.js Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Render Docs:** https://render.com/docs

## Performance Expectations

| Task | Local Dev | Render Free |
|------|-----------|------------|
| API Start | <1s | 3-5s |
| PDF Upload | <1s | 1-2s |
| Processing | 5-15s | 10-20s |
| Download Excel | <1s | 1-2s |

**Note:** Processing time depends on PDF size and OpenAI API latency.
