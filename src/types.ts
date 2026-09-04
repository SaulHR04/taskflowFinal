export interface Project {
  id: number | string
  name: string
  description?: string
  ownerId?: number | string
  createdAt?: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface Task {
  id: number | string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId?: number | string
  assigneeId?: number | string | null
  dueDate?: string | null
}

export interface CreateTaskPayload {
  title: string
  description?: string
  priority?: TaskPriority
  projectId?: number | string
  assigneeId?: number | string | null
  dueDate?: string | null
}

export interface UpdateTaskPayload {
  title: string
  description?: string
  priority?: TaskPriority
}

export const TOKEN_KEY = 'taskflow_token'
export const API_URL = import.meta.env.VITE_API_URL || 'https://d3ujwk09smrk9z.cloudfront.net'