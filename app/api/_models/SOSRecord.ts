import mongoose, { Schema, models, model } from "mongoose"

export interface ISOSRecord extends mongoose.Document {
  username: string
  emergencyType: "panic" | "sos" | "inactivity" | "distress"
  status: "active" | "resolved" | "cancelled"
  location: {
    lat: number
    lng: number
    accuracy?: number
    address?: string
  }
  videoData?: {
    blobUrl?: string
    duration?: number
    fileSize?: number
    mimeType?: string
  }
  audioTranscript?: string
  emergencyContacts: string[]
  createdAt: Date
  resolvedAt?: Date
  metadata?: {
    deviceInfo?: string
    appVersion?: string
    batteryLevel?: number
    networkType?: string
  }
}

const SOSRecordSchema = new Schema<ISOSRecord>({
  username: { type: String, required: true, index: true },
  emergencyType: { 
    type: String, 
    required: true, 
    enum: ["panic", "sos", "inactivity", "distress"] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ["active", "resolved", "cancelled"],
    default: "active"
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: Number,
    address: String
  },
  videoData: {
    blobUrl: String,
    duration: Number,
    fileSize: Number,
    mimeType: String
  },
  audioTranscript: String,
  emergencyContacts: [String],
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  metadata: {
    deviceInfo: String,
    appVersion: String,
    batteryLevel: Number,
    networkType: String
  }
})

// Index for efficient queries
SOSRecordSchema.index({ username: 1, createdAt: -1 })
SOSRecordSchema.index({ status: 1, createdAt: -1 })

export const SOSRecord = models.SOSRecord || model<ISOSRecord>("SOSRecord", SOSRecordSchema)
