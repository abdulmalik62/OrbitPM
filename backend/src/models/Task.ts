import mongoose, { Document, Schema, Types } from "mongoose";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    projectId: Types.ObjectId;
    tenantId: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            default: "TODO"
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: true
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Performance indexes
TaskSchema.index({ tenantId: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assignedTo: 1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
