import mongoose, { Schema, models, model } from "mongoose"

export interface IUserWallet extends mongoose.Document {
  username: string
  balance: number
  currency: string
  updatedAt: Date
  createdAt: Date
}

const UserWalletSchema = new Schema<IUserWallet>({
  username: { type: String, required: true, unique: true, index: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: "INR" },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
})

// Update the updatedAt field before saving
UserWalletSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const UserWallet = models.UserWallet || model<IUserWallet>("UserWallet", UserWalletSchema)
