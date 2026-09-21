import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createNoise3D, fbm } from '../lib/noise'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * Builds a soft, wrinkled date (Medjool style) from a seamless icosphere.
 *
 * Surface = big irregular lumps + two layers of "ridged" noise whose zero
 * crossings carve sharp creases (like loose skin folding) + fine grain.
 * The same fields drive per-vertex colour: creases go deep red-brown,
 * stretched skin goes pale amber, and a few blotches simulate the papery
 * skin that lifts away from the flesh.
 */
function useDateGeometry() {
  return useMemo(() => {
    const noise = createNoise3D(7)
    let geo = new THREE.IcosahedronGeometry(1, 110)
    geo = mergeVertices(geo) // share vertices so normals are smooth

    const pos = geo.attributes.position
    const count = pos.count
    const colors = new Float32Array(count * 3)
    const v = new THREE.Vector3()

    const cBase = new THREE.Color('#cf7647')
    const cRed = new THREE.Color('#993f1f')
    const cDark = new THREE.Color('#521a0b')
    const cLight = new THREE.Color('#f0b384')
    const cPale = new THREE.Color('#e6bd97')
    const col = new THREE.Color()

    // Track the highest point so the stem cap sits on the actual surface
    let topY = -Infinity
    const top = new THREE.Vector3()

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(pos, i)
      const { x, y, z } = v // unit sphere

      // --- Large-scale irregularity (asymmetric lumps) --------------------
      const lump = fbm(noise, x * 1.3 + 3.1, y * 0.9, z * 1.3, 2) * 0.085

      // --- Domain warp so creases meander instead of following a grid -----
      const wx = noise(x * 1.4 + 11, y * 1.4, z * 1.4) * 0.35
      const wy = noise(x * 1.4, y * 1.4 + 23, z * 1.4) * 0.35
      const wz = noise(x * 1.4, y * 1.4, z * 1.4 + 37) * 0.35

      // Keep the two poles relatively smooth
      const fade = 1 - Math.pow(Math.abs(y), 5)

      // Some areas of the skin stay taut and smooth, others fold heavily
      const foldMask = 0.25 + 0.75 * smoothstep(-0.35, 0.45, noise(x * 1.1 + 200, y * 1.1, z * 1.1))

      // --- Primary folds: a few long, deep creases along the fruit axis ---
      const n1 = noise((x + wx) * 1.9, (y + wy) * 0.6, (z + wz) * 1.9)
      const crease1 = Math.pow(1 - Math.abs(n1), 2.8) * foldMask

      // --- Secondary folds: shallower wrinkles between the big ones -------
      const n2 = noise((x + wz) * 3.8 + 50, (y + wx) * 1.6, (z + wy) * 3.8)
      const crease2 = Math.pow(1 - Math.abs(n2), 3.5) * foldMask

      // --- Very subtle skin grain -----------------------------------------
      const grain = noise(x * 18, y * 18, z * 18) * 0.0015

      const creaseDepth = (crease1 * 0.075 + crease2 * 0.016) * fade
      const r = 1 + lump - creaseDepth + grain

      // Plump oblong body, slightly narrower towards the stem (y > 0)
      const taper = 1 - 0.12 * Math.max(0, y) ** 2
      v.set(x * r * taper * 1.0, y * r * 1.55, z * r * taper * 0.9)
      pos.setXYZ(i, v.x, v.y, v.z)
      if (v.y > topY) {
        topY = v.y
        top.copy(v)
      }

      // --- Colour ----------------------------------------------------------
      col.copy(cBase)
      // broad warm/red variation
      const tint = clamp01(fbm(noise, x * 1.8 + 90, y * 1.8, z * 1.8, 2) * 0.5 + 0.5)
      col.lerp(cRed, tint * 0.45)
      // raised skin catches light and reads paler
      col.lerp(cLight, clamp01(lump * 5 + 0.15) * 0.5)
      // papery lifted-skin patches
      const blotch = smoothstep(0.25, 0.6, noise(x * 2.2 + 77, y * 2.2, z * 2.2))
      col.lerp(cPale, blotch * 0.65)
      // creases darken towards deep red-brown
      col.lerp(cDark, clamp01(crease1 * 0.85 + crease2 * 0.4) * 0.7)

      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return { geometry: geo, top }
  }, [])
}

function DateFruit() {
  const tilt = useRef()
  const spin = useRef()
  const { geometry, top } = useDateGeometry()

  useFrame((state, delta) => {
    if (!tilt.current || !spin.current) return
    // Roll slowly around the fruit's own long axis so the side profile stays visible
    spin.current.rotation.y += delta * 0.2
    // Gentle tilt that follows the pointer
    const targetX = state.pointer.y * 0.15
    const targetZ = -state.pointer.x * 0.15
    tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, 0.3 + targetX, 0.05)
    tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, -1.0 + targetZ, 0.05)
  })

  return (
    <group ref={tilt} rotation={[0.3, 0, -1.0]} scale={1.12}>
      <group ref={spin}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          vertexColors
          color="#ffffff"
          roughness={0.34}
          metalness={0}
          clearcoat={0.75}
          clearcoatRoughness={0.18}
          sheen={0.6}
          sheenRoughness={0.5}
          sheenColor="#f6c581"
          transmission={0.06}
          thickness={1.4}
          ior={1.42}
          attenuationColor="#d9611f"
          attenuationDistance={0.7}
          emissive="#2a0a03"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Calyx – the small dry cap where the stem was attached */}
      <mesh position={[top.x, top.y - 0.03, top.z]}>
        <cylinderGeometry args={[0.07, 0.15, 0.06, 20]} />
        <meshStandardMaterial color="#8a6238" roughness={0.95} />
      </mesh>
      </group>
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* Key, fill and rim lights tuned to warm honey tones */}
      <ambientLight intensity={0.3} color="#f6dcae" />
      <spotLight
        position={[5, 8, 6]}
        angle={0.4}
        penumbra={0.8}
        intensity={110}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, -2, 4]} intensity={22} color="#f0a24f" />
      <pointLight position={[0, -5, -6]} intensity={40} color="#ffb060" />

      {/* A studio-like environment built from lightformers (no external HDR needed) */}
      <Environment resolution={256}>
        <Lightformer intensity={3.5} position={[0, 6, -8]} scale={[12, 6, 1]} color="#fff3dd" />
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
        <Lightformer intensity={1.2} position={[2, 8, 3]} scale={[3, 3, 1]} color="#ffffff" />
      </Environment>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <DateFruit />
      </Float>

      <Sparkles count={70} scale={[7, 7, 4]} size={2.2} speed={0.35} opacity={0.5} color="#f2c27a" />

      <ContactShadows position={[0, -2.6, 0]} opacity={0.55} scale={12} blur={2.6} far={4} color="#0b0402" />
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
