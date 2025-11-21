"use client"

import {
  Search,
  Menu,
  Home,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  Navigation,
  Zap,
  Users,
  Clock,
  Star,
  Filter,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ExplorePage() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("All")

  const filters = ["All", "Popular", "Nearby", "Events", "Nature", "Heritage"]

  const heatmapData = [
    { name: "Mysore Palace", visitors: 2500, rating: 4.8, category: "Heritage", lat: 12.3051, lng: 76.6551 },
    { name: "Coorg Coffee Estates", visitors: 1800, rating: 4.9, category: "Nature", lat: 12.3375, lng: 75.8069 },
    { name: "Hampi Ruins", visitors: 2200, rating: 4.7, category: "Heritage", lat: 15.335, lng: 76.46 },
    { name: "Gokarna Beach", visitors: 1600, rating: 4.6, category: "Nature", lat: 14.5492, lng: 74.32 },
    { name: "Bangalore Palace", visitors: 1400, rating: 4.5, category: "Heritage", lat: 12.9988, lng: 77.5928 },
    { name: "Nandi Hills", visitors: 1900, rating: 4.7, category: "Nature", lat: 13.3703, lng: 77.6838 },
  ]

  const getHeatIntensity = (visitors: number) => {
    if (visitors > 2000) return "bg-red-500"
    if (visitors > 1500) return "bg-orange-500"
    return "bg-yellow-500"
  }

  const filteredData =
    selectedFilter === "All"
      ? heatmapData
      : heatmapData.filter(
          (item) => item.category === selectedFilter || (selectedFilter === "Popular" && item.visitors > 2000),
        )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-3 p-4 pt-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 text-center">Explore Heatmap</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search locations on map"
            className="pl-10 bg-gray-100 border-0 rounded-full h-12 text-center"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedFilter === filter ? "bg-blue-500 text-white shadow-lg" : "hover:bg-blue-50"
              }`}
            >
              <Filter className="h-3 w-3 mr-1" />
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        {/* Interactive Heatmap */}
        <Card className="rounded-3xl overflow-hidden shadow-lg mb-6 h-80 relative bg-gradient-to-br from-blue-50 to-green-50">
          <div className="w-full h-full relative">
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Heatmap Points */}
            {filteredData.map((location, index) => (
              <div
                key={location.name}
                className={`absolute w-6 h-6 ${getHeatIntensity(location.visitors)} rounded-full opacity-70 animate-pulse cursor-pointer hover:scale-150 transition-transform`}
                style={{
                  left: `${20 + index * 12}%`,
                  top: `${15 + index * 10}%`,
                }}
                title={`${location.name} - ${location.visitors} visitors`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                  {location.name}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
              <h4 className="text-xs font-semibold mb-2">Visitor Density</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs">High (2000+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs">Medium (1500+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">Low (&lt;1500)</span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-lg font-bold text-blue-800">12.5K</p>
            <p className="text-xs text-blue-600">Active Visitors</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-lg font-bold text-green-800">248</p>
            <p className="text-xs text-green-600">Hot Spots</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-lg font-bold text-purple-800">Live</p>
            <p className="text-xs text-purple-600">Real-time</p>
          </Card>
        </div>

        {/* Popular Locations List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trending Now</h2>
          <div className="space-y-3">
            {filteredData.slice(0, 4).map((location, index) => (
              <Card key={location.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${getHeatIntensity(location.visitors)} rounded-full`}></div>
                    <div>
                      <h3 className="font-medium text-gray-800">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.visitors} visitors today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
