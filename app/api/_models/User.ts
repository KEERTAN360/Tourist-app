import mongoose, { Schema, models, model } from "mongoose"

export interface IUser extends mongoose.Document {
  username: string
  passwordHash: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const User = models.User || model<IUser>("User", UserSchema)


