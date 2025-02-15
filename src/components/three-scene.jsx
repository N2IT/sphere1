'use client'

import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Spacecraft } from './spacecraft'
import { IceSphere } from './ice-sphere'

// Loading component with fade transition
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-blue-200/60"
      >
        Loading...
      </motion.div>
    </div>
  )
}

// Camera controller component
function CameraController({ isZoomedOut }) {
  const { camera } = useThree()
  const initialPosition = [8, 0, 8]
  const zoomedOutPosition = [16, 0, 16]

  useFrame(() => {
    if (isZoomedOut) {
      camera.position.x += (zoomedOutPosition[0] - camera.position.x) * 0.02
      camera.position.y += (zoomedOutPosition[1] - camera.position.y) * 0.02
      camera.position.z += (zoomedOutPosition[2] - camera.position.z) * 0.02
    } else {
      camera.position.x += (initialPosition[0] - camera.position.x) * 0.02
      camera.position.y += (initialPosition[1] - camera.position.y) * 0.02
      camera.position.z += (initialPosition[2] - camera.position.z) * 0.02
    }
  })

  return null
}

export function ThreeScene({ isZoomedOut = false }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSceneReady, setIsSceneReady] = useState(false)

  const handleSceneCreated = () => {
    // Short delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full h-full bg-black">
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Canvas 
          camera={{ 
            position: [8, 0, 8],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          onCreated={handleSceneCreated}
        >
          <Suspense fallback={null}>
            <CameraController isZoomedOut={isZoomedOut} />
            
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
              isReady={!isLoading}
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
          </Suspense>
        </Canvas>
      </motion.div>
    </div>
  )
}

