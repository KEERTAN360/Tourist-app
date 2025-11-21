"use client"
import {
  Search,
  Menu,
  Home,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  LogOut,
  X,
  Star,
  Phone,
  LocateOffIcon as LocationIcon,
  DollarSign,
  Users,
  Award,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ServicesPage() {
  const router = useRouter()
  const [showSidePanel, setShowSidePanel] = useState(false)

  const tourGuides = [
    {
      name: "Rajesh Kumar",
      image: "/professional-indian-male-tour-guide-smiling-with-t.jpg",
      nicheImage: "/heritage-temple-architecture-karnataka.jpg", // Updated to use new heritage temple image
      rating: 4.9,
      experience: "8 years",
      speciality: "Heritage Tours",
      price: "₹2,500/day",
      phone: "+91 98765 43210",
    },
    {
      name: "Priya Sharma",
      image: "/professional-indian-female-tour-guide-with-traditi.jpg",
      nicheImage: "/wildlife-safari-bandipur-national-park.jpg", // Updated to use new wildlife safari image
      rating: 4.8,
      experience: "6 years",
      speciality: "Nature & Wildlife",
      price: "₹2,200/day",
      phone: "+91 98765 43211",
    },
    {
      name: "Arjun Reddy",
      image: "/young-indian-male-adventure-tour-guide-with-backpa.jpg",
      nicheImage: "/adventure-trekking-western-ghats-karnataka.jpg", // Updated to use new adventure trekking image
      rating: 4.7,
      experience: "5 years",
      speciality: "Adventure Tours",
      price: "₹2,000/day",
      phone: "+91 98765 43212",
    },
    {
      name: "Meera Nair",
      image: "/experienced-indian-female-tour-guide-with-hat-and-.jpg",
      nicheImage: "/cultural-dance-performance-karnataka.jpg", // Updated to use new cultural dance image
      rating: 4.9,
      experience: "10 years",
      speciality: "Cultural Tours",
      price: "₹2,800/day",
      phone: "+91 98765 43213",
    },
  ]

  const localGuides = [
    {
      name: "Suresh Gowda",
      location: "Mysore",
      rating: 4.6,
      languages: "Kannada, English, Hindi",
      price: "₹1,500/day",
    },
    {
      name: "Lakshmi Devi",
      location: "Coorg",
      rating: 4.8,
      languages: "Kannada, English",
      price: "₹1,200/day",
    },
    {
      name: "Ravi Kumar",
      location: "Hampi",
      rating: 4.7,
      languages: "Kannada, English, Telugu",
      price: "₹1,800/day",
    },
    {
      name: "Anita Rao",
      location: "Gokarna",
      rating: 4.5,
      languages: "Kannada, English, Marathi",
      price: "₹1,000/day",
    },
  ]

  const forexCenters = [
    {
      name: "Karnataka Forex Exchange",
      location: "MG Road, Bangalore",
      rating: 4.8,
      services: "USD, EUR, GBP, AED",
      hours: "9:00 AM - 7:00 PM",
      phone: "+91 80 2558 9900",
    },
    {
      name: "Global Money Exchange",
      location: "Commercial Street, Bangalore",
      rating: 4.6,
      services: "All Major Currencies",
      hours: "10:00 AM - 8:00 PM",
      phone: "+91 80 2559 1100",
    },
    {
      name: "Quick Forex Solutions",
      location: "Brigade Road, Bangalore",
      rating: 4.7,
      services: "USD, EUR, SGD, AUD",
      hours: "9:30 AM - 6:30 PM",
      phone: "+91 80 2560 2200",
    },
    {
      name: "City Forex Center",
      location: "Jayanagar, Bangalore",
      rating: 4.5,
      services: "USD, EUR, GBP, CAD",
      hours: "10:00 AM - 7:00 PM",
      phone: "+91 80 2661 3300",
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 text-center">Services</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => setShowSidePanel(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search services..."
            className="pl-10 bg-gray-100 border-0 rounded-full h-12 text-center"
          />
        </div>
      </div>

      {/* Side Panel */}
      {showSidePanel && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidePanel(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSidePanel(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start text-left p-4 h-auto">
                  <HelpCircle className="h-5 w-5 mr-3" />
                  <span>Need help?</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start text-left p-4 h-auto">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <span>Feedback</span>
                </Button>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20 space-y-8">
        {/* Famous Tour Guides */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-orange-500" />
            Famous Tour Guides
          </h2>
          <div className="space-y-6">
            {tourGuides.map((guide, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Left side - Niche image */}
                  <div className="absolute left-0 top-0 w-1/2 h-full">
                    <img
                      src={guide.nicheImage || "/placeholder.svg"}
                      alt={`${guide.speciality} specialty`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right side - Guide image */}
                  <div className="absolute right-0 top-0 w-1/2 h-full">
                    <img
                      src={guide.image || "/placeholder.svg"}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center overlay with guide info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <div className="p-4 text-white w-full">
                      <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-lg">{guide.name}</h3>
                      <p className="text-sm text-white/90 drop-shadow-md">{guide.speciality}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">{guide.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">{guide.experience} experience</span>
                    </div>
                    <span className="text-base font-semibold text-green-600">{guide.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Verified Expert</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open(`tel:${guide.phone}`, "_self")}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Local Guides */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Local Guides
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {localGuides.map((guide, index) => (
              <Card key={index} className="p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{guide.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{guide.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <LocationIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{guide.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Languages: {guide.languages}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">{guide.price}</span>
                  <Button size="sm" variant="outline">
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Forex Trade Centers */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            Forex Trade Centers
          </h2>
          <div className="space-y-4">
            {forexCenters.map((center, index) => (
              <Card key={index} className="p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{center.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{center.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <LocationIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{center.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Services: {center.services}</p>
                <p className="text-sm text-gray-600 mb-3">Hours: {center.hours}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{center.phone}</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
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
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto ${
                item.label === "Services" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
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
