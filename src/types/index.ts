export interface MimosaState {
  trust: number
  stress: number
  openness: number
  lastDialogue: string
  timestamp: number
}

export interface DialogueOption {
  text: string
  score: number
}

export type DialogueCategory = 'neutral' | 'aggressive' | 'supportive'

export const DEFAULT_STATE: MimosaState = {
  trust: 50,
  stress: 20,
  openness: 50,
  lastDialogue: '',
  timestamp: Date.now(),
}
