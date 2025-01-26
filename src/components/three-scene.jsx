'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Spacecraft } from './spacecraft'

export function ThreeScene() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas 
        camera={{ 
          position: [0, 0, 3],  // Moved camera closer for better view
          fov: 50,              // Reset FOV to normal value
          near: 0.1,
          far: 1000
        }}
      >
        {/* Scene Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* Basic lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2}
          color="#ffffff"
        />
        
        {/* Centered Spacecraft */}
        <Spacecraft 
          size={0.2}
          rotationSpeed={0.0}
          position={[0, 0, 0]}  // Explicitly set center position
        />

        {/* Environment for reflections */}
        <Environment 
          preset="studio"
          background={false}
          intensity={0.5}
        />
      </Canvas>
    </div>
  )
}

