"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, Clock, Activity, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SafetyMonitorProps {
  isActive?: boolean
  onEmergencyDetected?: () => void
}

export default function SafetyMonitor({ isActive = true, onEmergencyDetected }: SafetyMonitorProps) {
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [inactivityWarning, setInactivityWarning] = useState(false)
  const [distressDetected, setDistressDetected] = useState(false)
  const [movementPattern, setMovementPattern] = useState<any[]>([])
  const [showInactivityAlert, setShowInactivityAlert] = useState(false)
  const [showDistressAlert, setShowDistressAlert] = useState(false)
  const [inactivityCountdown, setInactivityCountdown] = useState(0)

  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const distressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastLocationRef = useRef<{ lat: number; lng: number; timestamp: number } | null>(null)

  // Inactivity detection settings
  const INACTIVITY_WARNING_TIME = 30 * 60 * 1000 // 30 minutes
  const INACTIVITY_ALERT_TIME = 45 * 60 * 1000 // 45 minutes
  const DISTRESS_MOVEMENT_THRESHOLD = 5 // Number of rapid direction changes
  const DISTRESS_TIME_WINDOW = 2 * 60 * 1000 // 2 minutes

  useEffect(() => {
    if (!isActive) return

    // Track user activity
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      setLastActivity(Date.now())
      setInactivityWarning(false)
      setShowInactivityAlert(false)

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }

      startInactivityTimer()
    }

    const startInactivityTimer = () => {
      // Warning after 30 minutes
      inactivityTimeoutRef.current = setTimeout(() => {
        setInactivityWarning(true)

        // Alert after 45 minutes
        setTimeout(
          () => {
            setShowInactivityAlert(true)
            setInactivityCountdown(300) // 5 minutes countdown

            countdownIntervalRef.current = setInterval(() => {
              setInactivityCountdown((prev) => {
                if (prev <= 1) {
                  triggerInactivityEmergency()
                  return 0
                }
                return prev - 1
              })
            }, 1000)
          },
          15 * 60 * 1000,
        ) // Additional 15 minutes
      }, INACTIVITY_WARNING_TIME)
    }

    // Start monitoring location for distress detection
    const startLocationMonitoring = () => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: Date.now(),
            }

            if (lastLocationRef.current) {
              analyzeMovementPattern(lastLocationRef.current, currentLocation)
            }

            lastLocationRef.current = currentLocation
          },
          (error) => {
            console.error("Location monitoring error:", error)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
        )

        return () => {
          navigator.geolocation.clearWatch(watchId)
        }
      }
    }

    // Initialize activity tracking
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    startInactivityTimer()
    const cleanupLocation = startLocationMonitoring()

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      if (distressTimeoutRef.current) {
        clearTimeout(distressTimeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }

      if (cleanupLocation) {
        cleanupLocation()
      }
    }
  }, [isActive])

  const analyzeMovementPattern = (lastLocation: any, currentLocation: any) => {
    const distance = calculateDistance(lastLocation.lat, lastLocation.lng, currentLocation.lat, currentLocation.lng)

    const timeDiff = currentLocation.timestamp - lastLocation.timestamp
    const speed = distance / (timeDiff / 1000) // meters per second

    // Add to movement pattern
    const newMovement = {
      distance,
      speed,
      timestamp: currentLocation.timestamp,
      location: currentLocation,
    }

    setMovementPattern((prev) => {
      const updated = [...prev, newMovement].slice(-10) // Keep last 10 movements

      // Analyze for distress patterns
      if (updated.length >= 5) {
        const recentMovements = updated.slice(-5)
        const rapidChanges = detectRapidDirectionChanges(recentMovements)
        const highSpeedMovements = recentMovements.filter((m) => m.speed > 2).length // > 2 m/s (running speed)

        if (rapidChanges >= DISTRESS_MOVEMENT_THRESHOLD || highSpeedMovements >= 3) {
          triggerDistressDetection()
        }
      }

      return updated
    })
  }

  const detectRapidDirectionChanges = (movements: any[]) => {
    let changes = 0

    for (let i = 1; i < movements.length - 1; i++) {
      const prev = movements[i - 1]
      const curr = movements[i]
      const next = movements[i + 1]

      // Calculate bearing changes
      const bearing1 = calculateBearing(prev.location, curr.location)
      const bearing2 = calculateBearing(curr.location, next.location)
      const bearingChange = Math.abs(bearing2 - bearing1)

      // Significant direction change (> 90 degrees)
      if (bearingChange > 90 && bearingChange < 270) {
        changes++
      }
    }

    return changes
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const calculateBearing = (start: any, end: any) => {
    const startLat = (start.lat * Math.PI) / 180
    const startLng = (start.lng * Math.PI) / 180
    const endLat = (end.lat * Math.PI) / 180
    const endLng = (end.lng * Math.PI) / 180

    const dLng = endLng - startLng

    const y = Math.sin(dLng) * Math.cos(endLat)
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng)

    const bearing = Math.atan2(y, x)
    return ((bearing * 180) / Math.PI + 360) % 360
  }

  const triggerDistressDetection = () => {
    if (distressDetected) return // Prevent multiple triggers

    setDistressDetected(true)
    setShowDistressAlert(true)

    // Auto-resolve after 5 minutes if no action taken
    distressTimeoutRef.current = setTimeout(
      () => {
        setDistressDetected(false)
        setShowDistressAlert(false)
      },
      5 * 60 * 1000,
    )

    if (onEmergencyDetected) {
      onEmergencyDetected()
    }
  }

  const triggerInactivityEmergency = () => {
    if (onEmergencyDetected) {
      onEmergencyDetected()
    }

    // Send emergency alerts
    sendInactivityAlert()
  }

  const sendInactivityAlert = () => {
    const message = `🚨 INACTIVITY ALERT 🚨\n\nNo activity detected for over 45 minutes. This could indicate an emergency situation.\n\nLast activity: ${new Date(lastActivity).toLocaleString()}\n\nPlease check on my safety or contact emergency services if you cannot reach me.`

    if (navigator.share) {
      navigator.share({
        title: "Inactivity Emergency Alert",
        text: message,
      })
    } else {
      navigator.clipboard.writeText(message)
      alert("Emergency alert copied to clipboard! Please share with your emergency contacts.")
    }
  }

  const sendDistressAlert = () => {
    const message = `🚨 DISTRESS DETECTED 🚨\n\nUnusual movement patterns detected that may indicate distress or danger.\n\nTime: ${new Date().toLocaleString()}\n\nPlease check on my safety immediately or contact emergency services.`

    if (navigator.share) {
      navigator.share({
        title: "Distress Detection Alert",
        text: message,
      })
    } else {
      navigator.clipboard.writeText(message)
      alert("Distress alert copied to clipboard! Please share with your emergency contacts.")
    }
  }

  const dismissInactivityAlert = () => {
    setShowInactivityAlert(false)
    setInactivityWarning(false)
    setInactivityCountdown(0)

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Reset activity timer
    setLastActivity(Date.now())
  }

  const dismissDistressAlert = () => {
    setShowDistressAlert(false)
    setDistressDetected(false)

    if (distressTimeoutRef.current) {
      clearTimeout(distressTimeoutRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  if (!isActive) return null

  return (
    <>
      {/* Inactivity Warning */}
      {inactivityWarning && !showInactivityAlert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <Card className="p-4 bg-yellow-50 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Inactivity Detected</p>
                <p className="text-sm text-yellow-600">No activity for 30+ minutes. Stay safe!</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setInactivityWarning(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Inactivity Emergency Alert */}
      {showInactivityAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-red-50 border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-lg font-bold text-red-800 mb-2">Inactivity Emergency</h3>
              <p className="text-sm text-red-600 mb-4">
                No activity detected for over 45 minutes. Emergency services will be contacted automatically.
              </p>

              <div className="bg-red-100 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-red-700 mb-1">{formatTime(inactivityCountdown)}</div>
                <p className="text-xs text-red-600">Time until emergency alert</p>
              </div>

              <div className="space-y-2">
                <Button onClick={dismissInactivityAlert} className="w-full bg-green-500 hover:bg-green-600 text-white">
                  I'm Safe - Cancel Alert
                </Button>

                <Button
                  onClick={sendInactivityAlert}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Send Alert Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Distress Detection Alert */}
      {showDistressAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-orange-50 border-orange-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-lg font-bold text-orange-800 mb-2">Distress Detected</h3>
              <p className="text-sm text-orange-600 mb-4">
                Unusual movement patterns detected. This could indicate you're in distress or danger.
              </p>

              <div className="bg-orange-100 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-orange-800 mb-2">Detected Patterns:</h4>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• Rapid direction changes</li>
                  <li>• Unusual speed variations</li>
                  <li>• Erratic movement behavior</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button onClick={dismissDistressAlert} className="w-full bg-green-500 hover:bg-green-600 text-white">
                  I'm Safe - False Alarm
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={sendDistressAlert}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    Send Alert
                  </Button>

                  <Button onClick={() => window.open("tel:112")} className="bg-red-500 hover:bg-red-600 text-white">
                    <Phone className="h-4 w-4 mr-1" />
                    Call 112
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Safety Status Indicator */}
      {isActive && (
        <div className="fixed bottom-24 right-4 z-40">
          <div className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-border">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${inactivityWarning ? "bg-yellow-500" : distressDetected ? "bg-orange-500" : "bg-green-500"} animate-pulse`}
              ></div>
              <span className="text-xs text-muted-foreground">Safety Monitor</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
