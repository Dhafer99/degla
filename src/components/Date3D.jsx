import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createNoise3D, fbm } from '../lib/noise'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * Soft drop shadow under the floating fruit.
 * A camera-facing plane with a radial gradient: unlike a floor plane it
 * fades to fully transparent well inside the canvas, so it can't get
 * clipped into a hard edge on short (mobile) canvases.
 */
function SoftShadow({ position = [0, -2.55, 0], width = 3.2, height = 0.7, opacity = 0.6 }) {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(8, 3, 1, 1)')
    grad.addColorStop(0.45, 'rgba(8, 3, 1, 0.55)')
    grad.addColorStop(1, 'rgba(8, 3, 1, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <mesh position={position} renderOrder={-1}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

/**
 * Builds a Deglet Nour date from a seamless icosphere.
 *
 * Deglet Nour is slim and elongated with a glossy golden-brown skin.
 * Its wrinkles are long ridges running along the fruit, and where the skin
 * has lifted from the flesh it turns pale and slightly translucent.
 * Surface = gentle asymmetry + lengthwise ridged noise carving the creases
 * + a small flat calyx cap at the stem end. The same fields drive the
 * per-vertex colour.
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

    const cBase = new THREE.Color('#bb6422') // warm brown-orange
    const cDeep = new THREE.Color('#7a3812') // darker brown zones
    const cCrease = new THREE.Color('#3a1506') // crease bottoms
    const cGold = new THREE.Color('#d98b3a') // golden highlights on ridges
    const cPale = new THREE.Color('#cdbba6') // lifted, translucent skin
    const col = new THREE.Color()

    // Track the vertex at the stem pole so the calyx cap sits on the surface
    let poleDist = Infinity
    const pole = new THREE.Vector3()

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(pos, i)
      const { x, y, z } = v // unit sphere
      const ang = Math.atan2(z, x)

      // --- Stem end (y > 0): a blunt, rounded shoulder with a small cap -----
      const dStem = y > 0 ? Math.sqrt(x * x + z * z) : 1
      const cap = smoothstep(0.2, 0.08, dStem) // flat spot under the cap
      const shoulder = smoothstep(0.85, 0.25, dStem) // the smooth dome around it

      // --- Gentle asymmetry so the silhouette isn't a perfect ellipsoid ----
      const lump = fbm(noise, x * 1.2 + 3.1, y * 0.7, z * 1.2, 2) * 0.035

      // --- Mild domain warp so ridges wander a little ----------------------
      const wx = noise(x * 1.6 + 11, y * 0.8, z * 1.6) * 0.16
      const wz = noise(x * 1.6, y * 0.8, z * 1.6 + 37) * 0.16

      // Poles stay smoother
      const fade = 1 - Math.pow(Math.abs(y), 6)

      // --- Primary ridges: long creases running along the axis -------------
      // high frequency around the circumference, very low along y
      const n1 = noise((x + wx) * 1.9, y * 0.35 + 5, (z + wz) * 1.9)
      const crease1 = Math.pow(1 - Math.abs(n1), 2.0)

      // --- Secondary: a few finer lengthwise wrinkles ----------------------
      const n2 = noise((x + wz) * 3.4 + 50, y * 0.8, (z + wx) * 3.4)
      const crease2 = Math.pow(1 - Math.abs(n2), 3)

      // --- Fine grain ------------------------------------------------------
      const grain = noise(x * 20, y * 20, z * 20) * 0.001

      // Creases soften into a few shallow folds on the shoulder, vanish under the cap
      const creaseDepth = (crease1 * 0.075 + crease2 * 0.012) * fade * (1 - shoulder * 0.75) * (1 - cap)
      const r = 1 + lump - creaseDepth + grain - cap * 0.03

      // Slim, long body: rounder at the base, broad and blunt at the stem end
      const yTop = Math.max(0, y)
      const taper = 1 - 0.05 * yTop ** 3 - 0.05 * Math.max(0, -y) ** 3
      // squash the top pole a little so the end is a dome rather than a point
      const blunt = 1 - 0.09 * smoothstep(0.55, 1, yTop)
      v.set(x * r * taper, y * r * 2.35 * blunt, z * r * taper * 0.94)
      pos.setXYZ(i, v.x, v.y, v.z)
      if (dStem < poleDist) {
        poleDist = dStem
        pole.copy(v)
      }

      // --- Colour ----------------------------------------------------------
      col.copy(cBase)
      // broad light/dark variation along the fruit
      const zone = clamp01(fbm(noise, x * 1.4 + 90, y * 0.9, z * 1.4, 2) * 0.5 + 0.5)
      col.lerp(cDeep, zone * 0.4)
      // ridges catch the light and glow golden
      const ridge = 1 - clamp01(crease1 * 1.2)
      col.lerp(cGold, ridge * 0.35)
      // lifted skin: large pale translucent patches sitting on the ridges
      const patch = smoothstep(0.05, 0.5, noise(x * 1.8 + 77, y * 0.7, z * 1.8 + Math.sin(ang * 2) * 0.3))
      col.lerp(cPale, patch * ridge * 0.85)
      // crease bottoms go dark
      col.lerp(cCrease, clamp01(crease1 * 0.9 + crease2 * 0.35) * 0.6)
      // dry, lighter skin under the cap
      col.lerp(cPale, cap * 0.3)
      // the shoulder is smooth glossy skin: fewer pale patches, warmer tone
      col.lerp(cBase, shoulder * 0.35)

      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return { geometry: geo, pole }
  }, [])
}

function DateFruit() {
  const tilt = useRef()
  const spin = useRef()
  const { geometry, pole } = useDateGeometry()

  useFrame((state, delta) => {
    if (!tilt.current || !spin.current) return
    // Roll slowly around the fruit's own long axis
    spin.current.rotation.y += delta * 0.22
    // Gentle tilt that follows the pointer
    const targetX = state.pointer.y * 0.12
    const targetZ = -state.pointer.x * 0.12
    tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, 0.12 + targetX, 0.05)
    tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, -0.3 + targetZ, 0.05)
  })

  // Nearly upright, leaning slightly, so the full length reads
  return (
    <group ref={tilt} rotation={[0.12, -0.2, -0.3]} scale={0.92}>
      <group ref={spin}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            vertexColors
            color="#ffffff"
            roughness={0.28}
            metalness={0}
            clearcoat={0.9}
            clearcoatRoughness={0.12}
            sheen={0.35}
            sheenRoughness={0.5}
            sheenColor="#f6c581"
            transmission={0.05}
            thickness={1.2}
            ior={1.45}
            attenuationColor="#c8641c"
            attenuationDistance={0.7}
            emissive="#240a02"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Small flat calyx cap where the stem was attached */}
        <mesh position={[pole.x, pole.y + 0.02, pole.z]}>
          <cylinderGeometry args={[0.11, 0.15, 0.07, 18]} />
          <meshStandardMaterial color="#d4b27c" roughness={0.9} />
        </mesh>
        <mesh position={[pole.x, pole.y + 0.075, pole.z]}>
          <cylinderGeometry args={[0.04, 0.055, 0.05, 12]} />
          <meshStandardMaterial color="#7d5a33" roughness={1} />
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
      <spotLight position={[5, 8, 6]} angle={0.4} penumbra={0.8} intensity={110} color="#fff1d6" />
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

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <DateFruit />
      </Float>

      <Sparkles count={70} scale={[7, 7, 4]} size={2.2} speed={0.35} opacity={0.5} color="#f2c27a" />

      <SoftShadow />
    </>
  )
}

export default function Date3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9.6], fov: 32 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
