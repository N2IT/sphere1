'use client'

import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Spacecraft } from './spacecraft'
import { IceSphere } from './ice-sphere'
import * as THREE from 'three'

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
  const animationProgress = useRef(0)
  const lastTime = useRef(Date.now())
  
  const initialPosition = [8, 0, 8]
  const zoomedOutPosition = [16, 0, 16]
  const finalPosition = [25, 10, 25]
  const initialTarget = [0, 0, 0]
  const finalTarget = [-45, -15, 0]

  // Set initial camera position and lookAt
  useEffect(() => {
    camera.position.set(...initialPosition)
    camera.lookAt(...initialTarget)
  }, [])

  useFrame(() => {
    const currentTime = Date.now()
    const deltaTime = (currentTime - lastTime.current) / 1000
    lastTime.current = currentTime

    // Smoothly update animation progress
    const targetProgress = isZoomedOut ? 1 : 0
    const progressDelta = (targetProgress - animationProgress.current) * deltaTime * 0.08
    animationProgress.current += progressDelta

    // Calculate intermediate positions based on single progress value
    const firstPhaseProgress = Math.min(1, animationProgress.current * 2) // 0 to 1 during first half
    const secondPhaseProgress = Math.max(0, (animationProgress.current * 2) - 1) // 0 to 1 during second half

    // Calculate camera position
    const targetPosition = {
      x: initialPosition[0] +
         (zoomedOutPosition[0] - initialPosition[0]) * firstPhaseProgress +
         (finalPosition[0] - zoomedOutPosition[0]) * secondPhaseProgress,
      y: initialPosition[1] +
         (zoomedOutPosition[1] - initialPosition[1]) * firstPhaseProgress +
         (finalPosition[1] - zoomedOutPosition[1]) * secondPhaseProgress,
      z: initialPosition[2] +
         (zoomedOutPosition[2] - initialPosition[2]) * firstPhaseProgress +
         (finalPosition[2] - zoomedOutPosition[2]) * secondPhaseProgress
    }

    // Calculate lookAt target
    const lookAtTarget = new THREE.Vector3(
      initialTarget[0] + (finalTarget[0] - initialTarget[0]) * secondPhaseProgress,
      initialTarget[1] + (finalTarget[1] - initialTarget[1]) * secondPhaseProgress,
      initialTarget[2] + (finalTarget[2] - initialTarget[2]) * secondPhaseProgress
    )

    // Smoothly update camera position
    camera.position.x += (targetPosition.x - camera.position.x) * 0.02
    camera.position.y += (targetPosition.y - camera.position.y) * 0.02
    camera.position.z += (targetPosition.z - camera.position.z) * 0.02

    // Update camera lookAt
    camera.lookAt(lookAtTarget)
  })

  return null
}

export function ThreeScene({ isZoomedOut = false }) {
  const [isLoading, setIsLoading] = useState(true)

  const handleSceneCreated = () => {
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
        transition={{ duration: 1 }}
      >
        <Canvas 
          camera={{ 
            position: [8, 0, 8],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          onCreated={({ gl, camera }) => {
            camera.lookAt(0, 0, 0)
            handleSceneCreated()
          }}
        >
          <Suspense fallback={null}>
            <CameraController isZoomedOut={isZoomedOut} />
            
            {/* Scene Controls - Disabled during transitions */}
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              enableRotate={!isZoomedOut}
              minDistance={4}
              maxDistance={20}
              autoRotate={!isZoomedOut}
              autoRotateSpeed={0.1}
              enableDamping={true}
              dampingFactor={0.05}
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
              isReady={true}
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

