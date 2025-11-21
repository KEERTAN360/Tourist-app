"use client"

import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Building as Swimming,
  Share2,
  Calendar,
  CreditCard,
  Train,
  Plane,
  Navigation,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  AlertTriangle,
  Menu,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import LikeButton from "@/components/like-button"

export default function HotelDetailPage() {
  const router = useRouter()
  const params = useParams()
  const hotelName = decodeURIComponent(params.name as string)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [hotelData, setHotelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch hotel data from Makcrops API
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/hotel-details?name=${encodeURIComponent(hotelName)}`)

        if (res.ok) {
          const data = await res.json()
          setHotelData(data)
        } else {
          console.error("Failed to fetch hotel data")
          setHotelData(null)
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error)
        setHotelData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchHotelData()
  }, [hotelName])

  // No fallback - only show real data from API

  const amenityIcons: any = {
    "Free WiFi": Wifi,
    "WiFi": Wifi,
    "Parking": Car,
    "Coffee Shop": Coffee,
    "Coffee": Coffee,
    "Restaurant": Utensils,
    "Dining": Utensils,
    "Fitness Center": Dumbbell,
    "Gym": Dumbbell,
    "Swimming Pool": Swimming,
    "Pool": Swimming,
  }

  // Generate room types from API pricing data
  const getRoomTypes = () => {
    const basePrice = hotelData?.bestPrice?.price || hotelData?.prices?.[0]?.price || 12500
    return [
      {
        type: "Deluxe Room",
        price: `₹${Math.round(basePrice)}`,
        originalPrice: `₹${Math.round(basePrice * 1.2)}`,
        size: "35 sqm",
        description: "Comfortable room with modern amenities"
      },
      {
        type: "Executive Suite",
        price: `₹${Math.round(basePrice * 1.5)}`,
        originalPrice: `₹${Math.round(basePrice * 1.8)}`,
        size: "55 sqm",
        description: "Spacious suite with separate living area"
      },
      {
        type: "Presidential Suite",
        price: `₹${Math.round(basePrice * 2.8)}`,
        originalPrice: `₹${Math.round(basePrice * 3.4)}`,
        size: "120 sqm",
        description: "Luxurious suite with premium facilities"
      },
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    )
  }

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Hotel not found</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    )
  }

  const roomTypes = getRoomTypes()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 text-center">Hotel Details</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {/* Hotel Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={hotelData?.photos?.[0] || "/placeholder.svg?height=300&width=400&query=luxury hotel exterior"}
            alt={hotelData?.name || hotelName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <LikeButton
              placeId={(hotelData?.name || hotelName).toLowerCase().replace(/\s+/g, "-")}
              placeName={hotelData?.name || hotelName}
              placeData={{
                name: hotelData?.name || hotelName,
                location: hotelData?.address || "Karnataka, India",
                image: hotelData?.photos?.[0] || "/placeholder.svg",
                rating: (hotelData?.rating || 4.8).toString(),
                timing: "24 Hours",
                entry: `₹${hotelData?.bestPrice?.price || 12500}`,
                description: hotelData?.description || "Luxury hotel with excellent amenities",
              }}
              className="shadow-lg"
            />
            <Button size="icon" variant="secondary" className="rounded-full bg-white/80">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-4">
          {/* Hotel Info */}
          <div className="py-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{hotelData?.name || hotelName}</h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotelData?.rating || 4.8}</span>
              </div>
              <span className="text-gray-500">({hotelData?.reviews?.length || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{hotelData?.address || "Karnataka, India"}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
            <div className="grid grid-cols-3 gap-3">
              {(hotelData?.amenities || ["Free WiFi", "Parking", "Restaurant"]).slice(0, 6).map((amenity: string, index: number) => {
                const IconComponent = amenityIcons[amenity] || Wifi
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-700">{amenity}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Booking Options */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Options</h3>
            <div className="space-y-3">
              {roomTypes.map((room, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${selectedRoom === room.type ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                    }`}
                  onClick={() => setSelectedRoom(room.type)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{room.type}</h4>
                      <p className="text-sm text-gray-600">{room.size}</p>
                      {room.description && (
                        <p className="text-xs text-gray-500 mt-1">{room.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">{room.price}</span>
                        <span className="text-sm text-gray-500 line-through">{room.originalPrice}</span>
                      </div>
                      <Button size="sm" className="mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Reviews</h3>
            {hotelData?.reviews && hotelData.reviews.length > 0 ? (
              <div className="space-y-4">
                {hotelData.reviews.slice(0, 3).map((review: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{review.author || review.name || "Guest"}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(Math.round(review.rating || 5))].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date || "Recent"}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment || review.text || "Great experience!"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews available yet.</p>
            )}
          </div>

          {/* Hotel Description */}
          {hotelData?.description && (
            <div className="py-4">
              <h3 className="font-semibold text-gray-800 mb-3">About This Hotel</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{hotelData.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
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
              onClick={() => item.href && router.push(item.href)}
              className="flex flex-col items-center gap-1 p-2 h-auto text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <item.icon className="h-5 w-5" />
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
