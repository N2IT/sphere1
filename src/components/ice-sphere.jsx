import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Shader code as constants
const vertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normal;
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  // Improved noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                       0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));  // Adjusted light direction
    float wrap = 0.5;  // Light wrap factor for smoother transitions
    
    // Smoother lighting calculation with wrap lighting
    float diffuse = max(0.0, (dot(vNormal, lightDir) + wrap) / (1.0 + wrap));
    float intensity = smoothstep(0.0, 1.0, diffuse);
    
    // Create layered noise for texture
    float noiseScale1 = 8.0;
    float noiseScale2 = 16.0;
    float timeScale = time * 0.1;
    
    vec2 uv1 = vUv * noiseScale1;
    vec2 uv2 = vUv * noiseScale2 + timeScale;
    
    float noise1 = snoise(uv1 + timeScale);
    float noise2 = snoise(uv2) * 0.5;
    
    // Combine noise layers with smoother blending
    float combinedNoise = noise1 * 0.7 + noise2 * 0.3;
    
    // Smooth color transition
    vec3 brightColor = vec3(0.2, 0.5, 1.0);
    vec3 darkColor = vec3(0.1, 0.2, 0.4);
    vec3 baseColor = mix(
      darkColor,
      brightColor,
      smoothstep(0.2, 0.8, diffuse + combinedNoise * 0.3)
    );
    
    // Add atmospheric scattering effect
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
    vec3 baseGlow = mix(baseColor, atmosphereColor, fresnel * 0.5) * (intensity + combinedNoise * 0.3);
    
    // Enhanced holographic shapes with smoother blending
    vec2 center = vUv * 2.0 - 1.0;
    float t = time * 0.2;
    
    float shapes = 0.0;
    for(int i = 0; i < 8; i++) {
      float angle = float(i) * 3.14159 * 2.0 / 8.0 + t;
      vec2 offset = vec2(cos(angle), sin(angle)) * (0.5 + combinedNoise * 0.1);
      vec2 pos = center + offset;
      
      vec2 size = vec2(0.3, 0.2);
      vec2 rect = smoothstep(size, size + 0.1, abs(pos));
      float shape = 1.0 - max(rect.x, rect.y);
      
      shape *= 0.5 + 0.5 * sin(time + float(i) + combinedNoise);
      shapes += shape * 0.3;
    }
    
    // Combine all effects with smoother transitions
    vec3 shapeColor = vec3(0.2, 0.6, 1.0) * shapes;
    vec3 finalColor = baseGlow + shapeColor;
    
    // Enhanced edge effect with smoother falloff
    float edge = smoothstep(0.0, 1.0, pow(fresnel, 3.0));
    finalColor += vec3(1.0, 0.2, 0.5) * edge * (0.3 + combinedNoise * 0.2);
    
    // Add subtle color variations with smoother blending
    finalColor *= 1.0 + combinedNoise * 0.2;
    
    // Smooth alpha transition
    float alpha = smoothstep(0.0, 1.0, max(intensity * 1.5, shapes));
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function IceSphere({ 
  radius = 4,
  position = [0, 0, 0],
  rotationSpeed = 0.001,
  isReady = false
}) {
  const meshRef = useRef()
  const materialRef = useRef()
  const timeRef = useRef(0)

  // Create shader material with fade-in uniforms
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      opacity: { value: 0 }, // Start fully transparent
      transitionProgress: { value: 0 } // For smooth material transition
    },
    vertexShader,
    fragmentShader: `
      ${fragmentShader.split('void main()')[0]}
      uniform float opacity;
      uniform float transitionProgress;
      
      void main() {
        ${fragmentShader.split('void main()')[1].replace(
          'gl_FragColor = vec4(finalColor, alpha);',
          'gl_FragColor = vec4(finalColor, alpha * opacity);'
        )}
      }
    `,
    transparent: true,
  })

  // Animation
  useFrame((state, delta) => {
    timeRef.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.material.uniforms.time.value += delta

      // Smooth transition when ready
      if (isReady) {
        meshRef.current.material.uniforms.opacity.value += (1 - meshRef.current.material.uniforms.opacity.value) * 0.05
        meshRef.current.material.uniforms.transitionProgress.value += (1 - meshRef.current.material.uniforms.transitionProgress.value) * 0.03
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
} 