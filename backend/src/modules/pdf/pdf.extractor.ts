import { extractText } from 'unpdf';

export const extractTextFromPdfBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    // A biblioteca PDF.js (usada internamente pelo unpdf) é estrita com tipos:
    // Ela rejeita objetos do tipo "Buffer" do Node.js, exigindo um Uint8Array puro.
    const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    
    const result = await extractText(uint8Array);
    return Array.isArray(result.text) ? result.text.join('\n') : String(result.text);
  } catch (error) {
    console.error("Erro interno do unpdf:", error);
    throw new Error('PDF_READ_FAILED');
  }
};
