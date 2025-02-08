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

  // Wheel-like rotation animation
  useFrame((state, delta) => {
    timeRef.current += delta
    
    if (ringRef.current) {
      // Rotate around the Y axis for wheel-like motion when viewed from front
      ringRef.current.rotation.y -= rotationSpeed * delta
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
          color="#666666"
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
    <group ref={groupRef} position={position} rotation={[3 * Math.PI / 2, -Math.PI / 4, 0]}>
      {/* Ring of segments that will rotate */}
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
        {/* Central hub - cone shaped with thrusters */}
        <group rotation={[Math.PI, 0, 0]}>
          {/* Main cone body */}
          <mesh>
            <coneGeometry args={[size * 2, size * 7, 16, 1, false, size * 1]} /> {/* [radius, height, segments, heightSegments, openEnded, thetaStart] */}
            <meshStandardMaterial 
              color="#444444"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          
          {/* Thruster ring */}
          <mesh position={[0, -size * 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.8, size * 0.3, 16, 32]} /> {/* [radius, tube, radialSegments, tubularSegments] */}
            <meshStandardMaterial 
              color="#666666"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Thruster nozzles */}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * size * 1.5,
                  -size * 3.5,
                  Math.sin(angle) * size * 1.5
                ]}
                rotation={[0, 0, 0]}
              >
                <cylinderGeometry args={[size * 0.4, size * 0.6, size * 0.8, 8]} />
                <meshStandardMaterial 
                  color="#333333"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            )
          })}
        </group>
      </group>
    </group>
  )
} 