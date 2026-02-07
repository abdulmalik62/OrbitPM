import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type AuthResponse {
    token: String!
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
`;
