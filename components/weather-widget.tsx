"use client"
import { Cloud, Sun, CloudRain, Wind, CloudDrizzle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: "sun" | "cloud" | "rain" | "drizzle"
  hourlyForecast: Array<{
    time: string
    temp: number
    icon: "sun" | "cloud" | "rain" | "drizzle"
  }>
}

export default function WeatherWidget() {
  const router = useRouter()
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchWeather = async (query: string) => {
      try {
        const res = await fetch(query + `&t=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load weather")
        const icon = (() => {
          const main = data?.current?.weather?.[0]?.main?.toLowerCase() || "cloud"
          if (main.includes("rain")) return "rain"
          if (main.includes("drizzle")) return "drizzle"
          if (main.includes("clear")) return "sun"
          return "cloud"
        })() as WeatherData["icon"]
        const hourly = (data?.hourly || []).slice(0, 5).map((h: any, i: number) => {
          const dt = new Date((h.dt || 0) * 1000)
          const label = i === 0 ? "Now" : dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          const hIcon = (() => {
            const m = h?.weather?.[0]?.main?.toLowerCase() || "cloud"
            if (m.includes("rain")) return "rain"
            if (m.includes("drizzle")) return "drizzle"
            if (m.includes("clear")) return "sun"
            return "cloud"
          })() as WeatherData["icon"]
          return { time: label, temp: Math.round(Number(h.temp)), icon: hIcon }
        })
        setCurrentWeather({
          location: "Bengaluru",
          temperature: Math.round(Number(data?.current?.temp ?? 0)),
          condition: data?.current?.weather?.[0]?.description || "--",
          humidity: Math.round(Number(data?.current?.humidity ?? 0)),
          windSpeed: Math.round(Number(data?.current?.wind_speed ?? 0)),
          icon,
          hourlyForecast: hourly,
        })
      } catch (e) {
        // keep UI and try fallback to city name
        if (query.indexOf("lat=") > -1) {
          try {
            const res2 = await fetch(`/api/weather?q=Bengaluru`, { cache: "no-store" })
            const data2 = await res2.json()
            if (res2.ok) {
              const main = data2?.current?.weather?.[0]?.main?.toLowerCase() || "cloud"
              const icon = main.includes("rain") ? "rain" : main.includes("drizzle") ? "drizzle" : main.includes("clear") ? "sun" : "cloud"
              const hourly = (data2?.hourly || []).slice(0, 5).map((h: any, i: number) => {
                const dt = new Date((h.dt || 0) * 1000)
                const label = i === 0 ? "Now" : dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                const hMain = h?.weather?.[0]?.main?.toLowerCase() || "cloud"
                const hIcon = hMain.includes("rain") ? "rain" : hMain.includes("drizzle") ? "drizzle" : hMain.includes("clear") ? "sun" : "cloud"
                return { time: label, temp: Math.round(Number(h.temp)), icon: hIcon }
              })
              setCurrentWeather({
                location: "Bengaluru",
                temperature: Math.round(Number(data2?.current?.temp ?? 0)),
                condition: data2?.current?.weather?.[0]?.description || "--",
                humidity: Math.round(Number(data2?.current?.humidity ?? 0)),
                windSpeed: Math.round(Number(data2?.current?.wind_speed ?? 0)),
                icon,
                hourlyForecast: hourly,
              })
            }
          } catch {}
        }
      }
    }
    // Prefer geolocation when available
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          fetchWeather(`/api/weather?lat=${latitude}&lon=${longitude}`)
        },
        () => fetchWeather(`/api/weather?q=Bengaluru`),
        { timeout: 4000 }
      )
    } else {
      fetchWeather(`/api/weather?q=Bengaluru`)
    }
    const interval = setInterval(() => {
      fetchWeather(`/api/weather?q=Bengaluru`)
    }, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (iconType: string, size: "sm" | "lg" = "lg") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-6 w-6"
    switch (iconType) {
      case "sun":
        return <Sun className={`${sizeClass} text-orange-500`} />
      case "rain":
        return <CloudRain className={`${sizeClass} text-blue-600`} />
      case "drizzle":
        return <CloudDrizzle className={`${sizeClass} text-blue-500`} />
      default:
        return <Cloud className={`${sizeClass} text-gray-600`} />
    }
  }

  const getThemeColors = () => {
    const iconType = currentWeather?.icon || "cloud"
    switch (iconType) {
      case "sun":
        return {
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
          textColor: "#92400e",
          accentColor: "#d97706",
        }
      case "rain":
        return {
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)",
          textColor: "#1e293b",
          accentColor: "#475569",
        }
      case "drizzle":
        return {
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
          textColor: "#1e40af",
          accentColor: "#3b82f6",
        }
      default:
        return {
          background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
          textColor: "#334155",
          accentColor: "#64748b",
        }
    }
  }

  const renderBackgroundElements = () => {
    const theme = getThemeColors()
    const iconType = currentWeather?.icon || "cloud"
    switch (iconType) {
      case "sun":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300/40 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-orange-300/50 rounded-full animate-bounce"></div>
          </div>
        )
      case "rain":
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-400/60 animate-pulse"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${10 + (i % 3) * 15}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        )
      case "drizzle":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 right-6 w-12 h-6 bg-gradient-to-r from-red-400/50 via-yellow-400/50 via-green-400/50 via-blue-400/50 to-purple-400/50 rounded-full opacity-80"></div>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-2 bg-blue-300/60 animate-pulse"
                style={{
                  left: `${30 + i * 15}%`,
                  top: `${20 + (i % 2) * 10}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              ></div>
            ))}
          </div>
        )
      default:
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-3 right-8 w-10 h-6 bg-gray-400/40 rounded-full animate-pulse"></div>
            <div
              className="absolute top-6 right-12 w-8 h-4 bg-gray-300/50 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-2 right-16 w-6 h-3 bg-gray-500/40 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        )
    }
  }

  const theme = getThemeColors()

  return (
    <div
      className={`weather-widget relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 cursor-pointer hover:scale-105 ${
        isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
      }`}
      style={{
        background: `${theme.background} !important`,
        minHeight: "128px",
      }}
      onClick={() => router.push("/weather")}
    >
      {renderBackgroundElements()}

      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-3xl font-light mb-1" style={{ color: `${theme.textColor} !important` }}>
              {currentWeather ? currentWeather.temperature : "--"}°
            </div>
            <div className="text-sm font-medium" style={{ color: `${theme.textColor} !important` }}>
              {currentWeather ? currentWeather.condition : ""}
            </div>
            <div className="text-xs" style={{ color: `${theme.accentColor} !important` }}>
              {currentWeather ? currentWeather.location : ""}
            </div>
          </div>
          <div className="transition-transform duration-300 hover:scale-110">{getWeatherIcon(currentWeather?.icon || "cloud")}</div>
        </div>

        <div
          className="flex justify-between items-center rounded-lg p-2 mb-2"
          style={{
            backgroundColor: `${theme.accentColor}20`,
          }}
        >
          {(currentWeather?.hourlyForecast || []).slice(0, 3).map((hour, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              {getWeatherIcon(hour.icon, "sm")}
              <div className="text-xs font-medium" style={{ color: `${theme.textColor} !important` }}>
                {hour.time}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-3 text-xs"
          style={{ color: `${theme.accentColor} !important` }}
        >
          <span>💧 {currentWeather ? currentWeather.humidity : "--"}%</span>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>{currentWeather ? currentWeather.windSpeed : "--"} km/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
