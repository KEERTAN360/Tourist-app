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
  User,
  Hotel,
  ArrowLeft,
  HelpCircle,
  LogOut,
  Calendar,
  Shield,
  Moon,
  Sun,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import WeatherWidget from "@/components/weather-widget"
import FloatingDropdown from "@/components/floating-dropdown"
import FloatingSafetyMonitor from "@/components/floating-safety-monitor"
import AIHelper from "@/components/ai-helper"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const router = useRouter()
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [showFloatingDropdown, setShowFloatingDropdown] = useState(false)
  const [showSafetyMonitor, setShowSafetyMonitor] = useState(false)
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  const [travelType, setTravelType] = useState("")
  const [drinks, setDrinks] = useState(false)
  const { t } = useLanguage()
  const { resolvedTheme, setTheme } = useTheme()

  const mainTiles = [
    {
      icon: MapPin,
      label: t("touristSpots"),
      bgColor: "gradient-blue",
      href: "/tourist-spots",
      bgImage: "/beautiful-tourist-destinations-with-temples-and-mo.jpg",
    },
    {
      icon: CreditCard,
      label: t("pay"),
      bgColor: "gradient-green",
      href: "/pay",
      bgImage: "/digital-payment-and-mobile-banking-interface.jpg",
    },
    {
      icon: FileText,
      label: t("documents"),
      bgColor: "gradient-purple",
      href: "/documents",
      bgImage: "/official-documents-and-travel-papers.jpg",
    },
    {
      icon: AlertTriangle,
      label: t("sos"),
      bgColor: "gradient-red",
      href: "/sos",
    },
    {
      icon: Hotel,
      label: t("services"),
      bgColor: "gradient-orange",
      href: "/services",
      bgImage: "/travel-services-and-tour-guide-assistance.jpg",
    },
  ]

  const famousTourGuides = [
    { name: "Rajesh Kumar", image: "/dynamic-tour-guide-rajesh.jpg", specialty: "Heritage Sites" },
    { name: "Priya Sharma", image: "/dynamic-tour-guide-priya.jpg", specialty: "Adventure Tours" },
    { name: "Arjun Reddy", image: "/dynamic-tour-guide-arjun.jpg", specialty: "Hill Stations" },
    { name: "Meera Nair", image: "/dynamic-tour-guide-meera.jpg", specialty: "Beach Destinations" },
  ]

  const ourPicks = [
    {
      name: "Mysore Palace",
      image: "/dynamic-mysore-palace-placard.jpg",
      timing: "10 AM - 5:30 PM",
      entry: "₹70",
      rating: 4.8,
    },
    {
      name: "Coorg Hills",
      image: "/dynamic-coorg-hills-placard.jpg",
      timing: "6 AM - 6 PM",
      entry: "Free",
      rating: 4.6,
    },
    {
      name: "Hampi Ruins",
      image: "/dynamic-hampi-ruins-placard.jpg",
      timing: "6 AM - 6 PM",
      entry: "₹40",
      rating: 4.9,
    },
    {
      name: "Gokarna Beach",
      image: "/dynamic-gokarna-beach-placard.jpg",
      timing: "24 Hours",
      entry: "Free",
      rating: 4.7,
    },
  ]

  const recommendedHotels = [
    {
      name: "Heritage Palace Resort",
      image: "/recommended-hotel-1.jpg",
      price: "₹8,500/night",
      rating: 4.8,
      location: "Mysore",
    },
    {
      name: "Urban Boutique Hotel",
      image: "/recommended-hotel-2.jpg",
      price: "₹4,200/night",
      rating: 4.6,
      location: "Bangalore",
    },
    {
      name: "Mountain Eco Lodge",
      image: "/recommended-hotel-3.jpg",
      price: "₹6,800/night",
      rating: 4.7,
      location: "Coorg",
    },
  ]

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const storedUsername = localStorage.getItem("username")

    if (!isLoggedIn) {
      router.push("/login")
    } else if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [router])

  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 bg-background border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-card text-card-foreground hover:bg-muted border border-border shadow-md"
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {t("hello")}, {username}
            </p>
            <h1 className="text-xl font-bold text-foreground">{t("exploreKarnataka")}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md h-10 w-10"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground bg-blue-500 rounded-xl hover:bg-blue-600 shadow-lg h-10 w-10"
            onClick={() => setShowSafetyMonitor(true)}
          >
            <Shield className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md h-10 w-10"
            onClick={() => setShowFloatingDropdown(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showSidePanel && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidePanel(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-card-foreground">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidePanel(false)}
                  className="text-foreground hover:bg-muted"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-4 h-auto text-foreground hover:bg-muted"
                >
                  {/* Added icons for need help and feedback */}
                  <Star className="h-5 w-5 mr-3" />
                  <span>Need help?</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-4 h-auto text-foreground hover:bg-muted"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  <span>Feedback</span>
                </Button>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-left p-4 h-auto text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <FloatingDropdown
        isOpen={showFloatingDropdown}
        onClose={() => setShowFloatingDropdown(false)}
        onLogout={handleLogout}
      />

      {showSafetyMonitor && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-start p-4 z-40"
          onClick={() => setShowSafetyMonitor(false)}
        >
          <div 
            className="w-full max-w-sm mt-16 ml-4 bg-card/95 backdrop-blur-md border border-border overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FloatingSafetyMonitor 
              isActive={true} 
              onClose={() => setShowSafetyMonitor(false)}
            />
          </div>
        </div>
      )}

      <div className="pb-4 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder={t("findSpots")}
            className="pl-10 bg-input border border-border rounded-full h-12 text-center text-foreground placeholder:text-muted-foreground shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 mb-6">
        <WeatherWidget />
      </div>

      <div className="flex-1 pb-20">
        <div className="grid grid-cols-2 gap-4 mb-8 px-4">
          {mainTiles.map((tile, index) => (
            <div
              key={tile.label}
              onClick={() => handleNavigation(tile.href)}
              className={`
                placard-3d relative p-6 h-32 flex flex-col items-center justify-center cursor-pointer
                rounded-3xl overflow-hidden group
                ${index === 0 ? "col-span-2" : ""}
                ${tile.bgColor}
              `}
            >
              {tile.bgImage && (
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url('${tile.bgImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                <tile.icon className="h-8 w-8 mb-2 drop-shadow-lg text-white" />
                <span className="text-sm font-medium text-center font-semibold drop-shadow-lg text-white">
                  {tile.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Admin quick access removed per request */}

        <div className="mb-8 px-4">
          <Button
            onClick={() => router.push("/itinerary")}
            className="w-full p-6 h-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6" />
              <div className="text-center">
                <h2 className="text-lg font-semibold">Plan Your Itinerary</h2>
                <p className="text-sm text-white/80">Create and manage your travel plans</p>
              </div>
            </div>
          </Button>
        </div>

        <div className="mb-8 px-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("famousTourGuides")}</h2>
          <div
            onClick={() => handleNavigation("/services")}
            className="placard-3d flex gap-4 overflow-x-auto pb-2 banner-gradient rounded-3xl p-4 shadow-md cursor-pointer scrollbar-hide"
          >
            {famousTourGuides.map((guide, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-card to-muted shadow-md overflow-hidden border-2 border-white/30 mb-2">
                  <img
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-white font-medium">{guide.name}</p>
                <p className="text-xs text-white/80">{guide.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card text-card-foreground shadow-md border border-border">
              <Star className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t("ourPicks")}</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {ourPicks.map((place, index) => (
              <Card
                key={index}
                className="placard-3d flex-shrink-0 w-48 rounded-3xl overflow-hidden bg-card border border-border cursor-pointer"
              >
                <div className="relative">
                  <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-90">Open: {place.timing}</p>
                        <p className="text-xs opacity-90">Entry: {place.entry}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-card-foreground text-center">{place.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card text-card-foreground shadow-md border border-border">
              <Hotel className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t("recommendedHotels")}</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedHotels.map((hotel, index) => (
              <Card
                key={index}
                className="placard-3d flex-shrink-0 w-52 rounded-3xl overflow-hidden bg-card border border-border cursor-pointer"
              >
                <div className="relative">
                  <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-90">{hotel.location}</p>
                        <p className="text-sm font-semibold">{hotel.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-card-foreground text-center">{hotel.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8 px-4">
          <Button
            onClick={() => router.push("/location-sharing")}
            className="placard-3d w-full p-6 h-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <MapPin className="h-6 w-6" />
              <div className="text-center">
                <h2 className="text-lg font-semibold">Share Live Location</h2>
                <p className="text-sm text-white/80">Keep friends & family informed of your whereabouts</p>
              </div>
            </div>
          </Button>
        </div>

        <div className="mb-8 px-4">
          <Button
            onClick={() => router.push("/about")}
            className="placard-3d w-full p-6 h-auto bg-gradient-to-r from-primary to-accent rounded-3xl text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-2">
              <User className="h-8 w-8" />
              <h2 className="text-lg font-semibold">{t("tellUsAboutYourself")}</h2>
              <p className="text-sm text-primary-foreground/80">{t("personalizeExperience")}</p>
            </div>
          </Button>
        </div>

        <div className="px-4">
          <Card className="placard-3d bg-card border border-border rounded-3xl p-8 text-center shadow-md">
            <h2 className="text-xl font-bold text-card-foreground mb-2">{t("aboutUs")}</h2>
            <p className="text-muted-foreground text-sm">{t("trustedCompanion")}</p>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: t("home"), active: true, href: "/" },
            { icon: MapPin, label: t("touristSpots"), href: "/tourist-spots" },
            { icon: CreditCard, label: t("pay"), href: "/pay" },
            { icon: FileText, label: t("documents"), href: "/documents" },
            { icon: AlertTriangle, label: t("sos"), href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto transition-all duration-300 rounded-xl ${
                item.active
                  ? "text-white bg-gradient-to-r from-primary to-primary/80 shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-muted-foreground">{t("madeInBangalore")}</p>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}
