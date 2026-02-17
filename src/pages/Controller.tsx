import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DialoguePanel,
  applyDialogueToState,
  getResponseText,
} from '../components/DialoguePanel'
import { useMimosaStatePost } from '../hooks/useMimosaState'
import { DEFAULT_STATE } from '../types'
import type { DialogueOption } from '../types'

export function Controller() {
  const navigate = useNavigate()
  const { state, loading, postState } = useMimosaStatePost()
  const [lastResponse, setLastResponse] = useState('')

  const currentState = state ?? DEFAULT_STATE

  const handleSelect = async (option: DialogueOption) => {
    const nextState = applyDialogueToState(currentState, option)
    const reply = getResponseText(option, nextState)
    try {
      await postState({ ...nextState, lastResponse: reply })
      setLastResponse(reply)
    } catch {
      setLastResponse('…')
    }
  }

  const handleReset = () => {
    postState(DEFAULT_STATE)
    setLastResponse('')
  }

  return (
    <DialoguePanel
      currentState={currentState}
      onSelect={handleSelect}
      onReset={handleReset}
      onBack={() => navigate('/')}
      lastResponse={lastResponse}
      loading={loading}
    />
  )
}
