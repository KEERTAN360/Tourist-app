import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// In-memory fallback storage
const memorySOSStore = new Map<string, any[]>()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 })
    }

    // Use memory store
    const userRecords = memorySOSStore.get(username) || []
    const filteredRecords = status
      ? userRecords.filter((record: any) => record.status === status)
      : userRecords

    return NextResponse.json({
      records: filteredRecords.slice(0, limit),
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch SOS records" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      username,
      emergencyType,
      location,
      videoData,
      audioTranscript,
      emergencyContacts,
      metadata
    } = body || {}

    if (!username || !emergencyType || !location) {
      return NextResponse.json({
        error: "username, emergencyType, and location are required"
      }, { status: 400 })
    }

    const newRecord = {
      _id: `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      emergencyType,
      status: "active",
      location,
      videoData,
      audioTranscript,
      emergencyContacts: emergencyContacts || [],
      createdAt: new Date(),
      metadata
    }

    // Use memory store for immediate response and fallback
    const userRecords = memorySOSStore.get(username) || []
    userRecords.unshift(newRecord)
    memorySOSStore.set(username, userRecords.slice(0, 50)) // Keep only last 50

    // Store SOS record on blockchain
    try {
      const { addToBlockchain } = await import("../_lib/blockchain")
      await addToBlockchain("SOS_RECORD", {
        ...newRecord,
        username
      })
    } catch (e) {
      console.error("Failed to store SOS record on blockchain", e)
    }

    return NextResponse.json({
      record: newRecord,
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create SOS record" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { recordId, status, resolvedAt } = body || {}

    if (!recordId || !status) {
      return NextResponse.json({
        error: "recordId and status are required"
      }, { status: 400 })
    }

    // Use memory store
    const allRecords = Array.from(memorySOSStore.values()).flat()
    const recordIndex = allRecords.findIndex((record: any) => record._id === recordId)

    if (recordIndex === -1) {
      return NextResponse.json({ error: "SOS record not found" }, { status: 404 })
    }

    const record = allRecords[recordIndex]
    record.status = status
    if (status === "resolved" && resolvedAt) {
      record.resolvedAt = new Date(resolvedAt)
    }

    return NextResponse.json({
      record,
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update SOS record" }, { status: 500 })
  }
}
