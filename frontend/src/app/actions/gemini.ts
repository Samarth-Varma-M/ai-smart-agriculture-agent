"use server";

import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import History from "@/models/History";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function analyzeCropImage(
  base64Image: string,
  query: string,
  lang: string,
  soilPh?: string,
  npkLevels?: string,
  location?: string,
  weather?: string,
  commodity?: string,
  soilType?: string,
  irrigation?: string
) {
  if (!apiKey) {
    return { error: "Gemini API key is not configured on the server." };
  }

  try {
    const prompt = `You are an expert agronomist advising smallholder farmers. Analyze the provided image and user query. Provide a clean, structured diagnosis:
### 🌾 Problem Identification
### 🌿 Low-Cost Organic Remedy
### 🧪 Precise Chemical Dosage
### ⚠️ Warnings & Prevention

**Context**:
- Target Commodity: ${commodity || 'Not provided'}
- Location: ${location || 'Not provided'}
- Weather: ${weather || 'Not provided'}
- Soil pH: ${soilPh || 'Not provided'}
- NPK Levels: ${npkLevels || 'Not provided'}
- Soil Type: ${soilType || 'Not provided'}
- Irrigation Method: ${irrigation || 'Not provided'}

Ensure the response is practical, low-cost, and strictly formatted using Markdown. Output the response ONLY in this language: ${lang}.

User Query: ${query}`;

    const base64Data = base64Image.split(",")[1] || base64Image;
    const mimeType = base64Image.split(";")[0]?.split(":")[1] || "image/jpeg";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              }
            },
            {
              text: prompt
            }
          ]
        }
      ]
    });

    const aiDiagnosis = response.text;

    // Save to database if user is logged in
    const session = await getServerSession(authOptions);
    if (session?.user && (session.user as any).id) {
      try {
        await dbConnect();
        await History.create({
          userId: (session.user as any).id,
          location,
          weather,
          commodity,
          image: base64Image,
          query,
          diagnosis: aiDiagnosis
        });
      } catch (dbErr) {
        console.error("Failed to save history:", dbErr);
      }
    }

    return { text: aiDiagnosis };
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to analyze the image. Please try again later. Details: " + ((error as Error).message || "Unknown error") };
  }
}
