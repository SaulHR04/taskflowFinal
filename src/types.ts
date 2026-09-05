export interface Project {
  id: number;
  name: string
  description?: string
  ownerId?: number;
  createdAt?: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface Task {
  id: number;
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId?: number;
  assigneeId?: number;
  dueDate?: string | null;
}

export interface CreateTaskPayload {
  title: string
  description?: string
  priority?: TaskPriority
  projectId?: number;
  assigneeId?: number;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number; 
}

export const TOKEN_KEY = 'taskflow_token'
export const API_URL = import.meta.env.VITE_API_URL || 'https://d3ujwk09smrk9z.cloudfront.net'