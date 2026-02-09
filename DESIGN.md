# OrbitPM – Multi-Tenant Project Management System

Author: Abdul Malik P A  
Architecture Level: Production-Ready SaaS Design  
Pattern: Shared Database Multi-Tenancy with Hierarchical RBAC  

---

# 1. System Overview

OrbitPM is a multi-tenant project management backend designed to support:

- Multiple isolated organizations (Tenants)
- Tenant-scoped users
- Role-based access control (RBAC)
- Project-level membership enforcement
- Task-level responsibility and workflow
- Stateless JWT authentication
- Strong data isolation guarantees

The system is designed using:

- Node.js
- Express
- Apollo GraphQL
- MongoDB (Shared DB + tenantId pattern)
- JWT-based stateless authentication

---

# 2. Multi-Tenancy Strategy

## Selected Pattern

Shared Database + Tenant Identifier Column

Each core entity contains:


## Why This Pattern?

- Lower infrastructure complexity
- Suitable for SaaS MVP
- Easy horizontal scaling
- Cost efficient
- Simplifies operational management

## Isolation Guarantee

Every query is scoped using: tenantId = context.user.tenantId

No data is returned without:
1. Valid JWT
2. Matching tenantId
3. Proper project membership (when applicable)

---

# 3. Authentication & Middleware Architecture

## Authentication Mechanism

JWT (JSON Web Token)

Token contains:

{
sub: userId,
tenantId: tenantId,
role: userRole,
iss: "orbitpm",
aud: "orbitpm-users",
exp: expiry
}

## Middleware Layer

Apollo context middleware:

- Extracts Authorization header
- Verifies JWT signature
- Injects decoded user into context
- Enables stateless security

Flow:

Request → JWT → Middleware → context.user → Resolver → DB query

This ensures all authorization decisions are made at resolver level.

---

# 4. Role-Based Access Control (RBAC)

OrbitPM implements hierarchical RBAC with 3 levels:

## 4.1 System Level

Role: SYSTEM_ADMIN

Capabilities:
- Manage tenants
- Create system admins
- View all system data

---

## 4.2 Tenant Level

Role: TENANT_ADMIN

Capabilities:
- Manage users within tenant
- View all projects inside tenant
- Assign users to projects
- Act as project manager

---

## 4.3 Project Level

Roles:
- PROJECT_ADMIN
- PROJECT_MEMBER

PROJECT_ADMIN:
- Full CRUD on project
- Assign members
- Delete project
- Manage tasks

PROJECT_MEMBER:
- View project
- Create tasks
- Update assigned task status

---

# 5. Data Modeling

## 5.1 Tenant

Tenant {
_id
name
createdAt
updatedAt
}


### Indexes

- Unique index on `name`

---

## 5.2 User

User {
_id
name
email
password (hashed)
role (SYSTEM_ADMIN | TENANT_ADMIN | MEMBER)
tenantId (nullable for SYSTEM_ADMIN)
timestamps
}


### Indexes

Compound unique index:

{ email: 1, tenantId: 1 }


Purpose:
- Same email allowed across tenants
- Prevent duplicate user inside same tenant

---

## 5.3 Project

Project {
_id
name
description
tenantId
createdBy
timestamps
}


### Indexes

{ tenantId: 1 }


Optimizes tenant-scoped project queries.

---

## 5.4 ProjectMembership

ProjectMembership {
_id
projectId
userId
tenantId
role (PROJECT_ADMIN | PROJECT_MEMBER)
timestamps
}


### Indexes

Compound unique index:

{ projectId: 1, userId: 1 }


Prevents duplicate assignment.

---

## 5.5 Task

Task {
_id
title
description
status (TODO | IN_PROGRESS | DONE)
projectId
tenantId
assignedTo
createdBy
timestamps
}


### Indexes

{ tenantId: 1 }
{ projectId: 1 }
{ assignedTo: 1 }


Purpose:
- Fast tenant filtering
- Fast project task listing
- Fast user dashboard queries

---

# 6. Authorization Enforcement Strategy

Authorization is enforced at three layers:

## Layer 1 – Authentication

JWT verification in middleware.

## Layer 2 – Tenant Isolation

All queries include tenantId filtering.

## Layer 3 – Project Membership Enforcement

Before accessing project or tasks:

requireProjectMember(projectId, userId)

Prevents:
- Cross-project access
- Cross-tenant leakage
- Unauthorized modification

---

# 7. Project CRUD Rules

Create:
- Tenant users only

Read:
- Tenant Admin → All tenant projects
- Member → Only projects where membership exists

Update:
- PROJECT_ADMIN only

Delete:
- PROJECT_ADMIN only
- Cascades:
  - Delete tasks
  - Delete memberships

---

# 8. Task Rules

Create:
- Only project members

Update Status:
- Assigned user or PROJECT_ADMIN

Delete:
- PROJECT_ADMIN only

View:
- Only project members

---

# 9. Security Considerations

- Passwords hashed using bcrypt
- JWT expiration enforced
- Role claims validated per request
- No cross-tenant joins allowed
- No unscoped queries permitted
- Unique constraints prevent duplication

---

# 10. Performance Optimization

Indexes added for:

- Multi-tenant filtering
- Membership validation
- Task listing
- Assignment lookup

MongoDB chosen due to:
- Flexible schema
- Natural document modeling
- Efficient indexing
- Suitable for SaaS MVP

---

# 11. Scalability Considerations

This architecture supports:

- Horizontal scaling (stateless JWT)
- Container deployment (Docker-ready)
- Kubernetes-ready
- Load balancing safe
- No server-side session dependency

Future scale option:

- Move to database-per-tenant if required
- Add caching layer (Redis)
- Add read replicas

---

# 12. Trade-offs

Chosen Shared DB Pattern:

Pros:
- Simple
- Cost-effective
- Fast to implement

Cons:
- Requires strict isolation enforcement
- Scaling complexity at very high tenant counts

---

# 13. Future Improvements

- Pagination for projects/tasks
- Soft delete support
- Audit logging
- Rate limiting
- Centralized error formatting
- Activity feed
- Analytics dashboard
- CI/CD deployment notes

---

# 14. Isolation Guarantee Summary

Data is protected through:

1. JWT-based identity
2. TenantId query scoping
3. Project membership validation
4. Role-based permission checks
5. Indexed DB queries

This guarantees strong logical isolation between tenants.

---

# 15. Final Architecture Summary

OrbitPM implements:

- Multi-layer RBAC
- Tenant-scoped data modeling
- Membership-based project access
- Assignment-based task workflow
- Indexed document design
- Stateless cloud-ready backend

The system reflects production-grade SaaS architecture principles and demonstrates strong backend engineering fundamentals.