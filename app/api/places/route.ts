import { NextResponse } from "next/server"

const GEOAPIFY_API_KEY = "94f25ba01135482494790e23a9122984"
const GEOAPIFY_DETAILS_KEY = "d3645c2764cb4466b00a01432287642d"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const categories = searchParams.get("categories") || "catering.restaurant,accommodation"
    const radius = searchParams.get("radius") || "5000" // 5km default

    if (!lat || !lon) {
        return NextResponse.json({ error: "Latitude and Longitude required" }, { status: 400 })
    }

    try {
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`

        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Geoapify API error: ${res.statusText}`)
        }

        const data = await res.json()

        // Fetch place details for each place to get images
        const placesWithDetails = await Promise.all(
            data.features.map(async (feature: any) => {
                const placeId = feature.properties.place_id
                let imageUrl = null

                // Fetch place details to get image
                try {
                    const detailsUrl = `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${GEOAPIFY_DETAILS_KEY}`
                    const detailsRes = await fetch(detailsUrl)

                    if (detailsRes.ok) {
                        const detailsData = await detailsRes.json()
                        // Get the first image if available
                        if (detailsData.features?.[0]?.properties?.datasource?.raw?.image) {
                            imageUrl = detailsData.features[0].properties.datasource.raw.image
                        } else if (detailsData.features?.[0]?.properties?.wiki_and_media?.image) {
                            imageUrl = detailsData.features[0].properties.wiki_and_media.image
                        }
                    }
                } catch (e) {
                    console.error(`Failed to fetch details for place ${placeId}`, e)
                }

                return {
                    id: feature.properties.place_id,
                    name: feature.properties.name || feature.properties.street || "Unknown Place",
                    category: feature.properties.categories?.[0] || '',
                    address: feature.properties.formatted,
                    distance: feature.properties.distance,
                    lat: feature.properties.lat,
                    lon: feature.properties.lon,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    isOpen: true,
                    imageUrl
                }
            })
        )

        return NextResponse.json({ places: placesWithDetails })
    } catch (error: any) {
        console.error("Geoapify error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
