
import { GoogleGenAI, Type } from "@google/genai";

// Standardizing key access following @google/genai coding guidelines
const initAI = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("BuddyGuard AI: process.env.API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

export async function analyzeIncident(description: string) {
  const ai = initAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this school incident: "${description}". Suggest category and severity (Low, Medium, High).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedType: {
              type: Type.STRING,
              description: "The most appropriate category.",
            },
            severity: {
              type: Type.STRING,
              description: "Urgency level: 'Low', 'Medium', or 'High'.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Quick explanation.",
            }
          },
          required: ["suggestedType", "severity", "reasoning"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Normalize casing for the UI
    if (result.severity) {
      const s = result.severity.toLowerCase();
      result.severity = s.charAt(0).toUpperCase() + s.slice(1);
    }

    return result;
  } catch (error) {
    console.error("BuddyGuard AI: Analysis failed", error);
    return null;
  }
}
