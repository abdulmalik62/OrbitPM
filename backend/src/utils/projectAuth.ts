import { ProjectMembership } from "../models/ProjectMembership";

export const requireProjectMember = async (
  projectId: string,
  userId: string
) => {
  const membership = await ProjectMembership.findOne({
    projectId,
    userId
  });

  if (!membership) {
    throw new Error("Not authorized for this project");
  }

  return membership;
};
