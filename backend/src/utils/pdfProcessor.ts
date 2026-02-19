import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';


export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      text += pageText + '\n';
    }

    return text.trim();
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Extract numbers from text with context
export function extractNumbers(text: string): Array<{ value: number; context: string }> {
  const numberPattern = /[^a-zA-Z]([\d,]+(?:\.\d{1,2})?)\s*(?:million|billion|thousand|M|B|K|%)?/gi;
  const matches = [];
  let match;

  while ((match = numberPattern.exec(text)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ''));
    const start = Math.max(0, match.index - 50);
    const end = Math.min(text.length, match.index + 100);
    const context = text.substring(start, end);

    matches.push({ value, context });
  }

  return matches;
}
