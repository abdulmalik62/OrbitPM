import mongoose, { Document, Schema, Types } from "mongoose";

export type UserRole = "SYSTEM_ADMIN" | "TENANT_ADMIN" | "MEMBER";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    tenantId?: Types.ObjectId; // optional for SYSTEM_ADMIN
    role: UserRole;
    createdAt: Date;
}


const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["SYSTEM_ADMIN", "TENANT_ADMIN", "MEMBER"],
            default: "MEMBER",
            required: true
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: function (this: IUser) {
                return this.role !== "SYSTEM_ADMIN";
            }
        }

    },
    {
        timestamps: true
    }
);

// Compound index for multi-tenancy isolation
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });

export const User = mongoose.model<IUser>("User", UserSchema);
