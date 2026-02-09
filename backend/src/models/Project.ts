import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  tenantId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// 🔐 Index for tenant isolation
ProjectSchema.index({ tenantId: 1 });

export const Project = mongoose.model<IProject>(
  "Project",
  ProjectSchema
);
