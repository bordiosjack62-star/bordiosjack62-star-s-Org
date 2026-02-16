
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
              description: "The level of urgency: 'Low', 'Medium', or 'High'.",
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

    const result = JSON.parse(response.text || "{}");
    
    // Sanitize severity to match expected casing
    if (result.severity) {
      const s = result.severity.toLowerCase();
      if (s === 'low') result.severity = 'Low';
      else if (s === 'high') result.severity = 'High';
      else result.severity = 'Medium';
    }

    return result;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}
