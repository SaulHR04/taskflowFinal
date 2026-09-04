import { useState, useCallback, useEffect } from 'react'
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types'
import * as taskService from '../services/taskService'
import { getApiErrorMessage } from '../services/httpClient'

export function useTasks(projectId: number | string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await taskService.getTasksByProject(projectId)
      setTasks(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (payload: CreateTaskPayload) => {
    if (!projectId) return
    await taskService.createTask({ ...payload, projectId }) 
    await fetchTasks()
  }

  const editTask = async (taskId: number | string, payload: UpdateTaskPayload) => {
    await taskService.updateTask(taskId, payload)
    await fetchTasks()
  }

  const changeStatus = async (taskId: number | string, status: TaskStatus) => {
    await taskService.updateTaskStatus(taskId, status)
    await fetchTasks()
  }

  const removeTask = async (taskId: number | string) => {
    await taskService.deleteTask(taskId)
    await fetchTasks()
  }

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    addTask,
    editTask,
    changeStatus,
    removeTask,
  }
}