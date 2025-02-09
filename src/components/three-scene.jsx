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
          autoRotate={true}
          autoRotateSpeed={0.1}
        />
        
        {/* Enhanced lighting for better surface detail */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 5, 5]} 
          intensity={0.8}
          color="#ffffff"
        />
        
        {/* Holographic Ice Sphere */}
        <IceSphere 
          radius={4}
          position={[0, 0, 0]}
          rotationSpeed={0.001}
        />

        {/* Orbiting Spacecraft */}
        <Spacecraft 
          size={0.009}
          rotationSpeed={0.1}
          position={[0, 0, 0]}
          orbitRadius={9}
          orbitSpeed={0.03}
        />

        {/* Environment for reflections */}
        <Environment 
          preset="night"
          background={false}
          intensity={0.2}
        />
      </Canvas>
    </div>
  )
}

