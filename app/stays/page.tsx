"use client"

import {
  Search,
  Menu,
  Home,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  Star,
  SlidersHorizontal,
  Car,
  Train,
  IndianRupee,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function StaysPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("price")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const hotels = [
    {
      id: 1,
      name: "The Leela Palace Bangalore",
      image: "/luxury-hotel-exterior.jpg",
      price: 12500,
      rating: 4.8,
      reviews: 2847,
      location: "UB City Mall, Bangalore",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
      avgTravelCost: 180,
    },
    {
      id: 2,
      name: "ITC Gardenia",
      image: "/business-hotel-lobby.jpg",
      price: 8900,
      rating: 4.6,
      reviews: 1923,
      location: "Residency Road, Bangalore",
      amenities: ["WiFi", "Gym", "Restaurant", "Bar"],
      avgTravelCost: 220,
    },
    {
      id: 3,
      name: "Taj West End",
      image: "/heritage-hotel-garden.jpg",
      price: 15200,
      rating: 4.9,
      reviews: 3156,
      location: "Race Course Road, Bangalore",
      amenities: ["WiFi", "Pool", "Spa", "Garden", "Restaurant"],
      avgTravelCost: 160,
    },
    {
      id: 4,
      name: "The Oberoi Bangalore",
      image: "/modern-hotel-room.jpg",
      price: 11800,
      rating: 4.7,
      reviews: 2234,
      location: "MG Road, Bangalore",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
      avgTravelCost: 200,
    },
  ]

  const travelOptions = [
    { type: "Auto", icon: Car, price: 150, time: "25 min", color: "text-green-600" },
    { type: "Taxi", icon: Car, price: 280, time: "20 min", color: "text-blue-600" },
    { type: "Metro", icon: Train, price: 45, time: "35 min", color: "text-purple-600" },
    { type: "Train", icon: Train, price: 25, time: "45 min", color: "text-orange-600" },
  ]

  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price
    if (sortBy === "rating") return b.rating - a.rating
    return a.name.localeCompare(b.name)
  })

  const handleBookNow = (hotelId: number) => {
    setExpandedCard(expandedCard === hotelId ? null : hotelId)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-3 p-4 pt-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 text-center">Stay Options</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search hotels & stays"
            className="pl-10 bg-gray-100 border-0 rounded-full h-12 text-center"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="rounded-full">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex gap-2 overflow-x-auto">
            {["price", "rating", "location"].map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
                className="rounded-full whitespace-nowrap"
              >
                Sort by {sort}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        {/* Hotel Cards */}
        <div className="space-y-4">
          {sortedHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
            >
              <div className="relative">
                <img
                  src={hotel.image || "/placeholder.svg?height=200&width=400&query=luxury hotel room"}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{hotel.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-gray-600" />
                      <span className="text-lg font-bold text-gray-800">{hotel.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>

                <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">Avg. Travel Cost: ₹{hotel.avgTravelCost}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity) => (
                    <span key={amenity} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleBookNow(hotel.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                >
                  {expandedCard === hotel.id ? "Hide Options" : "Book Now"}
                </Button>

                {expandedCard === hotel.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Travel Options</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {travelOptions.map((option) => (
                        <Card
                          key={option.type}
                          className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <option.icon className={`h-5 w-5 mx-auto mb-1 ${option.color}`} />
                          <p className="text-xs font-medium text-gray-800">{option.type}</p>
                          <p className="text-xs text-gray-600">₹{option.price}</p>
                          <p className="text-xs text-gray-500">{option.time}</p>
                        </Card>
                      ))}
                    </div>
                    <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white rounded-full">
                      Confirm Booking
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
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
              <span className="text-xs">{item.label}</span>
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
