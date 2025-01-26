import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Spacecraft({ 
  size = 0.05,
  rotationSpeed = 0.2,
  position = [0, 0, 0]
}) {
  const groupRef = useRef()
  const ringRef = useRef()
  const timeRef = useRef(0)

  // Only rotation animation, no orbital movement
  useFrame((state, delta) => {
    timeRef.current += delta
    
    if (ringRef.current) {
      // Only maintain ring rotation for styling
      ringRef.current.rotation.z += rotationSpeed * delta
    }
  })

  // Create a segment of the spacecraft
  const Segment = ({ position, rotation = [0, 0, 0], scale = .1 }) => (
    <group position={position} rotation={rotation}>
      {/* Main module */}
      <mesh>
        <boxGeometry args={[size * 2, size, size]} />
        <meshStandardMaterial 
          color="#FFFFFF"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Solar panel */}
      <mesh position={[0, size * 0.8, 0]}>
        <boxGeometry args={[size * 4, size * 0.1, size * 1.5]} />
        <meshStandardMaterial 
          color="#4488FF"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Connector */}
      <mesh position={[size * 1.2, 0, 0]}>
        <cylinderGeometry args={[size * 0.2, size * 0.2, size * 0.5, 8]} />
        <meshStandardMaterial 
          color="#666666"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  )

  return (
    <group ref={groupRef} position={position} rotation={[3 * Math.PI / 2, 0, 0]}>
      <group ref={ringRef}>
        {/* Create ring of segments */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = size * 8
          return (
            <Segment 
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              rotation={[0, -angle, 0]}
            />
          )
        })}
      </group>
      {/* Central hub */}
      <mesh>
        <cylinderGeometry args={[size * 2, size * 2, size, 16]} />
        <meshStandardMaterial 
          color="#333333"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
} 