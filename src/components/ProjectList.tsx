import { useState } from 'react'
import { Button, TextField, Select, MenuItem, Stack, Alert, CircularProgress } from '@mui/material'
import * as taskService from '../services/taskService'
import type { Project, Task, TaskStatus } from '../types'

interface ProjectListProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onEditProject: (project: Project) => void
  onDeleteProject: (id: number | string) => void
}

const ALLOWED_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']

const normalizeStatus = (status: string): TaskStatus => {
  return ALLOWED_STATUSES.includes(status as TaskStatus) ? (status as TaskStatus) : 'PENDING'
}

export function ProjectList({ projects, loading, error, onEditProject, onDeleteProject }: ProjectListProps) {
  const [selectedId, setSelectedId] = useState<number | string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)

 
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('PENDING')
  const [editingTaskId, setEditingTaskId] = useState<number | string | null>(null)

  const toggleTasks = async (projectId: number | string) => {
    if (selectedId === projectId) {
      setSelectedId(null)
      return
    }
    setSelectedId(projectId)
    setTasksLoading(true)
    try {
      const data = await taskService.getTasksByProject(projectId)
      const projectTasks = data.filter((t) => String(t.projectId) === String(projectId))
      setTasks(projectTasks.map((t) => ({ ...t, status: normalizeStatus(t.status) })))
    } catch {
      alert('Error al cargar tareas')
    } finally {
      setTasksLoading(false)
    }
    resetForm()
  }

  const reloadTasks = async (projectId: number | string) => {
    const data = await taskService.getTasksByProject(projectId)
    const projectTasks = data.filter((t) => String(t.projectId) === String(projectId))
    setTasks(projectTasks.map((t) => ({ ...t, status: normalizeStatus(t.status) })))
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setStatus('PENDING')
    setEditingTaskId(null)
  }

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return

    if (editingTaskId) {
      await taskService.updateTask(editingTaskId, { title, description, status })
    } else {
      await taskService.createTask({ title, description, status, projectId: selectedId })
    }

    resetForm()
    reloadTasks(selectedId)
  }

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(normalizeStatus(task.status))
  }

  const handleStatusChange = async (taskId: number | string, newStatus: string) => {
    const validStatus = normalizeStatus(newStatus)
    await taskService.updateTaskStatus(taskId, validStatus)
    if (selectedId) reloadTasks(selectedId)
  }

  const handleDeleteTask = async (taskId: number | string) => {
    if (confirm('¿Borrar tarea?')) {
      await taskService.deleteTask(taskId)
      if (selectedId) reloadTasks(selectedId)
    }
  }

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!projects.length) return <p>No hay proyectos registrados.</p>

  return (
    <div style={{ marginTop: '20px' }}>
      {projects.map((p) => {
        const isOpen = selectedId === p.id
        return (
          <div key={p.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.name}</strong>
                {p.description && <span style={{ color: '#666', marginLeft: '10px' }}>— {p.description}</span>}
              </div>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => toggleTasks(p.id)}>
                  {isOpen ? 'Ocultar tareas' : 'Ver tareas'}
                </Button>
                <Button size="small" color="primary" onClick={() => onEditProject(p)}>Editar</Button>
                <Button size="small" color="error" onClick={() => onDeleteProject(p.id)}>Eliminar</Button>
              </Stack>
            </div>

            {isOpen && (
              <div style={{ background: '#f9f9f9', padding: '12px', marginTop: '10px', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {editingTaskId ? 'Editar Tarea' : 'Nueva Tarea para este proyecto'}
                </p>
                <form onSubmit={handleSaveTask}>
                  <Stack direction="row" spacing={1} mb={2}>
                    <TextField size="small" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <TextField size="small" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Select size="small" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                      <MenuItem value="PENDING">Pendiente</MenuItem>
                      <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                      <MenuItem value="COMPLETED">Completada</MenuItem>
                    </Select>
                    <Button type="submit" variant="contained" size="small">
                      {editingTaskId ? 'Guardar' : 'Agregar'}
                    </Button>
                    {editingTaskId && <Button size="small" onClick={resetForm}>Cancelar</Button>}
                  </Stack>
                </form>

                {tasksLoading ? <p>Cargando tareas...</p> : (
                  <div>
                    {!tasks.length ? <p style={{ fontSize: '14px', color: '#777' }}>Este proyecto no tiene tareas aún.</p> : (
                      tasks.map((t) => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid #eee' }}>
                          <div>
                            <span>{t.title}</span>
                            {t.description && <small style={{ color: '#666', marginLeft: '8px' }}>({t.description})</small>}
                          </div>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Select size="small" value={normalizeStatus(t.status)} onChange={(e) => handleStatusChange(t.id, e.target.value)}>
                              <MenuItem value="PENDING">Pendiente</MenuItem>
                              <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                              <MenuItem value="COMPLETED">Completada</MenuItem>
                            </Select>
                            <Button size="small" onClick={() => handleStartEdit(t)}>Editar</Button>
                            <Button size="small" color="error" onClick={() => handleDeleteTask(t.id)}>Borrar</Button>
                          </Stack>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}