"use client"

import { MapPin, Navigation, Clock, Star, ArrowRight, Smartphone, CreditCard, Menu } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function TravelPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const mode = searchParams.get("mode") || "auto"
  const destination = searchParams.get("destination") || "ITC Gardenia"
  const price = searchParams.get("price") || "₹180"
  const time = searchParams.get("time") || "25 min"
  const distance = searchParams.get("distance") || "8.5 km"

  const bookingApps = [
    {
      name: "Ola",
      rating: 4.3,
      eta: "3 min",
      price: price,
      discount: "20% OFF",
      logo: "/ola-logo.jpg",
      recommended: true,
    },
    {
      name: "Uber",
      rating: 4.5,
      eta: "5 min",
      price: `₹${Number.parseInt(price.replace("₹", "")) + 20}`,
      discount: "First ride free",
      logo: "/generic-transportation-network-logo.png",
      recommended: false,
    },
    {
      name: "Rapido",
      rating: 4.1,
      eta: "2 min",
      price: `₹${Number.parseInt(price.replace("₹", "")) - 30}`,
      discount: "₹50 OFF",
      logo: "/rapido-logo.jpg",
      recommended: false,
    },
  ]

  const handleConfirmBooking = (appName: string, appPrice: string) => {
    router.push(
      `/pay?type=travel&app=${appName}&amount=${appPrice}&destination=${encodeURIComponent(destination)}&mode=${mode}`,
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Book {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Trip Details */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Trip to {destination}</h3>
              <p className="text-sm text-gray-600">
                {distance} • {time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Current Location</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{destination}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Placeholder */}
      <div className="mx-4 mb-4">
        <div className="h-48 bg-gray-100 rounded-lg relative overflow-hidden">
          <img
            src="/map-with-route-from-current-location-to-hotel.jpg"
            alt="Route Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
            <div className="bg-white/90 px-3 py-2 rounded-lg">
              <p className="text-sm font-medium text-gray-800">Route to {destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Apps to Book */}
      <div className="px-4 flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Best Apps to Book</h2>
        <div className="space-y-3">
          {bookingApps.map((app, index) => (
            <Card key={index} className={`p-4 ${app.recommended ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
              {app.recommended && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full w-fit mb-2">Recommended</div>
              )}
              <div className="flex items-center gap-3">
                <img src={app.logo || "/placeholder.svg"} alt={`${app.name} logo`} className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{app.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{app.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {app.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span className="font-medium text-green-600">{app.price}</span>
                    </div>
                  </div>
                  {app.discount && (
                    <div className="mt-1">
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">{app.discount}</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleConfirmBooking(app.name, app.price)}
                  className={app.recommended ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          {[
            { icon: MapPin, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", href: "/pay" },
            { icon: Smartphone, label: "Documents", href: "/documents" },
            { icon: Navigation, label: "SOS", href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.href && router.push(item.href)}
              className="flex flex-col items-center gap-1 p-2 h-auto text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              <span className="text-xs text-gray-600">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-gray-400">Made in Bangalore, India</p>
        </div>
      </div>
    </div>
  )
}

export default function TravelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TravelPageContent />
    </Suspense>
  )
}
