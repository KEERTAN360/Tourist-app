import mongoose, { Schema, models, model } from "mongoose"

export interface IPayHistory extends mongoose.Document {
  username: string
  type: "Payment" | "Received" | "Transfer" | "Added Money"
  amount: number
  recipient?: string
  method?: string
  meta?: Record<string, any>
  createdAt: Date
}

const PayHistorySchema = new Schema<IPayHistory>({
  username: { type: String, required: true, index: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  recipient: { type: String },
  method: { type: String },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
})

export const PayHistory = models.PayHistory || model<IPayHistory>("PayHistory", PayHistorySchema)


