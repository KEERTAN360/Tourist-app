"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MapPin, Calendar, Camera } from "lucide-react"

export default function TravelHistoryPage() {
  const router = useRouter()

  const travelLog = [
    {
      id: 1,
      place: "Mysore Palace",
      date: "December 15, 2023",
      duration: "Full Day",
      rating: 5,
      photos: 12,
      notes: "Amazing architecture and rich history. The light show in the evening was spectacular!",
      image: "/mysore-palace-beautiful-architecture.jpg",
    },
    {
      id: 2,
      place: "Coorg Hills",
      date: "November 22, 2023",
      duration: "3 Days",
      rating: 4,
      photos: 28,
      notes: "Beautiful coffee plantations and misty hills. Perfect for nature lovers.",
      image: "/coorg-hills-green-landscape.jpg",
    },
    {
      id: 3,
      place: "Hampi Ruins",
      date: "October 8, 2023",
      duration: "2 Days",
      rating: 5,
      photos: 35,
      notes: "Incredible ancient ruins and boulder landscapes. A photographer's paradise!",
      image: "/hampi-ancient-ruins-historical.jpg",
    },
    {
      id: 4,
      place: "Gokarna Beach",
      date: "September 14, 2023",
      duration: "Weekend",
      rating: 4,
      photos: 18,
      notes: "Peaceful beaches and beautiful sunsets. Great for relaxation.",
      image: "/gokarna-beach-sunset-scenic.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-4 p-4 pt-6 bg-white shadow-sm border-b border-gray-100">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">Travel Log & History</h1>
      </div>

      <div className="p-4 pb-20 space-y-4">
        {travelLog.map((trip) => (
          <Card
            key={trip.id}
            className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <img
                src={trip.image || "/placeholder.svg"}
                alt={trip.place}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{trip.place}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < trip.rating ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>{trip.photos} photos</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{trip.notes}</p>
              </div>
            </div>
          </Card>
        ))}

        {travelLog.length === 0 && (
          <Card className="p-8 text-center rounded-2xl border border-gray-200 shadow-sm bg-white">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Travel History Yet</h3>
            <p className="text-gray-500">Start exploring Karnataka to build your travel log!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
