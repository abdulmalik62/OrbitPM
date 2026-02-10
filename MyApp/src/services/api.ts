import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://localhost:5000/graphql",
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

// GraphQL query/mutation functions
export const graphqlRequest = async (query: string, variables?: any) => {
  const response = await api.post("", { query, variables });
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  return response.data.data;
};

// Tenant Admin Queries
export const getMyTenantUsers = async () => {
  const query = `
    query {
      getMyTenantUsers {
        id
        name
        email
        role
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getMyTenantUsers;
};

export const getMyProjects = async () => {
  const query = `
    query {
      getMyProjects {
        id
        name
        description
        members {
          user {
            id
            name
            email
          }
          role
        }
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getMyProjects;
};

export const getProjectTasks = async (projectId: string) => {
  const query = `
    query($projectId: ID!) {
      getProjectTasks(projectId: $projectId) {
        id
        title
        description
        status
        assignedTo {
          id
          name
          email
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { projectId });
  return data.getProjectTasks;
};

export const getProjectById = async (projectId: string) => {
  const query = `
    query($projectId: ID!) {
      getProjectById(projectId: $projectId) {
        id
        name
        description
        members {
          user {
            id
            name
            email
          }
          role
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { projectId });
  return data.getProjectById;
};

// Tenant Admin Mutations
export const createTenantUser = async (name: string, email: string, password: string, role: string) => {
  const mutation = `
    mutation($name: String!, $email: String!, $password: String!, $role: String!) {
      createTenantUser(name: $name, email: $email, password: $password, role: $role) {
        id
        name
        email
        role
      }
    }
  `;
  const data = await graphqlRequest(mutation, { name, email, password, role });
  return data.createTenantUser;
};

export const createProject = async (name: string, description?: string) => {
  const mutation = `
    mutation($name: String!, $description: String) {
      createProject(name: $name, description: $description) {
        id
        name
        description
      }
    }
  `;
  const data = await graphqlRequest(mutation, { name, description });
  return data.createProject;
};

export const updateProject = async (projectId: string, name?: string, description?: string) => {
  const mutation = `
    mutation($projectId: ID!, $name: String, $description: String) {
      updateProject(projectId: $projectId, name: $name, description: $description) {
        id
        name
        description
      }
    }
  `;
  const data = await graphqlRequest(mutation, { projectId, name, description });
  return data.updateProject;
};

export const deleteProject = async (projectId: string) => {
  const mutation = `
    mutation($projectId: ID!) {
      deleteProject(projectId: $projectId)
    }
  `;
  const data = await graphqlRequest(mutation, { projectId });
  return data.deleteProject;
};

export const createTask = async (projectId: string, title: string, description?: string, assignedTo?: string) => {
  const mutation = `
    mutation($projectId: ID!, $title: String!, $description: String, $assignedTo: ID) {
      createTask(projectId: $projectId, title: $title, description: $description, assignedTo: $assignedTo) {
        id
        title
        description
        status
        assignedTo {
          id
          name
          email
        }
      }
    }
  `;
  const data = await graphqlRequest(mutation, { projectId, title, description, assignedTo });
  return data.createTask;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const mutation = `
    mutation($taskId: ID!, $status: String!) {
      updateTaskStatus(taskId: $taskId, status: $status) {
        id
        title
        status
        assignedTo {
          id
          name
          email
        }
      }
    }
  `;
  const data = await graphqlRequest(mutation, { taskId, status });
  return data.updateTaskStatus;
};

export const deleteTask = async (taskId: string) => {
  const mutation = `
    mutation($taskId: ID!) {
      deleteTask(taskId: $taskId)
    }
  `;
  const data = await graphqlRequest(mutation, { taskId });
  return data.deleteTask;
};

export const addMember = async (projectId: string, userId: string, role: string) => {
  const mutation = `
    mutation($projectId: ID!, $userId: ID!, $role: String!) {
      addMember(projectId: $projectId, userId: $userId, role: $role) {
        id
        projectId
        userId
        role
      }
    }
  `;
  const data = await graphqlRequest(mutation, { projectId, userId, role });
  return data.addMember;
};

export const removeMember = async (projectId: string, userId: string) => {
  const mutation = `
    mutation($projectId: ID!, $userId: ID!) {
      removeMember(projectId: $projectId, userId: $userId)
    }
  `;
  const data = await graphqlRequest(mutation, { projectId, userId });
  return data.removeMember;
};

export const updateMemberRole = async (projectId: string, userId: string, role: string) => {
  const mutation = `
    mutation($projectId: ID!, $userId: ID!, $role: String!) {
      updateMemberRole(projectId: $projectId, userId: $userId, role: $role) {
        id
        projectId
        userId
        role
      }
    }
  `;
  const data = await graphqlRequest(mutation, { projectId, userId, role });
  return data.updateMemberRole;
};

export const getAllUsers = async () => {
  const query = `
    query {
      getAllUsers {
        id
        name
        email
        role
        tenant {
          id
          name
        }
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getAllUsers;
};

export { api };
