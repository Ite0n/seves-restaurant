"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const STATIONS = [
  "/images/exterior-facade-sign.png",
  "/images/interior-pendant-room.png",
  "/images/interior-dining-banquette.png",
  "/images/interior-feather-art.png",
  "/images/bar-bonsai-night.png",
  "/images/interior-winecart-dusk.png",
  "/images/exterior-firewater-city.png",
];

const SPACING = 7;
const PANEL_HEIGHT = 5.4;

function ImagePanel({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const texture = useTexture(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  const img = texture.image as HTMLImageElement;
  const aspect = img && img.width ? img.width / img.height : 0.75;
  let width = PANEL_HEIGHT * aspect;
  width = Math.min(width, 8);

  const side = index % 2 === 0 ? -1 : 1;
  const z = -index * SPACING - 2;
  const x = index === 0 ? 0 : side * 3.4;
  const rotY = index === 0 ? 0 : side * 0.6;
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.06;
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh ref={mesh}>
        <planeGeometry args={[width, PANEL_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* gold frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.18, PANEL_HEIGHT + 0.18]} />
        <meshBasicMaterial color="#c9a96a" toneMapped={false} />
      </mesh>
      {/* glow backdrop */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[width + 1.4, PANEL_HEIGHT + 1.4]} />
        <meshBasicMaterial color="#1a140a" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Rig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const totalDepth = (STATIONS.length - 1) * SPACING;

  useFrame(({ pointer: p }) => {
    pointer.current.x += (p.x - pointer.current.x) * 0.05;
    pointer.current.y += (p.y - pointer.current.y) * 0.05;

    const t = progress.get();
    const targetZ = 4 - t * (totalDepth + 4);
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.x += (pointer.current.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (pointer.current.y * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, camera.position.z - 6);
  });

  return null;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, -20]}>
      <planeGeometry args={[60, 80]} />
      <meshStandardMaterial
        color="#0a0807"
        roughness={0.35}
        metalness={0.7}
      />
    </mesh>
  );
}

export default function WalkthroughScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 8, 30]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 2]} intensity={20} color="#c9a96a" distance={30} />
      <Floor />
      <Suspense fallback={null}>
        {STATIONS.map((src, i) => (
          <ImagePanel key={src} src={src} index={i} />
        ))}
      </Suspense>
      <Rig progress={progress} />
    </Canvas>
  );
}
