import { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, Stack, CircularProgress, Dialog, DialogTitle, DialogActions, Snackbar, Alert as MuiAlert } from '@mui/material';
import * as taskService from '../services/taskService';
import type { Task, TaskStatus, TaskPriority } from '../types';

interface TaskListProps {
  projectId: number;
}


export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MED'); 
  const [assigneeId, setAssigneeId] = useState<number>(1);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);


  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasksByProject(projectId);
      setTasks(data);
    } catch (error) {
      setSnackbarMessage('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MED');
    setAssigneeId(1);
    setEditingTaskId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (editingTaskId) {
        await taskService.updateTask(editingTaskId, { title, description, priority, assigneeId });
        if (status) await taskService.updateTaskStatus(editingTaskId, status);
        setSnackbarMessage('Tarea actualizada exitosamente');
      } else {
        await taskService.createTask(projectId, { title, description, priority, assigneeId });
        setSnackbarMessage('Tarea creada exitosamente');
      }
      resetForm();
      loadTasks();
    } catch (error) {
      setSnackbarMessage('Error al guardar la tarea. Verifica responsable.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialogOpen) return;
    try {
      await taskService.deleteTask(deleteDialogOpen);
      setSnackbarMessage('Tarea eliminada');
      loadTasks();
    } catch (error) {
      setSnackbarMessage('Error al eliminar');
    } finally {
      setDeleteDialogOpen(null);
    }
  };

  if (loading) return <CircularProgress size={24} sx={{ my: 2 }} />;

  return (
    <div style={{ background: '#f9f9f9', padding: '12px', marginTop: '10px', borderRadius: '4px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {editingTaskId ? 'Editar Tarea' : 'Nueva Tarea'}
      </p>
      
      <form onSubmit={handleSave}>
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
          <TextField size="small" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField size="small" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          
          

          <Select size="small" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <MenuItem value="LOW">Baja</MenuItem>
            <MenuItem value="MED">Media</MenuItem>
            <MenuItem value="HIGH">Alta</MenuItem>
          </Select>

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
          {editingTaskId && <Button size="small" onClick={resetForm}>Cancelar</Button>}
        </Stack>
      </form>

  
      <div>
        {!tasks.length ? (
          <p style={{ fontSize: '14px', color: '#777' }}>Este proyecto no tiene tareas aún.</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid #eee' }}>
              <div>
                <span>{t.title} <small>({t.priority})</small></span>
              </div>
              <Stack direction="row" spacing={1} alignItems="center">
                <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: '4px', backgroundColor: t.status === 'DONE' ? '#10b981' : '#f59e0b', color: 'white' }}>
                  {t.status}
                </span>
                <Button size="small" onClick={() => {
                  setEditingTaskId(t.id); setTitle(t.title); setDescription(t.description || ''); setStatus(t.status); setPriority(t.priority); setAssigneeId(t.assigneeId || 1);
                }}>Editar</Button>
                <Button size="small" color="error" onClick={() => setDeleteDialogOpen(t.id)}>Borrar</Button>
              </Stack>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!deleteDialogOpen} onClose={() => setDeleteDialogOpen(null)}>
        <DialogTitle>¿Borrar esta tarea permanentemente?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(null)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Borrar</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={!!snackbarMessage} autoHideDuration={3000} onClose={() => setSnackbarMessage('')}>
        <MuiAlert severity="info" onClose={() => setSnackbarMessage('')}>{snackbarMessage}</MuiAlert>
      </Snackbar>
    </div>
  );
}