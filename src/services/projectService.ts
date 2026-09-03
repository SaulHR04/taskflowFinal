import { httpClient } from './httpClient'
import type { Project } from '../types'

export async function getProjects(): Promise<Project[]> {
  const response = await httpClient.get<Project[]>('/api/projects')
  return response.data
}

export async function createProject(data: { name: string; description?: string }): Promise<Project> {
  const response = await httpClient.post<Project>('/api/projects', data)
  return response.data
}

export async function updateProject(id: number | string, data: { name: string; description?: string }): Promise<Project> {
  const response = await httpClient.put<Project>(`/api/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id: number | string): Promise<void> {
  await httpClient.delete(`/api/projects/${id}`)
}