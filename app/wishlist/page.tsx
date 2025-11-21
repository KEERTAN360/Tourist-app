"use client"

import { useState, useRef } from "react"
import { Heart, X, Share2, MapPin, Star, RotateCcw, Info, ArrowLeft, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })

  const spots = [
    {
      id: 1,
      name: "Mysore Palace",
      location: "Mysore, Karnataka",
      image: "/beautiful-mysore-palace-architecture.jpg",
      rating: "4.8",
      description: "A magnificent royal palace with stunning Indo-Saracenic architecture and rich history",
      openHours: "10:00 AM - 5:30 PM",
      price: "₹70",
      originalPrice: "₹100",
      isOpen: true,
      closingIn: "3 hours",
      tags: ["Heritage", "Architecture", "Royal"],
      distance: "2.5 km",
      safetyScore: 9.2,
      safetyLevel: "Very Safe",
      safetyColor: "text-green-400",
    },
    {
      id: 2,
      name: "Coorg Coffee Estates",
      location: "Coorg, Karnataka",
      image: "/green-hills-landscape-in-coorg.jpg",
      rating: "4.9",
      description: "Lush green coffee plantations with breathtaking hill views and aromatic coffee tours",
      openHours: "6:00 AM - 6:00 PM",
      price: "₹150",
      originalPrice: "₹200",
      isOpen: true,
      closingIn: "5 hours",
      tags: ["Nature", "Coffee", "Hills"],
      distance: "45 km",
      safetyScore: 8.7,
      safetyLevel: "Safe",
      safetyColor: "text-green-400",
    },
    {
      id: 3,
      name: "Hampi Heritage Site",
      location: "Hampi, Karnataka",
      image: "/ancient-hampi-ruins-historical-site.jpg",
      rating: "4.7",
      description: "Ancient ruins and temples from the Vijayanagara Empire, a UNESCO World Heritage Site",
      openHours: "6:00 AM - 6:00 PM",
      price: "₹40",
      originalPrice: "₹60",
      isOpen: false,
      closingIn: "Closed",
      tags: ["UNESCO", "Ancient", "Temples"],
      distance: "12 km",
      safetyScore: 7.8,
      safetyLevel: "Moderate",
      safetyColor: "text-yellow-400",
    },
    {
      id: 4,
      name: "Gokarna Beach",
      location: "Gokarna, Karnataka",
      image: "/scenic-gokarna-beach-sunset.jpg",
      rating: "4.6",
      description: "Pristine beaches with golden sand, crystal clear waters, and stunning sunsets",
      openHours: "24 Hours",
      price: "Free",
      originalPrice: null,
      isOpen: true,
      closingIn: "Always Open",
      tags: ["Beach", "Sunset", "Relaxation"],
      distance: "8.2 km",
      safetyScore: 8.1,
      safetyLevel: "Safe",
      safetyColor: "text-green-400",
    },
  ]

  const currentSpot = spots[currentIndex]

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return
    setIsDragging(true)
    startPos.current = { x: clientX, y: clientY }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || isAnimating) return

    const deltaX = clientX - startPos.current.x
    const deltaY = clientY - startPos.current.y

    setDragOffset({ x: deltaX, y: deltaY })

    if (cardRef.current) {
      const rotation = deltaX * 0.1
      cardRef.current.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`

      const overlay = cardRef.current.querySelector(".swipe-overlay") as HTMLElement
      if (overlay) {
        if (Math.abs(deltaY) > 80 && deltaY < 0) {
          overlay.style.opacity = Math.min(Math.abs(deltaY) / 150, 0.9).toString()
          overlay.style.backgroundColor = "rgba(59, 130, 246, 0.9)"
          overlay.innerHTML = `
            <div class="flex items-center justify-center h-full">
              <div class="bg-white rounded-full p-6 shadow-2xl">
                <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div class="absolute bottom-20 text-white font-bold text-xl">VISIT NOW</div>
            </div>
          `
        } else if (Math.abs(deltaX) > 60) {
          overlay.style.opacity = Math.min(Math.abs(deltaX) / 150, 0.9).toString()
          overlay.style.backgroundColor = deltaX > 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)"
          overlay.innerHTML =
            deltaX > 0
              ? `
              <div class="flex items-center justify-center h-full">
                <div class="bg-white rounded-full p-6 shadow-2xl">
                  <svg class="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div class="absolute bottom-20 text-white font-bold text-xl">SAVE</div>
              </div>
            `
              : `
              <div class="flex items-center justify-center h-full">
                <div class="bg-white rounded-full p-6 shadow-2xl">
                  <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div class="absolute bottom-20 text-white font-bold text-xl">REJECT</div>
              </div>
            `
        } else {
          overlay.style.opacity = "0"
        }
      }
    }
  }

  const handleEnd = () => {
    if (!isDragging || isAnimating) return

    setIsDragging(false)

    const threshold = 100
    const upThreshold = 80

    if (dragOffset.y < -upThreshold) {
      handleSwipe("up")
    } else if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left")
    } else {
      if (cardRef.current) {
        cardRef.current.style.transform = "translateX(0) translateY(0) rotate(0deg)"
        const overlay = cardRef.current.querySelector(".swipe-overlay") as HTMLElement
        if (overlay) overlay.style.opacity = "0"
      }
    }

    setDragOffset({ x: 0, y: 0 })
  }

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (isAnimating) return

    setIsAnimating(true)

    if (direction === "right") {
      const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]")
      const newPlace = {
        id: currentSpot.id.toString(),
        name: currentSpot.name,
        location: currentSpot.location,
        image: currentSpot.image,
        rating: currentSpot.rating,
        timing: currentSpot.openHours,
        entry: currentSpot.price,
        description: currentSpot.description,
        savedAt: new Date().toISOString(),
      }

      if (!savedPlaces.some((place: any) => place.id === newPlace.id)) {
        const updated = [...savedPlaces, newPlace]
        localStorage.setItem("savedPlaces", JSON.stringify(updated))
      }
    } else if (direction === "up") {
      router.push(`/hotel/${encodeURIComponent(currentSpot.name)}`)
      return
    }

    if (cardRef.current) {
      let exitTransform = ""
      if (direction === "up") {
        exitTransform = "translateY(-150%) rotate(0deg)"
      } else {
        const exitX = direction === "right" ? "150%" : "-150%"
        const exitRotation = direction === "right" ? "30deg" : "-30deg"
        exitTransform = `translateX(${exitX}) rotate(${exitRotation})`
      }

      cardRef.current.style.transform = exitTransform
      cardRef.current.style.opacity = "0"
    }

    setTimeout(() => {
      if (currentIndex === spots.length - 1) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
      setIsAnimating(false)

      if (cardRef.current) {
        cardRef.current.style.transform = "translateX(0) translateY(0) rotate(0deg)"
        cardRef.current.style.opacity = "1"
        const overlay = cardRef.current.querySelector(".swipe-overlay") as HTMLElement
        if (overlay) overlay.style.opacity = "0"
      }
    }, 400)
  }

  const handleShare = async () => {
    const shareData = {
      title: `${currentSpot.name} - Karnataka Tourism`,
      text: `🏛️ ${currentSpot.name}\n📍 ${currentSpot.location}\n⭐ ${currentSpot.rating}/5\n💰 ${currentSpot.price}\n🕒 ${currentSpot.openHours}\n\n${currentSpot.description}`,
      url: `${window.location.origin}/hotel/${encodeURIComponent(currentSpot.name)}`,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\n🔗 ${shareData.url}`)
        const toast = document.createElement("div")
        toast.className =
          "fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg z-50"
        toast.textContent = "Link copied to clipboard!"
        document.body.appendChild(toast)
        setTimeout(() => document.body.removeChild(toast), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/60 animate-pulse"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/10 rounded-full animate-bounce delay-3000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Discover Karnataka</h1>
          <p className="text-white/70 text-sm">
            {currentIndex + 1} of {spots.length} • Swipe to explore
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowInfo(!showInfo)}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          <Info className="h-6 w-6" />
        </Button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div
          ref={cardRef}
          className="relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing transition-all duration-300"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleEnd}
        >
          <div className="swipe-overlay absolute inset-0 z-20 opacity-0 transition-opacity duration-200"></div>

          <div className="absolute inset-0">
            <img
              src={currentSpot.image || "/placeholder.svg?height=600&width=400"}
              alt={currentSpot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{currentSpot.rating}</span>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">{currentSpot.distance}</span>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${currentSpot.safetyColor === "text-green-400" ? "bg-green-400" : currentSpot.safetyColor === "text-yellow-400" ? "bg-yellow-400" : "bg-orange-400"}`}
                  ></div>
                  <span className="text-xs font-semibold">{currentSpot.safetyScore}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    currentSpot.isOpen ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
                  }`}
                >
                  {currentSpot.isOpen ? `Open • ${currentSpot.closingIn}` : "Closed"}
                </div>

                <div className="flex gap-1 flex-wrap justify-end">
                  {currentSpot.tags.map((tag) => (
                    <span key={tag} className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-green-400">{currentSpot.price}</div>
                {currentSpot.originalPrice && (
                  <div className="text-lg text-white/60 line-through">{currentSpot.originalPrice}</div>
                )}
                <div className="text-sm text-white/80">per person</div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-1">{currentSpot.name}</h2>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm opacity-90">{currentSpot.location}</span>
                </div>
              </div>

              {showInfo && (
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 space-y-3 animate-in slide-in-from-bottom duration-300">
                  <p className="text-sm leading-relaxed opacity-90">{currentSpot.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs opacity-75">
                    <div className="flex items-center gap-1">
                      <span>🕒</span>
                      <span>{currentSpot.openHours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      <span>{currentSpot.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🛡️</span>
                      <span className={currentSpot.safetyColor}>{currentSpot.safetyLevel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📊</span>
                      <span className={currentSpot.safetyColor}>{currentSpot.safetyScore}/10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center gap-6 pb-12">
        <Button
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-red-500/90 hover:bg-red-500 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all hover:scale-110"
        >
          <X className="h-8 w-8" />
        </Button>

        <Button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0 || isAnimating}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          onClick={() => handleSwipe("up")}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-blue-500/90 hover:bg-blue-500 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all hover:scale-110"
        >
          <Navigation className="h-8 w-8" />
        </Button>

        <Button
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-green-500/90 hover:bg-green-500 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all hover:scale-110"
        >
          <Heart className="h-8 w-8" />
        </Button>

        <Button
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-purple-500/90 hover:bg-purple-500 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center space-y-1">
        <p className="text-white/60 text-sm">← Reject • ↑ Visit • → Save • Share</p>
        <p className="text-white/40 text-xs">Swipe or tap buttons to interact</p>
      </div>
    </div>
  )
}
