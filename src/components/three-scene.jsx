'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Spacecraft } from './spacecraft'
import { IceSphere } from './ice-sphere'

export function ThreeScene() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas 
        camera={{ 
          position: [8, 0, 8],  // Adjusted for level view of orbital plane
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        {/* Scene Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={4}
          maxDistance={20}
        />
        
        {/* Basic lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2}
          color="#ffffff"
        />
        
        {/* Ice Sphere */}
        <IceSphere 
          radius={4}
          position={[0, 0, 0]}
        />

        {/* Orbiting Spacecraft */}
        <Spacecraft 
          size={0.0049}
          rotationSpeed={0.1}  // Increased for more visible rotation
          position={[0, 0, 0]}
          orbitRadius={9}
          orbitSpeed={0.05}  // Slightly increased orbit speed
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

