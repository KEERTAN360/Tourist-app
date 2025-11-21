import { NextResponse } from "next/server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const API_KEY = process.env.WEATHER_API_KEY || "42e10fb24559beb8d8bc31a29e1734e1"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || "Bengaluru,IN"
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  try {
    // Determine coordinates
    let glat = lat
    let glon = lon
    if (!glat || !glon) {
      // Try with provided q first
      let geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${API_KEY}`, { cache: "no-store" })
      let geoJson = await geo.json()
      if (!Array.isArray(geoJson) || geoJson.length === 0) {
        // Fallback to Bengaluru,IN and Bangalore,IN
        const fallbacks = ["Bengaluru,IN", "Bangalore,IN"]
        for (const name of fallbacks) {
          geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(name)}&limit=1&appid=${API_KEY}`, { cache: "no-store" })
          geoJson = await geo.json()
          if (Array.isArray(geoJson) && geoJson.length > 0) break
        }
      }
      if (!Array.isArray(geoJson) || geoJson.length === 0) {
        return NextResponse.json({ error: "City not found" }, { status: 404 })
      }
      glat = String(geoJson[0].lat)
      glon = String(geoJson[0].lon)
    }

    // Fetch current and forecast (free tier compatible)
    const [curRes, fcRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${glat}&lon=${glon}&units=metric&appid=${API_KEY}`, { cache: "no-store" }),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${glat}&lon=${glon}&units=metric&appid=${API_KEY}`, { cache: "no-store" }),
    ])
    const cur = await curRes.json()
    const fc = await fcRes.json()
    if (!curRes.ok) return NextResponse.json({ error: cur?.message || "Weather fetch failed" }, { status: curRes.status })
    if (!fcRes.ok) return NextResponse.json({ error: fc?.message || "Forecast fetch failed" }, { status: fcRes.status })

    // Normalize to onecall-like shape used by UI
    const hourly = Array.isArray(fc?.list)
      ? fc.list.slice(0, 8).map((item: any) => ({
          dt: Math.floor(new Date(item.dt_txt).getTime() / 1000),
          temp: item?.main?.temp,
          weather: [{ main: item?.weather?.[0]?.main, description: item?.weather?.[0]?.description }],
          pop: item?.pop ?? 0,
        }))
      : []

    // Group forecast by date for daily min/max
    const byDay: Record<string, { temps: number[]; pop: number; icon: string; dt: number }> = {}
    hourly.concat(
      Array.isArray(fc?.list)
        ? fc.list.map((item: any) => ({
            dt: Math.floor(new Date(item.dt_txt).getTime() / 1000),
            temp: item?.main?.temp,
            pop: item?.pop ?? 0,
            main: item?.weather?.[0]?.main || "Clouds",
          }))
        : []
    ).forEach((h: any) => {
      const d = new Date(h.dt * 1000)
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
      if (!byDay[key]) byDay[key] = { temps: [], pop: 0, icon: h.main, dt: h.dt }
      byDay[key].temps.push(h.temp)
      byDay[key].pop = Math.max(byDay[key].pop, h.pop)
      byDay[key].icon = h.main
      byDay[key].dt = Math.min(byDay[key].dt, h.dt)
    })
    const daily = Object.values(byDay)
      .slice(0, 4)
      .map((d) => ({
        dt: d.dt,
        temp: { min: Math.round(Math.min(...d.temps)), max: Math.round(Math.max(...d.temps)) },
        weather: [{ main: d.icon }],
        pop: d.pop,
      }))

    const normalized = {
      current: {
        dt: cur?.dt,
        temp: cur?.main?.temp,
        feels_like: cur?.main?.feels_like,
        humidity: cur?.main?.humidity,
        wind_speed: cur?.wind?.speed,
        weather: [{ main: cur?.weather?.[0]?.main, description: cur?.weather?.[0]?.description }],
      },
      hourly,
      daily,
    }

    return NextResponse.json(normalized)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
  }
}


