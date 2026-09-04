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

const ALLOWED_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

const normalizeStatus = (status: string): TaskStatus => {
  return ALLOWED_STATUSES.includes(status as TaskStatus) ? (status as TaskStatus) : 'TODO'
}

export function ProjectList({ projects, loading, error, onEditProject, onDeleteProject }: ProjectListProps) {
  const [selectedId, setSelectedId] = useState<number | string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
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
      setTasks(data.map((t) => ({ ...t, status: normalizeStatus(t.status) })))
    } catch (err) {
      console.error(err)
      alert('Error al obtener las tareas de este proyecto')
    } finally {
      setTasksLoading(false)
    }
    resetForm()
  }

  const reloadTasks = async (projectId: number | string) => {
    try {
      const data = await taskService.getTasksByProject(projectId)
      setTasks(data.map((t) => ({ ...t, status: normalizeStatus(t.status) })))
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setStatus('TODO')
    setEditingTaskId(null)
  }

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || submitting) return

    setSubmitting(true)
    try {
      if (editingTaskId) {
      
        await taskService.updateTask(editingTaskId, { title, description })
        if (status) {
          await taskService.updateTaskStatus(editingTaskId, status)
        }
      } else {
        await taskService.createTask(selectedId, { title, description, priority: 'HIGH' })
      }
      resetForm()
      await reloadTasks(selectedId)
    } catch (err) {
      console.error(err)
      alert('Error al guardar la tarea. Verifica los datos enviados.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(normalizeStatus(task.status))
  }

  const handleDeleteTask = async (taskId: number | string) => {
    if (confirm('¿Borrar tarea?')) {
      try {
        await taskService.deleteTask(taskId)
        if (selectedId) await reloadTasks(selectedId)
      } catch (err) {
        console.error(err)
        alert('Error al eliminar la tarea.')
      }
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
          <div key={p.id} style={{ borderBottom: '1px solidrgb(63, 1, 1)', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.name}</strong>
                {p.description && <span style={{ color: '#666', marginLeft: '10px' }}>— {p.description}</span>}
              </div>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => toggleTasks(p.id)}>
                  {isOpen ? 'Ocultar tareas' : 'Ver tareas'}
                </Button>
                <Button size="small" color="primary" onClick={() => onEditProject(p)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => onDeleteProject(p.id)}>
                  Eliminar
                </Button>
              </Stack>
            </div>

            {isOpen && (
              <div style={{ background: '#f9f9f9', padding: '12px', marginTop: '10px', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {editingTaskId ? 'Editar Tarea' : 'Nueva Tarea para este proyecto'}
                </p>
                <form onSubmit={handleSaveTask}>
                  <Stack direction="row" spacing={1} mb={2}>
                    <TextField
                      size="small"
                      placeholder="Título"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <TextField
                      size="small"
                      placeholder="Descripción"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {editingTaskId && (
                      <Select size="small" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                        <MenuItem value="TODO">Pendiente</MenuItem>
                        <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
                        <MenuItem value="DONE">Completada</MenuItem>
                      </Select>
                    )}
                    <Button type="submit" variant="contained" size="small" disabled={submitting}>
                      {submitting ? 'Guardando...' : editingTaskId ? 'Guardar' : 'Crear Tarea'}
                    </Button>
                    {editingTaskId && (
                      <Button size="small" onClick={resetForm} disabled={submitting}>
                        Cancelar
                      </Button>
                    )}
                  </Stack>
                </form>

                {tasksLoading ? (
                  <p>Cargando tareas...</p>
                ) : (
                  <div>
                    {!tasks.length ? (
                      <p style={{ fontSize: '14px', color: '#777' }}>Este proyecto no tiene tareas aún.</p>
                    ) : (
                      tasks.map((t) => (
                        <div
                          key={t.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 0',
                            borderTop: '1px solid #eee',
                          }}
                        >
                          <div>
                            <span>{t.title}</span>
                            {t.description && <small style={{ color: '#666', marginLeft: '8px' }}>({t.description})</small>}
                          </div>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <span
                              style={{
                                fontSize: '13px',
                                color: '#555',
                                backgroundColor: '#e9e9e9',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {t.status === 'IN_PROGRESS'
                                ? 'En progreso'
                                : t.status === 'DONE'
                                ? 'Completada'
                                : 'Pendiente'}
                            </span>
                            <Button size="small" onClick={() => handleStartEdit(t)}>
                              Editar
                            </Button>
                            <Button size="small" color="error" onClick={() => handleDeleteTask(t.id)}>
                              Borrar
                            </Button>
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