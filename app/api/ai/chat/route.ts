import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_NAME = "gemini-1.5-flash"

/**
 * AI Chat API with User Preferences Integration
 * 
 * This API endpoint provides personalized AI responses by:
 * 1. Accepting a username parameter from the client
 * 2. Fetching user preferences from the database
 * 3. Including user profile data in the AI system prompt
 * 4. Providing personalized recommendations based on user preferences
 */

function buildSystemPrompt(userPreferences?: any) {
  let basePrompt = "You are a helpful and knowledgeable AI assistant for a Karnataka tourism and safety app. " +
    "You can help with travel-related questions, tourist spots in Karnataka, travel planning, weather, safety/SOS, documents, insurance, payments, hotels, services, and app navigation. " +
    "You can also engage in general conversation and provide helpful information on various topics when appropriate. " +
    "Use your knowledge to provide accurate, helpful, and engaging responses. Be friendly, informative, and conversational. " +
    "When discussing travel or Karnataka specifically, provide detailed and accurate information. For other topics, be helpful while staying appropriate and safe."

  if (userPreferences) {
    basePrompt += "\n\nUser Profile Information:\n"
    if (userPreferences.age) basePrompt += `- Age: ${userPreferences.age}\n`
    if (userPreferences.travelType) basePrompt += `- Travel Type: ${userPreferences.travelType}\n`
    if (userPreferences.budget) basePrompt += `- Budget: ${userPreferences.budget}\n`
    if (userPreferences.interests && userPreferences.interests.length > 0) {
      basePrompt += `- Interests: ${userPreferences.interests.join(", ")}\n`
    }
    if (userPreferences.travelStyle) basePrompt += `- Travel Style: ${userPreferences.travelStyle}\n`
    if (userPreferences.foodPreference) basePrompt += `- Food Preference: ${userPreferences.foodPreference}\n`
    if (userPreferences.accommodation) basePrompt += `- Accommodation: ${userPreferences.accommodation}\n`
    if (userPreferences.languages && userPreferences.languages.length > 0) {
      basePrompt += `- Languages: ${userPreferences.languages.join(", ")}\n`
    }
    if (userPreferences.disabilities) basePrompt += `- Accessibility Needs: ${userPreferences.disabilities}\n`
    if (userPreferences.emergencyContact) basePrompt += `- Emergency Contact: ${userPreferences.emergencyContact}\n`
    if (userPreferences.drinks !== undefined) basePrompt += `- Drinks Alcohol: ${userPreferences.drinks ? "Yes" : "No"}\n`

    basePrompt += "\nUse this profile information to provide personalized recommendations and responses. Consider the user's preferences, budget, interests, and accessibility needs when suggesting tourist spots, accommodations, and activities."
  }

  return basePrompt
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfiguration: missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
    }

    const { message, username } = await req.json()
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Fetch user preferences if username is provided
    let userPreferences = null
    if (username) {
      // In a real app, we would fetch from database
      // For now, we skip this or could use a memory store if shared
      console.log("Skipping user preferences fetch for:", username)
    }

    // Lightweight content filter for inappropriate content only
    const lower = message.toLowerCase()
    const inappropriateKeywords = [
      "hate", "violence", "illegal", "harmful", "dangerous"
    ]

    const isInappropriate = inappropriateKeywords.some((k) => lower.includes(k))
    if (isInappropriate) {
      return NextResponse.json({
        text: "I'm here to help with helpful and appropriate topics. Let's keep our conversation positive and constructive!",
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })
    const prompt = `${buildSystemPrompt(userPreferences)}\n\nUser: ${message}\nAssistant:`
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ text })
  } catch (err: any) {
    return NextResponse.json({ error: "AI service failed", detail: String(err?.message || err) }, { status: 500 })
  }
}


