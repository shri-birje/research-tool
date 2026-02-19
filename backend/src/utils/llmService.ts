import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-4-turbo-preview';

interface LLMRequest {
  prompt: string;
  jsonSchema?: any;
  temperature?: number;
}

interface LLMResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export async function callLLM(req: LLMRequest): Promise<LLMResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst and research assistant. Respond with structured, accurate data extraction.'
          },
          {
            role: 'user',
            content: req.prompt
          }
        ],
        temperature: req.temperature || 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`LLM API error: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

export async function extractWithLLM(
  text: string,
  instructions: string,
  jsonSchema?: any
): Promise<any> {
  const prompt = `
${instructions}

TEXT TO ANALYZE:
${text.substring(0, 3000)}

${jsonSchema ? `Please respond with valid JSON matching this schema: ${JSON.stringify(jsonSchema)}` : 'Please provide a structured response.'}

Important: 
- Only extract information explicitly mentioned in the text
- If information is not present, mark it as null or "Not found"
- For financial figures, ensure you include currency and units
- Be precise with numbers and dates
  `;

  const response = await callLLM({ prompt, temperature: 0.2 });
  
  // Try to parse JSON if requested
  if (jsonSchema) {
    try {
      // Extract JSON from the response (may be wrapped in markdown)
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to parse LLM response as JSON, returning raw content');
    }
  }
  
  return { content: response.content };
}
