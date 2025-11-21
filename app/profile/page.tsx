"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Edit3 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
  })

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem("username")
      if (!storedUsername) {
        router.push("/login")
        return
      }
      setUsername(storedUsername)
      const email = localStorage.getItem("email") || ""
      const phone = localStorage.getItem("phone") || ""
      const location = localStorage.getItem("userAddress") || ""
      const joinDate = localStorage.getItem("joinDate") || ""
      setProfileData({ name: storedUsername, email, phone, location, joinDate })
    }
  }, [router])

  const travelHistory = [
    { place: "Mysore Palace", date: "Dec 2023", rating: 5 },
    { place: "Coorg Hills", date: "Nov 2023", rating: 4 },
    { place: "Hampi Ruins", date: "Oct 2023", rating: 5 },
  ]

  const emergencyContacts = [
    { name: "John Doe", relation: "Brother", phone: "+91 9876543211" },
    { name: "Jane Smith", relation: "Friend", phone: "+91 9876543212" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center gap-4 p-4 pt-6 bg-white shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Profile Header */}
        <Card
          className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl border-0"
          style={{
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-blue-100">Karnataka Explorer</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="text-white hover:bg-white/20"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 rounded-3xl border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              {isEditing ? (
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profileData.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-500" />
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profileData.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-red-500" />
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <span className="text-gray-700">{profileData.location || "Add your location"}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">Member since {profileData.joinDate || "—"}</span>
            </div>
          </div>
        </Card>

        {/* Travel History placeholder if none */}
        <Card className="p-6 rounded-3xl border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel History</h3>
          <div className="text-sm text-gray-600">No trips yet. Start exploring tourist spots!</div>
        </Card>

        {/* Emergency Contacts from About prefs */}
        <Card className="p-6 rounded-3xl border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-700">
                {typeof window !== 'undefined' ? (localStorage.getItem("userEmergencyContact") || "Add emergency contact in About page") : "Add emergency contact in About page"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
