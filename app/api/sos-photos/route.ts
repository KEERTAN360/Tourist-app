import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// In-memory photo storage (fallback)
const memoryPhotoStore = new Map<string, {
  recordId: string
  photos: Array<{
    id: string
    blobUrl: string
    mimeType: string
    fileSize: number
    timestamp: number
    cameraType: "front" | "back"
  }>
  createdAt: Date
}>()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const username = formData.get("username") as string
    const recordId = formData.get("recordId") as string
    const photoFile = formData.get("photo") as File
    const cameraType = formData.get("cameraType") as string
    const timestamp = formData.get("timestamp") as string

    if (!username || !recordId || !photoFile) {
      return NextResponse.json({
        error: "username, recordId, and photo file are required"
      }, { status: 400 })
    }

    // Convert photo file to base64 for storage
    const arrayBuffer = await photoFile.arrayBuffer()
    const base64Photo = Buffer.from(arrayBuffer).toString('base64')

    const photoData = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blobUrl: `data:${photoFile.type};base64,${base64Photo}`,
      mimeType: photoFile.type,
      fileSize: photoFile.size,
      timestamp: timestamp ? parseInt(timestamp) : Date.now(),
      cameraType: cameraType as "front" | "back" || "back"
    }

    // Use memory store
    const existingPhotos = memoryPhotoStore.get(recordId)
    if (existingPhotos) {
      existingPhotos.photos.push(photoData)
      memoryPhotoStore.set(recordId, existingPhotos)
    } else {
      memoryPhotoStore.set(recordId, {
        recordId,
        photos: [photoData],
        createdAt: new Date()
      })
    }

    // Store photo metadata on blockchain
    try {
      const { addToBlockchain } = await import("../_lib/blockchain")
      await addToBlockchain("SOS_PHOTO", {
        recordId,
        username,
        photoId: photoData.id,
        mimeType: photoFile.type,
        fileSize: photoFile.size,
        timestamp: photoData.timestamp,
        cameraType
      })
    } catch (e) {
      console.error("Failed to store photo metadata on blockchain", e)
    }

    return NextResponse.json({
      message: "Photo saved to temporary storage",
      recordId,
      photoId: photoData.id,
      photoSize: photoFile.size,
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to save photo" }, { status: 500 })
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
    let blockchainData: any[] = []
    try {
      const { getUserTransactions } = await import("../_lib/blockchain")
      const transactions = await getUserTransactions(username, "SOS_PHOTO")
      blockchainData = transactions.filter((t: any) => t.recordId === recordId)
    } catch (e) {
      console.error("Failed to fetch photo metadata from blockchain", e)
    }

    // Use memory store for actual blobs
    const storedRecord = memoryPhotoStore.get(recordId)
    const photos = storedRecord ? storedRecord.photos : []

    if (photos.length === 0 && blockchainData.length === 0) {
      return NextResponse.json({ error: "Photos not found" }, { status: 404 })
    }

    return NextResponse.json({
      recordId,
      photos: photos.map(p => ({
        id: p.id,
        url: p.blobUrl, // Use existing blobUrl from memory store
        timestamp: p.timestamp,
        cameraType: p.cameraType
      })),
      blockchainMetadata: blockchainData,
      source: blockchainData.length > 0 ? "blockchain_verified" : "memory"
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to retrieve photos" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const recordId = searchParams.get("recordId")
    const photoId = searchParams.get("photoId")
    const username = searchParams.get("username")

    if (!recordId || !username) {
      return NextResponse.json({
        error: "recordId and username are required"
      }, { status: 400 })
    }

    // Use memory store
    const photoData = memoryPhotoStore.get(recordId)

    if (!photoData) {
      return NextResponse.json({ error: "Photos not found in temporary storage" }, { status: 404 })
    }

    if (photoId) {
      photoData.photos = photoData.photos.filter((photo: any) => photo.id !== photoId)
      memoryPhotoStore.set(recordId, photoData)
    } else {
      memoryPhotoStore.delete(recordId)
    }

    return NextResponse.json({
      message: "Photo(s) deleted from temporary storage",
      fallback: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete photo(s)" }, { status: 500 })
  }
}
