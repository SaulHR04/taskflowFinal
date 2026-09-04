import { httpClient } from './httpClient'
import type { Project } from '../types'

export async function getProjects(): Promise<Project[]> {
  const response = await httpClient.get<Project[]>('/projects')
  return response.data
}

export async function createProject(data: { name: string; description?: string }): Promise<Project> {
  const response = await httpClient.post<Project>('/projects', data)
  return response.data
}

export async function updateProject(id: number | string, data: { name: string; description?: string }): Promise<Project> {
  const response = await httpClient.put<Project>(`/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id: number | string): Promise<void> {
  await httpClient.delete(`/projects/${id}`)
}