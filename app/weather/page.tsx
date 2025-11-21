"use client"

import {
  ArrowLeft,
  MapPin,
  MoreVertical,
  Menu,
  ChevronDown,
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import BottomNavigation from "@/components/bottom-navigation"

export default function WeatherPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [weather, setWeather] = useState<any>(null)
  const [cityWeathers, setCityWeathers] = useState<Array<{ name: string; temp: number; icon: string }>>([])

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(`/api/weather?q=Bengaluru&t=${Date.now()}`, { cache: "no-store" })
      const data = await res.json()
      setWeather(data)
      setIsLoading(false)
    }
    fetchWeather()
    const fetchCities = async () => {
      const cities = [
        "Bengaluru",
        "Mysuru",
        "Mangaluru",
        "Hubballi",
        "Belagavi",
        "Shivamogga",
        "Davanagere",
        "Ballari",
        "Vijayapura",
        "Udupi",
      ]
      try {
        const results = await Promise.all(
          cities.map(async (c) => {
            const r = await fetch(`/api/weather?q=${encodeURIComponent(c)}&t=${Date.now()}`, { cache: "no-store" })
            const d = await r.json()
            const main = d?.current?.weather?.[0]?.main?.toLowerCase() || "cloud"
            const icon = main.includes("rain") ? "rain" : main.includes("clear") ? "sun" : "cloud-sun"
            return { name: c, temp: Math.round(d?.current?.temp ?? 0), icon }
          })
        )
        setCityWeathers(results)
      } catch (e) {
        // ignore
      }
    }
    fetchCities()
  }, [])

  const currentWeather = weather
    ? {
        location: "Bengaluru",
        temperature: Math.round(Number(weather?.current?.temp ?? 0)),
        condition: weather?.current?.weather?.[0]?.description || "--",
        high: Math.round(Number(weather?.daily?.[0]?.temp?.max ?? 0)),
        low: Math.round(Number(weather?.daily?.[0]?.temp?.min ?? 0)),
        feelsLike: Math.round(Number(weather?.current?.feels_like ?? 0)),
      }
    : {
        location: "Bengaluru",
        temperature: 0,
        condition: "--",
        high: 0,
        low: 0,
        feelsLike: 0,
      }

  const hourlyData = weather
    ? (weather.hourly || []).slice(0, 5).map((h: any, i: number) => ({
        time: i === 0 ? "Now" : new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit" }),
        temp: Math.round(Number(h.temp)),
        icon: (h?.weather?.[0]?.main?.toLowerCase().includes("rain") ? "rain" : "cloud-sun"),
      }))
    : []

  const dayName = (d: number) => new Date(d * 1000).toLocaleDateString(undefined, { weekday: "short" })
  const dailyForecast = weather
    ? (weather.daily || []).slice(0, 4).map((d: any, idx: number) => ({
        day: idx === 0 ? "Today" : dayName(d.dt),
        date: new Date(d.dt * 1000).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" }),
        high: Math.round(Number(d.temp.max)),
        low: Math.round(Number(d.temp.min)),
        icon: (d?.weather?.[0]?.main?.toLowerCase().includes("rain") ? "rain" : "cloud-sun"),
        precipitation: Math.round(Number(d.pop || 0) * 100),
      }))
    : []

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sun":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "cloud-sun":
        return <CloudSun className="h-6 w-6 text-blue-400" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Weather...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white">{currentWeather.location}</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="px-6 py-4 text-center">
        <div className="text-8xl font-light text-white mb-2">
          {currentWeather.temperature}°C
        </div>
        <div className="text-xl text-white/90 mb-2">{currentWeather.condition}</div>
        <div className="text-white/80">
          {currentWeather.low} ~ {currentWeather.high}°C Feels like {currentWeather.feelsLike}°C
        </div>
      </div>

      {/* Temperature Graph */}
      <div className="px-6 py-8">
        <div className="relative h-32 mb-4">
          {/* Temperature line graph */}
          <svg className="w-full h-full" viewBox="0 0 300 120">
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <path
              d={(() => {
                if (!hourlyData.length) return "M 20 100 L 260 100"
                const xs = [20, 80, 140, 200, 260]
                const ys = hourlyData.map((h: any) => 120 - (h.temp - (currentWeather.low || 0)) * (100 / Math.max(1, (currentWeather.high - currentWeather.low))))
                return `M ${xs[0]} ${ys[0]} Q ${xs[1]} ${ys[1]} ${xs[2]} ${ys[2]} Q ${xs[3]} ${ys[3]} ${xs[4]} ${ys[4]}`
              })()}
              stroke="url(#tempGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Current temperature point */}
            <circle cx="20" cy="100" r="6" fill="#10b981" />
            <text x="20" y="90" textAnchor="middle" className="text-xs fill-white font-medium">{currentWeather.low}</text>
            {/* Peak temperature point */}
            <circle cx="260" cy="20" r="6" fill="#f97316" />
            <text x="260" y="10" textAnchor="middle" className="text-xs fill-white font-medium">{currentWeather.high}</text>
          </svg>
        </div>

        {/* Time labels and weather icons */}
        <div className="flex justify-between items-end">
          {hourlyData.map((hour, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-white text-sm font-medium mb-2">{hour.time}</div>
              <div className="mb-2">
                {getWeatherIcon(hour.icon)}
              </div>
              {index === 1 && (
                <ChevronDown className="h-4 w-4 text-white/60" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="px-6 py-4 flex-1">
        <div className="space-y-3">
          {dailyForecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="text-white/80 text-sm w-16">{day.day}</div>
                <div className="text-white/60 text-xs w-12">{day.date}</div>
                <div className="flex items-center">
                  {getWeatherIcon(day.icon)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {day.precipitation && (
                  <span className="text-blue-200 text-sm">{day.precipitation}%</span>
                )}
                <div className="text-white font-medium">
                  {day.low} {day.high}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Karnataka Major Cities */}
      <div className="px-6 pb-6">
        <h2 className="text-white/90 font-semibold mb-3">Karnataka - Major Cities</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {cityWeathers.map((c, idx) => (
            <Card key={idx} className="min-w-[120px] px-3 py-3 bg-white/10 border-white/20 text-white rounded-2xl">
              <div className="text-sm font-medium mb-1">{c.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-light">{c.temp}°</div>
                <div>
                  {c.icon === "sun" ? (
                    <Sun className="h-5 w-5 text-yellow-300" />
                  ) : c.icon === "rain" ? (
                    <CloudRain className="h-5 w-5 text-blue-200" />
                  ) : (
                    <CloudSun className="h-5 w-5 text-blue-100" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}