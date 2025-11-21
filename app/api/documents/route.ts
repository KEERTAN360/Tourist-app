import { NextResponse } from "next/server"

// In-memory store for documents (fallback)
const memoryDocStore = new Map<string, any[]>()

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username") || "guest"

    let docs: any[] = []

    try {
        const { getUserTransactions } = await import("../_lib/blockchain")
        const transactions = await getUserTransactions(username, "DOCUMENT_UPLOAD")

        // Transform transactions to document format
        docs = transactions.map((tx: any) => ({
            id: tx.docId || tx.timestamp,
            type: tx.docType,
            name: `${tx.docType}_${tx.timestamp}.jpg`,
            uploadDate: new Date(tx.timestamp).toLocaleDateString(),
            status: "verified",
            blockchainVerified: true,
            metadata: tx.metadata
        }))
    } catch (e) {
        console.error("Failed to fetch documents from blockchain", e)
        // Fallback
        docs = memoryDocStore.get(username) || []
    }

    return NextResponse.json({ documents: docs })
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, image, username = "guest", metadata } = body

        if (!type || !image) {
            return NextResponse.json({ error: "Type and image are required" }, { status: 400 })
        }

        const newDoc = {
            id: Date.now(),
            type,
            name: `${type}_${Date.now()}.jpg`,
            uploadDate: new Date().toLocaleDateString(),
            status: "verified",
            blockchainVerified: true,
            metadata
        }

        // Store in memory
        const userDocs = memoryDocStore.get(username) || []
        userDocs.push(newDoc)
        memoryDocStore.set(username, userDocs)

        // Store on blockchain
        try {
            const { addToBlockchain } = await import("../_lib/blockchain")
            await addToBlockchain("DOCUMENT_UPLOAD", {
                username,
                docType: type,
                docId: newDoc.id,
                timestamp: Date.now(),
                metadata: { ...metadata, status: "verified" }
            })
        } catch (e) {
            console.error("Failed to store document on blockchain", e)
        }

        return NextResponse.json({ success: true, document: newDoc })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
    }
}
