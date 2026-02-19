import { extractWithLLM } from '../utils/llmService';

export interface FinancialLineItem {
  category: string;
  lineItem: string;
  value: number | null;
  currency: string;
  unit: string;
  period?: string;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface FinancialExtractionResult {
  documentSummary: string;
  yearsFound: string[];
  lineItems: FinancialLineItem[];
  extractionNotes: string;
  warnings: string[];
}

const FINANCIAL_SCHEMA = {
  type: 'object',
  properties: {
    revenue: { type: 'number', description: 'Total revenue' },
    costOfRevenue: { type: 'number' },
    operatingExpenses: { type: 'number' },
    operatingIncome: { type: 'number' },
    netIncome: { type: 'number' },
    currency: { type: 'string', example: 'USD' },
    unit: { type: 'string', example: 'millions' },
    period: { type: 'string', example: '2023' },
    additionalItems: { type: 'object' }
  }
};

export async function extractFinancialStatements(documentText: string): Promise<FinancialExtractionResult> {
  const warnings: string[] = [];
  const lineItems: FinancialLineItem[] = [];

  // Step 1: Extract key financial figures using LLM
  const extractionPrompt = `
You are a financial statement analyst. Extract income statement line items from this financial document.

For each line item found:
1. Name the category (e.g., "Income Statement", "Balance Sheet", "Cash Flow")
2. Extract the line item (e.g., "Revenue", "Cost of Goods Sold")
3. Extract the numeric value (remove commas and symbols)
4. Note the currency (USD, EUR, etc.)
5. Note the unit (millions, billions, units)
6. Note the period/year if multiple years

Return a JSON array of objects with this structure:
[
  {
    "category": "Income Statement",
    "lineItem": "Revenue",
    "value": 150000,
    "currency": "USD",
    "unit": "millions",
    "period": "2023",
    "confidence": "high",
    "notes": "From page 12"
  }
]

If a figure is mentioned but unclear, set value to null and mark confidence as "low".
Include ALL income statement items you can identify.
  `;

  try {
    const extractionResult = await extractWithLLM(
      documentText,
      extractionPrompt,
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            lineItem: { type: 'string' },
            value: { type: ['number', 'null'] },
            currency: { type: 'string' },
            unit: { type: 'string' },
            period: { type: 'string' },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
            notes: { type: 'string' }
          }
        }
      }
    );

    // Parse the extracted data
    if (Array.isArray(extractionResult)) {
      lineItems.push(...extractionResult);
    } else if (extractionResult.content) {
      try {
        const parsed = JSON.parse(extractionResult.content);
        if (Array.isArray(parsed)) {
          lineItems.push(...parsed);
        }
      } catch (e) {
        warnings.push('Could not parse extracted financial items as JSON');
      }
    }

    // Extract years mentioned
    const yearPattern = /20\d{2}/g;
    const yearsFound = Array.from(new Set(documentText.match(yearPattern) || []));

    // Data quality checks
    if (lineItems.length === 0) {
      warnings.push('No financial line items could be extracted. Document may not be a financial statement.');
    }

    const lowConfidenceItems = lineItems.filter(item => item.confidence === 'low');
    if (lowConfidenceItems.length > 0) {
      warnings.push(`${lowConfidenceItems.length} items extracted with low confidence - please verify manually`);
    }

    const nullItems = lineItems.filter(item => item.value === null);
    if (nullItems.length > 0) {
      warnings.push(`${nullItems.length} items have missing values - marked as "Not found" in the spreadsheet`);
    }

    return {
      documentSummary: `Extracted financial data from document. Found ${lineItems.length} line items across years: ${yearsFound.join(', ') || 'Not specified'}`,
      yearsFound,
      lineItems,
      extractionNotes: lineItems.length > 0 
        ? 'Successfully extracted line items. Please review low-confidence items and missing values.'
        : 'Extraction encountered issues. Please review warnings.',
      warnings
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    warnings.push(`LLM extraction failed: ${errorMsg}`);
    
    return {
      documentSummary: 'Financial extraction partially failed',
      yearsFound: [],
      lineItems: [],
      extractionNotes: 'Extraction could not complete. Check warnings for details.',
      warnings
    };
  }
}
