"use client"

import {
  Heart,
  ArrowLeft,
  Menu,
  Star,
  MapPin,
  Share2,
  Trash2,
  Calendar,
  Eye,
  Home,
  CreditCard,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface SavedPlace {
  id: string
  name: string
  location: string
  image: string
  rating: string
  timing: string
  entry: string
  description: string
  savedAt: string
}

export default function SavedPlacesPage() {
  const router = useRouter()
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])

  useEffect(() => {
    // Load saved places from localStorage
    const saved = localStorage.getItem("savedPlaces")
    if (saved) {
      setSavedPlaces(JSON.parse(saved))
    }
  }, [])

  const removeSavedPlace = (id: string) => {
    const updated = savedPlaces.filter((place) => place.id !== id)
    setSavedPlaces(updated)
    localStorage.setItem("savedPlaces", JSON.stringify(updated))
  }

  const sharePlace = (place: SavedPlace) => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} - ${place.description}`,
        url: window.location.origin + `/hotel/${encodeURIComponent(place.name)}`,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `Check out ${place.name} - ${place.description}\n${window.location.origin}/hotel/${encodeURIComponent(place.name)}`
      navigator.clipboard.writeText(text)
      alert("Link copied to clipboard!")
    }
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
          <h1 className="text-xl font-semibold text-foreground text-center">Saved Places</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground bg-card rounded-xl hover:bg-muted border border-border"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-20">
        {savedPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Saved Places Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save your favorite tourist spots to see them here
            </p>
            <Button
              onClick={() => router.push("/tourist-spots")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Explore Tourist Spots
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {savedPlaces.length} saved place{savedPlaces.length !== 1 ? "s" : ""}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/wishlist-discovery")}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Discover More
              </Button>
            </div>

            {savedPlaces.map((place) => (
              <Card
                key={place.id}
                className="placard-3d overflow-hidden bg-card border border-border rounded-3xl shadow-md"
              >
                <div className="relative">
                  <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Action buttons overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/80 hover:bg-white"
                      onClick={() => sharePlace(place)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                      onClick={() => removeSavedPlace(place.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Place info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{place.name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs opacity-90">{place.location}</span>
                        </div>
                        <p className="text-xs opacity-75 italic">{place.description}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{place.timing}</span>
                      </div>
                      <span className="font-medium text-green-600">{place.entry}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Saved {new Date(place.savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/hotel/${encodeURIComponent(place.name)}`)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sharePlace(place)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
