"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  QrCode,
  Camera,
  UserSearch,
  Siren,
  BellRing,
  Upload,
  FileText,
  ListChecks,
  CheckCircle2,
  HelpCircle,
  LogOut,
  ArrowLeft,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminDashboardPage() {
  const router = useRouter()

  // Scan QR / Physical ID
  const [isScanning, setIsScanning] = useState(false)
  const [manualId, setManualId] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  // Issue Fine
  const [fineUserId, setFineUserId] = useState("")
  const [fineReason, setFineReason] = useState("")
  const [fineAmount, setFineAmount] = useState("")

  // Geofencing
  const [breaches, setBreaches] = useState(
    [
      { id: "T-1023", name: "Asha Kumar", lastSeen: "Cubbon Park Gate 2", minutesOutside: 8 },
      { id: "T-1044", name: "Rohit Singh", lastSeen: "Nandi Base Trail", minutesOutside: 14 },
      { id: "T-1088", name: "Sara Ali", lastSeen: "Mysore Palace East", minutesOutside: 3 },
    ] as Array<{ id: string; name: string; lastSeen: string; minutesOutside: number }>
  )

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (e) {
      alert("Camera permission denied or unavailable.")
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
    }
    setIsScanning(false)
  }

  useEffect(() => {
    return () => stopScanner()
  }, [])

  const verifyManualId = () => {
    if (!manualId.trim()) {
      alert("Enter a valid ID")
      return
    }
    alert(`Verified ID: ${manualId}`)
  }

  const issueFine = () => {
    if (!fineUserId || !fineReason || !fineAmount) {
      alert("Fill all fine details")
      return
    }
    alert(`Fine issued to ${fineUserId}\nReason: ${fineReason}\nAmount: ₹${fineAmount}`)
    setFineUserId("")
    setFineReason("")
    setFineAmount("")
  }

  const alertTourist = (id: string) => {
    alert(`Alert sent to ${id} to return inside geofence.`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 bg-background border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-card text-card-foreground hover:bg-muted border border-border shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Authorized access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/sos")} className="w-10 h-10 rounded-full bg-card border border-border">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="w-10 h-10 rounded-full bg-card border border-border">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Row: Scan or Enter ID */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Scan QR or Enter Physical ID</h2>
          </div>
          {!isScanning ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={startScanner} className="h-10">
                <Camera className="h-4 w-4 mr-2" /> Start Scanner
              </Button>
              <Input
                placeholder="Enter Physical ID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="h-10"
              />
              <Button onClick={verifyManualId} variant="outline" className="h-10">
                <UserSearch className="h-4 w-4 mr-2" /> Verify ID
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
              </div>
              <Button onClick={stopScanner} variant="outline" className="w-full">Stop Scanner</Button>
            </div>
          )}
        </Card>

        {/* Row: Issue Fine */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Siren className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Issue a Fine</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Tourist ID" value={fineUserId} onChange={(e) => setFineUserId(e.target.value)} className="h-10" />
            <Input placeholder="Reason" value={fineReason} onChange={(e) => setFineReason(e.target.value)} className="h-10" />
            <Input type="number" placeholder="Amount (₹)" value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} className="h-10" />
            <Button onClick={issueFine} className="h-10">
              <Upload className="h-4 w-4 mr-2" /> Issue Fine
            </Button>
          </div>
        </Card>

        {/* Row: Geofencing Breaches */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellRing className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Geofencing Breaches</h2>
          </div>
          <div className="space-y-3">
            {breaches.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div>
                  <p className="font-medium">{b.name} ({b.id})</p>
                  <p className="text-xs text-muted-foreground">Last seen: {b.lastSeen} • {b.minutesOutside} min outside</p>
                </div>
                <Button size="sm" onClick={() => alertTourist(b.id)} className="h-9">
                  Send Alert
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Extra Options */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Extra Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button variant="outline" onClick={() => router.push("/e-fir")} className="justify-start">
              <FileText className="h-4 w-4 mr-2" /> e-FIR
            </Button>
            <Button variant="outline" onClick={() => router.push("/travel-history")} className="justify-start">
              <ListChecks className="h-4 w-4 mr-2" /> Past Reports
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/unresolved")} className="justify-start">
              <Siren className="h-4 w-4 mr-2" /> Unresolved Issues
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/resolved")} className="justify-start">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Resolved Issues
            </Button>
            <Button variant="outline" onClick={() => router.push("/sos")} className="justify-start">
              <HelpCircle className="h-4 w-4 mr-2" /> Help
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}


