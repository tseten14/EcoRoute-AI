import { GoogleGenAI } from "@google/genai";
import { EcoRouteResponse, LocationCoords } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEcoRoute = async (
  origin: string, 
  destination: string, 
  vehicleType: string,
  userLocation: LocationCoords | null
): Promise<EcoRouteResponse> => {
  
  const prompt = `
    Plan a comprehensive, energy-efficient route from "${origin}" to "${destination}" for a ${vehicleType}.
    
    Prioritize:
    1. Energy efficiency (flatter terrain, consistent speeds, less traffic).
    2. Available charging stations (if EV) or eco-friendly rest stops.
    3. Real-time route conditions using Google Maps data.

    Structure your response clearly with:
    - **Route Summary**: Distance, estimated time, and why this is the efficient choice.
    - **Key Stops**: Specific charging stations or green businesses along the way with their specific locations.
    - **Efficiency Tips**: Specific driving advice for this route (e.g. "Use regenerative braking heavily on the descent into...").

    Ensure you use the Google Maps tool to find real places and accurately estimate the route context.
  `;

  const toolConfig: any = {};
  
  if (userLocation) {
    toolConfig.retrievalConfig = {
      latLng: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
        // temperature: 0.4, // Slightly lower for more factual routing
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No route suggestions found.");
    }

    const candidate = candidates[0];
    
    // Extract text
    const text = candidate.content?.parts?.map(p => p.text).join('') || "No detailed route information available.";

    // Extract grounding chunks (Maps data)
    // The structure is often deeply nested in groundingMetadata
    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to calculate route. Please verify your API key and connection.");
  }
};