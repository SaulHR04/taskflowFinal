import { useState, useEffect } from 'react'
import { TextField, MenuItem, Button, Stack } from '@mui/material'
import type { Task, TaskStatus } from '../types'

interface TaskFormProps {
  onSubmit: (title: string, description: string, status: TaskStatus) => void
  initialTask?: Task | null
  onCancel?: () => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'Pendiente' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'DONE', label: 'Completada' },
]

export function TaskForm({ onSubmit, initialTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title)
      setDescription(initialTask.description || '')
      setStatus(initialTask.status)
    } else {
      setTitle('')
      setDescription('')
      setStatus('TODO')
    }
  }, [initialTask])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(title, description, status)
    setTitle('')
    setDescription('')
    setStatus('TODO')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} my={2}>
        <TextField
          label="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          size="small"
        />
        <TextField
          select
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          fullWidth
          size="small"
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" size="small">
            {initialTask ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
          {onCancel && (
            <Button variant="outlined" size="small" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  )
}