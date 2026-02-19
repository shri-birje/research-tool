import dotenv from 'dotenv';
dotenv.config();
console.log("API KEY LOADED:", !!process.env.OPENAI_API_KEY);
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { extractFinancialStatements } from './tools/financialExtractor';
import { analyzeEarningsCall } from './tools/earningsAnalyzer';
import { extractTextFromPDF } from './utils/pdfProcessor';


const app = express();
const PORT = process.env.PORT || 3001;

// Storage configuration for uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Upload and process document
app.post('/api/process', upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    const { toolType } = req.body;
    if (!toolType || !['financial', 'earnings'].includes(toolType)) {
      return res.status(400).json({ error: 'Invalid tool type. Must be "financial" or "earnings"' });
    }

    console.log(`Processing ${req.file.originalname} with tool: ${toolType}`);

    // Extract text from PDF
    let text: string;
    try {
      text = await extractTextFromPDF(req.file.buffer);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to extract text from PDF. Ensure the file is a valid PDF.' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'PDF appears to be empty or unreadable' });
    }

    // Process based on tool type
    let result;
    if (toolType === 'financial') {
      result = await extractFinancialStatements(text);
    } else if (toolType === 'earnings') {
      result = await analyzeEarningsCall(text);
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      toolType,
      result
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Download financial extraction as Excel
app.post('/api/download-financial', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    
    // Import Excel library
    const XLSX = require('xlsx');
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create sheet from extracted data
    const ws = XLSX.utils.json_to_sheet(data.lineItems || []);
    XLSX.utils.book_append_sheet(wb, ws, 'Financial Data');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="financial-data.xlsx"');
    res.send(buffer);
    
  } catch (error) {
    console.error('Excel generation error:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Research Portal API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
