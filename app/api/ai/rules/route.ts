import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_NAME = "gemini-1.5-flash"

function buildRulesSystemPrompt() {
  return (
    "You are an AI that answers ONLY about Indian travel rules, public safety, documents, and compliance relevant to tourism in India, with emphasis on Karnataka. " +
    "Use authoritative tone and cite Indian context (e.g., MoRTH for driving, MHA for safety advisories, Bureau of Immigration for visas, state tourism for local rules). " +
    "If the query is not about rules/regulations/compliance within India, refuse and ask for an India-specific rules question. " +
    "If unsure, advise the user to check the official government websites or local authorities."
  )
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    console.log("API Key exists:", !!apiKey)
    console.log("API Key length:", apiKey?.length || 0)
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfiguration: missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
    }

    const { query } = await req.json()
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Guardrail: ensure it's rules-focused and India-specific
    const lower = query.toLowerCase()
    const rulesKeywords = ["rule", "regulation", "law", "permit", "visa", "id", "document", "dl", "license", "insurance", "traffic", "road", "penalty", "fine", "immigration", "customs", "baggage", "police", "fir", "sos", "safety", "guideline", "helmet", "pillion", "motorcycle", "bike"]
    const indiaGeoKeywords = ["india", "indian", "karnataka", "bengaluru", "bangalore", "blr"]
    const isRulesy = rulesKeywords.some((k) => lower.includes(k)) && indiaGeoKeywords.some((k) => lower.includes(k))
    if (!isRulesy) {
      return NextResponse.json({
        text:
          "Please ask about India-specific travel rules, documents, safety guidelines, or compliance (e.g., Karnataka road rules, visa, ID, insurance, SOS).",
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })
    const prompt = `${buildRulesSystemPrompt()}\n\nUser: ${query}\nAssistant:`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return NextResponse.json({ text })
  } catch (err: any) {
    return NextResponse.json({ error: "Rules AI service failed", detail: String(err?.message || err) }, { status: 500 })
  }
}


