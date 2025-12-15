import { GoogleGenAI } from "@google/genai";
import type { BriefingData, GroundingSource } from "../types.ts";

const generatePrompt = () => `
You are a senior market analyst for the global textile and fabric industry.
Your task is to compile a "Daily Executive Briefing" by searching for the latest news (last 24-48 hours).

TARGET SOURCES TO PRIORITIZE SEARCH FOR:
- Fibre2Fashion
- Just Style
- Textile Exchange
- The Textile Magazine
- Global financial news related to textile companies (Bloomberg, FT context)

REQUIRED INFORMATION CATEGORIES:
1. Financial News (Stock moves, M&A, earnings of major textile/apparel holdings).
2. Market Trends (Cotton prices, synthetic fiber demand, supply chain shifts).
3. Corporate Updates (New factories, bankruptcies, strategic partnerships).
4. Sustainability & Innovation (New materials, regulations, circular economy).

OUTPUT FORMAT INSTRUCTIONS:
- Generate exactly 20-30 concise, high-impact bullet points.
- Use Markdown formatting.
- Group the bullets by category (e.g., ## Financials, ## Market Trends).
- Do not include intro or outro fluff.
- Focus on hard numbers, specific company names, and actionable intelligence.
`;

export const fetchDailyBriefing = async (): Promise<BriefingData> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_KEY,
});


  try {
    // We use gemini-2.5-flash for speed and search grounding capabilities
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generatePrompt(),
      config: {
        tools: [{ googleSearch: {} }],
        // We do not set responseMimeType to JSON because we want the model to format markdown text freely
        // and Search Grounding does not support JSON schema enforcement simultaneously in all cases perfectly.
      },
    });

    const summaryText = response.text || "No summary generated.";
    
    // Extract sources from grounding metadata
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = rawChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        title: web.title,
        uri: web.uri,
      }));

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      timestamp: new Date().toISOString(),
      summary: summaryText,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate briefing. Please try again.");
  }
};