import { useState } from 'react'
import { Controller } from './Controller'
import { Display } from './Display'

type ViewMode = 'conversation' | 'display'

export function Home() {
  const [view, setView] = useState<ViewMode>('conversation')

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-0 rounded-b-lg border-b border-gray-700 bg-gray-900/95 px-2 py-2 shadow-lg backdrop-blur sm:left-auto sm:right-4 sm:left-4 sm:w-auto sm:rounded-b-none sm:rounded-lg"
        style={{ width: 'min(100% - 1rem, 280px)' }}
      >
        <button
          type="button"
          onClick={() => setView('conversation')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            view === 'conversation'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Conversation
        </button>
        <button
          type="button"
          onClick={() => setView('display')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            view === 'display'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          3D View
        </button>
      </div>

      {view === 'conversation' ? (
        <div className="pt-14">
          <Controller />
        </div>
      ) : (
        <div className="fixed inset-0">
          <Display />
        </div>
      )}
    </>
  )
}
