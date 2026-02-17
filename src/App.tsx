import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Display } from './pages/Display'
import { Controller } from './pages/Controller'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Controller />} />
        <Route path="/controller" element={<Controller />} />
        <Route path="/display" element={<Display />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
