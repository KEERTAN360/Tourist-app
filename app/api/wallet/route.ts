import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// In-memory fallback storage for wallet balances
const memoryWalletStore = new Map<string, { balance: number; currency: string }>()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    if (!username) return NextResponse.json({ error: "username is required" }, { status: 400 })

    let balance = 5000
    let currency = "INR"
    const history: any[] = []

    try {
      const { getUserTransactions } = await import("../_lib/blockchain")
      const transactions = await getUserTransactions(username, "WALLET_TRANSACTION")

      if (transactions.length > 0) {
        // Sort by timestamp descending
        transactions.sort((a: any, b: any) => b.timestamp - a.timestamp)

        // Latest balance
        balance = transactions[0].newBalance
        currency = transactions[0].currency || "INR"

        // Build history
        transactions.forEach((tx: any) => {
          history.push({
            id: tx.timestamp,
            type: tx.operation === "add" ? "Deposit" : "Payment",
            amount: tx.amount,
            date: new Date(tx.timestamp).toISOString().split('T')[0],
            status: "Completed"
          })
        })
      }
    } catch (e) {
      console.error("Failed to fetch wallet from blockchain", e)
      // Fallback
      const wallet = memoryWalletStore.get(username)
      if (wallet) {
        balance = wallet.balance
        currency = wallet.currency
      }
    }

    return NextResponse.json({
      balance,
      currency,
      history,
      username,
      source: "blockchain"
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch wallet" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username = "guest", amount, operation } = body

    if (!amount || !operation) {
      return NextResponse.json({ error: "Amount and operation required" }, { status: 400 })
    }

    // Get current balance from blockchain first
    let currentBalance = 5000
    let currency = "INR"

    try {
      const { getUserTransactions } = await import("../_lib/blockchain")
      const transactions = await getUserTransactions(username, "WALLET_TRANSACTION")
      if (transactions.length > 0) {
        transactions.sort((a: any, b: any) => b.timestamp - a.timestamp)
        currentBalance = transactions[0].newBalance
        currency = transactions[0].currency || "INR"
      }
    } catch (e) {
      console.error("Failed to fetch balance from blockchain", e)
      const wallet = memoryWalletStore.get(username)
      if (wallet) {
        currentBalance = wallet.balance
        currency = wallet.currency
      }
    }

    let newBalance = currentBalance
    if (operation === "add") {
      newBalance += amount
    } else if (operation === "subtract") {
      if (currentBalance < amount) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
      }
      newBalance -= amount
    } else {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    // Update memory store
    memoryWalletStore.set(username, { balance: newBalance, currency })

    // Store on blockchain
    try {
      const { addToBlockchain } = await import("../_lib/blockchain")
      await addToBlockchain("WALLET_TRANSACTION", {
        username,
        operation,
        amount,
        newBalance,
        currency,
        timestamp: Date.now()
      })
    } catch (e) {
      console.error("Failed to store transaction on blockchain", e)
    }

    return NextResponse.json({
      balance: newBalance,
      currency,
      username,
      success: true
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update wallet" }, { status: 500 })
  }
}
