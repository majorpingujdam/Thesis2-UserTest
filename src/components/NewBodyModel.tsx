import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { MimosaState } from '../types'

const MODEL_URL = '/models/newbody.glb'

/** Optional correction (set to 0,0,0 to use model’s original orientation) */
const FRONT_FACE_CORRECTION = { x: 0, y: 0, z: 0 }

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}

interface NewBodyModelProps {
  state: MimosaState | null
}

const LERP_FACTOR = 0.08

export function NewBodyModel({ state }: NewBodyModelProps) {
  const { scene } = useGLTF(MODEL_URL)
  const clone = useMemo(() => scene.clone(), [scene])
  const groupRef = useRef<THREE.Group>(null)
  const prevScale = useRef(1)
  const prevRotX = useRef(0)
  const prevRotZ = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return

    if (state) {
      const stressNorm = state.stress / 100
      const trustNorm = state.trust / 100
      const opennessNorm = state.openness / 100

      const targetScale = 0.6 + trustNorm * 0.4
      const targetRotZ = (stressNorm * 60 * Math.PI) / 180 * 0.5
      const targetRotX = ((-30 + opennessNorm * 30) * Math.PI) / 180

      prevScale.current = lerp(prevScale.current, targetScale, LERP_FACTOR)
      prevRotZ.current = lerp(prevRotZ.current, targetRotZ, LERP_FACTOR)
      prevRotX.current = lerp(prevRotX.current, targetRotX, LERP_FACTOR)

      groupRef.current.scale.setScalar(prevScale.current)
      groupRef.current.rotation.x = prevRotX.current
      groupRef.current.rotation.z = prevRotZ.current
    }
  })

  return (
    <group
      rotation={[
        FRONT_FACE_CORRECTION.x,
        FRONT_FACE_CORRECTION.y,
        FRONT_FACE_CORRECTION.z,
      ]}
    >
      <group ref={groupRef}>
        <primitive object={clone} />
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL)
