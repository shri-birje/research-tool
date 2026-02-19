# Deployment & Testing Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No console.error() calls in production code
- [ ] Environment variables documented in .env.example
- [ ] No hardcoded API keys in code
- [ ] .gitignore includes .env and node_modules

### Backend Setup
- [ ] `backend/package.json` has all dependencies
- [ ] `backend/tsconfig.json` is properly configured
- [ ] `backend/src/index.ts` server starts on PORT 3001
- [ ] CORS is configured for frontend
- [ ] PDF parser works with sample documents
- [ ] LLM service handles API errors gracefully

### Frontend Setup
- [ ] `frontend/package.json` has all dependencies
- [ ] `frontend/vite.config.ts` proxies /api to backend
- [ ] All React components are in `src/components/`
- [ ] Upload component handles file validation
- [ ] Results display handles both tool types
- [ ] Styling is complete and responsive

### API Endpoints
- [ ] `POST /api/process` accepts file and toolType
- [ ] File upload uses multipart/form-data
- [ ] Financial extraction returns structured data
- [ ] Earnings analysis returns sentiment and guidance
- [ ] Error responses are descriptive
- [ ] `POST /api/download-financial` generates Excel

### Documentation
- [ ] README.md explains features and setup
- [ ] DEPLOYMENT.md has step-by-step instructions
- [ ] QUICKSTART.md covers local development
- [ ] Comments in code explain complex logic
- [ ] Error messages guide users to solutions

---

## Local Testing

### Environment Setup
- [ ] Node.js 16+ is installed
- [ ] OpenAI API key is obtained
- [ ] `.env` file created with API key
- [ ] Dependencies installed: `npm install-all`

### Backend Verification
- [ ] Backend starts: `cd backend && npm run dev`
- [ ] Server logs "running on port 3001"
- [ ] Health check works: `curl http://localhost:3001/health`
- [ ] API responds to requests

### Frontend Verification
- [ ] Frontend starts: `cd frontend && npm run dev`
- [ ] Vite dev server shows successful start
- [ ] Browser opens to `http://localhost:3000`
- [ ] Page loads without errors in console
- [ ] Upload interface is visible and functional

### Financial Extraction Test
- [ ] PDF upload works
- [ ] "Financial Statement Extraction" option is available
- [ ] Processing indicator appears during analysis
- [ ] Results display with line items table
- [ ] Table columns: Category, Line Item, Value, Currency, Unit, Period, Confidence
- [ ] Values are formatted as numbers
- [ ] Confidence badges show (high/medium/low)
- [ ] Download button generates Excel file
- [ ] Excel file opens in spreadsheet app
- [ ] Excel contains extracted data

### Earnings Call Analysis Test
- [ ] PDF upload works
- [ ] "Earnings Call Analysis" option is available
- [ ] Processing completes successfully
- [ ] Results show management tone badge
- [ ] Tone colors are correct (optimistic=green, cautious=orange, etc.)
- [ ] Key positives list appears (3-5 items)
- [ ] Key concerns list appears (3-5 items)
- [ ] Forward guidance section displays
- [ ] Growth initiatives are listed
- [ ] Data quality notes appear when relevant

### Edge Cases
- [ ] Empty PDF is rejected with error message
- [ ] Non-PDF file is rejected
- [ ] File >50MB is rejected with message
- [ ] Network failure shows error toast
- [ ] API key missing shows helpful error
- [ ] Processing timeout shows user-friendly message

---

## Render Deployment

### Pre-Deployment
- [ ] Repository is pushed to GitHub
- [ ] .env is in .gitignore
- [ ] build.sh and start.sh are executable
- [ ] render.yaml is correct for your setup

### Deployment Steps
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created for backend
- [ ] Build command set: `cd backend && npm install && npm run build`
- [ ] Start command set: `cd backend && node dist/index.js`
- [ ] OPENAI_API_KEY environment variable added
- [ ] Deployment initiated
- [ ] Deployment completes without errors

### Post-Deployment Verification
- [ ] Service shows "Live" status on Render dashboard
- [ ] Service URL is public and accessible
- [ ] Health check endpoint responds: `https://<service>.onrender.com/health`
- [ ] No errors in Render logs
- [ ] API accepts document uploads
- [ ] Financial extraction works end-to-end
- [ ] Earnings analysis works end-to-end
- [ ] Results are displayed correctly
- [ ] Warnings and errors are clear

### Performance Validation
- [ ] Initial request completes in <30 seconds
- [ ] Subsequent requests complete in <20 seconds
- [ ] PDF uploads handle 10-50MB files
- [ ] Excel download completes successfully
- [ ] No memory errors in logs
- [ ] API rate limits not exceeded

---

## Data Quality Testing

### Financial Extraction Accuracy
- [ ] Revenue figure extracted correctly
- [ ] COGS/Cost of Revenue identified
- [ ] Operating expenses listed
- [ ] Operating income calculated or found
- [ ] Net income extracted
- [ ] Multiple years detected when present
- [ ] Currency identified (USD, EUR, etc.)
- [ ] Units recognized (millions, thousands)
- [ ] Missing values marked as "Not found"
- [ ] Low-confidence items flagged
- [ ] Warnings appear for non-standard formats

### Earnings Call Analysis Quality
- [ ] Tone assessment is reasonable (matches content)
- [ ] Confidence level matches certainty of analysis
- [ ] Key positives are direct quotes or paraphrases
- [ ] Key concerns are explicitly mentioned
- [ ] Forward guidance reflects actual statements
- [ ] No hallucinated information
- [ ] Growth initiatives are clearly from text
- [ ] Data quality notes are appropriate
- [ ] No false confidence in analysis

### Error Handling
- [ ] Corrupted PDF shows readable error
- [ ] Missing data sections show warnings
- [ ] API failures show descriptive messages
- [ ] Partial results display gracefully
- [ ] User can retry without reloading page
- [ ] Error state is recoverable

---

## Security & Compliance

### Data Privacy
- [ ] OPENAI_API_KEY not logged or exposed
- [ ] PDFs not stored permanently
- [ ] User data cleared after analysis
- [ ] No sensitive data in browser console
- [ ] CORS properly configured

### API Security
- [ ] File upload validates filetype
- [ ] File size limits enforced
- [ ] Input sanitization in place
- [ ] Error messages don't leak system info
- [ ] API key validation on each request

---

## Final Sign-Off

### Functionality
- [ ] All required features implemented
- [ ] Both research tools fully functional
- [ ] Document upload working
- [ ] Results are analyst-ready
- [ ] Excel export functional

### Deployment
- [ ] Public URL working
- [ ] Service handles 1-2 concurrent users
- [ ] No memory leaks during extended use
- [ ] Restart-safe (no data loss)
- [ ] Environment properly configured

### Documentation
- [ ] All docs are accurate
- [ ] README is complete
- [ ] Quickstart is easy to follow
- [ ] Deployment guide covers all steps
- [ ] Error messages are helpful

### Ready for Testing
- [ ] Team can access deployed URL
- [ ] Sample documents provided
- [ ] Expected results documented
- [ ] Feedback mechanism in place
- [ ] Issues can be reported

---

## Deployment Success Criteria ✅

**Green Light to Share:**
- [ ] API running and responding
- [ ] Frontend accessible via public URL  
- [ ] Document upload functional
- [ ] Financial extraction works with test data
- [ ] Earnings analysis works with test data
- [ ] Results are clear and useful
- [ ] Download Excel works
- [ ] Error messages are helpful
- [ ] No console errors or warnings
- [ ] Performance is acceptable (<20 seconds)

**Ready for Production:**
- [ ] All above criteria met
- [ ] 10+ successful test runs
- [ ] User feedback positive
- [ ] No critical bugs reported
- [ ] Documentation reviewed
- [ ] Team trained on usage
- [ ] Monitoring/alerts configured

---

## Rollback Plan

If deployment fails:
1. [ ] Check Render error logs
2. [ ] Verify OPENAI_API_KEY is set
3. [ ] Test backend locally first
4. [ ] Check file permissions
5. [ ] Verify package.json has all deps
6. [ ] Try manual build: `npm install && npm run build`
7. [ ] Check Node version compatibility
8. [ ] Contact Render support if needed

---

**Last Tested:** [Date]
**Tested By:** [Name]
**Status:** Ready for deployment
