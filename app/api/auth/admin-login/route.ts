import { NextResponse } from "next/server"
export const runtime = "nodejs"

export async function POST(req: Request) {
  const body = await req.json()
  const { username, password } = body || {}

  const ADMIN_USER = process.env.ADMIN_USER || "Admin"
  const ADMIN_PASS = process.env.ADMIN_PASS || "12345"

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 })
}


