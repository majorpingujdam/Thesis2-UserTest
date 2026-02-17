import { useState } from 'react'
import { MimosaScene } from '../components/MimosaScene'
import {
  DialoguePanel,
  applyDialogueToState,
  getResponseText,
} from '../components/DialoguePanel'
import { useMimosaStatePost } from '../hooks/useMimosaState'
import { DEFAULT_STATE } from '../types'
import type { DialogueOption, MimosaState } from '../types'

export function Controller() {
  const { state, loading, postState } = useMimosaStatePost()
  const [lastResponse, setLastResponse] = useState('')

  const currentState = state ?? DEFAULT_STATE

  const handleSelect = async (option: DialogueOption) => {
    const nextState = applyDialogueToState(currentState, option)
    try {
      await postState(nextState)
      setLastResponse(getResponseText(option, nextState))
    } catch {
      setLastResponse('…')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-semibold">Project Mimosa — Controller</h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4">
        <section className="relative h-48 overflow-hidden rounded-lg border border-gray-700 bg-black">
          <MimosaScene state={state as MimosaState | null} />
        </section>

        <section className="flex-1">
          <DialoguePanel
            currentState={currentState}
            onSelect={handleSelect}
            lastResponse={lastResponse}
            loading={loading}
          />
        </section>
      </main>
    </div>
  )
}
