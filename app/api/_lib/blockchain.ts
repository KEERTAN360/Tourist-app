import { NextResponse } from "next/server"

const BLOCKCHAIN_API_URL = "http://localhost:8800"

export async function addToBlockchain(type: string, data: any) {
    try {
        // 1. Create transaction
        const transactionData = {
            user: data.username || "anonymous",
            v_file: `${type}_${Date.now()}`,
            file_data: JSON.stringify(data),
            file_size: JSON.stringify(data).length.toString()
        }

        const txRes = await fetch(`${BLOCKCHAIN_API_URL}/new_transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
        })

        if (!txRes.ok) {
            console.error("Blockchain transaction failed:", await txRes.text())
            return false
        }

        // 2. Mine the block (to confirm transaction immediately for demo)
        const mineRes = await fetch(`${BLOCKCHAIN_API_URL}/mine`)
        if (!mineRes.ok) {
            console.error("Blockchain mining failed:", await mineRes.text())
            return false
        }

        return true
    } catch (error) {
        console.error("Blockchain error:", error)
        return false
    }
}

// Fetch the full blockchain
async function getChain() {
    try {
        const res = await fetch(`${BLOCKCHAIN_API_URL}/chain`, { cache: 'no-store' })
        if (!res.ok) return null
        const data = await res.json()
        return data.chain
    } catch (error) {
        console.error("Failed to fetch blockchain:", error)
        return null
    }
}

// Helper to get all transactions of a specific type for a user
async function getUserTransactions(username: string, type: string) {
    const chain = await getChain()
    if (!chain) return []

    const transactions: any[] = []

    // Iterate through blocks (skip genesis block usually, but here we check all)
    for (const block of chain) {
        if (block.transactions) {
            for (const tx of block.transactions) {
                try {
                    // Parse file_data if it's a string
                    let data = tx.file_data
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data)
                        } catch (e) {
                            // Keep as is if not JSON
                        }
                    }

                    // Check if it matches user and type
                    // Note: Our python peer stores it as 'user', but we might have stored username inside file_data too
                    if (tx.user === username || data.username === username) {
                        // Check type from v_file (e.g. "WALLET_TRANSACTION_123") or data
                        if (tx.v_file && tx.v_file.startsWith(type)) {
                            transactions.push({ ...data, timestamp: tx.timestamp || Date.now() })
                        }
                    }
                } catch (e) {
                    console.error("Error parsing transaction:", e)
                }
            }
        }
    }
    return transactions
}

export { addToBlockchain, getChain, getUserTransactions }
