import { httpClient } from './httpClient'
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types'


export async function getTasksByProject(projectId: number | string): Promise<Task[]> {
  const response = await httpClient.get<Task[]>('/tasks', {
    params: {
      projectId: projectId,
      project_id: projectId
    }
  })
  return response.data
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await httpClient.post<Task>('/tasks', payload)
  return response.data
}

export async function updateTask(taskId: number | string, payload: UpdateTaskPayload): Promise<Task> {
  const response = await httpClient.put<Task>(`/tasks/${taskId}`, payload)
  return response.data
}

export async function updateTaskStatus(taskId: number | string, status: TaskStatus): Promise<Task> {
  const response = await httpClient.patch<Task>(`/tasks/${taskId}/status`, { status })
  return response.data
}

export async function deleteTask(taskId: number | string): Promise<void> {
  await httpClient.delete(`/tasks/${taskId}`)
}