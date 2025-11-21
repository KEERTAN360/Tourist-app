"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Users, Share2, ArrowLeft, Plus, X, Phone, Shield, Send, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  isSharing: boolean
  lastUpdate?: string
}

interface LocationData {
  lat: number
  lng: number
  timestamp: string
  accuracy?: number
}

export default function LocationSharingPage() {
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "" })
  const [sharingDuration, setSharingDuration] = useState(60) // minutes
  const [remainingTime, setRemainingTime] = useState(0)
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([])

  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load saved contacts
    const savedContacts = localStorage.getItem("locationContacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }

    // Load sharing state
    const savedSharing = localStorage.getItem("locationSharingActive")
    const savedEndTime = localStorage.getItem("locationSharingEndTime")

    if (savedSharing === "true" && savedEndTime) {
      const endTime = new Date(savedEndTime)
      const now = new Date()

      if (now < endTime) {
        setIsSharing(true)
        setRemainingTime(Math.floor((endTime.getTime() - now.getTime()) / 1000))
        startLocationTracking()
      } else {
        // Expired, clean up
        localStorage.removeItem("locationSharingActive")
        localStorage.removeItem("locationSharingEndTime")
      }
    }

    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (isSharing && remainingTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            stopLocationSharing()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isSharing, remainingTime])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString(),
            accuracy: position.coords.accuracy,
          }
          setCurrentLocation(locationData)

          if (isSharing) {
            setLocationHistory((prev) => [...prev.slice(-19), locationData]) // Keep last 20 locations
          }
        },
        (error) => {
          console.error("Location error:", error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    }
  }

  const startLocationSharing = () => {
    if (contacts.length === 0) {
      alert("Please add at least one contact to share your location with.")
      return
    }

    setIsSharing(true)
    const endTime = new Date(Date.now() + sharingDuration * 60 * 1000)
    setRemainingTime(sharingDuration * 60)

    // Save sharing state
    localStorage.setItem("locationSharingActive", "true")
    localStorage.setItem("locationSharingEndTime", endTime.toISOString())

    startLocationTracking()
    sendInitialLocationAlert()
  }

  const startLocationTracking = () => {
    getCurrentLocation()

    // Update location every 2 minutes
    locationIntervalRef.current = setInterval(() => {
      getCurrentLocation()
      sendLocationUpdate()
    }, 120000)
  }

  const stopLocationSharing = () => {
    setIsSharing(false)
    setRemainingTime(0)

    // Clear saved state
    localStorage.removeItem("locationSharingActive")
    localStorage.removeItem("locationSharingEndTime")

    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current)
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    sendLocationStopAlert()
  }

  const sendInitialLocationAlert = () => {
    if (!currentLocation) return

    const message = `📍 Location Sharing Started\n\nI'm sharing my live location with you for the next ${sharingDuration} minutes.\n\nCurrent location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}\n\nTime: ${new Date().toLocaleString()}\n\nYou'll receive updates every 2 minutes.`

    shareWithContacts(message, "Location Sharing Started")
  }

  const sendLocationUpdate = () => {
    if (!currentLocation) return

    const message = `📍 Location Update\n\nUpdated location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}\n\nTime: ${new Date().toLocaleString()}\n\nAccuracy: ${currentLocation.accuracy ? Math.round(currentLocation.accuracy) + "m" : "Unknown"}`

    shareWithContacts(message, "Location Update")
  }

  const sendLocationStopAlert = () => {
    const message = `📍 Location Sharing Stopped\n\nI've stopped sharing my location.\n\nTime: ${new Date().toLocaleString()}\n\nThank you for keeping track of my safety!`

    shareWithContacts(message, "Location Sharing Stopped")
  }

  const shareWithContacts = (message: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: message,
      })
    } else {
      navigator.clipboard.writeText(message)
      alert("Location message copied to clipboard! Please share with your contacts.")
    }
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      alert("Please enter both name and phone number.")
      return
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      isSharing: false,
    }

    const updatedContacts = [...contacts, contact]
    setContacts(updatedContacts)
    localStorage.setItem("locationContacts", JSON.stringify(updatedContacts))

    setNewContact({ name: "", phone: "", email: "" })
    setShowAddContact(false)
  }

  const removeContact = (contactId: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== contactId)
    setContacts(updatedContacts)
    localStorage.setItem("locationContacts", JSON.stringify(updatedContacts))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Location Sharing</h1>
          <p className="text-sm text-muted-foreground">Share your live location with trusted contacts</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <Card className={`p-6 ${isSharing ? "bg-green-50 border-green-200" : "bg-card"}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isSharing ? "bg-green-500" : "bg-gray-300"} text-white`}>
              <MapPin className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {isSharing ? "Location Sharing Active" : "Location Sharing Inactive"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isSharing
                  ? `Sharing with ${contacts.length} contacts • ${formatTime(remainingTime)} remaining`
                  : "Start sharing to keep your contacts informed"}
              </p>
              {isSharing && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Live tracking active</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Current Location */}
        {currentLocation && (
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Current Location</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
              <p className="text-muted-foreground">
                Last updated: {new Date(currentLocation.timestamp).toLocaleString()}
              </p>
              {currentLocation.accuracy && (
                <p className="text-muted-foreground">Accuracy: {Math.round(currentLocation.accuracy)}m</p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`)}
                className="mt-2"
              >
                View on Map
              </Button>
            </div>
          </Card>
        )}

        {/* Sharing Controls */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Sharing Controls</h3>

          {!isSharing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 120, 240].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={sharingDuration === minutes ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSharingDuration(minutes)}
                      className="text-xs"
                    >
                      {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={startLocationSharing}
                disabled={contacts.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Start Sharing Location
              </Button>

              {contacts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center">Add contacts below to start sharing</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{formatTime(remainingTime)}</div>
                <p className="text-sm text-muted-foreground">Time remaining</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={sendLocationUpdate} variant="outline" className="flex-1 bg-transparent">
                  <Send className="h-4 w-4 mr-2" />
                  Send Update Now
                </Button>

                <Button onClick={stopLocationSharing} variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Stop Sharing
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Contacts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Trusted Contacts</h3>
            <Button size="sm" onClick={() => setShowAddContact(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No contacts added yet</p>
              <Button onClick={() => setShowAddContact(true)} variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => window.open(`tel:${contact.phone}`)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeContact(contact.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Add Contact</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowAddContact(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Enter phone number"
                    type="tel"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email (Optional)</label>
                  <Input
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddContact(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={addContact} className="flex-1 bg-primary hover:bg-primary/90">
                    Add Contact
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Safety Information */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Privacy & Safety</h3>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Your location is only shared with contacts you add</li>
                <li>• Sharing automatically stops after the selected duration</li>
                <li>• You can stop sharing at any time</li>
                <li>• Location data is not stored on our servers</li>
                <li>• Only share with people you trust completely</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
