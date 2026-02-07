import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  name: string;
  createdAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Index for fast lookup
TenantSchema.index({ name: 1 }, { unique: true });

export const Tenant = mongoose.model<ITenant>("Tenant", TenantSchema);
