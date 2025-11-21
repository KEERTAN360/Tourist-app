"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const loginUser = async () => {
    try {
      setError("")
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
      localStorage.removeItem("isAdmin")
      router.push("/")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const loginAdmin = async () => {
    try {
      setError("")
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Admin login failed")
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
      localStorage.setItem("isAdmin", "true")
      router.push("/admin")
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/travel-background-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0"
        style={{
          boxShadow: "0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(59, 130, 246, 0.3)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to explore Karnataka</p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid grid-cols-2 rounded-2xl mb-4">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
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

              {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</div>}

              <Button
                onClick={loginUser}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.7), 0 0 50px rgba(59, 130, 246, 0.4)" }}
              >
                Sign In
              </Button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    onClick={() => router.push("/register")}
                    className="text-blue-600 font-semibold p-0 h-auto"
                  >
                    Register here
                  </Button>
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
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

              {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</div>}

              <Button
                onClick={loginAdmin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.7), 0 0 50px rgba(59, 130, 246, 0.4)" }}
              >
                Sign In (Admin)
              </Button>
              <p className="text-xs text-gray-400 text-center">Admin credentials are managed manually.</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Demo — Admin: Admin/12345 • User: keertan/12345</p>
        </div>
      </Card>
    </div>
  )
}
