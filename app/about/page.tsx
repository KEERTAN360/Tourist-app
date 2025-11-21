"use client"
import { ArrowLeft, User, MapPin, Camera, Utensils, Plane, Heart, Music, Gamepad2, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const router = useRouter()
  const [age, setAge] = useState("")
  const [travelType, setTravelType] = useState("")
  const [drinks, setDrinks] = useState(false)
  const [budget, setBudget] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [travelStyle, setTravelStyle] = useState("")
  const [foodPreference, setFoodPreference] = useState("")
  const [accommodation, setAccommodation] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [disabilities, setDisabilities] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Load existing preferences
    const savedAge = localStorage.getItem("userAge")
    const savedTravelType = localStorage.getItem("userTravelType")
    const savedDrinks = localStorage.getItem("userDrinks")
    const savedBudget = localStorage.getItem("userBudget")
    const savedInterests = localStorage.getItem("userInterests")
    const savedTravelStyle = localStorage.getItem("userTravelStyle")
    const savedFoodPreference = localStorage.getItem("userFoodPreference")
    const savedAccommodation = localStorage.getItem("userAccommodation")
    const savedLanguages = localStorage.getItem("userLanguages")
    const savedDisabilities = localStorage.getItem("userDisabilities")
    const savedEmergencyContact = localStorage.getItem("userEmergencyContact")

    if (savedAge) setAge(savedAge)
    if (savedTravelType) setTravelType(savedTravelType)
    if (savedDrinks) setDrinks(savedDrinks === "true")
    if (savedBudget) setBudget(savedBudget)
    if (savedInterests) setInterests(JSON.parse(savedInterests))
    if (savedTravelStyle) setTravelStyle(savedTravelStyle)
    if (savedFoodPreference) setFoodPreference(savedFoodPreference)
    if (savedAccommodation) setAccommodation(savedAccommodation)
    if (savedLanguages) setLanguages(JSON.parse(savedLanguages))
    if (savedDisabilities) setDisabilities(savedDisabilities)
    if (savedEmergencyContact) setEmergencyContact(savedEmergencyContact)
  }, [router])

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const toggleLanguage = (language: string) => {
    setLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const handleSave = async () => {
    // Save to localStorage for instant UX
    localStorage.setItem("userAge", age)
    localStorage.setItem("userTravelType", travelType)
    localStorage.setItem("userDrinks", drinks.toString())
    localStorage.setItem("userBudget", budget)
    localStorage.setItem("userInterests", JSON.stringify(interests))
    localStorage.setItem("userTravelStyle", travelStyle)
    localStorage.setItem("userFoodPreference", foodPreference)
    localStorage.setItem("userAccommodation", accommodation)
    localStorage.setItem("userLanguages", JSON.stringify(languages))
    localStorage.setItem("userDisabilities", disabilities)
    localStorage.setItem("userEmergencyContact", emergencyContact)

    // Persist to backend
    const username = localStorage.getItem("username") || "guest"
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          age,
          travelType,
          drinks,
          budget,
          interests,
          travelStyle,
          foodPreference,
          accommodation,
          languages,
          disabilities,
          emergencyContact,
        }),
      })
    } catch {}

    router.push("/")
  }

  const interestOptions = [
    { id: "heritage", label: "Heritage Sites", icon: MapPin },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "food", label: "Food & Cuisine", icon: Utensils },
    { id: "adventure", label: "Adventure Sports", icon: Plane },
    { id: "wellness", label: "Wellness & Spa", icon: Heart },
    { id: "music", label: "Music & Arts", icon: Music },
    { id: "nightlife", label: "Nightlife", icon: Gamepad2 },
    { id: "learning", label: "Learning & Culture", icon: Book },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background border-b border-border shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground hover:bg-muted rounded-xl"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">About Yourself</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Tell us about yourself</h2>
            <p className="text-muted-foreground">Help us personalize your Karnataka experience</p>
          </div>

          <div className="space-y-8">
            {/* Age Group */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Age Group</label>
              <div className="grid grid-cols-3 gap-3">
                {["18-25", "26-35", "36-45", "46-60", "60+"].map((ageGroup) => (
                  <Button
                    key={ageGroup}
                    variant={age === ageGroup ? "default" : "outline"}
                    onClick={() => setAge(ageGroup)}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      age === ageGroup
                        ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {ageGroup}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Travel Type */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Travel Type</label>
              <div className="grid grid-cols-2 gap-3">
                {["Solo", "Couple", "Family", "Friends"].map((type) => (
                  <Button
                    key={type}
                    variant={travelType === type ? "default" : "outline"}
                    onClick={() => setTravelType(type)}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      travelType === type
                        ? "bg-secondary text-secondary-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Budget Range */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Budget Range (per day)</label>
              <div className="grid grid-cols-2 gap-3">
                {["₹1,000-2,500", "₹2,500-5,000", "₹5,000-10,000", "₹10,000+"].map((budgetRange) => (
                  <Button
                    key={budgetRange}
                    variant={budget === budgetRange ? "default" : "outline"}
                    onClick={() => setBudget(budgetRange)}
                    className={`h-12 rounded-xl transition-all duration-300 text-sm ${
                      budget === budgetRange
                        ? "bg-accent text-accent-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {budgetRange}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Interests */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">
                Interests (select multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <Button
                    key={interest.id}
                    variant={interests.includes(interest.id) ? "default" : "outline"}
                    onClick={() => toggleInterest(interest.id)}
                    className={`h-16 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
                      interests.includes(interest.id)
                        ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <interest.icon className="h-5 w-5" />
                    <span className="text-xs text-center">{interest.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Travel Style */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Travel Style</label>
              <div className="grid grid-cols-2 gap-3">
                {["Planned", "Spontaneous", "Luxury", "Budget", "Adventure", "Relaxed"].map((style) => (
                  <Button
                    key={style}
                    variant={travelStyle === style ? "default" : "outline"}
                    onClick={() => setTravelStyle(style)}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      travelStyle === style
                        ? "bg-secondary text-secondary-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Food Preference */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Food Preference</label>
              <div className="grid grid-cols-2 gap-3">
                {["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "No Restrictions", "Halal"].map((food) => (
                  <Button
                    key={food}
                    variant={foodPreference === food ? "default" : "outline"}
                    onClick={() => setFoodPreference(food)}
                    className={`h-12 rounded-xl transition-all duration-300 text-sm ${
                      foodPreference === food
                        ? "bg-accent text-accent-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {food}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Accommodation Preference */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Accommodation Preference</label>
              <div className="grid grid-cols-2 gap-3">
                {["Hotels", "Homestays", "Hostels", "Resorts", "Guesthouses", "Camping"].map((acc) => (
                  <Button
                    key={acc}
                    variant={accommodation === acc ? "default" : "outline"}
                    onClick={() => setAccommodation(acc)}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      accommodation === acc
                        ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {acc}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Languages You Speak</label>
              <div className="grid grid-cols-3 gap-3">
                {["English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam", "Marathi", "Bengali", "Gujarati"].map(
                  (lang) => (
                    <Button
                      key={lang}
                      variant={languages.includes(lang) ? "default" : "outline"}
                      onClick={() => toggleLanguage(lang)}
                      className={`h-12 rounded-xl transition-all duration-300 text-sm ${
                        languages.includes(lang)
                          ? "bg-secondary text-secondary-foreground shadow-lg transform scale-105"
                          : "bg-card text-card-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {lang}
                    </Button>
                  ),
                )}
              </div>
            </Card>

            {/* Accessibility Needs */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Accessibility Needs</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "None",
                  "Wheelchair Access",
                  "Visual Impairment",
                  "Hearing Impairment",
                  "Mobility Issues",
                  "Other",
                ].map((disability) => (
                  <Button
                    key={disability}
                    variant={disabilities === disability ? "default" : "outline"}
                    onClick={() => setDisabilities(disability)}
                    className={`h-12 rounded-xl transition-all duration-300 text-sm ${
                      disabilities === disability
                        ? "bg-accent text-accent-foreground shadow-lg transform scale-105"
                        : "bg-card text-card-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {disability}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Emergency Contact Number</label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Enter emergency contact number"
                className="w-full h-12 px-4 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This will be used in case of emergencies during your travel
              </p>
            </Card>

            {/* Drinks */}
            <Card className="p-6 bg-card border border-border rounded-2xl">
              <label className="text-lg font-semibold text-card-foreground mb-4 block">Do you drink alcohol?</label>
              <div className="flex items-center justify-center gap-6 p-6 bg-muted border border-border rounded-2xl">
                <span
                  className={`text-lg transition-colors duration-300 ${!drinks ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  No
                </span>
                <div
                  className="relative w-20 h-10 bg-border rounded-full cursor-pointer transition-all duration-300 hover:shadow-md"
                  onClick={() => setDrinks(!drinks)}
                >
                  <div
                    className={`absolute top-1 left-1 w-8 h-8 rounded-full transition-all duration-500 ease-out transform ${
                      drinks ? "translate-x-10 bg-primary shadow-lg" : "translate-x-0 bg-background shadow-md"
                    }`}
                  />
                </div>
                <span
                  className={`text-lg transition-colors duration-300 ${drinks ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  Yes
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm border-t border-border">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSave}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-white/20 backdrop-blur-sm"
          >
            💾 Save My Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
