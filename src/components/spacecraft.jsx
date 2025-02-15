import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export function Spacecraft({ 
  size = 0.05,
  rotationSpeed = 0.2,
  position = [0, 0, 0],
  orbitRadius = 4,
  orbitSpeed = 0.2
}) {
  const groupRef = useRef()
  const ringRef = useRef()
  const timeRef = useRef(0)

  // Orbit and rotation animation
  useFrame((state, delta) => {
    timeRef.current += delta
    
    if (ringRef.current) {
      // Rotate ring around its axis
      ringRef.current.rotation.y -= rotationSpeed * delta
    }

    if (groupRef.current) {
      // Calculate orbit position
      const angle = timeRef.current * orbitSpeed
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius
      
      // Point nose in direction of travel while maintaining vertical orientation
      groupRef.current.rotation.x = 3 * Math.PI / 2  // Keep spacecraft upright
      groupRef.current.rotation.y = angle - Math.PI / 2  // Point in direction of travel
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
    <group ref={groupRef} position={position} rotation={[3 * Math.PI / 2, 0, 0]}>
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
          {/* Top section (cockpit) */}
          <mesh position={[0, size * 2, 0]}>
            <cylinderGeometry args={[size * .3, size * 2.5, size * 3, 32]} /> {/* [topRadius, bottomRadius, height, segments] */}
            <meshStandardMaterial 
              color="#fefefe"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Cockpit Windows */}
          {/* Front window */}
          <RoundedBox 
            position={[
              Math.cos(0) * size * 0.9025,
              size * 2.45,
              Math.sin(0) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              0,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Back window */}
          <RoundedBox 
            position={[
              Math.cos(Math.PI) * size * 0.9025,
              size * 2.45,
              Math.sin(Math.PI) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -Math.PI,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Third window - 45 degrees */}
          <RoundedBox 
            position={[
              Math.cos(Math.PI / 4) * size * 0.9025,
              size * 2.45,
              Math.sin(Math.PI / 4) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -Math.PI / 4,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Fourth window - 90 degrees */}
          <RoundedBox 
            position={[
              Math.cos(Math.PI / 2) * size * 0.9025,
              size * 2.45,
              Math.sin(Math.PI / 2) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -Math.PI / 2,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Fifth window - 135 degrees */}
          <RoundedBox 
            position={[
              Math.cos(3 * Math.PI / 4) * size * 0.9025,
              size * 2.45,
              Math.sin(3 * Math.PI / 4) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -3 * Math.PI / 4,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Sixth window - 225 degrees */}
          <RoundedBox 
            position={[
              Math.cos(5 * Math.PI / 4) * size * 0.9025,
              size * 2.45,
              Math.sin(5 * Math.PI / 4) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -5 * Math.PI / 4,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Seventh window - 270 degrees */}
          <RoundedBox 
            position={[
              Math.cos(3 * Math.PI / 2) * size * 0.9025,
              size * 2.45,
              Math.sin(3 * Math.PI / 2) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -3 * Math.PI / 2,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Eighth window - 315 degrees */}
          <RoundedBox 
            position={[
              Math.cos(7 * Math.PI / 4) * size * 0.9025,
              size * 2.45,
              Math.sin(7 * Math.PI / 4) * size * 0.9025
            ]}
            rotation={[
              Math.PI / 1.1,
              -7 * Math.PI / 4,
              1 + Math.PI / 2.5
            ]}
            args={[size * .9, size * 0.1, size * 0.8]}
            radius={0.005}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#88ccff"
              metalness={0.9}
              roughness={0.1}
              emissive="#447799"
              emissiveIntensity={0.5}
            />
          </RoundedBox>

          {/* Bottom section (main body) */}
          <mesh position={[0, -size * 1, 0]}>
            <cylinderGeometry args={[size * 2.5, size * 2, size * 4, 32]} /> {/* [topRadius, bottomRadius, height, segments] */}
            <meshStandardMaterial 
              color="#666666"
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