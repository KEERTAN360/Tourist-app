"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ArrowLeft, Phone, MapPin, Clock, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DistressResponsePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [responseTime, setResponseTime] = useState(0)
  const [isResponding, setIsResponding] = useState(false)

  const responseSteps = [
    {
      title: "Stay Calm",
      description: "Take deep breaths and try to remain calm. Panic can cloud your judgment.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      actions: ["Take 3 deep breaths", "Look around for immediate threats", "Assess your situation"],
    },
    {
      title: "Assess Immediate Danger",
      description: "Quickly evaluate if you're in immediate physical danger that requires escape.",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      actions: ["Check for immediate threats", "Identify safe areas nearby", "Plan escape route if needed"],
    },
    {
      title: "Signal for Help",
      description: "Use available methods to signal for help and alert others to your situation.",
      icon: Phone,
      color: "text-red-600",
      bgColor: "bg-red-50",
      actions: ["Call emergency services (112)", "Send location to contacts", "Use emergency whistle if available"],
    },
    {
      title: "Move to Safety",
      description: "If possible, move to a safer location while staying visible to rescuers.",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
      actions: ["Move to well-lit area", "Stay near landmarks", "Remain visible to others"],
    },
    {
      title: "Wait for Help",
      description: "Stay in your safe location and continue signaling until help arrives.",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      actions: ["Stay in safe location", "Keep phone charged", "Continue periodic signaling"],
    },
  ]

  useEffect(() => {
    if (isResponding) {
      const timer = setInterval(() => {
        setResponseTime((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isResponding])

  const startResponse = () => {
    setIsResponding(true)
    setCurrentStep(0)
    setResponseTime(0)
  }

  const nextStep = () => {
    if (currentStep < responseSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeResponse = () => {
    setIsResponding(false)
    alert("Response protocol completed. Stay safe and wait for help to arrive.")
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const currentStepData = responseSteps[currentStep]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 pt-6 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Distress Response Guide</h1>
          <p className="text-sm text-muted-foreground">Step-by-step emergency response protocol</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!isResponding ? (
          <>
            {/* Introduction */}
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Emergency Response Protocol</h2>
                <p className="text-red-600 mb-4">
                  This guide will walk you through essential steps to respond to a distress situation safely and
                  effectively.
                </p>
                <Button onClick={startResponse} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                  Start Emergency Response
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Emergency Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open("tel:112")}
                  className="bg-red-500 hover:bg-red-600 text-white h-16 flex flex-col items-center justify-center"
                >
                  <Phone className="h-6 w-6 mb-1" />
                  <span>Call 112</span>
                </Button>

                <Button
                  onClick={() => router.push("/sos")}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-16 flex flex-col items-center justify-center"
                >
                  <AlertTriangle className="h-6 w-6 mb-1" />
                  <span>Activate SOS</span>
                </Button>

                <Button
                  onClick={() => router.push("/location-sharing")}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-16 flex flex-col items-center justify-center"
                >
                  <MapPin className="h-6 w-6 mb-1" />
                  <span>Share Location</span>
                </Button>

                <Button
                  onClick={() => router.push("/emergency-contacts")}
                  className="bg-green-500 hover:bg-green-600 text-white h-16 flex flex-col items-center justify-center"
                >
                  <Phone className="h-6 w-6 mb-1" />
                  <span>Emergency Contacts</span>
                </Button>
              </div>
            </Card>

            {/* Response Steps Preview */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Response Protocol Steps</h3>
              <div className="space-y-3">
                {responseSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className={`w-8 h-8 rounded-full ${step.bgColor} flex items-center justify-center`}>
                      <step.icon className={`h-4 w-4 ${step.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Response Timer */}
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700 mb-1">{formatTime(responseTime)}</div>
                <p className="text-sm text-red-600">Response time</p>
              </div>
            </Card>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              {responseSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep ? "bg-primary" : index < currentStep ? "bg-green-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Current Step */}
            <Card className={`p-6 ${currentStepData.bgColor} border-2`}>
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 ${currentStepData.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 border-2`}
                >
                  <currentStepData.icon className={`h-8 w-8 ${currentStepData.color}`} />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  Step {currentStep + 1}: {currentStepData.title}
                </h2>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold">Actions to take:</h3>
                {currentStepData.actions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-foreground">{action}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
                    Previous Step
                  </Button>
                )}

                {currentStep < responseSteps.length - 1 ? (
                  <Button onClick={nextStep} className="flex-1 bg-primary hover:bg-primary/90">
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={completeResponse} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    Complete Response
                  </Button>
                )}
              </div>
            </Card>

            {/* Emergency Actions */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Emergency Actions Available</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => window.open("tel:112")}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call 112
                </Button>

                <Button
                  onClick={() => router.push("/sos")}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  SOS
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* Safety Tips */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">General Safety Tips</h3>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
            <li>• Always inform someone of your travel plans</li>
            <li>• Keep your phone charged and carry a power bank</li>
            <li>• Stay in well-lit, populated areas when possible</li>
            <li>• Trust your instincts - if something feels wrong, leave</li>
            <li>• Carry emergency supplies (whistle, flashlight, first aid)</li>
            <li>• Know local emergency numbers and contacts</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
