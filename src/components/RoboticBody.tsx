import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function RoboticBody() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Shoulder / neck plate */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.35, 0.12, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Simple arm stubs */}
      <mesh position={[-0.35, 0.5, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.08]} />
        <meshStandardMaterial color="#252525" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 0.5, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.08]} />
        <meshStandardMaterial color="#252525" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}
