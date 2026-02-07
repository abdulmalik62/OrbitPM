export const requireAuth = (context: any) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }
};

export const requireSystemAdmin = (context: any) => {
  requireAuth(context);

  if (context.user.role !== "SYSTEM_ADMIN") {
    throw new Error("System admin access required");
  }
};

export const requireTenantUser = (context: any) => {
  requireAuth(context);

  if (!context.user.tenantId) {
    throw new Error("Tenant context required");
  }
};
