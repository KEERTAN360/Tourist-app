

"use client"

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LocationService } from "@/lib/location-service";
import BottomNavigation from "@/components/bottom-navigation";
import LikeButton from "@/components/like-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertTriangle,
  Bookmark,
  Shield,
  Menu,
  MapPin,
  LocateFixed,
  Loader2,
  Search,
  X,
  Zap,
  Users,
  TrendingUp,
  Eye,
  Hotel,
  UtensilsCrossed,
  Coffee,
  Calendar,
  Activity,
  Compass,
  AlertCircle,
  Star
} from "lucide-react";
// If you have a GoogleMap component, import it. Otherwise, comment out or implement as needed.
// import GoogleMap from "@/components/google-map";

export default function TouristSpotsPage() {
  const PLACE_TYPES = [
    "tourist_attraction",
    "lodging",
    "restaurant",
    "cafe",
    "amusement_park",
    "museum",
    "park",
  ];

  function PlaceCard({ place, onClick }: { place: any; onClick: () => void }) {
    return (
      <li className="place-result" onClick={onClick} style={{ cursor: "pointer", display: "flex", padding: "0.8em", borderBottom: "1px solid #eee" }}>
        <div className="text" style={{ flexGrow: 1 }}>
          <div className="name" style={{ fontWeight: 500 }}>{place.name}</div>
          <div className="info" style={{ color: "#555", fontSize: "0.9em" }}>
            {place.rating && <span>{place.rating}★</span>}
            {place.user_ratings_total && <span>&nbsp;({place.user_ratings_total})</span>}
            {place.vicinity && <span>&nbsp;· {place.vicinity}</span>}
          </div>
          <div className="info">{place.types?.[0]?.replace(/_/g, " ")}</div>
        </div>
        {place.photos && place.photos.length > 0 && (
          <div className="photo" style={{ flex: "0 0 4em", height: "4em", marginLeft: "0.8em", background: `url(${place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })}) center/cover`, borderRadius: "0.3em" }} />
        )}
      </li>
    );
  }

  function PlaceDetailsModal({ place, onClose }: { place: any; onClose: () => void }) {
    if (!place) return null;
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 24, minWidth: 320, maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
          <h2>{place.name}</h2>
          {place.photos && place.photos.length > 0 && (
            <img src={place.photos[0].getUrl({ maxWidth: 400, maxHeight: 400 })} alt={place.name} style={{ width: "100%", borderRadius: 8, marginBottom: 12 }} />
          )}
          <div style={{ marginBottom: 8 }}>{place.vicinity}</div>
          {place.rating && <div>Rating: {place.rating} ({place.user_ratings_total})</div>}
          {place.types && <div>Type: {place.types.map((t: string) => t.replace(/_/g, " ")).join(", ")}</div>}
          {place.opening_hours && place.opening_hours.weekday_text && (
            <div style={{ marginTop: 8 }}>
              <b>Opening Hours:</b>
              <ul>
                {place.opening_hours.weekday_text.map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
          {place.website && <div><a href={place.website} target="_blank" rel="noopener noreferrer">Website</a></div>}
          {place.formatted_phone_number && <div>Phone: {place.formatted_phone_number}</div>}
          {place.reviews && place.reviews.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <b>Reviews:</b>
              <ul>
                {place.reviews.slice(0, 3).map((r: any, i: number) => <li key={i}>{r.text} — <i>{r.author_name}</i></li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ...existing code...
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [places, setPlaces] = useState<any[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [liveStats, setLiveStats] = useState({
    visitors: 1247,
    trending: 8,
    activeNow: 342,
  })
  const [preferences, setPreferences] = useState<any>(null)
  const [nearestPlaces, setNearestPlaces] = useState<any[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null)
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null)
  const [lastLocationUpdate, setLastLocationUpdate] = useState<Date | null>(null)
  const [locationRetryCount, setLocationRetryCount] = useState(0)
  const [locationRetryAttempts, setLocationRetryAttempts] = useState<string[]>([])
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown')

  // Check location permission status
  const checkLocationPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        setLocationPermissionStatus(permission.state)

        permission.onchange = () => {
          setLocationPermissionStatus(permission.state)
        }
      } catch (error) {
        console.log('Permission API not supported')
      }
    }
  }, [])

  // Enhanced location handling using LocationService
  useEffect(() => {
    // Check permissions first
    checkLocationPermission()

    const initializeLocation = async () => {
      setIsLocationLoading(true)
      setLocationRetryCount(0)
      setLocationRetryAttempts([])

      try {
        const coords = await LocationService.getCurrentLocation({
          onProgress: (attempt: any, strategy: any) => {
            setLocationRetryCount(attempt)
            setLocationRetryAttempts(prev => [...prev, strategy.description])
          },
          onSuccess: (coords: any) => {
            setLocationError("")
            setUserLocation(coords)
            setLocationAccuracy(coords.accuracy || null)
            setLastLocationUpdate(coords.timestamp || new Date())
            setIsLocationLoading(false)
            setLocationRetryCount(0)
            setLocationRetryAttempts([])

            // Start live location tracking
            startLiveLocationTracking()
          },
          onError: (error: any, finalAttempt: any) => {
            if (finalAttempt) {
              setLocationError(LocationService.getErrorMessage(error))
            }
            setIsLocationLoading(false)
          }
        })

        if (coords) {
          setUserLocation(coords)
          setLocationAccuracy(coords.accuracy || null)
          setLastLocationUpdate(coords.timestamp || new Date())
          startLiveLocationTracking()
        }
      } catch (error) {
        console.error('Location initialization error:', error)
        setLocationError('Failed to initialize location service.')
        setIsLocationLoading(false)
      }
    }

    initializeLocation()
  }, [])

  // Start live location tracking using LocationService
  const startLiveLocationTracking = useCallback(() => {
    if (locationWatchId) {
      navigator.geolocation.clearWatch(locationWatchId)
    }

    const watchId = LocationService.watchLocation(
      (coords: any) => {
        setUserLocation(coords)
        setLocationAccuracy(coords.accuracy || null)
        setLastLocationUpdate(coords.timestamp || new Date())
        setLocationError("")
      },
      (error: any) => {
        console.error('Live location tracking error:', error)
        setLocationError('Live location tracking failed')
      }
    )

    setLocationWatchId(watchId)
  }, [locationWatchId])

  // Cleanup location tracking on unmount
  useEffect(() => {
    return () => {
      if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId)
      }
    }
  }, [locationWatchId])

  const requestLocation = useCallback(async () => {
    setIsLocationLoading(true)
    setLocationRetryCount(0)
    setLocationRetryAttempts([])

    try {
      const coords = await LocationService.getCurrentLocation({
        onProgress: (attempt: any, strategy: any) => {
          setLocationRetryCount(attempt)
          setLocationRetryAttempts(prev => [...prev, strategy.description])
        },
        onSuccess: (coords: any) => {
          setLocationError("")
          setUserLocation(coords)
          setLocationAccuracy(coords.accuracy || null)
          setLastLocationUpdate(coords.timestamp || new Date())
          setIsLocationLoading(false)
          setLocationRetryCount(0)
          setLocationRetryAttempts([])

          // Start live location tracking
          startLiveLocationTracking()
        },
        onError: (error: any, finalAttempt: any) => {
          if (finalAttempt) {
            setLocationError(LocationService.getErrorMessage(error))
          }
          setIsLocationLoading(false)
        }
      })

      if (coords) {
        setUserLocation(coords)
        setLocationAccuracy(coords.accuracy || null)
        setLastLocationUpdate(coords.timestamp || new Date())
        startLiveLocationTracking()
      }
    } catch (error) {
      console.error('Manual location request error:', error)
      setLocationError('Failed to get location. Please try again.')
      setIsLocationLoading(false)
    }
  }, [startLiveLocationTracking])

  // Share live location
  const shareLiveLocation = useCallback(async () => {
    if (!userLocation) {
      alert('Location not available. Please enable location access.')
      return
    }

    const locationUrl = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`
    const locationText = `📍 My current location: ${locationUrl}\n\nLatitude: ${userLocation.lat.toFixed(6)}\nLongitude: ${userLocation.lng.toFixed(6)}\n\nShared from Karnataka Tourism App`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Live Location',
          text: locationText,
          url: locationUrl
        })
      } else {
        await navigator.clipboard.writeText(locationText)
        alert('Location copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing location:', error)
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(locationText)
        alert('Location copied to clipboard!')
      } catch (clipboardError) {
        alert('Unable to share location. Please try again.')
      }
    }
  }, [userLocation])

  // Get location address using reverse geocoding (Geoapify)
  const getLocationAddress = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=94f25ba01135482494790e23a9122984`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        return data.features[0].properties.formatted
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
    }
    return null
  }, [])

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setLiveStats((prev) => ({
        visitors: prev.visitors + Math.floor(Math.random() * 10) - 5,
        trending: prev.trending + Math.floor(Math.random() * 3) - 1,
        activeNow: prev.activeNow + Math.floor(Math.random() * 20) - 10,
      }))
    }, 3000)

    return () => clearInterval(statsInterval)
  }, [])

  useEffect(() => {
    const loadPrefs = async () => {
      if (typeof window !== 'undefined') {
        const username = localStorage.getItem("username") || "guest"
        try {
          const res = await fetch(`/api/preferences?username=${encodeURIComponent(username)}`, { cache: "no-store" })
          const data = await res.json()
          setPreferences(data?.preferences || null)
        } catch { }
      }
    }
    loadPrefs()
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlaces(places)
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(() => {
      const filtered = places.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.vicinity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.types?.some((type: string) => type.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredPlaces(filtered)
      setShowSuggestions(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, places])

  // Load nearest places with Geoapify API
  useEffect(() => {
    const run = async () => {
      if (!userLocation) return
      try {
        // Fetch tourist attractions from Geoapify
        const res = await fetch(
          `/api/places?lat=${userLocation.lat}&lon=${userLocation.lng}&categories=tourism.attraction&radius=5000`
        )
        const data = await res.json()

        // Normalize Geoapify data
        const normalize = (p: any) => ({
          place_id: p.id,
          name: p.name,
          vicinity: p.address || '',
          rating: parseFloat(p.rating) || 0,
          user_ratings_total: 0,
          types: ['tourist_attraction'],
          opening_hours: { open_now: p.isOpen ?? undefined },
          geometry: { location: { lat: p.lat, lng: p.lon } },
          photos: [],
          distance: p.distance
        })

        setNearestPlaces((data.places || []).map(normalize).slice(0, 3))
      } catch (e) {
        console.error('nearest load error', e)
      }
    }
    run()
  }, [userLocation])

  // Fetch places from Geoapify API (All categories)
  useEffect(() => {
    const fetchGeoapifyPlaces = async () => {
      if (!userLocation) return

      try {
        // Fetch multiple categories
        const categories = [
          'catering.restaurant',
          'accommodation',
          'catering.cafe',
          'tourism.attraction',
          'entertainment.museum',
          'leisure.park'
        ]

        const allPlaces: any[] = []

        for (const category of categories) {
          const res = await fetch(
            `/api/places?lat=${userLocation.lat}&lon=${userLocation.lng}&categories=${category}&radius=5000`
          )
          const data = await res.json()

          // Map category to type
          const typeMap: any = {
            'catering.restaurant': 'restaurant',
            'accommodation': 'lodging',
            'catering.cafe': 'cafe',
            'tourism.attraction': 'tourist_attraction',
            'entertainment.museum': 'museum',
            'leisure.park': 'park'
          }

          // Normalize Geoapify data to match Google Places format
          const normalized = (data.places || []).map((place: any) => ({
            place_id: place.id,
            name: place.name,
            vicinity: place.address || '',
            rating: parseFloat(place.rating) || 0,
            user_ratings_total: 0,
            types: [typeMap[category]],
            opening_hours: { open_now: place.isOpen },
            geometry: { location: { lat: place.lat, lng: place.lon } },
            photos: place.imageUrl ? [{ getUrl: () => place.imageUrl }] : [],
            distance: place.distance,
            imageUrl: place.imageUrl
          }))

          allPlaces.push(...normalized)
        }

        // Set all places at once
        setPlaces(allPlaces)
        setFilteredPlaces(allPlaces)
      } catch (error) {
        console.error('Geoapify fetch error:', error)
      }
    }

    fetchGeoapifyPlaces()
  }, [userLocation])

  const handlePlacesUpdate = (newPlaces: any[]) => {
    setPlaces(newPlaces)
    setFilteredPlaces(newPlaces)
  }

  const getPlacePhoto = (place: any) => {
    // Check for Geoapify imageUrl first
    if (place.imageUrl) {
      return place.imageUrl
    }
    // Fallback to photos array
    if (place.photos && place.photos.length > 0) {
      return place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
    }
    return "/placeholder.svg"
  }

  const getSafetyScore = (place: any) => {
    const rating = place.rating || 0
    const userRatingsTotal = place.user_ratings_total || 0

    if (rating >= 4.5 && userRatingsTotal >= 1000) return { score: 9.2, level: "Very Safe", color: "text-green-500" }
    if (rating >= 4.0 && userRatingsTotal >= 500) return { score: 8.5, level: "Safe", color: "text-green-500" }
    if (rating >= 3.5 && userRatingsTotal >= 100) return { score: 7.5, level: "Moderate", color: "text-yellow-500" }
    if (rating >= 3.0) return { score: 6.5, level: "Caution", color: "text-orange-500" }
    return { score: 5.0, level: "Unknown", color: "text-gray-500" }
  }

  const categories = [
    { icon: Hotel, label: "Stays", color: "from-blue-400 to-blue-600", href: "/stays" },
    { icon: UtensilsCrossed, label: "Restaurants", color: "from-green-400 to-green-600" },
    { icon: Coffee, label: "Cafes", color: "from-amber-400 to-amber-600" },
    { icon: Calendar, label: "Events", color: "from-pink-400 to-pink-600" },
    { icon: Activity, label: "Activities", color: "from-orange-400 to-orange-600" },
    { icon: Compass, label: "Explore", color: "from-indigo-400 to-indigo-600", href: "/explore" },
  ]

  const safetyHazards = [
    {
      name: "Jog Falls Trek Path",
      image: "/dynamic-safety-hazard-rain.jpg",
      reason: "Slippery rocks during monsoon",
      severity: "high",
      condition: "Heavy Rain",
    },
    {
      name: "Coorg Night Safari",
      image: "/dynamic-safety-hazard-dark.jpg",
      reason: "Wild animal encounters reported",
      severity: "medium",
      condition: "After Dark",
    },
    {
      name: "Hampi Cliff Areas",
      image: "/dynamic-safety-hazard-theft.jpg",
      reason: "Theft reports in isolated areas",
      severity: "high",
      condition: "Isolated Areas",
    },
    {
      name: "Landslide Zone",
      image: "/dynamic-safety-hazard-landslide.jpg",
      reason: "Recent landslide activity",
      severity: "high",
      condition: "Monsoon Season",
    },
  ]

  const SpotCard = ({ spot }: { spot: any }) => {
    const safety = getSafetyScore(spot)
    const photo = getPlacePhoto(spot)

    return (
      <Card
        className="placard-3d flex-shrink-0 w-52 rounded-3xl overflow-hidden shadow-md cursor-pointer bg-card border border-border"
        onClick={() => router.push(`/hotel/${encodeURIComponent(spot.name)}`)}
      >
        <div className="relative">
          <img src={photo} alt={spot.name} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-2 right-2">
            <LikeButton
              placeId={spot.place_id || spot.name.toLowerCase().replace(/\s+/g, "-")}
              placeName={spot.name}
              placeData={{
                name: spot.name,
                location: spot.vicinity || "Karnataka, India",
                image: photo,
                rating: spot.rating?.toString() || "N/A",
                timing: spot.opening_hours?.open_now ? "Open Now" : "Check Hours",
                entry: spot.price_level ? "₹" + (spot.price_level * 200) : "Free",
                description: spot.types?.[0]?.replace(/_/g, ' ') || "Tourist Attraction",
              }}
              size="sm"
              className="shadow-lg"
            />
          </div>
          <div className="absolute top-2 left-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
              <div
                className={`w-2 h-2 rounded-full ${safety.color === "text-green-500" ? "bg-green-500" :
                  safety.color === "text-yellow-500" ? "bg-yellow-500" :
                    safety.color === "text-orange-500" ? "bg-orange-500" : "bg-gray-500"
                  }`}
              ></div>
              <span className="text-xs font-medium text-gray-800">{safety.score}</span>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 text-white">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs opacity-90">
                    {spot.opening_hours?.open_now ? "Open Now" : "Check Hours"}
                  </p>
                  <p className="text-xs opacity-90">
                    {spot.price_level ? "₹" + (spot.price_level * 200) : "Free"}
                  </p>
                  <p className={`text-xs font-medium ${safety.color}`}>
                    Safety: {safety.level}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs">{spot.rating?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
              <p className="text-xs opacity-75 italic">
                {spot.types?.[0]?.replace(/_/g, ' ') || "Tourist Attraction"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-card-foreground text-center truncate">{spot.name}</h3>
          <p className="text-xs text-muted-foreground text-center mt-1 truncate">{spot.vicinity}</p>
        </div>
      </Card>
    )
  }

  const SafetyHazardCard = ({ hazard }: { hazard: any }) => (
    <Card className="placard-3d flex-shrink-0 w-48 rounded-3xl overflow-hidden shadow-md bg-card border border-destructive/20">
      <div className="relative">
        <img src={hazard.image || "/placeholder.svg"} alt={hazard.name} className="w-full h-28 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/20 to-transparent" />
        <div className="absolute top-2 right-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${hazard.severity === "high" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
              }`}
          >
            {hazard.condition}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className="flex items-center gap-1 mb-1">
            <AlertCircle className={`h-3 w-3 ${hazard.severity === "high" ? "text-red-400" : "text-amber-400"}`} />
            <span className="text-xs font-medium">{hazard.severity.toUpperCase()} RISK</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-card-foreground mb-1">{hazard.name}</h3>
        <p className="text-xs text-muted-foreground">{hazard.reason}</p>
      </div>
    </Card>
  )

  const handleCategoryClick = (category: any) => {
    if (category.href) {
      router.push(category.href)
    }
  }

  const handleMapClick = () => {
    router.push("/explore")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 pt-6">
        <h1 className="text-xl font-semibold text-foreground">Tourist Spots</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 shadow-lg h-10 w-10"
            onClick={() => router.push("/geofencing-alerts")}
          >
            <AlertTriangle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 shadow-lg h-10 w-10"
            onClick={() => router.push("/saved-places")}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground bg-blue-500 rounded-xl hover:bg-blue-600 shadow-lg h-10 w-10"
            onClick={() => router.push("/sos")}
          >
            <Shield className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground bg-card rounded-xl hover:bg-muted border border-border h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Location Status and Controls */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Location Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${userLocation && !locationError ? 'bg-green-500 animate-pulse' :
                isLocationLoading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                }`}></div>
              <span className="text-sm text-muted-foreground">
                {userLocation && !locationError ? 'Live Location Active' :
                  isLocationLoading ? 'Getting Location...' : 'Location Unavailable'}
              </span>
              {locationPermissionStatus === 'denied' && (
                <span className="text-xs text-red-500 ml-2">(Permission Denied)</span>
              )}
              {locationPermissionStatus === 'granted' && !userLocation && (
                <span className="text-xs text-blue-500 ml-2">(Permission Granted)</span>
              )}
            </div>

            {/* Location Details */}
            {userLocation && (
              <div className="text-xs text-muted-foreground">
                <span>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                {locationAccuracy && (
                  <span className="ml-2">±{Math.round(locationAccuracy)}m</span>
                )}
              </div>
            )}
          </div>

          {/* Location Controls */}
          <div className="flex items-center gap-2">
            {userLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={shareLiveLocation}
                className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Share Location
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={isLocationLoading}
              className="text-xs"
            >
              {isLocationLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <LocateFixed className="h-3 w-3 mr-1" />
              )}
              {isLocationLoading ? 'Getting...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Location Status Display */}
        {isLocationLoading && locationRetryAttempts.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-sm text-blue-700">Getting your location...</span>
            </div>
            <div className="text-xs text-blue-600">
              <div>Attempt {locationRetryCount + 1} of 4</div>
              <div className="mt-1">
                {locationRetryAttempts[locationRetryAttempts.length - 1]}
              </div>
            </div>
          </div>
        )}

        {/* Location Error Display */}
        {locationError && !isLocationLoading && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{locationError}</span>
            </div>
            {locationRetryCount > 0 && (
              <div className="mt-2 text-xs text-red-600">
                Tried {locationRetryCount} different location methods.
                <Button
                  variant="link"
                  size="sm"
                  onClick={requestLocation}
                  className="text-xs p-0 h-auto text-red-600 hover:text-red-800"
                >
                  Try again
                </Button>
              </div>
            )}
            {locationPermissionStatus === 'denied' && (
              <div className="mt-2 text-xs text-red-600">
                <strong>To fix this:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location access</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Location Success Display */}
        {userLocation && !locationError && !isLocationLoading && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-700">Location successfully obtained</span>
            </div>
            {locationAccuracy && (
              <div className="mt-1 text-xs text-green-600">
                Accuracy: ±{Math.round(locationAccuracy)}m
              </div>
            )}
          </div>
        )}

        {/* Last Update Info */}
        {lastLocationUpdate && (
          <div className="mb-4 text-xs text-muted-foreground">
            Last updated: {lastLocationUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search tourist spots, restaurants, hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-input border border-border rounded-full h-12 text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 pb-20">
        <div className="placard-3d rounded-2xl overflow-hidden shadow-lg mb-4 h-96 relative cursor-pointer bg-card border border-border">
          {userLocation && (
            <iframe
              className="w-full h-full rounded-2xl"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${userLocation.lng},${userLocation.lat}&zoom=14&marker=lonlat:${userLocation.lng},${userLocation.lat};color:%23ff0000;size:medium&apiKey=94f25ba01135482494790e23a9122984`}
            />
          )}
          {!userLocation && (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading map...</div>
          )}
        </div>

        <div className="mb-6">
          <Button
            onClick={() => router.push("/wishlist")}
            className="w-full p-4 bg-gradient-to-r from-accent to-primary text-accent-foreground rounded-2xl hover:from-accent/90 hover:to-primary/90 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Discover Your Wishlist</span>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-card-foreground">{liveStats.visitors}</span>
            </div>
            <p className="text-xs text-muted-foreground">Live Visitors</p>
          </Card>
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-lg font-bold text-card-foreground">{liveStats.trending}</span>
            </div>
            <p className="text-xs text-muted-foreground">Trending Now</p>
          </Card>
          <Card className="placard-3d p-3 text-center bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-4 w-4 text-secondary" />
              <span className="text-lg font-bold text-card-foreground">{liveStats.activeNow}</span>
            </div>
            <p className="text-xs text-muted-foreground">Active Now</p>
          </Card>
        </div>

        {/* Dynamic placards for Stays, Restaurants, Cafes, Activities */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Stays Near You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {places.filter(place => place.types?.includes('lodging')).slice(0, 8).map((spot, index) => (
              <SpotCard key={spot.place_id || index} spot={spot} />
            ))}
            {places.filter(place => place.types?.includes('lodging')).length === 0 && (
              <div className="flex items-center justify-center w-full h-32 text-muted-foreground">No stays found nearby.</div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Restaurants Near You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {places.filter(place => place.types?.includes('restaurant')).slice(0, 8).map((spot, index) => (
              <SpotCard key={spot.place_id || index} spot={spot} />
            ))}
            {places.filter(place => place.types?.includes('restaurant')).length === 0 && (
              <div className="flex items-center justify-center w-full h-32 text-muted-foreground">No restaurants found nearby.</div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Cafes Near You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {places.filter(place => place.types?.includes('cafe')).slice(0, 8).map((spot, index) => (
              <SpotCard key={spot.place_id || index} spot={spot} />
            ))}
            {places.filter(place => place.types?.includes('cafe')).length === 0 && (
              <div className="flex items-center justify-center w-full h-32 text-muted-foreground">No cafes found nearby.</div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Activities Near You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {places.filter(place =>
              place.types?.includes('amusement_park') ||
              place.types?.includes('museum') ||
              place.types?.includes('park')
            ).slice(0, 8).map((spot, index) => (
              <SpotCard key={spot.place_id || index} spot={spot} />
            ))}
            {places.filter(place =>
              place.types?.includes('amusement_park') ||
              place.types?.includes('museum') ||
              place.types?.includes('park')
            ).length === 0 && (
                <div className="flex items-center justify-center w-full h-32 text-muted-foreground">No activities found nearby.</div>
              )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Places to Skip Due to Safety Hazards
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {safetyHazards.map((hazard, index) => (
              <SafetyHazardCard key={index} hazard={hazard} />
            ))}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Search Results ({filteredPlaces.length})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((spot, index) => (
                  <SpotCard key={spot.place_id || index} spot={spot} />
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-32 text-muted-foreground">
                  <p>No places found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!searchQuery && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Nearest to You</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {nearestPlaces.length > 0 ? (
                  nearestPlaces.map((spot, index) => (
                    <SpotCard key={spot.place_id || index} spot={spot} />
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-32 text-muted-foreground">
                    <p>Loading nearby places...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Popular Tourist Spots</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {places
                  .filter(place => place.rating >= 4.5 && place.user_ratings_total >= 1000)
                  .slice(0, 5)
                  .map((spot, index) => (
                    <SpotCard key={spot.place_id || index} spot={spot} />
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Restaurants & Cafes</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {places
                  .filter(place => place.types?.includes('restaurant') || place.types?.includes('cafe'))
                  .slice(0, 5)
                  .map((spot, index) => (
                    <SpotCard key={spot.place_id || index} spot={spot} />
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Hotels & Stays</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {places
                  .filter(place => place.types?.includes('lodging'))
                  .slice(0, 5)
                  .map((spot, index) => (
                    <SpotCard key={spot.place_id || index} spot={spot} />
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Activities & Events</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {places
                  .filter(place =>
                    place.types?.includes('amusement_park') ||
                    place.types?.includes('museum') ||
                    place.types?.includes('park')
                  )
                  .slice(0, 5)
                  .map((spot, index) => (
                    <SpotCard key={spot.place_id || index} spot={spot} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
