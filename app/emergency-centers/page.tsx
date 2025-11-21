"use client"

import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  Star,
  AlertTriangle,
  Home,
  CreditCard,
  FileText,
  Hospital,
  Shield,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface EmergencyCenter {
  id: string
  name: string
  type: "hospital" | "police" | "fire" | "tourist"
  address: string
  distance: string
  phone: string
  rating: number
  isOpen: boolean
  services: string[]
  coordinates: { lat: number; lng: number }
}

export default function EmergencyCentersPage() {
  const router = useRouter()
  const [centers, setCenters] = useState<EmergencyCenter[]>([])
  const [filter, setFilter] = useState<"all" | "hospital" | "police" | "fire" | "tourist">("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Location error:", error)
        },
      )
    }

    // Mock emergency centers data
    const mockCenters: EmergencyCenter[] = [
      {
        id: "1",
        name: "Mysore District Hospital",
        type: "hospital",
        address: "Sayyaji Rao Road, Mysore, Karnataka 570001",
        distance: "2.3 km",
        phone: "0821-2423912",
        rating: 4.2,
        isOpen: true,
        services: ["Emergency Care", "Trauma Center", "ICU", "Ambulance"],
        coordinates: { lat: 12.3051, lng: 76.6553 },
      },
      {
        id: "2",
        name: "Mysore City Police Station",
        type: "police",
        address: "Devaraja Mohalla, Mysore, Karnataka 570001",
        distance: "1.8 km",
        phone: "0821-2444444",
        rating: 4.0,
        isOpen: true,
        services: ["Emergency Response", "Tourist Help", "FIR Registration", "Traffic Control"],
        coordinates: { lat: 12.3048, lng: 76.6542 },
      },
      {
        id: "3",
        name: "Karnataka Fire & Emergency Services",
        type: "fire",
        address: "Chamaraja Circle, Mysore, Karnataka 570024",
        distance: "3.1 km",
        phone: "0821-2425555",
        rating: 4.5,
        isOpen: true,
        services: ["Fire Fighting", "Rescue Operations", "Emergency Response", "Disaster Management"],
        coordinates: { lat: 12.3015, lng: 76.6512 },
      },
      {
        id: "4",
        name: "Karnataka Tourism Helpline Center",
        type: "tourist",
        address: "Old Exhibition Building, Mysore, Karnataka 570001",
        distance: "2.7 km",
        phone: "1363",
        rating: 4.3,
        isOpen: true,
        services: ["Tourist Assistance", "Travel Information", "Emergency Support", "Complaint Resolution"],
        coordinates: { lat: 12.3025, lng: 76.6535 },
      },
      {
        id: "5",
        name: "Apollo BGS Hospital",
        type: "hospital",
        address: "Adichunchanagiri Road, Kuvempunagar, Mysore 570023",
        distance: "4.2 km",
        phone: "0821-2566666",
        rating: 4.6,
        isOpen: true,
        services: ["Multi-specialty", "Emergency Care", "Cardiac Care", "Neurology"],
        coordinates: { lat: 12.2958, lng: 76.6394 },
      },
      {
        id: "6",
        name: "Coorg Police Station",
        type: "police",
        address: "General Thimayya Road, Madikeri, Coorg 571201",
        distance: "87.5 km",
        phone: "08272-228100",
        rating: 3.8,
        isOpen: true,
        services: ["Hill Station Security", "Tourist Safety", "Emergency Response", "Traffic Management"],
        coordinates: { lat: 12.4244, lng: 75.7382 },
      },
    ]

    setCenters(mockCenters)
  }, [])

  const filteredCenters = centers.filter((center) => filter === "all" || center.type === filter)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return Hospital
      case "police":
        return Shield
      case "fire":
        return Flame
      case "tourist":
        return MapPin
      default:
        return AlertTriangle
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-red-500"
      case "police":
        return "bg-blue-500"
      case "fire":
        return "bg-orange-500"
      case "tourist":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const navigateToCenter = (center: EmergencyCenter) => {
    const url = `https://maps.google.com/?q=${center.coordinates.lat},${center.coordinates.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground text-center">Emergency Centers</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Location Status */}
      <div className="px-4 mb-4">
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-foreground">
                {userLocation ? "Location Found" : "Getting Location..."}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{centers.length} centers nearby</div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Centers", icon: AlertTriangle },
            { key: "hospital", label: "Hospitals", icon: Hospital },
            { key: "police", label: "Police", icon: Shield },
            { key: "fire", label: "Fire Dept", icon: Flame },
            { key: "tourist", label: "Tourist Help", icon: MapPin },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "outline"}
              onClick={() => setFilter(filterOption.key as any)}
              className={`flex-shrink-0 rounded-full transition-all duration-300 flex items-center gap-2 ${
                filter === filterOption.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-card-foreground border-border hover:bg-muted"
              }`}
            >
              <filterOption.icon className="h-4 w-4" />
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Centers List */}
      <div className="flex-1 px-4 pb-20">
        <div className="space-y-4">
          {filteredCenters.map((center) => {
            const TypeIcon = getTypeIcon(center.type)
            return (
              <Card
                key={center.id}
                className="placard-3d overflow-hidden bg-card border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(center.type)} text-white`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{center.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">{center.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">• {center.distance}</span>
                          <div
                            className={`w-2 h-2 rounded-full ${center.isOpen ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span className="text-xs text-muted-foreground">{center.isOpen ? "Open" : "Closed"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{center.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{center.phone}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((service, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(`tel:${center.phone}`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigateToCenter(center)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Centers Found</h3>
            <p className="text-muted-foreground">No emergency centers match your current filter.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", href: "/pay" },
            { icon: FileText, label: "Documents", href: "/documents" },
            { icon: AlertTriangle, label: "SOS", href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-1 p-2 h-auto text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-muted-foreground">Made in Bangalore, India</p>
        </div>
      </div>
    </div>
  )
}
