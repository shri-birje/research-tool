import { extractWithLLM } from '../utils/llmService';

export interface EarningsAnalysisResult {
  managementTone: 'optimistic' | 'cautious' | 'neutral' | 'pessimistic';
  confidenceLevel: 'high' | 'medium' | 'low';
  keyPositives: string[];
  keyConcerns: string[];
  forwardGuidance: {
    revenue?: string;
    margin?: string;
    capex?: string;
    other?: string[];
  };
  capacityUtilization?: string;
  growthInitiatives: string[];
  analyzedLength: number;
  dataQuality: string[];
  warnings: string[];
}

export async function analyzeEarningsCall(documentText: string): Promise<EarningsAnalysisResult> {
  const warnings: string[] = [];
  const dataQuality: string[] = [];

  // Check document length and content
  if (documentText.length < 500) {
    warnings.push('Document is quite short - analysis may be incomplete');
  }

  const hasNumbers = /[\d,]+/.test(documentText);
  if (!hasNumbers) {
    warnings.push('No numerical data found - document may not be an earnings call or financial document');
  }

  // Step 1: Analyze tone and sentiment
  const tonePrompt = `
You are analyzing an earnings call transcript or management commentary.

Based on the provided text, assess:
1. Management tone: Is management optimistic, cautious, neutral, or pessimistic about the business?
2. Confidence level: How confident do you feel in this assessment (high, medium, low)?

Consider language like:
- Optimistic: "strong growth", "exceeded expectations", "confident", "record"
- Cautious: "challenges", "headwinds", "uncertainty", "monitoring"
- Pessimistic: "decline", "deteriorating", "difficult", "declining margins"

Return only a JSON object like:
{
  "tone": "optimistic",
  "confidence": "high",
  "reasoning": "Brief explanation based on specific phrases"
}
  `;

  let tone: 'optimistic' | 'cautious' | 'neutral' | 'pessimistic' = 'neutral';
  let toneConfidence: 'high' | 'medium' | 'low' = 'low';

  try {
    const toneResult = await extractWithLLM(documentText, tonePrompt);
    try {
      const jsonMatch = toneResult.content?.match(/\{[\s\S]*\}/) || toneResult.match?.(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        tone = parsed.tone || tone;
        toneConfidence = parsed.confidence || toneConfidence;
      }
    } catch (e) {
      dataQuality.push('Tone analysis returned unparseable format');
    }
  } catch (error) {
    warnings.push(`Tone analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Step 2: Extract key positives, concerns, guidance, and initiatives
  const extractionPrompt = `
You are analyzing management commentary. Extract:

1. KEY POSITIVES (3-5): What positive developments, achievements, or favorable outlook did management highlight?
2. KEY CONCERNS (3-5): What challenges, risks, or headwinds did management mention?
3. FORWARD GUIDANCE: What specific guidance did management provide about:
   - Revenue outlook
   - Margin expectations
   - Capital expenditure plans
   - Other financial metrics
4. CAPACITY UTILIZATION: Any mentions of production capacity, staffing levels, or operational efficiency?
5. GROWTH INITIATIVES (2-3): New products, markets, or strategic initiatives mentioned?

Return a JSON object with this structure:
{
  "keyPositives": ["Item 1", "Item 2", "Item 3"],
  "keyConcerns": ["Concern 1", "Concern 2", "Concern 3"],
  "forwardGuidance": {
    "revenue": "Expected 5-10% growth in 2024",
    "margin": "Expecting margin expansion of 200 bps",
    "capex": "Capex will be 3-4% of revenue",
    "other": ["Debt reduction focus", "Share buyback program"]
  },
  "capacityUtilization": "Operating at 85% capacity, planning expansion",
  "growthInitiatives": ["Initiative 1", "Initiative 2"]
}

CRITICAL: Only extract information explicitly mentioned in the text. Do NOT infer or hallucinate information.
If something isn't mentioned, omit it or set to null.
  `;

  let extractionResult = {
    keyPositives: [] as string[],
    keyConcerns: [] as string[],
    forwardGuidance: {} as any,
    capacityUtilization: undefined as string | undefined,
    growthInitiatives: [] as string[]
  };

  try {
    const result = await extractWithLLM(documentText, extractionPrompt);
    try {
      const jsonMatch = result.content?.match(/\{[\s\S]*\}/) || result.match?.(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        extractionResult = {
          keyPositives: parsed.keyPositives || [],
          keyConcerns: parsed.keyConcerns || [],
          forwardGuidance: parsed.forwardGuidance || {},
          capacityUtilization: parsed.capacityUtilization,
          growthInitiatives: parsed.growthInitiatives || []
        };
      }
    } catch (e) {
      dataQuality.push('Extraction returned unparseable format - using partial results');
    }
  } catch (error) {
    warnings.push(`Data extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate extracted data
  if (!extractionResult.keyPositives || extractionResult.keyPositives.length === 0) {
    dataQuality.push('No key positives extracted - document may lack forward-looking statements');
  }
  if (!extractionResult.keyConcerns || extractionResult.keyConcerns.length === 0) {
    dataQuality.push('No concerns/challenges identified - document may be incomplete transcript');
  }
  if (!extractionResult.forwardGuidance || Object.keys(extractionResult.forwardGuidance).length === 0) {
    dataQuality.push('Limited forward guidance extracted - check original document for guidance section');
  }

  return {
    managementTone: tone,
    confidenceLevel: toneConfidence,
    keyPositives: extractionResult.keyPositives.slice(0, 5),
    keyConcerns: extractionResult.keyConcerns.slice(0, 5),
    forwardGuidance: extractionResult.forwardGuidance,
    capacityUtilization: extractionResult.capacityUtilization,
    growthInitiatives: extractionResult.growthInitiatives.slice(0, 3),
    analyzedLength: documentText.length,
    dataQuality,
    warnings
  };
}
