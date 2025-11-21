import { NextResponse } from "next/server"
export const runtime = "nodejs"
import { connectToDatabase } from "@/app/api/_db/connect"
import { User } from "@/app/api/_models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body || {}

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Store user on blockchain
    try {
      const { addToBlockchain } = await import("../../_lib/blockchain")
      await addToBlockchain("USER_REGISTRATION", { username, password: hashedPassword })
    } catch (e) {
      console.error("Failed to store user on blockchain", e)
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
  }
}


