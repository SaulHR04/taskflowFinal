import { useState } from 'react'
import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { useAuth } from '../hooks/useAuth'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'
import * as projectService from '../services/projectService'
import type { Project } from '../types'

export function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { projects, loading, error, refetch } = useProjects()
  const projectForm = useProjectForm({ onSuccess: refetch })

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const startEdit = (p: Project) => {
    setEditingProject(p)
    setName(p.name)
    setDescription(p.description || '')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    await projectService.updateProject(editingProject.id, { name, description })
    setEditingProject(null)
    refetch()
  }

  const handleDelete = async (id: number | string) => {
    if (confirm('¿Eliminar proyecto?')) {
      await projectService.deleteProject(id)
      refetch()
    }
  }

  return (
    <Box maxWidth={700} mx="auto" mt={4} p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Proyectos y Tareas</Typography>
        <Button size="small" onClick={() => { logout(); navigate('/login') }}>Cerrar sesión</Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        {editingProject ? (
          <form onSubmit={handleUpdate}>
            <Typography variant="subtitle1" mb={1}>Editar Proyecto</Typography>
            <Stack spacing={2}>
              <TextField size="small" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              <TextField size="small" label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" size="small">Guardar</Button>
                <Button size="small" onClick={() => setEditingProject(null)}>Cancelar</Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <ProjectForm {...projectForm} />
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onEditProject={startEdit}
          onDeleteProject={handleDelete}
        />
      </Paper>
    </Box>
  )
}