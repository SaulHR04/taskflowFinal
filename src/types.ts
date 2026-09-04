export interface Project {
  id: number | string
  name: string
  description?: string
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface Task {
  id: number | string
  title: string
  description?: string
  status: TaskStatus
  projectId: number | string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  projectId?: number | string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: TaskStatus
}

export const TOKEN_KEY = 'taskflow_token'
export const API_URL = import.meta.env.VITE_API_URL || 'https://d3ujwk09smrk9z.cloudfront.net'