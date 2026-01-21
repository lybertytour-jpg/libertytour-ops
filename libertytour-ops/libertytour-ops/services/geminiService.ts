import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
// Note: In a real environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Sends a message to the Gemini AI model.
 * Uses 'gemini-3-flash-preview' for general operational queries as requested.
 * Includes tool configurations for Maps and Search grounding if needed in future expansions.
 */
export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    // For fast operational responses, we use the flash model.
    // If complex reasoning was needed, we would switch to 'gemini-3-pro-preview'.
    const modelId = 'gemini-3-flash-preview'; 

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: `You are an AI Operations Assistant for LibertyTour, an internal travel management system. 
        Your users are Admins, Dispatchers, and Accountants. 
        Keep answers concise, professional, and data-focused. 
        Do not use marketing language. 
        You have access to tools like Google Search and Maps if explicitly requested.`,
        // Start with search disabled for general chat to save tokens/latency, 
        // enable via tools if specific queries arise (simulated here).
        tools: [{ googleSearch: {} }], 
      },
    });

    // Convert history to format if needed, for now we just send the new message purely for this demo context
    // In a real app, you'd map the history to the chat context.
    
    const response: GenerateContentResponse = await chat.sendMessage({ 
      message 
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Error: Unable to process request at this time. Please check your API key configuration.";
  }
};

/**
 * Quick analysis for content correction or short summaries.
 * Uses 'gemini-2.5-flash-lite' for lowest latency.
 */
export const quickAnalyze = async (text: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest', // mapping to lite
      contents: `Analyze this text for operational clarity and brevity: ${text}`,
    });
    return response.text || "";
   } catch (error) {
     return "Analysis failed.";
   }
}