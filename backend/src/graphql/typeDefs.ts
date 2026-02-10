import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type AuthResponse {
    token: String!
    name: String!
    email: String!
    role: String!
    tenantName: String
  }

  type Tenant {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    tenant: Tenant
  }

  type Query {
    health: String

    # SYSTEM ADMIN
    getAllTenants: [Tenant!]!
    getAllUsers: [User!]!

    # TENANT USERS
    getMyTenantUsers: [User!]!
  }

  type Mutation {
    # AUTH
    register(
      tenantName: String!
      name: String!
      email: String!
      password: String!
    ): AuthResponse!

    login(
      email: String!
      password: String!
      tenantName: String
    ): AuthResponse!

    # SYSTEM ADMIN
    createTenant(name: String!): Tenant!
    createSystemAdmin(
      name: String!
      email: String!
      password: String!
    ): User!

    # TENANT ADMIN
    createTenantUser(
      name: String!
      email: String!
      password: String!
      role: String!
    ): User!
  }

  type Project {
  id: ID!
  name: String!
  description: String
}

extend type Query {
  getMyProjects: [Project!]!
}

extend type Mutation {
  createProject(
    name: String!
    description: String
  ): Project!
}
type ProjectMember {
  user: User!
  role: String!
}

extend type Project {
  members: [ProjectMember!]!
}

type Task {
  id: ID!
  title: String!
  description: String
  status: String!
  assignedTo: User
}

extend type Query {
  getProjectTasks(projectId: ID!): [Task!]!
}

extend type Mutation {
  createTask(
    projectId: ID!
    title: String!
    description: String
    assignedTo: ID
  ): Task!

  updateTaskStatus(
    taskId: ID!
    status: String!
  ): Task!

  deleteTask(taskId: ID!): Boolean!
}
type Project {
  id: ID!
  name: String!
  description: String
  members: [ProjectMember!]!
}

type ProjectMember {
  user: User!
  role: String!
}

extend type Query {
  getProjectById(projectId: ID!): Project!
}

extend type Mutation {
  updateProject(
    projectId: ID!
    name: String
    description: String
  ): Project!

  deleteProject(projectId: ID!): Boolean!

  addMember(
    projectId: ID!
    userId: ID!
    role: String!
  ): ProjectMembership!

  removeMember(
    projectId: ID!
    userId: ID!
  ): Boolean!

  updateMemberRole(
    projectId: ID!
    userId: ID!
    role: String!
  ): ProjectMembership!
}

type ProjectMembership {
  id: ID!
  projectId: ID!
  userId: ID!
  role: String!
}



`;
