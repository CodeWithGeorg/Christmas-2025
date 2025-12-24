
import { GoogleGenAI } from "@google/genai";

export const generateFestiveMessage = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, heartwarming Christmas 2025 message for a person named ${name}. Keep it festive and under 25 words.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text?.trim() || `Merry Christmas 2025, ${name}! May your days be merry and bright.`;
  } catch (error) {
    console.error("Error generating message:", error);
    return `Merry Christmas 2025, ${name}! Wishing you love, peace, and joy.`;
  }
};
