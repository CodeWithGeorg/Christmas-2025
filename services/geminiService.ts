
import { GoogleGenAI } from "@google/genai";

export const generateFestiveMessage = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // A set of diverse themes to ensure the model doesn't repeat the same style
  const themes = [
    "Traditional, warm, and cozy",
    "Magical, whimsical, and full of wonder",
    "Modern, sleek, and bright",
    "Deeply poetic and serene",
    "Energetic, joyful, and festive",
    "Inspired by a snowy winter adventure",
    "Focusing on the light of the North Star"
  ];
  
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a unique, short, heartwarming Christmas 2025 message for ${name}. 
      The vibe should be: ${randomTheme}. 
      Avoid standard clichés like "merry and bright" if possible. 
      Keep it between 10 to 20 words.`,
      config: {
        temperature: 1.0, // Increased temperature for higher creativity/variety
        topP: 0.95,
      },
    });

    return response.text?.trim() || `Merry Christmas 2025, ${name}! May your days be filled with unique magic and unexpected joy.`;
  } catch (error) {
    console.error("Error generating message:", error);
    // Fallback messages with randomness
    const fallbacks = [
      `Merry Christmas 2025, ${name}! Wishing you a year as brilliant as the winter stars.`,
      `To ${name}: May the magic of this season wrap you in warmth and wonder.`,
      `Happy 2025 Holidays, ${name}! May your heart be light and your home be full of laughter.`,
      `A special Christmas wish for ${name}: May beauty find you in every snowflake.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
