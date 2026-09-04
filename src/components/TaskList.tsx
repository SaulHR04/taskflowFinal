import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import type { Task, TaskStatus } from '../types'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onEdit: (task: Task) => void
  onDelete: (taskId: number | string) => void
  onStatusChange: (taskId: number | string, status: TaskStatus) => void
}

export function TaskList({
  tasks,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  if (loading) {
    return (
      <Stack alignItems="center" py={2}>
        <CircularProgress size={24} />
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (tasks.length === 0) {
    return <Typography color="text.secondary" variant="body2">Este proyecto no tiene tareas aún.</Typography>
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          divider
          secondaryAction={
            <Stack direction="row" spacing={1} alignItems="center">
              <Select
                size="small"
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                sx={{ fontSize: '0.8rem', height: 32 }}
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                <MenuItem value="COMPLETED">Completada</MenuItem>
              </Select>
              <IconButton edge="end" onClick={() => onEdit(task)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(task.id)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
        >
          <ListItemText
            primary={task.title}
            secondary={task.description || 'Sin descripción'}
          />
        </ListItem>
      ))}
    </List>
  )
}