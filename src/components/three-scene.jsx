'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear any existing canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64)
    
    // Create glowing material with holographic texture
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normal;
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          // Base glow
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 baseGlow = vec3(0.1, 0.4, 1.0) * intensity;
          
          // Holographic shapes
          vec2 center = vUv * 2.0 - 1.0;
          float t = time * 0.2;
          
          // Create multiple shapes
          float shapes = 0.0;
          for(int i = 0; i < 8; i++) {
            float angle = float(i) * 3.14159 * 2.0 / 8.0 + t;
            vec2 offset = vec2(cos(angle), sin(angle)) * 0.5;
            vec2 pos = center + offset;
            
            // Rounded rectangle shape
            vec2 size = vec2(0.3, 0.2);
            vec2 rect = smoothstep(size, size + 0.1, abs(pos));
            float shape = 1.0 - max(rect.x, rect.y);
            
            // Add some variation
            shape *= 0.5 + 0.5 * sin(time + float(i));
            shapes += shape * 0.3;
          }
          
          // Combine effects
          vec3 shapeColor = vec3(0.2, 0.6, 1.0) * shapes;
          vec3 finalColor = baseGlow + shapeColor;
          
          // Add subtle pink/red edges
          float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.0);
          finalColor += vec3(1.0, 0.2, 0.5) * edge * 0.3;
          
          gl_FragColor = vec4(finalColor, max(intensity * 1.5, shapes));
        }
      `,
      transparent: true,
    })

    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    camera.position.z = 5

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      sphere.rotation.y += 0.001
      material.uniforms.time.value += 0.01
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

