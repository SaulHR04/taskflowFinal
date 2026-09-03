import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'

const theme = createTheme()

function DashboardPlaceholder() {
  return (
    <Box maxWidth={480} mx="auto" mt={8}>
      <Typography variant="h4" gutterBottom>
        ¡Sesión iniciada!
      </Typography>
      <Typography color="text.secondary">
        Token guardado en localStorage. En la Fase 2 reemplazamos esto por el dashboard real.
      </Typography>
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}