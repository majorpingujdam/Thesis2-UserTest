import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const defaultState = {
  trust: 50,
  stress: 20,
  openness: 50,
  lastDialogue: '',
  lastResponse: '',
  timestamp: Date.now(),
}

let memoryState = { ...defaultState }

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use('/api/state', (req, res, next) => {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(memoryState))
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', () => {
              try {
                const data = JSON.parse(body)
                memoryState = {
                  trust: Math.max(0, Math.min(100, data.trust ?? memoryState.trust)),
                  stress: Math.max(0, Math.min(100, data.stress ?? memoryState.stress)),
                  openness: Math.max(0, Math.min(100, data.openness ?? memoryState.openness)),
                  lastDialogue: typeof data.lastDialogue === 'string' ? data.lastDialogue : memoryState.lastDialogue,
                  lastResponse: typeof data.lastResponse === 'string' ? data.lastResponse : memoryState.lastResponse,
                  timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
                }
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(memoryState))
              } catch {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid body' }))
              }
            })
            return
          }
          next()
        })
      },
    },
  ],
})
