import { Tenant } from "../models/Tenant";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { ProjectMembership } from "../models/ProjectMembership";
import { hashPassword, comparePassword } from "../utils/hash";
import { Task } from "../models/Task";
import { requireProjectMember } from "../utils/projectAuth";

import { generateToken } from "../utils/jwt";
import {
  requireSystemAdmin,
  requireTenantUser
} from "../utils/authorization";

export const resolvers = {
  Project: {
    members: async (project: any) => {
      const memberships = await ProjectMembership.find({
        projectId: project.id
      }).populate("userId");

      return memberships.map(m => ({
        user: m.userId,
        role: m.role
      }));
    }
  },
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
    },
    getMyProjects: async (_: any, __: any, context: any) => {
      requireTenantUser(context);

      // If tenant admin → see all tenant projects
      if (context.user.role === "TENANT_ADMIN") {
        return Project.find({
          tenantId: context.user.tenantId
        });
      }

      // Otherwise → membership based visibility
      const memberships = await ProjectMembership.find({
        userId: context.user.sub
      });

      const projectIds = memberships.map(m => m.projectId);

      return Project.find({
        _id: { $in: projectIds }
      });
    },



    getProjectTasks: async (_: any, { projectId }: any, context: any) => {
      requireTenantUser(context);

      await requireProjectMember(projectId, context.user.sub);

      return Task.find({
        projectId,
        tenantId: context.user.tenantId
      });
    },
    getProjectById: async (_: any, { projectId }: any, context: any) => {
      requireTenantUser(context);

      await requireProjectMember(projectId, context.user.sub);

      const project = await Project.findById(projectId);
      if (!project) throw new Error("Project not found");

      return project;
    },




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
    },
    createProject: async (
      _: any,
      { name, description }: any,
      context: any
    ) => {
      requireTenantUser(context);

      const project = await Project.create({
        name,
        description,
        tenantId: context.user.tenantId,
        createdBy: context.user.sub
      });

      await ProjectMembership.create({
        projectId: project._id,
        userId: context.user.sub,
        tenantId: context.user.tenantId,
        role: "PROJECT_ADMIN"
      });

      return project;
    },
    createTask: async (
      _: any,
      { projectId, title, description, assignedTo }: any,
      context: any
    ) => {
      requireTenantUser(context);

      await requireProjectMember(projectId, context.user.sub);

      return Task.create({
        title,
        description,
        projectId,
        tenantId: context.user.tenantId,
        assignedTo,
        createdBy: context.user.sub
      });
    },
    updateTaskStatus: async (
      _: any,
      { taskId, status }: any,
      context: any
    ) => {
      requireTenantUser(context);

      const task = await Task.findById(taskId);
      if (!task) throw new Error("Task not found");

      await requireProjectMember(task.projectId.toString(), context.user.sub);

      task.status = status;
      await task.save();

      return task;
    },
    deleteTask: async (_: any, { taskId }: any, context: any) => {
      requireTenantUser(context);

      const task = await Task.findById(taskId);
      if (!task) throw new Error("Task not found");

      const membership = await requireProjectMember(
        task.projectId.toString(),
        context.user.sub
      );

      if (membership.role !== "PROJECT_ADMIN") {
        throw new Error("Only project admin can delete task");
      }

      await task.deleteOne();
      return true;
    },

    updateProject: async (
      _: any,
      { projectId, name, description }: any,
      context: any
    ) => {
      requireTenantUser(context);

      const membership = await requireProjectMember(
        projectId,
        context.user.sub
      );

      if (membership.role !== "PROJECT_ADMIN") {
        throw new Error("Only project admin can update project");
      }

      const project = await Project.findById(projectId);
      if (!project) throw new Error("Project not found");

      if (name) project.name = name;
      if (description) project.description = description;

      await project.save();
      return project;
    },
    deleteProject: async (_: any, { projectId }: any, context: any) => {
      requireTenantUser(context);

      const membership = await requireProjectMember(
        projectId,
        context.user.sub
      );

      if (membership.role !== "PROJECT_ADMIN") {
        throw new Error("Only project admin can delete project");
      }

      await Task.deleteMany({ projectId });
      await ProjectMembership.deleteMany({ projectId });
      await Project.findByIdAndDelete(projectId);

      return true;
    },




  },


};
