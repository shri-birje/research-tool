# Research Portal

An AI-powered research portal for financial document analysis. Upload financial statements or earnings call transcripts to extract analyst-ready insights.

## Features

### 💰 Financial Statement Extraction
- Extracts income statement line items from PDF documents
- Handles multiple years of data
- Exports results to Excel for further analysis
- Confidence levels for extracted values
- Clear identification of missing data

**Handles:**
- Revenue, COGS, operating expenses, operating income, net income
- Multiple currency and unit identification
- Missing values with explicit "Not found" indicators
- Different naming conventions (e.g., "Operating Costs" vs "Operating Expenses")

### 📞 Earnings Call Analysis
- Analyzes management tone and sentiment (optimistic, cautious, neutral, pessimistic)
- Extracts 3-5 key positives mentioned by management
- Extracts 3-5 key concerns/challenges
- Identifies forward guidance (revenue, margin, capex outlook)
- Detects capacity utilization information
- Lists 2-3 new growth initiatives

**Quality Assurance:**
- Data quality flags for incomplete transcripts
- Warnings for vague guidance
- Built-in hallucination prevention with explicit text reference requirements

## Architecture

```
research-portal/
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── index.ts      # Main server
│   │   ├── tools/        # Research tools
│   │   │   ├── financialExtractor.ts
│   │   │   └── earningsAnalyzer.ts
│   │   └── utils/        # Utilities
│   │       ├── pdfProcessor.ts
│   │       └── llmService.ts
│   └── package.json
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js 16+
- OpenAI API key (for LLM processing)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Deployment

### Deploy to Render (Free Tier)

1. **Fork this repository** to your GitHub account

2. **Deploy Backend:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set up:
     - **Name:** `research-portal-api`
     - **Environment:** `Node`
     - **Build Command:** `cd backend && npm install && npm run build`
     - **Start Command:** `cd backend && npm start`
     - **Environment Variables:** Add `OPENAI_API_KEY`
   
3. **Deploy Frontend:**
   - Create another Web Service for frontend
   - Set up:
     - **Name:** `research-portal-web`
     - **Environment:** `Node`
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Start Command:** `npm start` (or use static site with `dist` output)
     - **Environment Variables:** Add `VITE_API_URL=<your-backend-url>`

### Alternative: Deploy to Vercel

```bash
# Frontend only (Vercel works great for React)
cd frontend
npm install -g vercel
vercel
```

For the backend, use Render or another Node.js hosting service.

## API Endpoints

### POST `/api/process`
Process a document with a selected research tool.

**Request:**
```
multipart/form-data:
  - document: PDF file
  - toolType: "financial" | "earnings"
```

**Response:**
```json
{
  "success": true,
  "filename": "document.pdf",
  "toolType": "financial",
  "result": {
    "documentSummary": "...",
    "yearsFound": ["2023", "2022"],
    "lineItems": [...],
    "warnings": [...]
  }
}
```

### POST `/api/download-financial`
Generate Excel file from financial extraction results.

**Request:**
```json
{
  "data": {
    "lineItems": [...]
  }
}
```

**Response:** Excel file (XLSX)

## Data Quality & Limitations

### Financial Extraction
- ✅ Handles multiple years of data
- ✅ Currency and unit detection
- ✅ Missing value indication
- ⚠️ Requires reasonably clear financial statements
- ⚠️ May struggle with heavily formatted tables
- ⚠️ Low confidence items should be manually verified

### Earnings Call Analysis
- ✅ Tone analysis based on specific language markers
- ✅ Explicit text reference (no hallucination)
- ✅ Quality flags for incomplete transcripts
- ⚠️ Requires present tense or explicit guidance language
- ⚠️ May miss implied guidance
- ⚠️ Confidence levels indicate how certain the analysis is

## Known Limitations & Free Tier Notes

1. **File Size:** 50MB limit on uploads (Render free tier)
2. **Processing Time:** Initial requests may take 10-15 seconds (cold start)
3. **API Rate Limits:** Render free tier has memory limits (512MB)
4. **Concurrent Users:** 1-2 simultaneous uploads recommended on free tier
5. **LLM API Calls:** Uses OpenAI API (paid) - budget accordingly for production
6. **Uptime:** Free tier may have brief downtimes for maintenance

### Cost Implications
- **Free tier (recommended for testing):** $0 hosting + $3-5/month on OpenAI API (for testing)
- **Production-ready:** ~$20-50/month depending on volume

## Error Handling

The system includes comprehensive error handling:
- Invalid PDF detection
- Empty document detection  
- LLM API failures with fallback
- JSON parsing failures with partial result returns
- File size validation

Errors are clearly reported with actionable messages for users.

## Future Enhancements

- [ ] Support for additional document types (Word, Excel, HTML)
- [ ] Batch processing for multiple documents
- [ ] Custom extraction templates
- [ ] Data comparison across documents
- [ ] User accounts and document history
- [ ] Advanced financial calculations and ratios
- [ ] Real-time collaboration features

## License

MIT

## Support

For issues or questions, please refer to the documentation or contact support.
