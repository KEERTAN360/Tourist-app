"use client"
import {
  FileText,
  Shield,
  Plane,
  Menu,
  Home,
  MapPin,
  CreditCard,
  AlertTriangle,
  Upload,
  Camera,
  ArrowLeft,
  Check,
  X,
  Bot,
  AlertCircle,
  IdCard,
  QrCode,
  Search,
  HelpCircle,
  Phone,
  User,
  Calendar,
  MapPin as MapPinIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

export default function DocumentsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])
  const [showInsuranceSummary, setShowInsuranceSummary] = useState(false)
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null)
  const [importInsuranceText, setImportInsuranceText] = useState("")
  const [importInsuranceResult, setImportInsuranceResult] = useState<any>(null)

  // Digital ID states
  const [isScanning, setIsScanning] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [qrExpiry, setQrExpiry] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const [rulesResult, setRulesResult] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock user data
  const userData = {
    name: "Keertan Vijay",
    dob: "2003-10-18",
    nationality: "Indian",
    address: "123 Main St, Bangalore, Karnataka",
    phone: "+91 8310377633",
    email: "keertan.vijay@gmail.com"
  }

  const documentCategories = [
    {
      icon: FileText,
      label: "Government Documents",
      bgColor: "from-blue-500 to-blue-600",
      id: "government",
    },
    {
      icon: Shield,
      label: "Insurance",
      bgColor: "from-green-500 to-green-600",
      id: "insurance",
    },
    {
      icon: Plane,
      label: "Import Insurance",
      bgColor: "from-purple-500 to-purple-600",
      id: "import",
    },
  ]

  const governmentDocTypes = [
    { id: "passport", label: "Passport", icon: "🛂", required: true },
    { id: "license", label: "Driving License", icon: "🚗", required: false },
    { id: "student", label: "Student ID", icon: "🎓", required: false, condition: "If applicable" },
    { id: "visa", label: "Visa", icon: "✈️", required: false, condition: "If applicable" },
  ]

  const insuranceOptions = [
    {
      id: "travel",
      name: "Travel Insurance",
      icon: "🛡️",
      provider: "HDFC ERGO",
      coverage: ["Medical emergencies", "Trip cancellation", "Lost baggage", "Flight delays"],
      doesNotCover: ["Pre-existing conditions", "Adventure sports", "War/terrorism"],
      premium: "₹2,500/year",
    },
    {
      id: "health",
      name: "Health Insurance",
      icon: "🏥",
      provider: "Star Health",
      coverage: ["Hospitalization", "Day care procedures", "Pre/post hospitalization", "Ambulance"],
      doesNotCover: ["Cosmetic surgery", "Dental treatment", "Maternity (first year)"],
      premium: "₹15,000/year",
    },
    {
      id: "vehicle",
      name: "Vehicle Insurance",
      icon: "🚗",
      provider: "ICICI Lombard",
      coverage: ["Third party liability", "Own damage", "Theft protection", "Natural disasters"],
      doesNotCover: ["Normal wear and tear", "Mechanical breakdown", "Drunk driving"],
      premium: "₹8,500/year",
    },
    {
      id: "life",
      name: "Life Insurance",
      icon: "❤️",
      provider: "LIC India",
      coverage: ["Death benefit", "Maturity benefit", "Tax benefits", "Loan facility"],
      doesNotCover: ["Suicide (first year)", "War", "Self-inflicted injuries"],
      premium: "₹25,000/year",
    },
  ]

  const handleDocumentUpload = (docType: string) => {
    // Simulate file upload
    const newDoc = {
      id: Date.now(),
      type: docType,
      name: `${docType}_document.pdf`,
      uploadDate: new Date().toLocaleDateString(),
      status: "verified",
    }
    setUploadedDocuments([...uploadedDocuments, newDoc])
  }

  const handleInsuranceAnalysis = (insurance: any) => {
    setSelectedInsurance(insurance)
    setShowInsuranceSummary(true)
  }

  const handleImportInsurance = () => {
    // Simulate AI analysis of imported insurance
    const isValidInIndia = Math.random() > 0.3 // 70% chance of being valid

    setImportInsuranceResult({
      isValid: isValidInIndia,
      provider: "International Insurance Co.",
      coverage: ["Emergency medical", "Repatriation"],
      validInIndia: isValidInIndia,
      recommendation: isValidInIndia
        ? "This insurance is valid in India and provides adequate coverage for your travel."
        : "This insurance is NOT valid in India. We recommend purchasing local travel insurance.",
    })
  }

  // Digital ID functions
  const generateQRCode = () => {
    const qrData = {
      userId: "user123",
      timestamp: Date.now(),
      name: userData.name,
      documents: uploadedDocuments.filter(doc => doc.status === "verified")
    }

    setQrCode(JSON.stringify(qrData))
    setQrExpiry(30) // 30 seconds

    // Start countdown
    const interval = setInterval(() => {
      setQrExpiry(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setQrCode(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setIsScanning(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setRulesResult(null)
    try {
      const res = await fetch('/api/ai/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      const data = await res.json()
      if (res.ok) {
        setRulesResult(data?.text || 'No response received.')
      } else {
        setRulesResult(`Error: ${data?.error || 'Server error occurred.'}`)
      }
    } catch (e) {
      setRulesResult('Error: Unable to connect to rules assistant. Please try again later.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleHelp = () => {
    setShowHelp(true)
  }

  const callSeniorAuthority = () => {
    // Mock call to senior authority
    alert("Calling Senior Authority...\n\nThis would typically initiate a call to the local tourism authority or emergency services.")
  }

  const reportAbuse = () => {
    // Mock abuse reporting
    alert("Reporting abuse...\n\nThis would typically open a form to report any misuse or abuse of the Digital ID system.")
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  const [activeCaptureDoc, setActiveCaptureDoc] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Load documents from API
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const username = localStorage.getItem("username") || "guest"
        const res = await fetch(`/api/documents?username=${username}`)
        if (res.ok) {
          const data = await res.json()
          if (data.documents && data.documents.length > 0) {
            setUploadedDocuments(prev => {
              // Merge existing mock docs with new API docs, avoiding duplicates
              const newDocs = data.documents.filter((d: any) => !prev.some(p => p.id === d.id))
              return [...prev, ...newDocs]
            })
          }
        }
      } catch (e) {
        console.error("Failed to fetch documents", e)
      }
    }
    fetchDocs()
  }, [])

  const startCapture = async (docType: string) => {
    setActiveCaptureDoc(docType)
    setCapturedImage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
      setActiveCaptureDoc(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
        stopScanner()
      }
    }
  }

  const saveCapturedDocument = async () => {
    if (!capturedImage || !activeCaptureDoc) return

    setIsUploading(true)
    try {
      const username = localStorage.getItem("username") || "guest"
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeCaptureDoc,
          image: capturedImage,
          username,
          metadata: {
            capturedAt: new Date().toISOString(),
            device: navigator.userAgent
          }
        })
      })

      if (res.ok) {
        const data = await res.json()
        setUploadedDocuments(prev => [...prev, data.document])
        setActiveCaptureDoc(null)
        setCapturedImage(null)
      } else {
        alert("Failed to save document")
      }
    } catch (e) {
      console.error("Upload failed", e)
      alert("Failed to upload document")
    } finally {
      setIsUploading(false)
    }
  }

  const cancelCapture = () => {
    stopScanner()
    setActiveCaptureDoc(null)
    setCapturedImage(null)
  }

  if (selectedCategory === "government") {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 p-4 pt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedCategory(null)}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground text-center">Government Documents</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHelp}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 pb-20 space-y-6">
          {/* User Profile Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.nationality}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">DOB:</span>
                <span className="font-medium">{userData.dob}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium">{userData.address}</span>
              </div>
            </div>
          </Card>

          {/* Capture Modal/Section */}
          {activeCaptureDoc && (
            <Card className="p-6 border-primary border-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Capture {governmentDocTypes.find(d => d.id === activeCaptureDoc)?.label}</h3>
                <Button variant="ghost" size="icon" onClick={cancelCapture}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {!capturedImage ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 border-2 border-white rounded-lg opacity-50"></div>
                    </div>
                  </div>
                  <Button onClick={captureImage} className="w-full h-12 text-lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={capturedImage} alt="Captured" className="w-full h-64 object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setCapturedImage(null)} variant="outline" className="flex-1">
                      Retake
                    </Button>
                    <Button onClick={saveCapturedDocument} disabled={isUploading} className="flex-1 bg-green-600 hover:bg-green-700">
                      {isUploading ? "Saving..." : "Save to Blockchain"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* User Documents Status */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Your Documents Status</h3>
            </div>

            <div className="space-y-3">
              {governmentDocTypes.map((docType) => {
                const uploadedDoc = uploadedDocuments.find(d => d.type === docType.id)
                const isSubmitted = !!uploadedDoc

                return (
                  <div key={docType.id} className={`flex items-center justify-between p-3 rounded-lg border ${isSubmitted ? "bg-green-50 border-green-100" : "bg-muted border-transparent"}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{docType.icon}</div>
                      <div>
                        <p className={`font-medium ${isSubmitted ? "text-green-900" : "text-foreground"}`}>{docType.label}</p>
                        {isSubmitted && (
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <Shield className="h-3 w-3" /> Blockchain Verified
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={isSubmitted ? "default" : "outline"} className={isSubmitted ? "bg-green-600 hover:bg-green-700" : ""}>
                        {isSubmitted ? "Submitted" : "Not Submitted"}
                      </Badge>
                      {isSubmitted && (
                        <p className="text-xs text-muted-foreground mt-1">{uploadedDoc.uploadDate}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>


          {/* Traditional Document Upload / Capture List */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Capture Documents</h3>
            </div>

            <div className="space-y-4">
              {governmentDocTypes.map((docType) => (
                <div key={docType.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{docType.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{docType.label}</h3>
                      {docType.condition && <p className="text-xs text-muted-foreground">{docType.condition}</p>}
                      {docType.required && <p className="text-xs text-destructive">Required</p>}
                    </div>
                  </div>
                  {uploadedDocuments.find((doc) => doc.type === docType.id) ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">Saved</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startCapture(docType.id)}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Capture
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Help Section */}
          {showHelp && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Help & Support</h3>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={callSeniorAuthority}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Senior Authority
                </Button>
                <Button
                  onClick={reportAbuse}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report Abuse
                </Button>
                <Button
                  onClick={() => setShowHelp(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-border rounded-2xl">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-foreground mb-1">Secure Document Storage</h3>
              <p className="text-sm text-muted-foreground">
                All documents are encrypted and stored securely with blockchain verification
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (selectedCategory === "insurance") {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 p-4 pt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedCategory(null)}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground text-center">Insurance Management</h1>
          </div>
        </div>

        <div className="px-4 pb-20">
          <div className="space-y-4">
            {insuranceOptions.map((insurance) => (
              <Card key={insurance.id} className="placard-3d p-4 bg-card border border-border rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{insurance.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{insurance.name}</h3>
                      <p className="text-sm text-muted-foreground">{insurance.provider}</p>
                      <p className="text-xs text-accent font-medium">{insurance.premium}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleInsuranceAnalysis(insurance)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl"
                  >
                    <Bot className="h-4 w-4 mr-1" />
                    Summarize with AI
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Covers</span>
                    </div>
                    <ul className="space-y-1">
                      {insurance.coverage.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="text-xs text-green-700">
                          • {item}
                        </li>
                      ))}
                      {insurance.coverage.length > 2 && (
                        <li className="text-xs text-green-600">+{insurance.coverage.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Doesn't Cover</span>
                    </div>
                    <ul className="space-y-1">
                      {insurance.doesNotCover.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="text-xs text-red-700">
                          • {item}
                        </li>
                      ))}
                      {insurance.doesNotCover.length > 2 && (
                        <li className="text-xs text-red-600">+{insurance.doesNotCover.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-border rounded-2xl">
            <h3 className="font-semibold text-foreground mb-3">Recommended Insurance</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your travel patterns and profile, we recommend:
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                Travel Insurance
              </Button>
              <Button size="sm" variant="outline" className="border-border hover:bg-muted rounded-xl bg-transparent">
                Health Insurance
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Insurance Summary Modal */}
        {showInsuranceSummary && selectedInsurance && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Insurance Summary</h3>
                  </div>
                  <Button
                    onClick={() => setShowInsuranceSummary(false)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{selectedInsurance.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      This {selectedInsurance.name.toLowerCase()} policy from {selectedInsurance.provider} offers
                      comprehensive coverage for {selectedInsurance.premium} annually. It's particularly strong in
                      emergency situations and provides good value for money.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-xl">
                      <h5 className="text-sm font-medium text-green-800 mb-2">✅ What's Covered</h5>
                      <ul className="space-y-1">
                        {selectedInsurance.coverage.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs text-green-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 p-3 rounded-xl">
                      <h5 className="text-sm font-medium text-red-800 mb-2">❌ Not Covered</h5>
                      <ul className="space-y-1">
                        {selectedInsurance.doesNotCover.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs text-red-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-xl">
                    <h5 className="text-sm font-medium text-blue-800 mb-1">💡 AI Recommendation</h5>
                    <p className="text-xs text-blue-700">
                      This policy is well-suited for frequent travelers and provides excellent emergency coverage.
                      Consider upgrading if you engage in adventure activities.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowInsuranceSummary(false)}
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                >
                  Got it
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  if (selectedCategory === "import") {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 p-4 pt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedCategory(null)}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground text-center">Import Insurance</h1>
          </div>
        </div>

        <div className="px-4 pb-20">
          <Card className="placard-3d p-6 bg-card border border-border rounded-2xl shadow-md mb-6">
            <h3 className="font-semibold text-foreground mb-4">Check Insurance Validity in India</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste your international insurance policy details below to check if it's valid in India.
            </p>

            <textarea
              value={importInsuranceText}
              onChange={(e) => setImportInsuranceText(e.target.value)}
              placeholder="Paste your insurance policy details here..."
              className="w-full h-32 p-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />

            <Button
              onClick={handleImportInsurance}
              disabled={!importInsuranceText.trim()}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-xl"
            >
              <Bot className="h-4 w-4 mr-2" />
              Analyze with AI
            </Button>
          </Card>

          {importInsuranceResult && (
            <Card
              className={`placard-3d p-6 border rounded-2xl shadow-md ${importInsuranceResult.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {importInsuranceResult.isValid ? (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={`font-semibold ${importInsuranceResult.isValid ? "text-green-800" : "text-red-800"}`}>
                    {importInsuranceResult.isValid ? "Valid in India ✅" : "Not Valid in India ❌"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{importInsuranceResult.provider}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Coverage Analysis</h4>
                  <ul className="space-y-1">
                    {importInsuranceResult.coverage.map((item: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl ${importInsuranceResult.isValid ? "bg-green-100" : "bg-red-100"}`}>
                  <h4
                    className={`font-medium mb-2 ${importInsuranceResult.isValid ? "text-green-800" : "text-red-800"}`}
                  >
                    AI Recommendation
                  </h4>
                  <p className={`text-sm ${importInsuranceResult.isValid ? "text-green-700" : "text-red-700"}`}>
                    {importInsuranceResult.recommendation}
                  </p>
                </div>

                {!importInsuranceResult.isValid && (
                  <Button
                    onClick={() => setSelectedCategory("insurance")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                  >
                    Browse Indian Insurance Options
                  </Button>
                )}
              </div>
            </Card>
          )}

          <Card className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-border rounded-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="font-semibold text-foreground">Important Note</h3>
                <p className="text-sm text-muted-foreground">
                  International insurance policies may have limited coverage in India. Always verify with your provider
                  before traveling.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-4 p-4 pt-6 bg-background border-b border-border shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground text-center">Documents</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {documentCategories.map((category, index) => (
            <Card
              key={category.label}
              onClick={() => setSelectedCategory(category.id)}
              className={`placard-3d p-6 h-24 flex items-center justify-center cursor-pointer
                rounded-2xl text-white bg-gradient-to-r ${category.bgColor}
                shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0`}
            >
              <category.icon className="h-8 w-8 mr-4 text-white" />
              <span className="text-lg font-semibold text-center text-white">{category.label}</span>
            </Card>
          ))}
        </div>

        {/* QR Code Generator */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <QrCode className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Generate QR Code</h3>
          </div>

          {qrCode ? (
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-white border-2 border-border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-24 w-24 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">QR Code Generated</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Expires in {qrExpiry} seconds</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Generate a secure QR code for verification</p>
              <Button onClick={generateQRCode} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            </div>
          )}
        </Card>

        {/* AI Search for Rules */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">AI Search for Rules</h3>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Search for travel rules, regulations, or requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleSearch} className="w-full" disabled={!searchQuery.trim() || isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search Rules"}
            </Button>
            {rulesResult && (
              <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">AI Rules Response</h4>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{rulesResult}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Insurance Recommendations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Insurance Access</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {insuranceOptions.map((insurance, index) => (
              <Card
                key={index}
                onClick={() => handleInsuranceAnalysis(insurance)}
                className="placard-3d flex-shrink-0 w-48 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card border border-border"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{insurance.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{insurance.name}</h3>
                  <p className="text-sm text-muted-foreground">{insurance.provider}</p>
                  <Button size="sm" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Summary
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Secure Storage Info */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-muted/50 to-accent/10 rounded-2xl border border-border shadow-sm">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Blockchain Secured</h3>
            <p className="text-sm text-muted-foreground">
              Your documents are encrypted and stored securely using blockchain technology
            </p>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", href: "/pay" },
            { icon: FileText, label: "Documents", active: true, href: "/documents" },
            { icon: AlertTriangle, label: "SOS", href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.href && router.push(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto rounded-xl transition-all duration-300 ${item.active
                ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
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
