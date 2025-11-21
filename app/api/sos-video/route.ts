import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// In-memory video storage (fallback)
const memoryVideoStore = new Map<string, {
  recordId: string
  videoBlob: string
  mimeType: string
  duration: number
  fileSize: number
  createdAt: Date
}>()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const username = formData.get("username") as string
    const recordId = formData.get("recordId") as string
    const videoFile = formData.get("video") as File
    const duration = formData.get("duration") as string

    if (!username || !recordId || !videoFile) {
      return NextResponse.json({
        error: "username, recordId, and video file are required"
      }, { status: 400 })
    }

    // Convert video file to base64 for storage
    const arrayBuffer = await videoFile.arrayBuffer()
    const base64Video = Buffer.from(arrayBuffer).toString('base64')

    // Use memory store
    memoryVideoStore.set(recordId, {
      recordId,
      videoBlob: base64Video,
      mimeType: videoFile.type,
      duration: duration ? parseFloat(duration) : 0,
      fileSize: videoFile.size,
      createdAt: new Date()
    })

    // Store video metadata on blockchain
    try {
      const { addToBlockchain } = await import("../_lib/blockchain")
      await addToBlockchain("SOS_VIDEO", {
        recordId,
        username,
        mimeType: videoFile.type,
        duration: duration ? parseFloat(duration) : 0,
        fileSize: videoFile.size,
        timestamp: Date.now()
        // Not storing full video blob to avoid block size limits in this demo
      })
    } catch (e) {
      console.error("Failed to store video metadata on blockchain", e)
    }

    return NextResponse.json({
      message: "Video saved to temporary storage",
      recordId,
      videoSize: videoFile.size,
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to save video" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const recordId = searchParams.get("recordId")
    const username = searchParams.get("username")

    if (!recordId || !username) {
      return NextResponse.json({
        error: "recordId and username are required"
      }, { status: 400 })
    }

    // Try to get metadata from blockchain
    let blockchainData = null
    try {
      const { getUserTransactions } = await import("../_lib/blockchain")
      const transactions = await getUserTransactions(username, "SOS_VIDEO")
      blockchainData = transactions.find((t: any) => t.recordId === recordId)
    } catch (e) {
      console.error("Failed to fetch video metadata from blockchain", e)
    }

    // Use memory store for the actual blob (since we don't store blobs on chain in this demo)
    const videoData = memoryVideoStore.get(recordId)

    if (!videoData && !blockchainData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({
      recordId: videoData?.recordId || blockchainData?.recordId,
      videoData: videoData ? {
        blobUrl: `data:${videoData.mimeType};base64,${videoData.videoBlob}`,
        duration: videoData.duration,
        fileSize: videoData.fileSize,
        mimeType: videoData.mimeType
      } : null,
      blockchainMetadata: blockchainData,
      createdAt: videoData?.createdAt || new Date(blockchainData?.timestamp),
      source: blockchainData ? "blockchain_verified" : "memory"
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to retrieve video" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const recordId = searchParams.get("recordId")
    const username = searchParams.get("username")

    if (!recordId || !username) {
      return NextResponse.json({
        error: "recordId and username are required"
      }, { status: 400 })
    }

    // Use memory store
    const deleted = memoryVideoStore.delete(recordId)

    if (!deleted) {
      return NextResponse.json({ error: "Video not found in temporary storage" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Video deleted from temporary storage",
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete video" }, { status: 500 })
  }
}
