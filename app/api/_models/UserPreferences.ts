import mongoose, { Schema, models, model } from "mongoose"

export interface IUserPreferences extends mongoose.Document {
  username: string
  age?: string
  travelType?: string
  drinks?: boolean
  budget?: string
  interests?: string[]
  travelStyle?: string
  foodPreference?: string
  accommodation?: string
  languages?: string[]
  disabilities?: string
  emergencyContact?: string
  updatedAt: Date
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  username: { type: String, required: true, unique: true, index: true },
  age: String,
  travelType: String,
  drinks: Boolean,
  budget: String,
  interests: [String],
  travelStyle: String,
  foodPreference: String,
  accommodation: String,
  languages: [String],
  disabilities: String,
  emergencyContact: String,
  updatedAt: { type: Date, default: Date.now },
})

export const UserPreferences =
  models.UserPreferences || model<IUserPreferences>("UserPreferences", UserPreferencesSchema)


