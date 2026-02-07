import { Tenant } from "../models/Tenant";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import {
  requireSystemAdmin,
  requireTenantUser
} from "../utils/authorization";

export const resolvers = {
  Query: {
    health: () => "OrbitPM Backend Running 🚀",

    // ==============================
    // SYSTEM ADMIN QUERIES
    // ==============================

    getAllTenants: async (_: any, __: any, context: any) => {
      requireSystemAdmin(context);
      return Tenant.find();
    },

    getAllUsers: async (_: any, __: any, context: any) => {
      requireSystemAdmin(context);
      return User.find();
    },

    // ==============================
    // TENANT QUERIES
    // ==============================

    getMyTenantUsers: async (_: any, __: any, context: any) => {
      requireTenantUser(context);

      return User.find({
        tenantId: context.user.tenantId
      });
    }
  },

  Mutation: {
    // ==============================
    // AUTH
    // ==============================

    register: async (
      _: any,
      { tenantName, name, email, password }: any
    ) => {
      let tenant = await Tenant.findOne({ name: tenantName });

      if (!tenant) {
        tenant = await Tenant.create({ name: tenantName });
      }

      const existingUser = await User.findOne({
        email,
        tenantId: tenant._id
      });

      if (existingUser) {
        throw new Error("User already exists in this tenant");
      }

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        tenantId: tenant._id,
        role: "TENANT_ADMIN"
      });

      return { token: generateToken(user) };
    },

    login: async (_: any, { email, password, tenantName }: any) => {
      let user;

      if (tenantName) {
        const tenant = await Tenant.findOne({ name: tenantName });
        if (!tenant) throw new Error("Tenant not found");

        user = await User.findOne({
          email,
          tenantId: tenant._id
        });
      } else {
        user = await User.findOne({
          email,
          role: "SYSTEM_ADMIN"
        });
      }

      if (!user) throw new Error("Invalid credentials");

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return { token: generateToken(user) };
    },

    // ==============================
    // SYSTEM ADMIN MUTATIONS
    // ==============================

    createTenant: async (_: any, { name }: any, context: any) => {
      requireSystemAdmin(context);

      const existing = await Tenant.findOne({ name });
      if (existing) throw new Error("Tenant already exists");

      return Tenant.create({ name });
    },

    createSystemAdmin: async (
      _: any,
      { name, email, password }: any,
      context: any
    ) => {
      const existingSystemAdmin = await User.findOne({
        role: "SYSTEM_ADMIN"
      });

      // If no system admin exists → allow bootstrap without auth
      if (!existingSystemAdmin) {
        const hashedPassword = await hashPassword(password);

        return User.create({
          name,
          email,
          password: hashedPassword,
          role: "SYSTEM_ADMIN"
        });
      }

      // After first admin exists → require authentication
      requireSystemAdmin(context);

      const existing = await User.findOne({ email });
      if (existing) throw new Error("User already exists");

      const hashedPassword = await hashPassword(password);

      return User.create({
        name,
        email,
        password: hashedPassword,
        role: "SYSTEM_ADMIN"
      });
    },


    // ==============================
    // TENANT ADMIN MUTATIONS
    // ==============================

    createTenantUser: async (
      _: any,
      { name, email, password, role }: any,
      context: any
    ) => {
      requireTenantUser(context);

      if (context.user.role !== "TENANT_ADMIN") {
        throw new Error("Only tenant admin can create users");
      }

      if (!["MEMBER", "TENANT_ADMIN"].includes(role)) {
        throw new Error("Invalid role");
      }

      const existing = await User.findOne({
        email,
        tenantId: context.user.tenantId
      });

      if (existing) {
        throw new Error("User already exists in this tenant");
      }

      const hashedPassword = await hashPassword(password);

      return User.create({
        name,
        email,
        password: hashedPassword,
        tenantId: context.user.tenantId,
        role
      });
    }
  }
};
