"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, MapPin, AlertTriangle, Phone, Flag, X, Navigation, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FloatingSafetyMonitorProps {
  isActive?: boolean
  onClose?: () => void
}

interface LocationData {
  name: string
  safetyScore: number
  safeZoneRadius: number
  riskLevel: "low" | "moderate" | "high"
  nearbyIncidents: number
  lastUpdated: string
}

export default function FloatingSafetyMonitor({ isActive = true, onClose }: FloatingSafetyMonitorProps) {
  const [isOpen, setIsOpen] = useState(true) // Always open when component is rendered
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [movementStatus, setMovementStatus] = useState<"stationary" | "walking" | "running" | "distress">("stationary")
  
  // Drag and drop state
  const [position, setPosition] = useState({ x: 16, y: 16 }) // Default top-right position
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)

  // Mock location data based on coordinates
  const getLocationData = (lat: number, lng: number): LocationData => {
    // Karnataka tourist spots with safety data
    const locations = [
      {
        name: "Mysore Palace Area",
        center: [12.3052, 76.6551],
        safetyScore: 9.2,
        safeZoneRadius: 2.5,
        riskLevel: "low" as const,
        nearbyIncidents: 0,
      },
      {
        name: "Hampi Historical Site",
        center: [15.335, 76.46],
        safetyScore: 8.7,
        safeZoneRadius: 3.0,
        riskLevel: "low" as const,
        nearbyIncidents: 1,
      },
      {
        name: "Coorg Hill Station",
        center: [12.3375, 75.8069],
        safetyScore: 8.9,
        safeZoneRadius: 5.0,
        riskLevel: "low" as const,
        nearbyIncidents: 0,
      },
      {
        name: "Gokarna Beach",
        center: [14.5492, 74.32],
        safetyScore: 7.8,
        safeZoneRadius: 1.8,
        riskLevel: "moderate" as const,
        nearbyIncidents: 2,
      },
      {
        name: "Bangalore City Center",
        center: [12.9716, 77.5946],
        safetyScore: 8.1,
        safeZoneRadius: 4.0,
        riskLevel: "moderate" as const,
        nearbyIncidents: 3,
      },
      {
        name: "Chikmagalur Coffee Estates",
        center: [13.3161, 75.772],
        safetyScore: 9.0,
        safeZoneRadius: 6.0,
        riskLevel: "low" as const,
        nearbyIncidents: 0,
      },
      {
        name: "Remote Trekking Area",
        center: [13.5, 75.0],
        safetyScore: 6.5,
        safeZoneRadius: 0.5,
        riskLevel: "high" as const,
        nearbyIncidents: 5,
      },
    ]

    // Find closest location
    let closestLocation = locations[0]
    let minDistance = calculateDistance(lat, lng, closestLocation.center[0], closestLocation.center[1])

    locations.forEach((location) => {
      const distance = calculateDistance(lat, lng, location.center[0], location.center[1])
      if (distance < minDistance) {
        minDistance = distance
        closestLocation = location
      }
    })

    return {
      ...closestLocation,
      lastUpdated: new Date().toLocaleTimeString(),
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserCoords(coords)
          const locationData = getLocationData(coords.lat, coords.lng)
          setCurrentLocation(locationData)
          setIsLoading(false)
        },
        (error) => {
          console.error("Location error:", error)
          // Fallback to Bangalore coordinates
          const fallbackCoords = { lat: 12.9716, lng: 77.5946 }
          setUserCoords(fallbackCoords)
          setCurrentLocation(getLocationData(fallbackCoords.lat, fallbackCoords.lng))
          setIsLoading(false)
        },
      )
    }
  }

  const reportIncident = () => {
    alert("Incident report submitted. Local authorities have been notified.")
    if (currentLocation) {
      setCurrentLocation({
        ...currentLocation,
        nearbyIncidents: currentLocation.nearbyIncidents + 1,
        lastUpdated: new Date().toLocaleTimeString(),
      })
    }
  }

  const getSafetyColor = (score: number) => {
    if (score >= 8.5) return "text-green-600"
    if (score >= 7.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getSafetyBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  useEffect(() => {
    if (isOpen && !currentLocation) {
      getCurrentLocation()
    }
  }, [isOpen])

  // Track activity for movement status
  useEffect(() => {
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      setLastActivity(Date.now())
      setMovementStatus("walking")

      setTimeout(() => {
        setMovementStatus("stationary")
      }, 5000)
    }

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [])

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return // Don't drag when panel is open
    
    setIsDragging(true)
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Keep button within viewport bounds
    const maxX = window.innerWidth - 56 // Button width (40px) + padding
    const maxY = window.innerHeight - 56 // Button height (40px) + padding

    setPosition({
      x: Math.max(8, Math.min(newX, maxX)),
      y: Math.max(8, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return
    
    setIsDragging(true)
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const touch = e.touches[0]
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const newX = touch.clientX - dragOffset.x
    const newY = touch.clientY - dragOffset.y

    const maxX = window.innerWidth - 56
    const maxY = window.innerHeight - 56

    setPosition({
      x: Math.max(8, Math.min(newX, maxX)),
      y: Math.max(8, Math.min(newY, maxY))
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragOffset])

  if (!isActive) return null

  return (
    <Card
      className="w-full bg-white/95 backdrop-blur-md border-0 overflow-hidden"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
      }}
    >
            <div
              className="p-4 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <h3 className="font-semibold">Safety Monitor</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Getting your location...</p>
                </div>
              ) : currentLocation ? (
                <>
                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{currentLocation.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">Last updated: {currentLocation.lastUpdated}</p>
                  </div>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      background: "linear-gradient(135deg, #fefefe 0%, #f9fafb 100%)",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Safety Score</span>
                      <Badge className={getSafetyBadgeColor(currentLocation.riskLevel)}>
                        {currentLocation.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div
                          className="h-3 bg-gray-200 rounded-full overflow-hidden"
                          style={{
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(currentLocation.safetyScore / 10) * 100}%`,
                              background:
                                currentLocation.safetyScore >= 8.5
                                  ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                                  : currentLocation.safetyScore >= 7.0
                                    ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
                                    : "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${getSafetyColor(currentLocation.safetyScore)}`}>
                        {currentLocation.safetyScore}/10
                      </span>
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Navigation className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Safe Zone Radius</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">{currentLocation.safeZoneRadius} km</p>
                    <p className="text-xs text-green-600">You're within the monitored safe area</p>
                  </div>

                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      background:
                        currentLocation.nearbyIncidents > 2
                          ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
                          : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle
                        className={`h-4 w-4 ${currentLocation.nearbyIncidents > 2 ? "text-red-600" : "text-blue-600"}`}
                      />
                      <span className="text-sm font-medium text-gray-700">Recent Incidents</span>
                    </div>
                    <p
                      className={`text-lg font-bold ${currentLocation.nearbyIncidents > 2 ? "text-red-700" : "text-blue-700"}`}
                    >
                      {currentLocation.nearbyIncidents} in last 24h
                    </p>
                  </div>

                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Movement Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse`}
                        style={{
                          background:
                            movementStatus === "stationary"
                              ? "linear-gradient(45deg, #10b981, #059669)"
                              : "linear-gradient(45deg, #f59e0b, #d97706)",
                          boxShadow: "0 0 6px rgba(0, 0, 0, 0.3)",
                        }}
                      ></div>
                      <span className="text-sm font-medium text-yellow-700 capitalize">{movementStatus}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={reportIncident}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                      style={{
                        boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report Incident
                    </Button>

                    <Button
                      onClick={() => window.open("tel:112")}
                      variant="outline"
                      className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      style={{
                        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Emergency Call
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Unable to get location data</p>
                  <Button onClick={getCurrentLocation} size="sm" className="mt-2">
                    Retry
                  </Button>
                </div>
              )}
            </div>
    </Card>
  )
}
