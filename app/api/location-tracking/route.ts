import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// In-memory location tracking
const activeLocationTracking = new Map<string, {
  username: string
  locations: Array<{
    lat: number
    lng: number
    timestamp: number
    accuracy?: number
  }>
  isActive: boolean
  startTime: number
}>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, lat, lng, accuracy, action } = body || {}

    if (!username || !lat || !lng) {
      return NextResponse.json({
        error: "username, lat, and lng are required"
      }, { status: 400 })
    }

    const locationData = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      timestamp: Date.now(),
      accuracy: accuracy ? parseFloat(accuracy) : undefined
    }

    if (action === "start") {
      // Start location tracking
      activeLocationTracking.set(username, {
        username,
        locations: [locationData],
        isActive: true,
        startTime: Date.now()
      })

      return NextResponse.json({
        message: "Location tracking started",
        trackingId: username
      })
    } else if (action === "update") {
      // Update location
      const tracking = activeLocationTracking.get(username)
      if (tracking) {
        tracking.locations.push(locationData)
        // Keep only last 100 locations to prevent memory issues
        if (tracking.locations.length > 100) {
          tracking.locations = tracking.locations.slice(-100)
        }
        activeLocationTracking.set(username, tracking)
      }

      return NextResponse.json({
        message: "Location updated",
        locationCount: tracking?.locations.length || 0
      })
    } else if (action === "stop") {
      // Stop location tracking
      const tracking = activeLocationTracking.get(username)
      if (tracking) {
        tracking.isActive = false

        // In a real app, we would save this to the database
        // For now, we just keep it in memory or discard it

        // Remove from active tracking
        activeLocationTracking.delete(username)

        return NextResponse.json({
          message: "Location tracking stopped",
          totalLocations: tracking.locations.length
        })
      }

      return NextResponse.json({ error: "No active tracking found" }, { status: 404 })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to process location tracking" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 })
    }

    const tracking = activeLocationTracking.get(username)

    if (!tracking) {
      return NextResponse.json({
        isActive: false,
        message: "No active location tracking found"
      })
    }

    return NextResponse.json({
      isActive: tracking.isActive,
      startTime: tracking.startTime,
      locationCount: tracking.locations.length,
      lastLocation: tracking.locations[tracking.locations.length - 1],
      locations: tracking.locations.slice(-10) // Return last 10 locations
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to get location tracking" }, { status: 500 })
  }
}
