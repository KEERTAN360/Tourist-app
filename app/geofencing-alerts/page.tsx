"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, MapPin, Shield, ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function GeofencingAlertsPage() {
  const router = useRouter()
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyRisks, setNearbyRisks] = useState<any[]>([])
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)

  const riskyAreas = [
    {
      id: 1,
      name: "Jog Falls Trek Path",
      location: { lat: 14.2291, lng: 74.7553 },
      radius: 2000, // 2km radius
      riskLevel: "High",
      riskColor: "bg-red-500",
      risks: [
        "Slippery rocks during monsoon season",
        "Flash flood risk near waterfall base",
        "Limited mobile network coverage",
        "Steep and unstable terrain",
      ],
      safetyTips: [
        "Wear proper trekking shoes with good grip",
        "Avoid visiting during heavy rain",
        "Inform someone about your trek plans",
        "Carry emergency whistle and first aid kit",
        "Stay on marked trails only",
      ],
      emergencyContacts: [
        { name: "Local Forest Office", number: "+91-8386-244-123" },
        { name: "Tourist Helpline", number: "1363" },
        { name: "Emergency Services", number: "112" },
      ],
    },
    {
      id: 2,
      name: "Coorg Night Safari Area",
      location: { lat: 12.3375, lng: 75.8069 },
      radius: 5000, // 5km radius
      riskLevel: "Medium",
      riskColor: "bg-orange-500",
      risks: [
        "Wild elephant encounters reported",
        "Poor visibility after sunset",
        "Limited street lighting",
        "Isolated forest roads",
      ],
      safetyTips: [
        "Travel in groups, never alone",
        "Use vehicle headlights and carry flashlight",
        "Make noise to alert animals of your presence",
        "Keep vehicle doors locked",
        "Avoid stopping in isolated areas",
      ],
      emergencyContacts: [
        { name: "Forest Department", number: "+91-8272-228-100" },
        { name: "Police Control Room", number: "100" },
        { name: "Wildlife Emergency", number: "+91-8272-228-456" },
      ],
    },
    {
      id: 3,
      name: "Hampi Cliff Areas",
      location: { lat: 15.335, lng: 76.46 },
      radius: 1500, // 1.5km radius
      riskLevel: "High",
      riskColor: "bg-red-500",
      risks: [
        "Theft reports in isolated areas",
        "Unstable cliff edges",
        "Limited police patrolling",
        "Tourist targeting by local gangs",
      ],
      safetyTips: [
        "Visit during daylight hours only",
        "Keep valuables secured and hidden",
        "Travel with registered tour guides",
        "Stay in well-populated areas",
        "Keep emergency contacts handy",
      ],
      emergencyContacts: [
        { name: "Tourist Police", number: "+91-8533-241-339" },
        { name: "Hampi Police Station", number: "+91-8533-241-238" },
        { name: "Emergency Helpline", number: "112" },
      ],
    },
  ]

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocationEnabled(true)
          checkNearbyRisks(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Location access denied:", error)
          setIsLocationEnabled(false)
        },
      )
    }
  }, [])

  const checkNearbyRisks = (lat: number, lng: number) => {
    const nearby = riskyAreas.filter((area) => {
      const distance = calculateDistance(lat, lng, area.location.lat, area.location.lng)
      return distance <= area.radius
    })
    setNearbyRisks(nearby)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const RiskAreaCard = ({ area }: { area: any }) => (
    <Card className="p-6 mb-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${area.riskColor} text-white`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{area.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${area.riskColor}`}>
              {area.riskLevel} Risk
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Potential Risks:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {area.risks.map((risk: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Safety Tips:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {area.safetyTips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Emergency Contacts:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {area.emergencyContacts.map((contact: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-background rounded-lg p-2 border">
                    <span className="text-sm font-medium">{contact.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${contact.number}`)}
                      className="text-xs"
                    >
                      {contact.number}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Geofencing Alerts</h1>
          <p className="text-sm text-muted-foreground">Safety warnings for risky areas</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Status */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isLocationEnabled ? "bg-green-500" : "bg-red-500"} text-white`}>
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Location Services</p>
              <p className="text-sm text-muted-foreground">
                {isLocationEnabled ? "Active - Monitoring nearby risks" : "Disabled - Enable for real-time alerts"}
              </p>
            </div>
          </div>
        </Card>

        {/* Current Alerts */}
        {nearbyRisks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ⚠️ ACTIVE ALERTS - You are near risky areas!
            </h2>
            {nearbyRisks.map((area) => (
              <RiskAreaCard key={area.id} area={area} />
            ))}
          </div>
        )}

        {/* All Risk Areas */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Known Risk Areas in Karnataka</h2>
          {riskyAreas.map((area) => (
            <RiskAreaCard key={area.id} area={area} />
          ))}
        </div>

        {/* General Safety Guidelines */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            General Travel Safety Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Before You Travel:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Share your itinerary with family/friends</li>
                <li>• Check weather conditions</li>
                <li>• Carry emergency supplies</li>
                <li>• Ensure phone is fully charged</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">During Your Visit:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Stay on marked paths</li>
                <li>• Travel in groups when possible</li>
                <li>• Keep emergency contacts handy</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
