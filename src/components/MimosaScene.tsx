import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, TransformControls } from '@react-three/drei'
import { NewBodyModel } from './NewBodyModel'
import type { MimosaState } from '../types'

interface MimosaSceneProps {
  state: MimosaState | null
}

export function MimosaScene({ state }: MimosaSceneProps) {
  const [locked, setLocked] = useState(false)
  const [rotationGizmoOn, setRotationGizmoOn] = useState(false)

  return (
    <div className="absolute inset-0 bg-white">
      <Canvas
        camera={{ position: [0, 1, 2.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow />
        <pointLight position={[-2, 2, 1]} intensity={0.5} />
        <TransformControls
          mode="rotate"
          size={0.75}
          enabled={rotationGizmoOn}
        >
          <group>
            <NewBodyModel state={state} />
          </group>
        </TransformControls>
        {!locked && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        )}
        <Environment preset="studio" />
      </Canvas>
      {/* Mimosa subtitle - reply shown in 3D view */}
      {state?.lastResponse && (
        <div className="absolute bottom-20 left-1/2 z-10 w-full max-w-2xl -translate-x-1/2 px-4">
          <div className="rounded-lg bg-black/75 px-4 py-3 text-center text-white shadow-lg backdrop-blur">
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              {state.lastResponse}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setRotationGizmoOn((on) => !on)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium shadow-md backdrop-blur ${
            rotationGizmoOn
              ? 'border-emerald-500 bg-emerald-500/90 text-white'
              : 'border-gray-300 bg-white/90 text-gray-800 hover:bg-gray-100'
          }`}
          title="Toggle 3D rotation gizmo (X, Y, Z)"
        >
          {rotationGizmoOn ? 'Hide rotation' : 'Rotate model'}
        </button>
        <button
          type="button"
          onClick={() => setLocked((l) => !l)}
          className="rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-md backdrop-blur hover:bg-gray-100"
          title={locked ? 'Unlock view to rotate/pan/zoom' : 'Lock view'}
        >
          {locked ? 'Unlock view' : 'Lock view'}
        </button>
      </div>
    </div>
  )
}
