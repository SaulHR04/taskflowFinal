import { useState } from 'react';
import { Button, Stack, Alert, CircularProgress } from '@mui/material';
import type { Project } from '../types';
import { TaskList } from './TaskList';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
}

export function ProjectList({ projects, loading, error, onEditProject, onDeleteProject }: ProjectListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!projects.length) return <p>No hay proyectos registrados.</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      {projects.map((p) => {
        const isOpen = selectedId === p.id;
        return (
          <div key={p.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.name}</strong>
                {p.description && <span style={{ color: '#666', marginLeft: '10px' }}>— {p.description}</span>}
              </div>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => setSelectedId(isOpen ? null : p.id)}>
                  {isOpen ? 'Ocultar tareas' : 'Ver tareas'}
                </Button>
                <Button size="small" color="primary" onClick={() => onEditProject(p)}>Editar</Button>
                <Button size="small" color="error" onClick={() => onDeleteProject(p.id)}>Eliminar</Button>
              </Stack>
            </div>

            
            {isOpen && <TaskList projectId={p.id} />}
          </div>
        );
      })}
    </div>
  );
}