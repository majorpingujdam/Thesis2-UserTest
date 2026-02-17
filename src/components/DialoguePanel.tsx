import type { MimosaState, DialogueOption, DialogueCategory } from '../types'
import { DEFAULT_STATE } from '../types'

/** Conversation starters shown in the main UI (match reference design) */
export const conversationStarters: DialogueOption[] = [
  { text: 'Hello! What species are you?', score: 3 },
  { text: 'Where do you come from originally?', score: 3 },
  { text: 'You look unique. What can you do?', score: 4 },
  { text: "You don't look like the other Mimosas I've seen.", score: 6 },
  { text: 'Your leaves look so delicate.', score: 2 },
]

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

/** Mimosa’s reply per conversation starter (shown as subtitles in 3D view) */
const MIMOSA_REPLIES: Record<string, string> = {
  'Hello! What species are you?': "I'm a Mimosa. My leaves can sense touch.",
  'Where do you come from originally?': "I'm from here. This place is my home.",
  'You look unique. What can you do?': "I feel, and I remember. I close when I'm hurt.",
  "You don't look like the other Mimosas I've seen.": "We're all a bit different. I'm still a Mimosa.",
  'Your leaves look so delicate.': "They are. Please be gentle.",
}

function getResponseText(option: DialogueOption, _newState: MimosaState): string {
  if (MIMOSA_REPLIES[option.text]) return MIMOSA_REPLIES[option.text]
  if (option.score >= 7) return "That hurt. I don't want to talk."
  if (option.score <= 2) return "Thank you for seeing me."
  return "I'm here. I'm listening."
}

interface DialoguePanelProps {
  currentState: MimosaState | null
  onSelect: (option: DialogueOption) => void
  onReset?: () => void
  onBack?: () => void
  lastResponse?: string
  loading?: boolean
}

const categories: { key: DialogueCategory; label: string }[] = [
  { key: 'supportive', label: 'Supportive' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'aggressive', label: 'Aggressive' },
]

export function DialoguePanel({
  currentState: _currentState,
  onSelect,
  onReset,
  onBack,
  lastResponse: _lastResponse = '',
  loading = false,
}: DialoguePanelProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {/* Left nav arrow */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-2 top-24 z-10 flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-white hover:bg-gray-700"
        aria-label="Back"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-normal tracking-wide text-white sm:text-3xl">
          MICROAGGRESSIONS AND RESPONSES
        </h1>
      </header>

      {/* Prompt with green left border */}
      <div className="mx-6 mb-6 flex overflow-hidden rounded border-0 border-l-4 border-l-emerald-500 bg-gray-900 px-4 py-3">
        <p className="text-white">
          You approach the Mimosa. Choose a conversation starter:
        </p>
      </div>

      {/* Conversation options - stacked vertically */}
      <div className="mx-6 flex flex-1 flex-col gap-3">
        {conversationStarters.map((opt) => (
          <button
            key={opt.text}
            type="button"
            disabled={loading}
            onClick={() => onSelect(opt)}
            className="w-full rounded-md bg-gray-800 px-4 py-3 text-center text-white transition hover:bg-gray-700 active:scale-[0.99] disabled:opacity-50"
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* Reset conversation - yellow-green border */}
      <div className="border-t border-gray-800 px-6 py-6">
        <button
          type="button"
          onClick={() => onReset?.()}
          disabled={loading}
          className="w-full rounded border-2 border-lime-400 bg-gray-800 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          Reset conversation
        </button>
      </div>
    </div>
  )
}

export { getResponseText }
