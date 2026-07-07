"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const [{ positions, speeds }] = useState(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.08 + Math.random() * 0.22;
    }
    return { positions, speeds };
  });

  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const pts = points.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(elapsed.current * 0.3 + i) * delta * 0.04;
      if (arr[i * 3 + 1] > 4.6) arr[i * 3 + 1] = -4.6;
    }
    pts.geometry.attributes.position.needsUpdate = true;

    const tx = mouse.current.x * 0.4;
    const ty = mouse.current.y * 0.3;
    pts.rotation.y += (tx - pts.rotation.y) * 0.04;
    pts.rotation.x += (-ty - pts.rotation.x) * 0.04;
  });

  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;
  });

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(245,225,180,1)");
    g.addColorStop(0.3, "rgba(201,169,106,0.7)");
    g.addColorStop(1, "rgba(201,169,106,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  return (
    <points ref={points} scale={[viewport.width / 8, viewport.height / 8, 1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export default function GoldDust() {
  const [{ count, dprMax }] = useState(() => {
    if (typeof window === "undefined") {
      return { count: 500, dprMax: 1.4 };
    }
    const w = window.innerWidth;
    if (w < 768) return { count: 320, dprMax: 1.25 };
    if (w < 1200) return { count: 550, dprMax: 1.45 };
    return { count: 900, dprMax: 1.6 };
  });

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <Particles count={count} />
    </Canvas>
  );
}
