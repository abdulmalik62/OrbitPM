import mongoose, { Document, Schema, Types } from "mongoose";

export type ProjectRole = "PROJECT_ADMIN" | "PROJECT_MEMBER";

export interface IProjectMembership extends Document {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  tenantId: Types.ObjectId;
  role: ProjectRole;
}

const ProjectMembershipSchema = new Schema<IProjectMembership>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    role: {
      type: String,
      enum: ["PROJECT_ADMIN", "PROJECT_MEMBER"],
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate membership
ProjectMembershipSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

export const ProjectMembership = mongoose.model<IProjectMembership>(
  "ProjectMembership",
  ProjectMembershipSchema
);
