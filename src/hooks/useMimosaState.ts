import { useState, useEffect, useCallback } from 'react'
import type { MimosaState } from '../types'

const API_BASE = '/api'

export function useMimosaStatePoll(intervalMs = 500) {
  const [state, setState] = useState<MimosaState | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`${API_BASE}/state`)
        if (!res.ok) throw new Error('Failed to fetch state')
        const data = await res.json()
        setState(data as MimosaState)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'))
      }
    }

    fetchState()
    const id = setInterval(fetchState, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return { state, error }
}

export function useMimosaStatePost() {
  const [state, setState] = useState<MimosaState | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const postState = useCallback(async (newState: MimosaState) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState),
      })
      if (!res.ok) throw new Error('Failed to update state')
      const data = await res.json()
      setState(data as MimosaState)
      return data as MimosaState
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/state`)
      if (!res.ok) throw new Error('Failed to fetch state')
      const data = await res.json()
      setState(data as MimosaState)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'))
    }
  }, [])

  useEffect(() => {
    fetchState()
  }, [fetchState])

  return { state, error, loading, postState, refetch: fetchState }
}
