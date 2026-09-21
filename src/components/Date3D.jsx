import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'

/**
 * Builds the wrinkled, elongated body of a Deglet Nour date
 * by displacing the vertices of a high-res sphere.
 */
function useDateGeometry() {
  return useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 160, 160)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const y = v.y // -1 (bottom) .. 1 (top / stem)
      const angle = Math.atan2(v.z, v.x)

      // The date is thinner near the stem and rounder at the base
      const taper = 1 - 0.18 * Math.max(0, y) ** 1.5 + 0.04 * Math.min(0, y)

      // Longitudinal ridges (dried-skin wrinkles), fading out at both poles
      const fade = 1 - Math.abs(y) ** 2.2
      const ridges = Math.sin(angle * 9 + y * 2.5) * 0.045 * fade
      const fine =
        (Math.sin(angle * 21 + y * 6) * 0.012 + Math.sin(y * 17 + angle * 4) * 0.01) * fade

      // A shallow crease along one side, typical of a soft date
      const crease = -0.05 * Math.exp(-((angle - 0.9) ** 2) * 6) * fade

      const r = (1 + ridges + fine + crease) * taper
      v.x *= r
      v.z *= r
      v.y *= 1.9

      pos.setXYZ(i, v.x, v.y, v.z)
    }

    geo.computeVertexNormals()
    return geo
  }, [])
}

function DateFruit() {
  const group = useRef()
  const geometry = useDateGeometry()

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.25
    // Gentle tilt that follows the pointer
    const targetX = state.pointer.y * 0.15
    const targetZ = -state.pointer.x * 0.15
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.15 + targetX, 0.05)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -0.35 + targetZ, 0.05)
  })

  return (
    <group ref={group} rotation={[0.15, 0, -0.35]}>
      {/* Body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#a35a1c"
          roughness={0.42}
          metalness={0}
          clearcoat={0.55}
          clearcoatRoughness={0.4}
          sheen={1}
          sheenRoughness={0.55}
          sheenColor="#f6c581"
          transmission={0.1}
          thickness={1.2}
          ior={1.4}
          attenuationColor="#d9822a"
          attenuationDistance={0.8}
          emissive="#2d0d03"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Calyx – the small dry cap where the stem was attached */}
      <mesh position={[0, 1.86, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.1, 24]} />
        <meshStandardMaterial color="#c9a06a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.96, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.08, 0.16, 12]} />
        <meshStandardMaterial color="#8c6a3d" roughness={1} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* Key, fill and rim lights tuned to warm honey tones */}
      <ambientLight intensity={0.35} color="#f6dcae" />
      <spotLight
        position={[5, 8, 6]}
        angle={0.4}
        penumbra={0.8}
        intensity={90}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, -2, 4]} intensity={25} color="#f0a24f" />
      <pointLight position={[0, -5, -6]} intensity={40} color="#ffb060" />

      {/* A studio-like environment built from lightformers (no external HDR needed) */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 6, -8]} scale={[12, 6, 1]} color="#fff3dd" />
        <Lightformer
          form="ring"
          intensity={4}
          position={[-6, 2, 4]}
          rotation-y={Math.PI / 2}
          scale={[6, 6, 1]}
          color="#f6c581"
        />
        <Lightformer
          intensity={2}
          position={[6, -3, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 3, 1]}
          color="#e09a45"
        />
      </Environment>

      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={1.1} floatingRange={[-0.25, 0.25]}>
        <DateFruit />
      </Float>

      <Sparkles count={70} scale={[7, 7, 4]} size={2.2} speed={0.35} opacity={0.5} color="#f2c27a" />

      <ContactShadows position={[0, -2.8, 0]} opacity={0.55} scale={12} blur={2.6} far={4} color="#0b0402" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.6}
        rotateSpeed={0.6}
      />
    </>
  )
}

export default function Date3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.8], fov: 32 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      shadows
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
