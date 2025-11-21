"use client"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Camera,
  Menu,
  Home,
  CreditCard,
  FileText,
  BookOpen,
  Radio,
  ArrowLeft,
  X,
  ChevronRight,
  Mic,
  MicOff,
  Share2,
  ImageIcon,
  Zap,
  Send,
  Video,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function SOSPage() {
  const router = useRouter()
  const [isSOSActive, setIsSOSActive] = useState(false)
  const [holdTimer, setHoldTimer] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [showCancelSlider, setShowCancelSlider] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [emergencyActivated, setEmergencyActivated] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<any>(null)
  const [panicActivated, setPanicActivated] = useState(false)
  const [locationSharing, setLocationSharing] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([])
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sosRecords, setSosRecords] = useState<any[]>([])
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
  const [username, setUsername] = useState("guest")
  const [photoInterval, setPhotoInterval] = useState<NodeJS.Timeout | null>(null)
  const [photoCount, setPhotoCount] = useState(0)
  const [frontCameraStream, setFrontCameraStream] = useState<MediaStream | null>(null)
  const [backCameraStream, setBackCameraStream] = useState<MediaStream | null>(null)
  const [currentSOSRecordId, setCurrentSOSRecordId] = useState<string | null>(null)

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + " " + finalTranscript)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }

    const savedContacts = localStorage.getItem("emergencyContacts")
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts))
    }

    // Get username from localStorage
    const storedUsername = localStorage.getItem("username") || "guest"
    setUsername(storedUsername)

    // Load SOS records
    loadSOSRecords(storedUsername)

    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Location error:", error)
        },
      )
    }
  }

  const loadSOSRecords = async (username: string) => {
    try {
      const res = await fetch(`/api/sos-records?username=${encodeURIComponent(username)}&limit=5`, { 
        cache: 'no-store' 
      })
      const data = await res.json()
      if (res.ok) {
        setSosRecords(data.records || [])
      }
    } catch (error) {
      console.error("Failed to load SOS records:", error)
    }
  }

  const handleVideoAccess = () => {
    setShowVideoModal(true)
  }

  const playVideo = async (recordId: string) => {
    try {
      const [videoRes, photosRes] = await Promise.all([
        fetch(`/api/sos-video?recordId=${recordId}&username=${encodeURIComponent(username)}`),
        fetch(`/api/sos-photos?recordId=${recordId}&username=${encodeURIComponent(username)}`)
      ])
      
      const videoData = await videoRes.json()
      const photosData = await photosRes.json()
      
      if (videoRes.ok && videoData.videoData) {
        setSelectedVideo(videoData)
      } else {
        alert("No video available for this emergency record")
      }
      
      if (photosRes.ok && photosData.photos) {
        setSelectedPhotos(photosData.photos)
      } else {
        setSelectedPhotos([])
      }
    } catch (error) {
      console.error("Failed to load video/photos:", error)
      alert("Failed to load video/photos")
    }
  }

  const loadPhotos = async (recordId: string) => {
    try {
      const res = await fetch(`/api/sos-photos?recordId=${recordId}&username=${encodeURIComponent(username)}`)
      const data = await res.json()
      if (res.ok && data.photos) {
        return data.photos
      }
    } catch (error) {
      console.error("Failed to load photos:", error)
    }
    return []
  }

  const closeVideoModal = () => {
    setShowVideoModal(false)
    setSelectedVideo(null)
    setSelectedPhotos([])
  }

  const setupDualCameras = async () => {
    try {
      // Get back camera (environment)
      const backStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      })
      setBackCameraStream(backStream)

      // Get front camera (user)
      const frontStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false, // Only one audio stream
      })
      setFrontCameraStream(frontStream)

      // Set the back camera as primary video
      if (videoRef.current) {
        videoRef.current.srcObject = backStream
      }

      return { backStream, frontStream }
    } catch (error) {
      console.error("Dual camera setup failed:", error)
      // Fallback to single camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: true,
        })
        setBackCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        return { backStream: stream, frontStream: null }
      } catch (fallbackError) {
        console.error("Single camera fallback failed:", fallbackError)
        throw fallbackError
      }
    }
  }

  const capturePhoto = async (cameraType: "front" | "back", stream: MediaStream) => {
    try {
      const canvas = document.createElement('canvas')
      const video = document.createElement('video')
      
      video.srcObject = stream
      video.play()
      
      await new Promise(resolve => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          resolve(true)
        }
      })
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(async (blob) => {
          if (blob && currentSOSRecordId) {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('recordId', currentSOSRecordId)
            formData.append('photo', blob, `photo_${cameraType}_${Date.now()}.jpg`)
            formData.append('cameraType', cameraType)
            formData.append('timestamp', Date.now().toString())
            
            try {
              await fetch('/api/sos-photos', {
                method: 'POST',
                body: formData
              })
              console.log(`Photo captured from ${cameraType} camera`)
            } catch (error) {
              console.error('Failed to save photo:', error)
            }
          }
        }, 'image/jpeg', 0.8)
      }
    } catch (error) {
      console.error(`Failed to capture photo from ${cameraType} camera:`, error)
    }
  }

  const startPhotoCapture = () => {
    setPhotoCount(0)
    
    const captureInterval = setInterval(async () => {
      if (photoCount >= 5) {
        clearInterval(captureInterval)
        setPhotoInterval(null)
        return
      }

      // Capture from both cameras if available
      if (backCameraStream) {
        await capturePhoto("back", backCameraStream)
      }
      if (frontCameraStream) {
        await capturePhoto("front", frontCameraStream)
      }

      setPhotoCount(prev => prev + 1)
    }, 5000) // Every 5 seconds

    setPhotoInterval(captureInterval)
  }

  const stopPhotoCapture = () => {
    if (photoInterval) {
      clearInterval(photoInterval)
      setPhotoInterval(null)
    }
    setPhotoCount(0)
  }

  const createSOSRecord = async () => {
    try {
      const response = await fetch('/api/sos-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          emergencyType: 'panic',
          location: currentLocation,
          emergencyContacts: emergencyContacts.map(c => c.phone),
          metadata: {
            deviceInfo: navigator.userAgent,
            appVersion: '1.0.0',
            batteryLevel: (navigator as any).getBattery ? await (navigator as any).getBattery().then((battery: any) => Math.round(battery.level * 100)) : null,
            networkType: (navigator as any).connection?.effectiveType || 'unknown'
          }
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        setCurrentSOSRecordId(data.record._id)
        return data.record._id
      }
    } catch (error) {
      console.error('Failed to create SOS record:', error)
    }
    return null
  }

  const activatePanicButton = async () => {
    setPanicActivated(true)
    setEmergencyActivated(true)

    // Create SOS record first
    const recordId = await createSOSRecord()
    if (recordId) {
      setCurrentSOSRecordId(recordId)
    }

    // Immediately start location sharing
    startLocationSharing()

    // Setup dual cameras
    try {
      await setupDualCameras()
      setShowCamera(true)
      
      // Start photo capture (5 photos every 5 seconds)
      startPhotoCapture()
    } catch (error) {
      console.error("Camera setup failed:", error)
    }

    // Send immediate alerts to emergency contacts
    sendEmergencyAlerts()

    // Auto-call emergency services after 10 seconds
    setTimeout(() => {
      window.open("tel:112")
    }, 10000)
  }

  const startLocationSharing = () => {
    setLocationSharing(true)

    // Update location every 30 seconds
    locationIntervalRef.current = setInterval(() => {
      getCurrentLocation()
      if (currentLocation) {
        shareLocationWithContacts()
      }
    }, 30000)
  }

  const stopLocationSharing = () => {
    setLocationSharing(false)
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current)
    }
  }

  const sendEmergencyAlerts = () => {
    if (emergencyContacts.length === 0) {
      alert("No emergency contacts found. Please add contacts in settings.")
      return
    }

    const alertMessage = `🚨 EMERGENCY ALERT 🚨\n\nI need immediate help! This is an automated emergency message.\n\nTime: ${new Date().toLocaleString()}\n\n${currentLocation ? `Location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}` : "Location unavailable"}\n\nPlease contact emergency services or come to my location immediately!`

    // Simulate sending SMS/notifications to emergency contacts
    emergencyContacts.forEach((contact) => {
      console.log(`Sending emergency alert to ${contact.name}: ${contact.phone}`)
      // In a real app, this would integrate with SMS API
    })

    // Show confirmation
    alert(`Emergency alerts sent to ${emergencyContacts.length} contacts`)
  }

  const shareLocationWithContacts = () => {
    if (!currentLocation) return

    const locationMessage = `📍 Live Location Update\n\nI'm currently at: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}\n\nTime: ${new Date().toLocaleString()}\n\nThis is an automated location update.`

    if (navigator.share) {
      navigator.share({
        title: "Live Location Update",
        text: locationMessage,
        url: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`,
      })
    } else {
      navigator.clipboard.writeText(locationMessage)
      alert("Location copied to clipboard!")
    }
  }

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true)
      setTranscript("")
      recognition.start()
    }
  }

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false)
      recognition.stop()
    }
  }

  const shareLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const locationText = `Emergency! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`

            if (navigator.share) {
              navigator.share({
                title: "Emergency Location",
                text: locationText,
                url: `https://maps.google.com/?q=${latitude},${longitude}`,
              })
            } else {
              navigator.clipboard.writeText(locationText)
              alert("Location copied to clipboard!")
            }
          },
          (error) => {
            console.error("Location error:", error)
            alert("Unable to get location. Please enable location services.")
          },
        )
      }
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  const shareEmergencyDetails = () => {
    const emergencyText = `🚨 EMERGENCY ALERT 🚨\n\nI need immediate help!\n\n${transcript ? `Issue: ${transcript}\n\n` : ""}Please contact emergency services or come to my location immediately.\n\nTime: ${new Date().toLocaleString()}`

    if (navigator.share) {
      navigator.share({
        title: "Emergency Alert",
        text: emergencyText,
      })
    } else {
      navigator.clipboard.writeText(emergencyText)
      alert("Emergency details copied to clipboard!")
    }
  }

  const handleSOSActivation = async () => {
    setEmergencyActivated(true)
    setShowCamera(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access denied:", error)
    }

    setTimeout(() => {
      setIsSOSActive(true)
    }, 1000)
  }

  const handleSOSMouseDown = () => {
    if (emergencyActivated) return

    setIsHolding(true)
    setHoldTimer(0)
    setShowCancelSlider(true)

    holdIntervalRef.current = setInterval(() => {
      setHoldTimer((prev) => {
        const newTimer = prev + 0.1
        if (newTimer >= 5) {
          handleSOSActivation()
          clearInterval(holdIntervalRef.current!)
          setIsHolding(false)
          setShowCancelSlider(false)
          return 5
        }
        return newTimer
      })
    }, 100)
  }

  const handleSOSMouseUp = () => {
    if (emergencyActivated) return

    setIsHolding(false)
    setHoldTimer(0)
    setShowCancelSlider(false)
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
    }
  }

  const handleSliderStart = (clientX: number) => {
    setIsDragging(true)
    setSliderPosition(0)
  }

  const handleSliderMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const maxWidth = rect.width - 60
    const newPosition = Math.max(0, Math.min(maxWidth, clientX - rect.left - 30))
    setSliderPosition(newPosition)

    if (newPosition > maxWidth * 0.8) {
      handleCancelSOS()
    }
  }

  const handleSliderEnd = () => {
    setIsDragging(false)
    setSliderPosition(0)
  }

  const handleCancelSOS = () => {
    setIsHolding(false)
    setHoldTimer(0)
    setShowCancelSlider(false)
    setSliderPosition(0)
    setIsDragging(false)
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const resetEmergency = () => {
    setEmergencyActivated(false)
    setIsSOSActive(false)
    setPanicActivated(false)
    stopCamera()
    stopRecording()
    stopLocationSharing()
    stopPhotoCapture()
    setTranscript("")
    setCurrentSOSRecordId(null)
    
    // Stop camera streams
    if (frontCameraStream) {
      frontCameraStream.getTracks().forEach(track => track.stop())
      setFrontCameraStream(null)
    }
    if (backCameraStream) {
      backCameraStream.getTracks().forEach(track => track.stop())
      setBackCameraStream(null)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleSliderMove(e.clientX)
    const handleMouseUp = () => handleSliderEnd()
    const handleTouchMove = (e: TouchEvent) => handleSliderMove(e.touches[0].clientX)
    const handleTouchEnd = () => handleSliderEnd()

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current)
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current)
      }
      stopCamera()
      if (recognition) {
        recognition.stop()
      }
    }
  }, [recognition])

  if (showCamera && emergencyActivated) {
    return (
      <div className="min-h-screen bg-black relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/50">
            <Button
              onClick={resetEmergency}
              variant="ghost"
              size="icon"
              className="text-white bg-white/20 rounded-full hover:bg-white/30"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="text-center">
              <h1 className="text-white font-semibold">Emergency Recording</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">LIVE</span>
                {locationSharing && (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-2"></div>
                    <span className="text-white text-sm">TRACKING</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-10" />
          </div>

          <div className="absolute top-20 left-4 right-4">
            <Card
              className={`${panicActivated ? "bg-orange-500/90" : "bg-red-500/90"} backdrop-blur-sm border-0 p-4 rounded-2xl`}
            >
              <div className="text-center text-white">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <h2 className="font-bold text-lg">{panicActivated ? "PANIC ACTIVATED" : "EMERGENCY ACTIVATED"}</h2>
                <p className="text-sm opacity-90">Location shared • Authorities notified</p>
                <p className="text-xs opacity-75 mt-1">Recording started automatically</p>
                {panicActivated && <p className="text-xs opacity-90 mt-1">Emergency contacts alerted</p>}
              </div>
            </Card>
          </div>

          {transcript && (
            <div className="absolute top-48 left-4 right-4">
              <Card className="bg-black/70 backdrop-blur-sm border-0 p-3 rounded-2xl">
                <div className="text-white">
                  <p className="text-xs opacity-75 mb-1">Recorded Issue:</p>
                  <p className="text-sm">{transcript}</p>
                </div>
              </Card>
            </div>
          )}

          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-mono text-lg">{Math.floor(holdTimer * 10) / 10}s</span>
            </div>
          </div>

          {/* Photo Capture Progress */}
          {photoCount > 0 && (
            <div className="absolute top-32 left-4 right-4">
              <Card className="bg-blue-500/90 backdrop-blur-sm border-0 p-3 rounded-2xl">
                <div className="text-center text-white">
                  <Camera className="h-6 w-6 mx-auto mb-2" />
                  <h3 className="font-bold text-sm">PHOTO CAPTURE ACTIVE</h3>
                  <p className="text-xs opacity-90">Photos: {photoCount}/5 • Every 5 seconds</p>
                  <div className="mt-2 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(photoCount / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => window.open("tel:100")}
                className="bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-2xl h-16 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <Phone className="h-5 w-5 mb-1" />
                <span className="text-xs">Call 100</span>
              </Button>

              <Button
                onClick={shareLocation}
                className="bg-green-500/80 hover:bg-green-600/80 text-white rounded-2xl h-16 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <MapPin className="h-5 w-5 mb-1" />
                <span className="text-xs">Share Location</span>
              </Button>

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`${isRecording ? "bg-red-600/80 hover:bg-red-700/80" : "bg-purple-500/80 hover:bg-purple-600/80"} text-white rounded-2xl h-16 flex flex-col items-center justify-center backdrop-blur-sm`}
              >
                {isRecording ? <MicOff className="h-5 w-5 mb-1" /> : <Mic className="h-5 w-5 mb-1" />}
                <span className="text-xs">{isRecording ? "Stop" : "Record"}</span>
              </Button>

              <Button
                onClick={shareEmergencyDetails}
                className="bg-orange-500/80 hover:bg-orange-600/80 text-white rounded-2xl h-16 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <Share2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-xl font-semibold text-foreground text-center">Emergency SOS</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVideoAccess}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
            title="View Emergency Videos"
          >
            <Video className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-20 flex flex-col items-center">
        <div className="w-full mb-6">
          <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg mb-2">INSTANT PANIC BUTTON</h3>
              <p className="text-sm opacity-90">Immediate emergency activation - No hold required</p>
            </div>
            <Button
              onClick={activatePanicButton}
              disabled={emergencyActivated}
              className="w-full h-16 bg-white/20 hover:bg-white/30 text-white font-bold text-xl rounded-xl backdrop-blur-sm border-2 border-white/30 transition-all duration-300 hover:scale-105"
            >
              <Zap className="h-8 w-8 mr-3" />
              {emergencyActivated ? "PANIC ACTIVE" : "PANIC"}
            </Button>
          </Card>
        </div>

        <div className="w-full mb-6">
          <Card className="p-4 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">Real-time Location Sharing</h3>
                <p className="text-sm text-muted-foreground">Share live location with emergency contacts</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${locationSharing ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
              ></div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={locationSharing ? stopLocationSharing : startLocationSharing}
                className={`flex-1 ${locationSharing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {locationSharing ? "Stop Sharing" : "Start Sharing"}
              </Button>
              <Button onClick={shareLocationWithContacts} variant="outline" className="flex-1 bg-transparent">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Hold SOS button for 5 seconds to activate</p>
          {isHolding && (
            <p className="text-xs text-destructive font-medium mt-1">
              Activating in {Math.ceil(5 - holdTimer)} seconds...
            </p>
          )}
        </div>

        <div className="w-full mb-6">
          <Card className="p-4 bg-card border border-border rounded-2xl">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-foreground mb-2">Describe Your Emergency</h3>
              <p className="text-xs text-muted-foreground">Tap to record your issue using voice</p>
            </div>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full h-12 rounded-xl transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            {transcript && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Recorded:</p>
                <p className="text-sm text-foreground">{transcript}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setTranscript("")} className="text-xs">
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={shareEmergencyDetails}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="flex-1 flex items-center justify-center my-12 relative">
          <div className="relative">
            <Button
              onMouseDown={handleSOSMouseDown}
              onMouseUp={handleSOSMouseUp}
              onMouseLeave={handleSOSMouseUp}
              onTouchStart={handleSOSMouseDown}
              onTouchEnd={handleSOSMouseUp}
              disabled={emergencyActivated}
              className={`w-64 h-64 rounded-full text-white font-bold text-2xl transition-all duration-300 transform relative overflow-hidden border-4 ${
                emergencyActivated
                  ? "bg-gradient-to-br from-green-500 to-green-600 border-green-300"
                  : isSOSActive
                    ? "bg-gradient-to-br from-red-500 to-red-600 scale-110 animate-pulse border-red-300"
                    : isHolding
                      ? "bg-gradient-to-br from-red-600 to-red-700 scale-105 border-red-400"
                      : "bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 hover:scale-105 border-red-200"
              }`}
              style={{
                boxShadow: isSOSActive
                  ? "0 8px 32px rgba(239, 68, 68, 0.4)"
                  : isHolding
                    ? "0 6px 24px rgba(239, 68, 68, 0.5)"
                    : "0 4px 20px rgba(239, 68, 68, 0.3)",
              }}
            >
              {isHolding && (
                <div className="absolute inset-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r="115" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
                    <circle
                      cx="120"
                      cy="120"
                      r="115"
                      stroke="white"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 115}`}
                      strokeDashoffset={`${2 * Math.PI * 115 * (1 - holdTimer / 5)}`}
                      className="transition-all duration-100 ease-linear"
                      style={{
                        filter: "drop-shadow(0 0 12px rgba(255,255,255,0.9))",
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">{Math.ceil(5 - holdTimer)}</div>
                      <div className="text-sm text-white/80">seconds</div>
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex flex-col items-center relative z-10 ${isHolding ? "opacity-30" : ""}`}>
                <AlertTriangle className="h-16 w-16 mb-4" />
                <span>{emergencyActivated ? "ACTIVE" : "SOS"}</span>
                {isSOSActive && <div className="text-sm mt-2 animate-pulse">ACTIVATED</div>}
              </div>
            </Button>
          </div>
        </div>

        {showCancelSlider && isHolding && (
          <div className="w-full max-w-sm mb-6">
            <Card className="p-4 bg-card border border-border rounded-2xl shadow-lg">
              <p className="text-center text-sm text-muted-foreground mb-3">Slide to cancel emergency</p>
              <div ref={sliderRef} className="relative bg-muted rounded-full h-12 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground font-medium">Slide to Cancel</span>
                </div>

                <div
                  className="absolute left-1 top-1 w-10 h-10 bg-destructive rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-100"
                  style={{ transform: `translateX(${sliderPosition}px)` }}
                  onMouseDown={(e) => handleSliderStart(e.clientX)}
                  onTouchStart={(e) => handleSliderStart(e.touches[0].clientX)}
                >
                  <ChevronRight className="h-5 w-5 text-destructive-foreground" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {(isSOSActive || emergencyActivated) && (
          <Card className="w-full p-4 mb-6 bg-destructive/10 border-destructive/20 rounded-2xl">
            <div className="text-center text-destructive">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Camera className="h-6 w-6" />
                {emergencyActivated && <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>}
              </div>
              <p className="font-semibold">Emergency Activated</p>
              <p className="text-sm">Location shared • Camera recording • Authorities notified</p>
              {emergencyActivated && (
                <Button
                  onClick={resetEmergency}
                  size="sm"
                  variant="outline"
                  className="mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                >
                  End Emergency
                </Button>
              )}
            </div>
          </Card>
        )}

        <div className="w-full grid grid-cols-1 gap-4">
          <Card
            onClick={() => router.push("/e-fir")}
            className="placard-3d p-6 h-20 flex items-center justify-between cursor-pointer rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center">
              <Phone className="h-6 w-6 mr-4 text-white" />
              <span className="text-lg font-semibold text-white">File E-FIR</span>
            </div>
            <ImageIcon className="h-5 w-5 text-white/80" />
          </Card>

          <Card
            onClick={() => router.push("/distress-signals")}
            className="placard-3d p-6 h-20 flex items-center justify-center cursor-pointer rounded-2xl text-white bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Radio className="h-6 w-6 mr-4 text-white" />
            <span className="text-lg font-semibold text-center text-white">Distress Signals</span>
          </Card>

          <Card
            onClick={() => router.push("/emergency-centers")}
            className="placard-3d p-6 h-20 flex items-center justify-center cursor-pointer rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MapPin className="h-6 w-6 mr-4 text-white" />
            <span className="text-lg font-semibold text-center text-white">Nearest Emergency Center</span>
          </Card>
        </div>

        <Card className="w-full mt-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Police</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("tel:100")}
                className="font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                100
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ambulance</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("tel:108")}
                className="font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                108
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fire Brigade</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("tel:101")}
                className="font-semibold text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                101
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tourist Helpline</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("tel:1363")}
                className="font-semibold text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                1363
              </Button>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => router.push("/travel-history")}
          className="placard-3d w-full mt-6 p-6 cursor-pointer rounded-2xl text-white bg-gradient-to-r from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold text-center text-white">View Travel Log & History</span>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", href: "/pay" },
            { icon: FileText, label: "Documents", href: "/documents" },
            { icon: AlertTriangle, label: "SOS", active: true, href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.href && router.push(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto transition-all duration-300 rounded-xl ${
                item.active
                  ? "text-primary-foreground bg-gradient-to-r from-destructive to-destructive/80 shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-muted-foreground">Made in Bangalore, India</p>
        </div>
      </div>

      {/* Video Access Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-background border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Emergency Videos</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeVideoModal}
                className="text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {sosRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No emergency videos available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sosRecords.map((record) => (
                    <Card key={record._id} className="p-4 bg-card border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-foreground">
                              {record.emergencyType.toUpperCase()} Emergency
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.status === 'active' 
                                ? 'bg-red-100 text-red-800' 
                                : record.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.createdAt).toLocaleString()}
                          </p>
                          {record.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => playVideo(record._id)}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl bg-black rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-900">
              <h3 className="text-white font-semibold">
                Emergency Media - {selectedVideo.emergencyType?.toUpperCase()}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeVideoModal}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Video Section */}
              {selectedVideo.videoData && (
                <div className="p-4">
                  <h4 className="text-white font-medium mb-2">📹 Video Recording</h4>
                  <div className="relative">
                    <video
                      controls
                      className="w-full h-auto max-h-[50vh] rounded-lg"
                      src={selectedVideo.videoData.blobUrl}
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xNiAxMlYyOEwyOCAyMEwxNiAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>Duration: {selectedVideo.videoData.duration ? `${selectedVideo.videoData.duration.toFixed(1)}s` : 'Unknown'}</p>
                    <p>File Size: {selectedVideo.videoData.fileSize ? `${(selectedVideo.videoData.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
                  </div>
                </div>
              )}

              {/* Photos Section */}
              {selectedPhotos.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3">📸 Emergency Photos ({selectedPhotos.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedPhotos.map((photo, index) => (
                      <div key={photo.id || index} className="relative group">
                        <img
                          src={photo.blobUrl}
                          alt={`Emergency photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // Open full-size image in new tab
                            const newWindow = window.open()
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head><title>Emergency Photo</title></head>
                                  <body style="margin:0;padding:20px;background:#000;display:flex;justify-content:center;align-items:center;">
                                    <img src="${photo.blobUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                                  </body>
                                </html>
                              `)
                            }
                          }}
                        />
                        <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded">
                          <div className="flex justify-between items-center">
                            <span>{photo.cameraType === 'front' ? '📱' : '📷'} {photo.cameraType}</span>
                            <span>{new Date(photo.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Media Message */}
              {!selectedVideo.videoData && selectedPhotos.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <Camera className="h-12 w-12 mx-auto mb-4" />
                  <p>No media available for this emergency record</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
