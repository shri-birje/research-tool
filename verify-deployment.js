#!/usr/bin/env node

/**
 * Research Portal - Deployment Verification
 * Run this script to verify the project is ready for deployment
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const CHECK = '✓';
const CROSS = '✗';

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function check(message, condition) {
  if (condition) {
    console.log(`${GREEN}${CHECK}${RESET} ${message}`);
    passCount++;
  } else {
    console.log(`${RED}${CROSS}${RESET} ${message}`);
    failCount++;
  }
}

function warn(message) {
  console.log(`${YELLOW}!${RESET} ${message}`);
  warnCount++;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, text) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.includes(text);
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   Research Portal - Pre-Deployment Verification           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Check directory structure
console.log('${YELLOW}Checking Directory Structure...${RESET}');
check('backend/ directory exists', fileExists('backend'));
check('frontend/ directory exists', fileExists('frontend'));
check('backend/src/ directory exists', fileExists('backend/src'));
check('frontend/src/ directory exists', fileExists('frontend/src'));
console.log();

// Check configuration files
console.log('${YELLOW}Checking Configuration Files...${RESET}');
check('Root package.json exists', fileExists('package.json'));
check('backend/package.json exists', fileExists('backend/package.json'));
check('frontend/package.json exists', fileExists('frontend/package.json'));
check('backend/tsconfig.json exists', fileExists('backend/tsconfig.json'));
check('frontend/tsconfig.json exists', fileExists('frontend/tsconfig.json'));
check('.env.example exists', fileExists('backend/.env.example'));
check('.gitignore exists', fileExists('.gitignore'));
console.log();

// Check source files
console.log('${YELLOW}Checking Source Files...${RESET}');
check('backend/src/index.ts exists', fileExists('backend/src/index.ts'));
check('backend/src/utils/pdfProcessor.ts exists', fileExists('backend/src/utils/pdfProcessor.ts'));
check('backend/src/utils/llmService.ts exists', fileExists('backend/src/utils/llmService.ts'));
check('backend/src/tools/financialExtractor.ts exists', fileExists('backend/src/tools/financialExtractor.ts'));
check('backend/src/tools/earningsAnalyzer.ts exists', fileExists('backend/src/tools/earningsAnalyzer.ts'));
check('frontend/src/App.tsx exists', fileExists('frontend/src/App.tsx'));
check('frontend/src/main.tsx exists', fileExists('frontend/src/main.tsx'));
check('frontend/src/components/DocumentUpload.tsx exists', fileExists('frontend/src/components/DocumentUpload.tsx'));
check('frontend/src/components/ResultsDisplay.tsx exists', fileExists('frontend/src/components/ResultsDisplay.tsx'));
check('frontend/index.html exists', fileExists('frontend/index.html'));
console.log();

// Check dependencies
console.log('${YELLOW}Checking Dependencies...${RESET}');
check('backend/package.json has express', fileContains('backend/package.json', 'express'));
check('backend/package.json has cors', fileContains('backend/package.json', 'cors'));
check('backend/package.json has multer', fileContains('backend/package.json', 'multer'));
check('backend/package.json has openai', fileContains('backend/package.json', 'openai'));
check('frontend/package.json has react', fileContains('frontend/package.json', 'react'));
check('frontend/package.json has vite', fileContains('frontend/package.json', 'vite'));
console.log();

// Check deployment files
console.log('${YELLOW}Checking Deployment Files...${RESET}');
check('Dockerfile exists', fileExists('Dockerfile'));
check('render.yaml exists', fileExists('render.yaml'));
check('build.sh exists', fileExists('build.sh'));
check('start.sh exists', fileExists('start.sh'));
console.log();

// Check documentation
console.log('${YELLOW}Checking Documentation...${RESET}');
check('README.md exists', fileExists('README.md'));
check('QUICKSTART.md exists', fileExists('QUICKSTART.md'));
check('DEPLOYMENT.md exists', fileExists('DEPLOYMENT.md'));
check('TESTING_CHECKLIST.md exists', fileExists('TESTING_CHECKLIST.md'));
check('IMPLEMENTATION_SUMMARY.md exists', fileExists('IMPLEMENTATION_SUMMARY.md'));
check('README.md has setup instructions', fileContains('README.md', 'npm install'));
console.log();

// Check implementation details
console.log('${YELLOW}Checking Implementation Quality...${RESET}');
check('Financial extractor is implemented', fileContains('backend/src/tools/financialExtractor.ts', 'export async function extractFinancialStatements'));
check('Earnings analyzer is implemented', fileContains('backend/src/tools/earningsAnalyzer.ts', 'export async function analyzeEarningsCall'));
check('PDF processor is implemented', fileContains('backend/src/utils/pdfProcessor.ts', 'export async function extractTextFromPDF'));
check('API has /api/process endpoint', fileContains('backend/src/index.ts', 'app.post'));
check('Frontend has upload component', fileContains('frontend/src/components/DocumentUpload.tsx', 'DocumentUpload'));
check('Frontend has results component', fileContains('frontend/src/components/ResultsDisplay.tsx', 'ResultsDisplay'));
console.log();

// Environment setup
console.log('${YELLOW}Checking Environment Setup...${RESET}');
check('.env.example documented', fileContains('backend/.env.example', 'OPENAI_API_KEY'));
warn('.env file not found (create from .env.example before running)');
console.log();

// Summary
console.log('╔════════════════════════════════════════════════════════════╗');
console.log(`${GREEN}Passed: ${passCount}${RESET} | ${RED}Failed: ${failCount}${RESET} | ${YELLOW}Warnings: ${warnCount}${RESET}`);
console.log('╚════════════════════════════════════════════════════════════╝\n');

if (failCount === 0) {
  console.log(`${GREEN}✓ All checks passed! Ready for deployment.${RESET}\n`);
  console.log('Next steps:');
  console.log('1. Create backend/.env with OPENAI_API_KEY');
  console.log('2. Test locally: cd backend && npm run dev');
  console.log('3. Push to GitHub');
  console.log('4. Deploy to Render (see DEPLOYMENT.md)\n');
  process.exit(0);
} else {
  console.log(`${RED}✗ ${failCount} issues found. Please fix before deployment.${RESET}\n`);
  process.exit(1);
}
