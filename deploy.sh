#!/bin/bash

# Render Deployment Helper
# This script guides you through deploying the Research Portal to Render

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Research Portal - Render Deployment Helper              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
if ! command -v git &> /dev/null; then
    echo "✗ Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js 16+."
    exit 1
fi

echo "✓ Git and Node.js found"
echo ""

# Step 1: Test local build
echo "Step 1: Testing local build..."
echo "Building backend..."
cd backend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Backend build failed. Check errors above."
    exit 1
fi
cd ..

echo "✓ Backend build successful"
echo ""

# Step 2: Guide user through Render setup
echo "Step 2: Prepare for Render deployment"
echo ""
echo "Follow these steps on render.com:"
echo ""
echo "1. Sign up at https://render.com"
echo "2. Click 'New +' > 'Web Service'"
echo "3. Connect your GitHub account and repository"
echo "4. Configure the backend service:"
echo "   - Name: research-portal-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install && cd backend && npm install && npm run build"
echo "   - Start Command: cd backend && node dist/index.js"
echo ""
echo "5. Add Environment Variable:"
echo "   - Key: OPENAI_API_KEY"
echo "   - Value: (paste your OpenAI API key)"
echo ""
echo "6. Click 'Create Web Service'"
echo "7. After deployment, note the service URL"
echo ""

# Step 3: Create deployment info
cat > DEPLOYMENT_INFO.txt << 'EOF'
=================================
RESEARCH PORTAL DEPLOYMENT INFO
=================================

Deployment Date: $(date)

Project Structure:
- backend/          (Node.js/Express API)
- frontend/         (React/Vite UI)
- README.md         (Main documentation)
- DEPLOYMENT.md     (Detailed deployment guide)
- QUICKSTART.md     (Local development setup)

Render Deployment Steps:
1. Push code to GitHub
2. Go to render.com and sign up
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables:
   - OPENAI_API_KEY: (your OpenAI API key)
   - NODE_ENV: production
   - PORT: 3001
6. Deploy backend service
7. Note the service URL (e.g., https://research-portal-api.onrender.com)
8. Deploy frontend separately if needed

Test the deployment:
1. Wait 3-5 minutes for initial deployment
2. Visit your Render service URL
3. Upload a test PDF
4. Select a research tool
5. Verify results appear

Expected Results:
- Financial Extraction: Excel-ready line items
- Earnings Analysis: Management tone, guidance, initiatives

Support:
- Check backend logs in Render dashboard
- Verify OPENAI_API_KEY is set correctly
- Ensure API key has sufficient credits
- Contact support if issues persist

EOF

echo "✓ Deployment info saved to DEPLOYMENT_INFO.txt"
echo ""

# Step 4: Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Ready for Deployment!                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial research portal commit'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and deploy:"
echo "   - Create Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set OPENAI_API_KEY environment variable"
echo "   - Deploy!"
echo ""
echo "3. Share the public URL with your team"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo ""
