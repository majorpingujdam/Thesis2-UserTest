import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MimosaState } from '../types'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}

interface MimosaHeadProps {
  state: MimosaState | null
}

const LERP_FACTOR = 0.08

export function MimosaHead({ state }: MimosaHeadProps) {
  const groupRef = useRef<THREE.Group>(null)
  const prevFold = useRef(0)
  const prevScale = useRef(1)
  const prevDroop = useRef(0)

  useFrame(() => {
    if (!state || !groupRef.current) return

    const stressNorm = state.stress / 100
    const trustNorm = state.trust / 100
    const opennessNorm = state.openness / 100

    const targetFold = stressNorm * 60
    const targetScale = 0.6 + trustNorm * 0.4
    const targetDroop = -30 + opennessNorm * 30

    prevFold.current = lerp(prevFold.current, targetFold, LERP_FACTOR)
    prevScale.current = lerp(prevScale.current, targetScale, LERP_FACTOR)
    prevDroop.current = lerp(prevDroop.current, targetDroop, LERP_FACTOR)

    const foldRad = (prevFold.current * Math.PI) / 180
    const droopRad = (prevDroop.current * Math.PI) / 180

    groupRef.current.scale.setScalar(prevScale.current)
    groupRef.current.rotation.x = droopRad
    groupRef.current.rotation.z = foldRad * 0.5
  })

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {/* Central stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Leaf pairs - simplified mimosa style */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.12, 0.2, 0]} rotation={[0, 0, (side * Math.PI) / 6]}>
          <mesh>
            <planeGeometry args={[0.25, 0.08, 1, 1]} />
            <meshStandardMaterial color="#3d7a37" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side, i) => (
        <group key={`b-${i}`} position={[side * 0.1, 0.35, 0.05]} rotation={[0, 0, (side * -Math.PI) / 8]}>
          <mesh>
            <planeGeometry args={[0.2, 0.06, 1, 1]} />
            <meshStandardMaterial color="#3d7a37" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
