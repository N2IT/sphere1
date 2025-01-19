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

    // Load multiple textures
    const textureLoader = new THREE.TextureLoader()
    const normalMap = textureLoader.load('/textures/Ice_001_COLOR.jpg')
    const roughnessMap = textureLoader.load('/textures/Ice_001_DISP.jpg')
    const metallicMap = textureLoader.load('/textures/Ice_001_NRM.jpg')
    const displacementMap = textureLoader.load('/textures/Ice_001_SPEC.jpg')

    // Configure texture settings
    const textures = [normalMap, roughnessMap, metallicMap, displacementMap]
    textures.forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2, 2) // Adjust texture tiling
    })

    // Create sphere geometry with more segments for better displacement
    const geometry = new THREE.SphereGeometry(2, 128, 128)
    
    // Create enhanced material with multiple textures
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        normalMap: { value: normalMap },
        roughnessMap: { value: roughnessMap },
        metallicMap: { value: metallicMap },
        displacementMap: { value: displacementMap },
        displacementScale: { value: 0.3 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vViewPosition;
        
        uniform sampler2D displacementMap;
        uniform float displacementScale;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          
          // Apply displacement mapping
          vec4 displacement = texture2D(displacementMap, vUv);
          vec3 newPosition = position + normal * displacement.r * displacementScale;
          vPosition = newPosition;
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vViewPosition;
        
        uniform float time;
        uniform sampler2D normalMap;
        uniform sampler2D roughnessMap;
        uniform sampler2D metallicMap;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          // Sample all texture maps
          vec3 normalMapValue = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
          float roughness = texture2D(roughnessMap, vUv).r;
          float metallic = texture2D(metallicMap, vUv).r;
          
          // Enhanced normal mapping with detail
          vec3 normal = normalize(vNormal + normalMapValue * 0.8);
          
          float intensity = pow(0.7 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
          
          // Dynamic color palette with metallic influence
          vec3 color1 = vec3(0.1, 0.4, 1.0);  // Blue
          vec3 color2 = vec3(0.8, 0.2, 0.8);  // Purple
          vec3 color3 = vec3(0.1, 0.8, 0.8);  // Cyan
          
          // Use metallic map to influence color mixing
          float colorMix = sin(time * 0.2) * 0.5 + 0.5;
          colorMix = mix(colorMix, metallic, 0.5);
          vec3 baseGlow = mix(color1, color2, colorMix) * intensity;
          
          // Enhanced holographic shapes with roughness influence
          vec2 center = vUv * 2.0 - 1.0;
          float t = time * 0.2;
          
          float shapes = 0.0;
          for(int i = 0; i < 8; i++) {
            float angle = float(i) * 3.14159 * 2.0 / 8.0 + t;
            vec2 offset = vec2(cos(angle), sin(angle)) * 0.5;
            vec2 pos = center + offset;
            
            vec2 size = vec2(0.3, 0.2);
            vec2 rect = smoothstep(size, size + 0.1, abs(pos));
            float shape = 1.0 - max(rect.x, rect.y);
            
            // Use roughness to affect shape intensity
            shape *= 0.5 + 0.5 * sin(time + float(i));
            shape *= mix(1.0, roughness, 0.5);
            shapes += shape * 0.3;
          }
          
          // Enhanced color combination with material properties
          vec3 shapeColor = mix(color2, color3, shapes) * shapes;
          vec3 finalColor = mix(baseGlow, shapeColor, roughness);
          
          // Enhanced edge glow with metallic reflection
          float edge = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 4.0);
          finalColor += mix(color2, color3, edge) * edge * metallic;
          
          // Add dynamic iridescence based on material properties
          float iridescence = sin(dot(normal, vec3(1.0)) * 8.0 + time) * 0.5 + 0.5;
          iridescence = mix(iridescence, metallic, 0.5);
          finalColor += vec3(iridescence * 0.2, iridescence * 0.1, iridescence * 0.3);
          
          // Final color with opacity influenced by roughness
          gl_FragColor = vec4(finalColor, max(intensity * 1.5, shapes) * (1.0 - roughness * 0.5));
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

