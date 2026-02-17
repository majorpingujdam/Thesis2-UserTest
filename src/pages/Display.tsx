import { MimosaScene } from '../components/MimosaScene'
import { useMimosaStatePoll } from '../hooks/useMimosaState'

const POLL_INTERVAL_MS = 500

export function Display() {
  const { state } = useMimosaStatePoll(POLL_INTERVAL_MS)

  return (
    <div className="fixed inset-0 bg-black">
      <MimosaScene state={state} />
    </div>
  )
}
