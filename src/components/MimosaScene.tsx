import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { MimosaHead } from './MimosaHead'
import { RoboticBody } from './RoboticBody'
import type { MimosaState } from '../types'

interface MimosaSceneProps {
  state: MimosaState | null
}

export function MimosaScene({ state }: MimosaSceneProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas
        camera={{ position: [0, 1, 2.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow />
        <pointLight position={[-2, 2, 1]} intensity={0.5} />
        <MimosaHead state={state} />
        <RoboticBody />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
