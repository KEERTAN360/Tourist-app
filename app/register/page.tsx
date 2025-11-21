"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, User, Lock, Mail, Phone, Calendar } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    durationOfStay: "",
  })
  const [error, setError] = useState("")

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.durationOfStay) {
      setError("Please fill in all required fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      setError("")
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", formData.username)
      localStorage.setItem("durationOfStay", formData.durationOfStay)
      localStorage.setItem("email", formData.email)
      localStorage.setItem("phone", formData.phone)
      if (!localStorage.getItem("joinDate")) {
        localStorage.setItem("joinDate", new Date().toLocaleDateString())
      }
      router.push("/")
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/travel-background-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0"
        style={{
          boxShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Us</h1>
          <p className="text-gray-600">Create your Karnataka travel account</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Select
              value={formData.durationOfStay}
              onValueChange={(value) => setFormData({ ...formData, durationOfStay: value })}
            >
              <SelectTrigger className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300">
                <SelectValue placeholder="Duration of Stay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3-days">1-3 Days (Short Trip)</SelectItem>
                <SelectItem value="4-7-days">4-7 Days (Week Trip)</SelectItem>
                <SelectItem value="1-2-weeks">1-2 Weeks (Extended Stay)</SelectItem>
                <SelectItem value="2-4-weeks">2-4 Weeks (Long Stay)</SelectItem>
                <SelectItem value="1-3-months">1-3 Months (Extended Visit)</SelectItem>
                <SelectItem value="3-6-months">3-6 Months (Long Term)</SelectItem>
                <SelectItem value="6-months-plus">6+ Months (Resident)</SelectItem>
                <SelectItem value="permanent">Permanent Resident</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</div>}

          <Button
            onClick={handleRegister}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="text-green-600 font-semibold p-0 h-auto"
              >
                Sign in here
              </Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
