"use client"

import type React from "react"

import {
  ArrowLeft,
  Camera,
  FileText,
  Upload,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  Home,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EFIRPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    incidentType: "",
    location: "",
    dateTime: "",
    description: "",
    contactNumber: "",
    witnessDetails: "",
    evidence: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const incidentTypes = [
    "Theft/Robbery",
    "Fraud/Cheating",
    "Assault/Violence",
    "Harassment",
    "Property Damage",
    "Missing Person",
    "Cybercrime",
    "Traffic Accident",
    "Other",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, evidence: [...prev.evidence, ...files] }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("E-FIR submitted successfully! Reference ID: FIR2024001234")
      router.push("/sos")
    }, 2000)
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
          <h1 className="text-xl font-semibold text-foreground text-center">File E-FIR</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Info Banner */}
      <div className="px-4 mb-6">
        <Card className="p-4 bg-blue-500/10 border-blue-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Online FIR Registration</h3>
              <p className="text-sm text-muted-foreground">
                File your complaint online. This will generate an official FIR that can be used for legal proceedings.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto">
        <div className="space-y-6">
          {/* Incident Type */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block">Type of Incident</label>
            <div className="grid grid-cols-2 gap-3">
              {incidentTypes.map((type) => (
                <Button
                  key={type}
                  variant={formData.incidentType === type ? "default" : "outline"}
                  onClick={() => handleInputChange("incidentType", type)}
                  className={`h-12 rounded-xl transition-all duration-300 text-sm ${
                    formData.incidentType === type
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card text-card-foreground border-border hover:bg-muted"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location of Incident
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter the exact location where incident occurred"
              className="h-12 rounded-xl border-border bg-input text-foreground"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs bg-transparent"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    handleInputChange("location", `${position.coords.latitude}, ${position.coords.longitude}`)
                  })
                }
              }}
            >
              Use Current Location
            </Button>
          </Card>

          {/* Date & Time */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time of Incident
            </label>
            <Input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleInputChange("dateTime", e.target.value)}
              className="h-12 rounded-xl border-border bg-input text-foreground"
            />
          </Card>

          {/* Description */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block">Detailed Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide a detailed description of what happened. Include names, places, and sequence of events."
              rows={6}
              className="w-full p-4 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Card>

          {/* Contact Number */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Number
            </label>
            <Input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              placeholder="Enter your mobile number"
              className="h-12 rounded-xl border-border bg-input text-foreground"
            />
          </Card>

          {/* Witness Details */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block flex items-center gap-2">
              <User className="h-5 w-5" />
              Witness Details (Optional)
            </label>
            <textarea
              value={formData.witnessDetails}
              onChange={(e) => handleInputChange("witnessDetails", e.target.value)}
              placeholder="Names and contact details of any witnesses"
              rows={3}
              className="w-full p-4 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Card>

          {/* Evidence Upload */}
          <Card className="p-6 bg-card border border-border rounded-2xl">
            <label className="text-lg font-semibold text-card-foreground mb-4 block flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Evidence
            </label>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload photos, videos, or documents related to the incident
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("evidence-upload")?.click()}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Choose Files
                </Button>
              </div>

              {formData.evidence.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-card-foreground">Uploaded Files:</p>
                  {formData.evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-foreground truncate">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.incidentType ||
              !formData.location ||
              !formData.description ||
              !formData.contactNumber ||
              isSubmitting
            }
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting E-FIR..." : "Submit E-FIR"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By submitting this form, you confirm that the information provided is accurate and complete.
            </p>
          </div>
        </div>
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
