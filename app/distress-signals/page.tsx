"use client"

import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Phone,
  Users,
  Clock,
  Navigation,
  Share2,
  Eye,
  Home,
  CreditCard,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface DistressSignal {
  id: string
  type: string
  location: string
  distance: string
  severity: "high" | "medium" | "low"
  time: string
  description: string
  reportedBy: number
  status: "active" | "resolved" | "investigating"
}

export default function DistressSignalsPage() {
  const router = useRouter()
  const [signals, setSignals] = useState<DistressSignal[]>([])
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all")

  useEffect(() => {
    // Simulate real-time distress signals
    const mockSignals: DistressSignal[] = [
      {
        id: "1",
        type: "Road Accident",
        location: "NH-48, Near Mysore",
        distance: "2.3 km",
        severity: "high",
        time: "5 mins ago",
        description: "Multi-vehicle collision reported. Emergency services on route.",
        reportedBy: 12,
        status: "active",
      },
      {
        id: "2",
        type: "Flash Flood Warning",
        location: "Coorg District",
        distance: "15.7 km",
        severity: "high",
        time: "12 mins ago",
        description: "Heavy rainfall causing flash floods in low-lying areas.",
        reportedBy: 8,
        status: "active",
      },
      {
        id: "3",
        type: "Tourist Stranded",
        location: "Hampi Archaeological Site",
        distance: "45.2 km",
        severity: "medium",
        time: "25 mins ago",
        description: "Group of tourists lost in restricted area after sunset.",
        reportedBy: 3,
        status: "investigating",
      },
      {
        id: "4",
        type: "Medical Emergency",
        location: "Gokarna Beach",
        distance: "67.8 km",
        severity: "high",
        time: "18 mins ago",
        description: "Tourist requiring immediate medical attention.",
        reportedBy: 6,
        status: "active",
      },
      {
        id: "5",
        type: "Landslide Alert",
        location: "Chikmagalur Hills",
        distance: "89.1 km",
        severity: "medium",
        time: "1 hour ago",
        description: "Landslide blocking main road. Alternative routes advised.",
        reportedBy: 15,
        status: "investigating",
      },
      {
        id: "6",
        type: "Wildlife Encounter",
        location: "Bandipur National Park",
        distance: "34.5 km",
        severity: "low",
        time: "2 hours ago",
        description: "Elephant herd spotted near tourist trail.",
        reportedBy: 4,
        status: "resolved",
      },
    ]

    setSignals(mockSignals)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((signal) => ({
          ...signal,
          reportedBy:
            signal.status === "active" ? signal.reportedBy + Math.floor(Math.random() * 3) : signal.reportedBy,
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredSignals = signals.filter((signal) => filter === "all" || signal.severity === filter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-600"
      case "investigating":
        return "text-orange-600"
      case "resolved":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const shareSignal = (signal: DistressSignal) => {
    const text = `🚨 DISTRESS ALERT 🚨\n\n${signal.type} - ${signal.location}\n${signal.description}\n\nReported ${signal.time} | Distance: ${signal.distance}\nStatus: ${signal.status.toUpperCase()}`

    if (navigator.share) {
      navigator.share({
        title: "Distress Signal Alert",
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert("Alert details copied to clipboard!")
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
          <h1 className="text-xl font-semibold text-foreground text-center">Distress Signals</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Live Status */}
      <div className="px-4 mb-4">
        <Card className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-foreground">Live Monitoring</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {signals.filter((s) => s.status === "active").length} active alerts
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Signals", count: signals.length },
            { key: "high", label: "High Priority", count: signals.filter((s) => s.severity === "high").length },
            { key: "medium", label: "Medium", count: signals.filter((s) => s.severity === "medium").length },
            { key: "low", label: "Low Priority", count: signals.filter((s) => s.severity === "low").length },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "outline"}
              onClick={() => setFilter(filterOption.key as any)}
              className={`flex-shrink-0 rounded-full transition-all duration-300 ${
                filter === filterOption.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-card-foreground border-border hover:bg-muted"
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Signals List */}
      <div className="flex-1 px-4 pb-20">
        <div className="space-y-4">
          {filteredSignals.map((signal) => (
            <Card
              key={signal.id}
              className="placard-3d overflow-hidden bg-card border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(signal.severity)}`}></div>
                    <h3 className="font-semibold text-foreground">{signal.type}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(signal.status)} bg-muted`}
                    >
                      {signal.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => shareSignal(signal)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{signal.location}</span>
                    <span className="text-xs">• {signal.distance} away</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{signal.time}</span>
                    <Users className="h-4 w-4 ml-2" />
                    <span>{signal.reportedBy} reports</span>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-4 leading-relaxed">{signal.description}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const location = encodeURIComponent(signal.location)
                      window.open(`https://maps.google.com/?q=${location}`, "_blank")
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/distress-details/${signal.id}`)}
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>

                  {signal.status === "active" && (
                    <Button
                      size="sm"
                      onClick={() => window.open("tel:100")}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Signals Found</h3>
            <p className="text-muted-foreground">No distress signals match your current filter.</p>
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
