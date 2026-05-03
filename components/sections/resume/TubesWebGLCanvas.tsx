"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type TubesWebGLCanvasHandle = {
  randomizeColors: () => void;
};

type Props = { className?: string };

const TUBE_COUNT = 11;
const RING_RADIUS = 1.55;
const TUBE_HEIGHT = 3.2;
const TUBE_R = 0.075;

function disposeMaterialsOnly(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const m = child.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose();
    }
  });
}

const TubesWebGLCanvas = forwardRef<TubesWebGLCanvasHandle, Props>(function TubesWebGLCanvas(
  { className },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const randomizeRef = useRef<() => void>(() => {});

  const randomizeColors = useCallback(() => {
    const mats = materialsRef.current;
    const rim = rimLightRef.current;
    for (let i = 0; i < mats.length; i += 1) {
      const h = (Math.random() + i * 0.07) % 1;
      const mat = mats[i];
      mat.emissive.setHSL(h, 0.88, 0.52);
      mat.color.setHSL(h, 0.55, 0.12);
    }
    if (rim) {
      rim.color.setHSL(Math.random(), 0.75, 0.58);
    }
  }, []);

  randomizeRef.current = randomizeColors;
  useImperativeHandle(ref, () => ({ randomizeColors }), [randomizeColors]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c09, 0.12);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0.35, 4.35);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;";
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x3a4a38, 0x080a08, 0.35);
    scene.add(hemi);

    const rim = new THREE.PointLight(0xd9ff75, 2.2, 12, 1.8);
    rim.position.set(2.2, 2.4, 2.4);
    scene.add(rim);
    rimLightRef.current = rim;

    const tubesGroup = new THREE.Group();
    scene.add(tubesGroup);

    const geom = new THREE.CylinderGeometry(TUBE_R, TUBE_R * 0.92, TUBE_HEIGHT, 28, 1, true);
    const materials: THREE.MeshStandardMaterial[] = [];
    materialsRef.current = materials;

    for (let i = 0; i < TUBE_COUNT; i += 1) {
      const angle = (i / TUBE_COUNT) * Math.PI * 2;
      const h = (i / TUBE_COUNT + 0.12) % 1;
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(h, 0.5, 0.14),
        emissive: new THREE.Color().setHSL(h, 0.9, 0.48),
        emissiveIntensity: 1.35,
        metalness: 0.35,
        roughness: 0.28,
        side: THREE.DoubleSide,
      });
      materials.push(mat);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(Math.cos(angle) * RING_RADIUS, 0, Math.sin(angle) * RING_RADIUS);
      mesh.rotation.y = -angle + Math.PI / 2;
      tubesGroup.add(mesh);
    }

    const targetRot = { x: 0, y: 0 };
    const curRot = { x: 0, y: 0 };
    let raf = 0;
    const visibleRef = { current: true };
    const clock = new THREE.Clock();

    /** Window-level move so tubes react anywhere over the section (content sits above the canvas). */
    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const { clientX: cx, clientY: cy } = e;
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) {
        targetRot.x = 0;
        targetRot.y = 0;
        return;
      }
      const nx = ((cx - r.left) / r.width - 0.5) * 2;
      const ny = -((cy - r.top) / r.height - 0.5) * 2;
      targetRot.y = nx * 0.52;
      targetRot.x = ny * 0.38;
    };

    const onClick = (e: MouseEvent) => {
      if (e.target !== renderer.domElement) return;
      if (e.button !== 0) return;
      randomizeRef.current();
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    renderer.domElement.addEventListener("click", onClick);

    const tick = () => {
      if (!visibleRef.current) {
        raf = 0;
        return;
      }
      const t = clock.getElapsedTime();
      curRot.x += (targetRot.x - curRot.x) * 0.085;
      curRot.y += (targetRot.y - curRot.y) * 0.085;
      tubesGroup.rotation.x = curRot.x + Math.sin(t * 0.22) * 0.02;
      tubesGroup.rotation.y = curRot.y + t * 0.04;
      tubesGroup.rotation.z = Math.sin(t * 0.17) * 0.015;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const visibilityIo = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (visibleRef.current && raf === 0) {
          raf = requestAnimationFrame(tick);
        }
      },
      { root: null, threshold: 0, rootMargin: "120px 0px" }
    );
    visibilityIo.observe(container);

    tick();

    return () => {
      visibilityIo.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      disposeMaterialsOnly(scene);
      geom.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      materialsRef.current = [];
      rimLightRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      role="presentation"
      aria-label="Interactive 3D neon tubes — move the pointer over this section to tilt; click the canvas to randomize colors"
    />
  );
});

export default TubesWebGLCanvas;
