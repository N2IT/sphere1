import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function IceSphere({ 
  radius = 2, 
  position = [0, 0, 0],
  rotationSpeed = 0.001,
  displacementScale = 0.35,
  refractionStrength = 0.7,
  scatteringStrength = 0.6,
  segments = 256,
  color = [0.75, 0.85, 1.0],
  opacity = 0.6,
  envMapIntensity = 1.0
}) {
  const materialRef = useRef()
  const meshRef = useRef()
  const timeRef = useRef(0)

  useEffect(() => {
    // Load textures
    const textureLoader = new THREE.TextureLoader()
    const colorMap = textureLoader.load('/textures/Ice_001_COLOR.jpg')
    const normalMap = textureLoader.load('/textures/Ice_001_NORM.jpg')
    const roughnessMap = textureLoader.load('/textures/Ice_001_ROUGH.jpg')
    const aoMap = textureLoader.load('/textures/Ice_001_OCC.jpg')
    const displacementMap = textureLoader.load('/textures/Ice_001_DISP.png')

    // Configure texture settings
    const textures = [colorMap, normalMap, roughnessMap, aoMap, displacementMap]
    textures.forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2)
    })

    // Create material
    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      aoMap: aoMap,
      displacementMap: displacementMap,
      displacementScale: displacementScale,
      transparent: true,
      opacity: opacity,
      color: new THREE.Color(color[0], color[1], color[2]),
      envMapIntensity: envMapIntensity,
      metalness: 0.3,
      roughness: 0.6,
      normalScale: new THREE.Vector2(1.5, 1.5),
    })

    materialRef.current = material
    if (meshRef.current) {
      meshRef.current.material = material
    }

    // Cleanup
    return () => {
      material.dispose()
      textures.forEach(texture => texture.dispose())
    }
  }, [displacementScale, color, opacity, envMapIntensity])

  // Animation
  useFrame((state, delta) => {
    timeRef.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, segments, segments]} />
    </mesh>
  )
} 