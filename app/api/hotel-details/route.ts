import { NextResponse } from "next/server"

const MAKCROPS_API_KEY = "6920ee18362a48991fe8bd84"

// Mapping API to find hotel ID by name
async function findHotelId(hotelName: string) {
    try {
        const url = `https://api.makcorps.com/mapping?api_key=${MAKCROPS_API_KEY}&name=${encodeURIComponent(hotelName)}`
        const res = await fetch(url)

        if (!res.ok) {
            console.error("Makcrops mapping API error:", res.statusText)
            return null
        }

        const data = await res.json()
        // Return the first hotel's document_id
        return data.document_id || null
    } catch (error) {
        console.error("Error finding hotel ID:", error)
        return null
    }
}

// Get hotel details by hotel ID
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const hotelName = searchParams.get("name")
    const hotelId = searchParams.get("hotelid")

    if (!hotelName && !hotelId) {
        return NextResponse.json({ error: "Hotel name or ID required" }, { status: 400 })
    }

    try {
        let finalHotelId = hotelId

        // If only name provided, find the hotel ID first
        if (!finalHotelId && hotelName) {
            finalHotelId = await findHotelId(hotelName)
            if (!finalHotelId) {
                return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
            }
        }

        // Get hotel details
        const checkin = new Date()
        checkin.setDate(checkin.getDate() + 7) // 7 days from now
        const checkout = new Date(checkin)
        checkout.setDate(checkout.getDate() + 2) // 2 night stay

        const detailsUrl = `https://api.makcorps.com/hotel?api_key=${MAKCROPS_API_KEY}&hotelid=${finalHotelId}&adults=2&cur=INR&rooms=1&checkin=${checkin.toISOString().split('T')[0]}&checkout=${checkout.toISOString().split('T')[0]}`

        const detailsRes = await fetch(detailsUrl)

        if (!detailsRes.ok) {
            throw new Error(`Makcrops hotel API error: ${detailsRes.statusText}`)
        }

        const hotelData = await detailsRes.json()

        // Format the response
        const formattedData = {
            id: finalHotelId,
            name: hotelData.hotel_name || hotelName,
            address: hotelData.address || "",
            rating: hotelData.rating || 0,
            reviews: hotelData.reviews || [],
            photos: hotelData.photos || [],
            amenities: hotelData.amenities || [],
            description: hotelData.description || "",
            prices: hotelData.vendors || [],
            bestPrice: hotelData.best_price || null,
            features: hotelData.features || []
        }

        return NextResponse.json(formattedData)
    } catch (error: any) {
        console.error("Makcrops API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
