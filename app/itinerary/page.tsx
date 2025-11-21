"use client"

import {
  Search,
  Menu,
  Calendar,
  MapPin,
  Clock,
  Plane,
  Train,
  Car,
  Hotel,
  UtensilsCrossed,
  Camera,
  Star,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Navigation,
  Ticket,
  Users,
  Phone,
  Globe,
  ArrowRight,
  ArrowDown,
  Map,
  Compass,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import BottomNavigation from "@/components/bottom-navigation"

interface ItineraryItem {
  id: string
  type: "transport" | "accommodation" | "activity" | "meal" | "sightseeing"
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  date: string
  status: "completed" | "upcoming" | "in-progress" | "cancelled"
  cost: number
  bookingRef?: string
  tickets?: Ticket[]
  coordinates?: { lat: number; lng: number }
  duration?: string
  rating?: number
  notes?: string
}

interface Ticket {
  id: string
  type: "flight" | "train" | "bus" | "entry" | "tour"
  title: string
  bookingRef: string
  qrCode?: string
  seat?: string
  gate?: string
  terminal?: string
  status: "confirmed" | "pending" | "cancelled"
  price: number
  validUntil: string
}

export default function ItineraryPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<"timeline" | "map">("timeline")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null)

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      id: "1",
      type: "transport",
      title: "Flight to Bangalore",
      description: "IndiGo 6E-1234",
      location: "Kempegowda International Airport",
      startTime: "08:00",
      endTime: "10:30",
      date: "2024-01-15",
      status: "completed",
      cost: 8500,
      bookingRef: "IND123456",
      coordinates: { lat: 13.1986, lng: 77.7063 },
      duration: "2h 30m",
      tickets: [
        {
          id: "t1",
          type: "flight",
          title: "IndiGo 6E-1234",
          bookingRef: "IND123456",
          seat: "12A",
          gate: "A12",
          terminal: "T1",
          status: "confirmed",
          price: 8500,
          validUntil: "2024-01-15T10:30:00Z"
        }
      ]
    },
    {
      id: "2",
      type: "accommodation",
      title: "Heritage Palace Resort",
      description: "Luxury heritage hotel in Mysore",
      location: "Mysore Palace Road",
      startTime: "14:00",
      endTime: "11:00",
      date: "2024-01-15",
      status: "upcoming",
      cost: 8500,
      bookingRef: "HPR789012",
      coordinates: { lat: 12.3052, lng: 76.6551 },
      duration: "2 nights",
      rating: 4.8,
      tickets: [
        {
          id: "t2",
          type: "entry",
          title: "Hotel Booking",
          bookingRef: "HPR789012",
          status: "confirmed",
          price: 8500,
          validUntil: "2024-01-17T11:00:00Z"
        }
      ]
    },
    {
      id: "3",
      type: "sightseeing",
      title: "Mysore Palace Visit",
      description: "Royal palace with guided tour",
      location: "Mysore Palace",
      startTime: "16:00",
      endTime: "18:00",
      date: "2024-01-15",
      status: "upcoming",
      cost: 140,
      bookingRef: "MP345678",
      coordinates: { lat: 12.3052, lng: 76.6551 },
      duration: "2h",
      rating: 4.9,
      tickets: [
        {
          id: "t3",
          type: "entry",
          title: "Mysore Palace Entry",
          bookingRef: "MP345678",
          status: "confirmed",
          price: 140,
          validUntil: "2024-01-15T18:00:00Z"
        }
      ]
    },
    {
      id: "4",
      type: "transport",
      title: "Train to Hampi",
      description: "Karnataka Express 12627",
      location: "Mysore Railway Station",
      startTime: "22:30",
      endTime: "06:45",
      date: "2024-01-16",
      status: "upcoming",
      cost: 1200,
      bookingRef: "KE12627",
      coordinates: { lat: 12.3052, lng: 76.6551 },
      duration: "8h 15m",
      tickets: [
        {
          id: "t4",
          type: "train",
          title: "Karnataka Express 12627",
          bookingRef: "KE12627",
          seat: "S3-12",
          status: "confirmed",
          price: 1200,
          validUntil: "2024-01-17T06:45:00Z"
        }
      ]
    },
    {
      id: "5",
      type: "sightseeing",
      title: "Hampi Ruins Tour",
      description: "Ancient Vijayanagara empire ruins",
      location: "Hampi Archaeological Site",
      startTime: "09:00",
      endTime: "17:00",
      date: "2024-01-17",
      status: "upcoming",
      cost: 80,
      bookingRef: "HR456789",
      coordinates: { lat: 15.335, lng: 76.46 },
      duration: "8h",
      rating: 4.7,
      tickets: [
        {
          id: "t5",
          type: "entry",
          title: "Hampi Ruins Entry",
          bookingRef: "HR456789",
          status: "confirmed",
          price: 80,
          validUntil: "2024-01-17T17:00:00Z"
        }
      ]
    }
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transport":
        return <Plane className="h-5 w-5" />
      case "accommodation":
        return <Hotel className="h-5 w-5" />
      case "activity":
        return <Camera className="h-5 w-5" />
      case "meal":
        return <UtensilsCrossed className="h-5 w-5" />
      case "sightseeing":
        return <MapPin className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "transport":
        return "from-blue-500 to-blue-600"
      case "accommodation":
        return "from-green-500 to-green-600"
      case "activity":
        return "from-purple-500 to-purple-600"
      case "meal":
        return "from-orange-500 to-orange-600"
      case "sightseeing":
        return "from-pink-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "in-progress":
        return "text-blue-600 bg-blue-100"
      case "upcoming":
        return "text-yellow-600 bg-yellow-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "upcoming":
        return <AlertCircle className="h-4 w-4" />
      case "cancelled":
        return <Trash2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredItinerary = itinerary.filter(item => item.date === selectedDate)

  const totalCost = itinerary.reduce((sum, item) => sum + item.cost, 0)
  const completedItems = itinerary.filter(item => item.status === "completed").length
  const upcomingItems = itinerary.filter(item => item.status === "upcoming").length

  const ItineraryItemCard = ({ item, index }: { item: ItineraryItem; index: number }) => (
    <Card
      className={`placard-3d p-4 mb-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        item.status === "completed" ? "opacity-75" : ""
      }`}
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getTypeColor(item.type)} text-white shadow-md`}>
          {getTypeIcon(item.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
              {item.status.replace("-", " ")}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {item.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.startTime} - {item.endTime}
            </div>
            {item.duration && (
              <div className="flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                {item.duration}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">₹{item.cost.toLocaleString()}</span>
              {item.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">{item.rating}</span>
                </div>
              )}
            </div>
            
            {item.tickets && item.tickets.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Ticket className="h-3 w-3" />
                {item.tickets.length} ticket{item.tickets.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className="p-3 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-foreground">{ticket.title}</p>
            <p className="text-xs text-muted-foreground">Ref: {ticket.bookingRef}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">₹{ticket.price.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{ticket.status}</p>
        </div>
      </div>
      {ticket.seat && (
        <div className="mt-2 text-xs text-muted-foreground">
          Seat: {ticket.seat} {ticket.gate && `| Gate: ${ticket.gate}`}
        </div>
      )}
    </Card>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground hover:bg-muted"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground text-center">My Itinerary</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode(viewMode === "timeline" ? "map" : "timeline")}
          className="text-foreground hover:bg-muted"
        >
          {viewMode === "timeline" ? <Map className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAddingItem(true)}
          className="text-foreground hover:bg-muted"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 bg-input border border-border rounded-full h-12 text-center text-foreground"
          />
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="text-lg font-bold text-foreground">{itinerary.length}</div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </Card>
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="text-lg font-bold text-green-600">{completedItems}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="text-lg font-bold text-blue-600">₹{totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Cost</p>
          </Card>
        </div>
      </div>

      <div className="flex-1 px-4 pb-20">
        {viewMode === "timeline" ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            {filteredItinerary.length === 0 ? (
              <Card className="placard-3d p-8 text-center bg-card border border-border rounded-2xl">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No plans for this day</h3>
                <p className="text-muted-foreground mb-4">Add some activities to make the most of your trip!</p>
                <Button onClick={() => setIsAddingItem(true)} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredItinerary.map((item, index) => (
                  <ItineraryItemCard key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="placard-3d h-96 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h3 className="font-semibold flex items-center gap-2">
                <Map className="h-5 w-5" />
                Itinerary Map
              </h3>
              <p className="text-sm text-blue-100">Interactive roadmap of your journey</p>
            </div>
            <div className="p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Map View Coming Soon</h3>
                <p className="text-muted-foreground">Interactive map with your itinerary route will be available here</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-card border border-border">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedItem.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Details</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>📍 {selectedItem.location}</p>
                  <p>🕐 {selectedItem.startTime} - {selectedItem.endTime}</p>
                  <p>💰 ₹{selectedItem.cost.toLocaleString()}</p>
                </div>
              </div>

              {selectedItem.tickets && selectedItem.tickets.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Tickets & Bookings</h4>
                  <div className="space-y-2">
                    {selectedItem.tickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
