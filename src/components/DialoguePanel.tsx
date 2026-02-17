import type { MimosaState, DialogueOption, DialogueCategory } from '../types'
import { DEFAULT_STATE } from '../types'

export const dialogues: Record<DialogueCategory, DialogueOption[]> = {
  neutral: [
    { text: 'Hello! What species are you?', score: 3 },
    { text: 'Where do you come from?', score: 3 },
    { text: 'You look unique.', score: 4 },
  ],
  aggressive: [
    { text: "You're too sensitive.", score: 8 },
    { text: "It's not a big deal.", score: 7 },
    { text: 'Why are you like this?', score: 9 },
    { text: "You're being dramatic.", score: 8 },
    { text: 'Just get over it.', score: 9 },
  ],
  supportive: [
    { text: "I'm sorry if I upset you.", score: 1 },
    { text: 'Take your time.', score: 1 },
    { text: "You're safe here.", score: 0 },
    { text: 'I see you.', score: 1 },
  ],
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function applyDialogueToState(prev: MimosaState, option: DialogueOption): MimosaState {
  const score = option.score
  let dStress = 0
  let dTrust = 0
  let dOpenness = 0

  if (score >= 7) {
    dStress = 15
    dTrust = -20
    dOpenness = -10
  } else if (score >= 3) {
    dStress = 5
    dTrust = 0
    dOpenness = 5
  } else {
    dStress = -10
    dTrust = 15
    dOpenness = 10
  }

  return {
    ...prev,
    stress: clamp(prev.stress + dStress),
    trust: clamp(prev.trust + dTrust),
    openness: clamp(prev.openness + dOpenness),
    lastDialogue: option.text,
    timestamp: Date.now(),
  }
}

function getResponseText(option: DialogueOption, _newState: MimosaState): string {
  if (option.score >= 7) return '…'
  if (option.score <= 2) return '…'
  return '…'
}

interface DialoguePanelProps {
  currentState: MimosaState | null
  onSelect: (option: DialogueOption) => void
  lastResponse?: string
  loading?: boolean
}

const categories: { key: DialogueCategory; label: string }[] = [
  { key: 'supportive', label: 'Supportive' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'aggressive', label: 'Aggressive' },
]

export function DialoguePanel({
  currentState,
  onSelect,
  lastResponse = '',
  loading = false,
}: DialoguePanelProps) {
  const state = currentState ?? DEFAULT_STATE

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-gray-400">
        <div>
          <div className="text-emerald-400">Trust</div>
          <div className="h-1.5 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${state.trust}%` }}
            />
          </div>
        </div>
        <div>
          <div className="text-amber-400">Stress</div>
          <div className="h-1.5 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${state.stress}%` }}
            />
          </div>
        </div>
        <div>
          <div className="text-sky-400">Openness</div>
          <div className="h-1.5 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
              style={{ width: `${state.openness}%` }}
            />
          </div>
        </div>
      </div>

      {lastResponse && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-300">
          Mimosa: {lastResponse}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-w-[120px] flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800/80 p-3"
          >
            <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              {label}
            </div>
            {dialogues[key].map((opt) => (
              <button
                key={opt.text}
                type="button"
                disabled={loading}
                onClick={() => onSelect(opt)}
                className="rounded-md border border-gray-600 bg-gray-700/80 px-2 py-2 text-left text-sm text-gray-200 transition hover:border-gray-500 hover:bg-gray-600/80 active:scale-[0.98] disabled:opacity-50"
              >
                {opt.text}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export { getResponseText }
