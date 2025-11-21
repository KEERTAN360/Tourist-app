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

    // Dummy authentication
    if (username === "user" && password === "password") {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
  }
}


