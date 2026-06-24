import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useGLTF,
  Center,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/Modal/mohan-maya2.glb";
// Target world size the model's largest dimension is normalised to. Keeps the
// framing/shadows consistent for any GLB and makes the model large & prominent.
const TARGET_SIZE = 2.6;

// Interaction tuning.
const DRAG_RANGE = Math.PI / 2; // ±90° drag window around the grab point (180° total).
const AUTO_SPEED = 0.3;          // continuous one-direction spin speed (rad/s).
const DRAG_SENS = 0.009;         // radians of rotation per pixel dragged.

/** Lightweight in-canvas loader shown while the GLB streams in. */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-10 h-10 rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462] animate-spin" />
        <span className="text-xs font-medium text-white/70 whitespace-nowrap">
          Loading · {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

/**
 * Loads the GLB, normalises its size and rotates it about the Y axis:
 *  - Spins continuously in a single direction by default (showroom style).
 *  - Pauses while hovered/dragged and follows the user's drag (within a 180°
 *    window around the grab point).
 *  - Resumes spinning in the same direction from the current angle on release.
 * All motion is damped (frame-rate independent) for a premium, smooth feel.
 * Pointer handlers attach straight to the canvas so mouse + touch both work.
 */
function RotatingModel({ modelPath = MODEL_PATH }) {
  const groupRef = useRef(null);
  // Live interaction + animation state (mutable ref → no re-renders).
  const control = useRef({ hovered: false, dragging: false, lastX: 0, yaw: 0, dragStartYaw: 0 });
  const { scene } = useGLTF(modelPath);
  const { gl } = useThree();

  // Clone per instance so the cached source scene is never mutated/stolen.
  const object = useMemo(() => scene.clone(true), [scene]);

  // Normalise scale + find the base Y so contact shadows sit under the model.
  const { scale, bottomY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = TARGET_SIZE / maxDim;
    return { scale: s, bottomY: -(size.y * s) / 2 };
  }, [object]);

  // Hover (pause) + drag (manual rotate) handlers on the actual canvas element.
  useEffect(() => {
    const el = gl.domElement;
    const c = control.current;

    const onEnter = () => { c.hovered = true; };
    const onLeave = () => { c.hovered = false; c.dragging = false; };
    const onDown = (e) => {
      c.dragging = true;
      c.lastX = e.clientX;
      c.dragStartYaw = c.yaw; // anchor the 180° drag window to the grab point
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!c.dragging) return;
      const dx = e.clientX - c.lastX;
      c.lastX = e.clientX;
      c.yaw = THREE.MathUtils.clamp(
        c.yaw + dx * DRAG_SENS,
        c.dragStartYaw - DRAG_RANGE,
        c.dragStartYaw + DRAG_RANGE
      );
    };
    const onUp = (e) => {
      c.dragging = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const c = control.current;

    // Continuous one-direction spin when the user isn't interacting.
    if (!c.hovered && !c.dragging) {
      c.yaw += AUTO_SPEED * delta;
    }

    // Smoothly ease the model toward the target angle (snappier while dragging).
    const lambda = c.dragging ? 14 : 6;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, c.yaw, lambda, delta);
  });

  return (
    <>
      <group ref={groupRef} scale={scale}>
        <Center>
          <primitive object={object} dispose={null} />
        </Center>
      </group>

      {/* Soft grounding shadow - works on a transparent canvas, no floor mesh. */}
      <ContactShadows
        position={[0, bottomY, 0]}
        scale={TARGET_SIZE * 2.6}
        opacity={0.5}
        blur={2.6}
        far={5}
        resolution={512}
        color="#000000"
      />
    </>
  );
}

/**
 * Hero 3D model: auto-rotates within a 180° arc, pauses on hover and lets the
 * user drag-rotate (mouse or touch) within that same 180° range, then smoothly
 * resumes. Transparent background so it sits over the hero artwork. Fills its
 * parent - size it via the parent container. `modelPath` lets other heroes
 * (e.g. About) reuse the exact same presentation with a different GLB.
 */
export default function Hero3DModel({
  className = "",
  modelPath = MODEL_PATH,
  // Camera position. y=0 keeps the origin-centered model vertically centred in
  // the frame; a larger z adds top/bottom margin so nothing clips. Callers can
  // override (e.g. About uses [0, 0, 4.8]) without affecting the Shop hero.
  cameraPosition = [0, 0.5, 4.4],
}) {
  return (
    <Canvas
      className={className}
      // pan-y lets vertical page scroll pass through on mobile; horizontal drag
      // rotates the model. grab cursor hints the model is interactive.
      style={{ touchAction: "pan-y", cursor: "grab" }}
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      {/* Premium lighting rig. Real-time shadow maps are off (they recompute
          every frame as the model spins → stutter); ContactShadows grounds it. */}
      <ambientLight intensity={0.9} />
      <hemisphereLight intensity={0.6} groundColor="#b58a8a" />
      <directionalLight position={[5, 9, 6]} intensity={2.4} />
      <directionalLight position={[-6, 4, -5]} intensity={0.7} />

      <Suspense fallback={<Loader />}>
        <RotatingModel modelPath={modelPath} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

// Preload so the model is ready as soon as the hero mounts.
useGLTF.preload(MODEL_PATH);
