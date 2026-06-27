import { Suspense, useMemo, useState, Component } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

const DEFAULT_MODEL = "/Modal/mohan-model.glb";
// Shown whenever the requested model is missing / fails to load.
const FALLBACK_MODEL = "/models/mm-modal.glb";
// Reference (default / reset) camera distance from the model.
const REF_DISTANCE = 40;
// Fraction of the smaller viewport dimension the model should fill.
const FILL = 0.92;

/** In-canvas loader shown while the GLTF + environment stream in. */
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-10 h-10 rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462] animate-spin" />
        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
          Loading 3D · {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

/**
 * Loads the GLTF and auto-fits it responsively:
 *  - measures the model's bounding sphere (rotation-invariant, so it never
 *    crops while the user rotates it),
 *  - scales it to fill ~FILL of the smaller visible viewport dimension at the
 *    reference camera distance, recomputed whenever the canvas resizes
 *    (desktop / tablet / mobile),
 *  - <Center>s it at the origin so the camera always frames it.
 */
function Model({ modelPath, fill }) {
  const { scene } = useGLTF(modelPath);
  const { size, camera } = useThree();

  // Clone the cached scene PER INSTANCE. A THREE.Object3D can only live in one
  // scene graph at a time, so without this a second canvas (Big Screen) would
  // "steal" the model from the first (inline) one - making it vanish on return.
  const object = useMemo(() => scene.clone(true), [scene]);

  // Bounding-sphere radius (rotation-invariant → never crops while rotating).
  const radius = useMemo(() => {
    const box = new THREE.Box3().setFromObject(object);
    return box.getBoundingSphere(new THREE.Sphere()).radius || 1;
  }, [object]);

  // Responsive scale: fill `fill` of the smaller visible viewport dimension
  // at the reference camera distance; recomputed on every resize.
  const scale = useMemo(() => {
    const fov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * REF_DISTANCE * Math.tan(fov / 2);
    const aspect = size.width / Math.max(1, size.height);
    const visibleWidth = visibleHeight * aspect;
    const minDim = Math.min(visibleHeight, visibleWidth);
    return (fill * minDim) / (2 * radius);
  }, [radius, size.width, size.height, camera.fov, fill]);

  return (
    <group scale={scale}>
      <Center>
        {/* dispose={null}: never dispose the geometry/material shared with the
            cached source when this instance unmounts (prevents the other
            canvas from going blank). */}
        <primitive object={object} dispose={null} />
      </Center>
    </group>
  );
}

/**
 * Catches GLTF load failures (bad file, network), logs the real error for
 * debugging and notifies the parent so it can swap in the fallback model.
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("[Product3DCanvas] 3D model failed to load:", error, info);
    this.props.onError?.(error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function ErrorFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xl">!</div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Couldn't load the 3D model</p>
      <p className="text-xs text-gray-400">Please check your connection and try again.</p>
    </div>
  );
}

/**
 * Reusable interactive 3D product canvas.
 * - Click/touch drag to rotate, right-drag/two-finger to pan, wheel/pinch to
 *   zoom (OrbitControls). No auto-rotation: the model stays still until the
 *   user interacts with it.
 * - Auto-fits any model; `controlsRef` lets a parent drive zoom / reset.
 * - `dpr={[1, 2]}` caps device pixel ratio for smooth rendering on mobile.
 */
/** The canvas + scene for a given model path. */
function CanvasScene({ modelPath, controlsRef, fill }) {
  return (
    <Canvas
      // Static model → render only on interaction/load, not a continuous loop.
      frameloop="demand"
      camera={{ position: [0, 0.5, REF_DISTANCE], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Lighting - bright enough that any model is clearly visible */}
      <ambientLight intensity={1.2} />
      <hemisphereLight intensity={0.8} groundColor="#b58a8a" />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} />

      <Suspense fallback={<CanvasLoader />}>
        <Model modelPath={modelPath} fill={fill} />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        autoRotate={false}
        enableZoom
        enablePan
        enableDamping
        target={[0, 0, 0]}
        minDistance={14}
        maxDistance={70}
        /* Free, continuous 360° horizontal rotation (no azimuth limits). */
        /* Lock vertical rotation -keep the camera at eye level (horizontal only). */
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

export default function Product3DCanvas({
  modelPath = DEFAULT_MODEL, controlsRef,
  fill = FILL,
}) {
  // 0 = requested model, 1 = mm-modal fallback, 2 = give up (text fallback).
  const [stage, setStage] = useState(modelPath ? 0 : 1);

  if (stage >= 2) return <ErrorFallback />;

  const activeModel = stage === 0 ? modelPath : FALLBACK_MODEL;

  return (
    // `key` remounts the boundary cleanly when we escalate to the fallback.
    <ModelErrorBoundary key={activeModel} onError={() => setStage((s) => s + 1)}>
      <CanvasScene modelPath={activeModel} controlsRef={controlsRef} fill={fill} />
    </ModelErrorBoundary>
  );
}

useGLTF.preload(DEFAULT_MODEL);
useGLTF.preload(FALLBACK_MODEL);
