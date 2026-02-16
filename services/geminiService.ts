
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeIncident(description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following school incident description and suggest the most likely incident type and its severity (Low, Medium, High). 
      Incident: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedType: {
              type: Type.STRING,
              description: "The most appropriate category for the incident.",
            },
            severity: {
              type: Type.STRING,
              description: "The level of urgency/severity.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation for the choice.",
            }
          },
          required: ["suggestedType", "severity", "reasoning"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}
