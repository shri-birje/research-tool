# Deployment Guide for Research Portal

## Render Deployment (Recommended for Testing)

### Step 1: Prepare Your Repository

1. Push the code to GitHub
2. Ensure `.env` is in `.gitignore`
3. Create `.env.example` with placeholder values

### Step 2: Deploy Backend API

1. Go to [render.com](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

```
Name: research-portal-api
Environment: Node
Region: Any
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && node dist/index.js
Plan: Free (512MB memory, 0.5 CPU)
```

5. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: production
   - `PORT`: 3001

6. Click **Create Web Service**
7. Wait for deployment (~5 minutes)
8. Note the service URL (e.g., `https://research-portal-api.onrender.com`)

### Step 3: Deploy Frontend

1. Click **New +** → **Web Service** again
2. Connect the same repository
3. Configure:

```
Name: research-portal-web
Environment: Node
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free
```

4. Add Environment Variable:
   - `VITE_API_URL`: https://research-portal-api.onrender.com

5. Click **Create Web Service**

### Step 4: Update Frontend API Configuration

In `frontend/src/App.tsx`, the API URL is automatically detected:

```typescript
const apiUrl = process.env.NODE_ENV === 'production' 
  ? `${window.location.origin}/api/process`  // Uses same domain with /api proxy
  : 'http://localhost:3001/api/process';
```

For CORS in production with separate domains, update this in backend `index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

## Vercel Deployment (Frontend Only)

Vercel is excellent for React apps but doesn't support Node.js backends on free tier.

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Environment: `VITE_API_URL`=`https://your-render-backend-url`

### Backend on Render (as above)

## Environment Variables Reference

### Backend (.env)

```
# OpenAI API Configuration
OPENAI_API_KEY=sk_test_xxxxx

# Server Configuration
PORT=3001
NODE_ENV=production

# Optional: Frontend URL for CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (vite.config.ts)

```typescript
export const API_BASE = {
  production: 'https://your-backend.onrender.com/api',
  development: 'http://localhost:3001/api'
}
```

## Testing the Deployment

1. Visit your frontend URL
2. Upload a test PDF document
3. Select a research tool (Financial or Earnings)
4. Click "Analyze Document"
5. Verify results appear within 10-20 seconds

## Troubleshooting

### 502 Bad Gateway

- Check that backend service has started
- Verify OPENAI_API_KEY is set
- Check Render logs for startup errors

### Document Upload Fails

- Verify file is a valid PDF
- Check file size (max 50MB)
- Ensure backend API is accessible

### LLM API Errors

- Verify OPENAI_API_KEY is correct
- Check API key has sufficient credits
- Verify API key permissions allow GPT-4 access

### CORS Errors

- Ensure backend allows requests from frontend origin
- Update `cors()` middleware in backend/src/index.ts
- Add `FRONTEND_URL` environment variable

## Performance Notes

### Free Tier Limitations

- **Cold Start:** First request after 15 minutes may take 30-60 seconds
- **Memory:** Limited to 512MB (sufficient for most documents)
- **Concurrent Users:** ~2-3 simultaneous requests recommended
- **Monthly Uptime:** Some downtime for maintenance (within free tier SLA)

### Cost Optimization

- OpenAI API: Test with GPT-3.5-turbo first, upgrade to GPT-4 if needed
- Batch multiple documents to reduce API calls
- Implement client-side validation to fail fast

## Production Deployment

For production use:

1. **Upgrade Render Plan:** Standard plan ($12/month) for better performance
2. **Setup Custom Domain:** Point your domain to Render
3. **Enable Auto-Deploy:** GitHub integration for continuous deployment
4. **Monitor Usage:** Set up alerts for API quota usage
5. **Database:** Consider adding PostgreSQL for document history
6. **Cache:** Implement Redis for frequently accessed results

### Architecture for Scale

```
┌─────────────────┐
│   Frontend      │ (Vercel)
│   (React)       │
└────────┬────────┘
         │
    ┌────▼──────┐
    │  Backend   │ (Render)
    │  (Node.js) │
    └────┬──────┘
         │
    ┌────▼──────────┐
    │ OpenAI GPT-4  │
    │ (API)         │
    └───────────────┘
```

## Next Steps

1. Test with sample financial documents
2. Gather user feedback on extraction accuracy
3. Fine-tune LLM prompts based on document types
4. Add document history and comparison features
5. Implement user authentication
6. Add support for additional document types
