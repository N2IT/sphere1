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
  const [animationPhase, setAnimationPhase] = useState(0) // 0: initial, 1: zoomed out, 2: top-right
  const initialPosition = [8, 0, 8]
  const zoomedOutPosition = [16, 0, 16]
  const finalPosition = [25, 10, 25]
  
  // Define lookAt targets for each phase
  const initialTarget = [0, 0, 0]
  const finalTarget = [-45, -15, 0] // Inverted values to move scene to top-right

  // Track animation progress
  const animationProgress = useRef(0)
  const lastTime = useRef(Date.now())

  useFrame(() => {
    const currentTime = Date.now()
    const deltaTime = (currentTime - lastTime.current) / 1000
    lastTime.current = currentTime

    if (!isZoomedOut) {
      // Reset animation when returning
      animationProgress.current = 0
      setAnimationPhase(0)
      
      // Return to initial position
      camera.position.x += (initialPosition[0] - camera.position.x) * 0.02
      camera.position.y += (initialPosition[1] - camera.position.y) * 0.02
      camera.position.z += (initialPosition[2] - camera.position.z) * 0.02
      camera.lookAt(...initialTarget)
      return
    }

    // Increment animation progress
    if (animationPhase === 0) {
      animationProgress.current += deltaTime * 0.3 // Slower first phase
      if (animationProgress.current >= 1) {
        setAnimationPhase(1)
        animationProgress.current = 0
      }
    } else if (animationPhase === 1) {
      animationProgress.current += deltaTime * 0.3 // Slower second phase
    }

    // Clamp animation progress
    animationProgress.current = Math.min(animationProgress.current, 1)

    // Calculate target position and lookAt based on animation phase
    let targetPosition, currentLookAt
    if (animationPhase === 0) {
      // First phase: Initial position to zoomed out
      targetPosition = {
        x: initialPosition[0] + (zoomedOutPosition[0] - initialPosition[0]) * animationProgress.current,
        y: initialPosition[1] + (zoomedOutPosition[1] - initialPosition[1]) * animationProgress.current,
        z: initialPosition[2] + (zoomedOutPosition[2] - initialPosition[2]) * animationProgress.current
      }
      currentLookAt = initialTarget
    } else {
      // Second phase: Zoomed out to final position with shifted lookAt
      targetPosition = {
        x: zoomedOutPosition[0] + (finalPosition[0] - zoomedOutPosition[0]) * animationProgress.current,
        y: zoomedOutPosition[1] + (finalPosition[1] - zoomedOutPosition[1]) * animationProgress.current,
        z: zoomedOutPosition[2] + (finalPosition[2] - zoomedOutPosition[2]) * animationProgress.current
      }
      // Smoothly interpolate lookAt target
      currentLookAt = [
        initialTarget[0] + (finalTarget[0] - initialTarget[0]) * animationProgress.current,
        initialTarget[1] + (finalTarget[1] - initialTarget[1]) * animationProgress.current,
        initialTarget[2] + (finalTarget[2] - initialTarget[2]) * animationProgress.current
      ]
    }

    // Update camera position with easing
    camera.position.x += (targetPosition.x - camera.position.x) * 0.05
    camera.position.y += (targetPosition.y - camera.position.y) * 0.05
    camera.position.z += (targetPosition.z - camera.position.z) * 0.05

    // Update camera lookAt
    camera.lookAt(...currentLookAt)
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
              enableZoom={false} 
              enablePan={false}
              enableRotate={!isZoomedOut}
              minDistance={4}
              maxDistance={20}
              autoRotate={!isZoomedOut}
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

