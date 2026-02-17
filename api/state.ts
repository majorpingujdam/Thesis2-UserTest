import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface MimosaState {
  trust: number
  stress: number
  openness: number
  lastDialogue: string
  lastResponse: string
  timestamp: number
}

const KV_KEY = 'mimosa:state'

const DEFAULT_STATE: MimosaState = {
  trust: 50,
  stress: 20,
  openness: 50,
  lastDialogue: '',
  lastResponse: '',
  timestamp: Date.now(),
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const state = (await kv.get<MimosaState>(KV_KEY)) ?? DEFAULT_STATE
      return res.status(200).json(state)
    } catch (e) {
      console.error('KV GET error:', e)
      return res.status(500).json({ error: 'Failed to get state' })
    }
  }

  if (req.method === 'POST') {
    const body = req.body as MimosaState
    if (!body || typeof body.trust !== 'number' || typeof body.stress !== 'number' || typeof body.openness !== 'number') {
      return res.status(400).json({ error: 'Invalid state shape' })
    }
    const state: MimosaState = {
      trust: Math.max(0, Math.min(100, body.trust)),
      stress: Math.max(0, Math.min(100, body.stress)),
      openness: Math.max(0, Math.min(100, body.openness)),
      lastDialogue: typeof body.lastDialogue === 'string' ? body.lastDialogue : '',
      lastResponse: typeof body.lastResponse === 'string' ? body.lastResponse : '',
      timestamp: typeof body.timestamp === 'number' ? body.timestamp : Date.now(),
    }
    try {
      await kv.set(KV_KEY, state)
      return res.status(200).json(state)
    } catch (e) {
      console.error('KV SET error:', e)
      return res.status(500).json({ error: 'Failed to set state' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
