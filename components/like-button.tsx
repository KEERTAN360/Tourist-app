"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface LikeButtonProps {
  placeId: string
  placeName: string
  placeData?: {
    name: string
    location?: string
    image?: string
    rating?: string
    timing?: string
    entry?: string
    description?: string
  }
  className?: string
  size?: "sm" | "default" | "lg"
}

export default function LikeButton({
  placeId,
  placeName,
  placeData,
  className = "",
  size = "default",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if place is already saved
    const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]")
    setIsLiked(savedPlaces.some((place: any) => place.id === placeId))
  }, [placeId])

  const toggleLike = () => {
    setIsAnimating(true)

    const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]")

    if (isLiked) {
      // Remove from saved places
      const updated = savedPlaces.filter((place: any) => place.id !== placeId)
      localStorage.setItem("savedPlaces", JSON.stringify(updated))
      setIsLiked(false)
    } else {
      // Add to saved places
      const newPlace = {
        id: placeId,
        name: placeName,
        location: placeData?.location || "Karnataka, India",
        image: placeData?.image || "/placeholder.svg",
        rating: placeData?.rating || "4.5",
        timing: placeData?.timing || "6 AM - 6 PM",
        entry: placeData?.entry || "Free",
        description: placeData?.description || "Beautiful tourist destination",
        savedAt: new Date().toISOString(),
      }

      const updated = [...savedPlaces, newPlace]
      localStorage.setItem("savedPlaces", JSON.stringify(updated))
      setIsLiked(true)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className={`
        rounded-full transition-all duration-300 
        ${sizeClasses[size]}
        ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/80 hover:bg-white text-gray-700"}
        ${isAnimating ? "scale-125" : "scale-100"}
        ${className}
      `}
      onClick={toggleLike}
    >
      <Heart
        className={`
          ${iconSizes[size]} transition-all duration-300
          ${isLiked ? "fill-current" : ""}
          ${isAnimating ? "animate-pulse" : ""}
        `}
      />
    </Button>
  )
}
