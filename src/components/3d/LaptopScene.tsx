import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { GLTF } from "three-stdlib";
import {
  Breakpoint,
  getBreakpoint,
  useBreakpoint,
} from "@/src/hooks/useBreakpoint";

useGLTF.preload("/models/macbook-m5-pro.draco.glb");

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.MeshStandardMaterial };
};

const MESH_LIST = [
  "Object_10",
  "Object_12",
  "Object_14",
  "Object_16",
  "Object_18",
  "Object_20",
  "Object_22",
  "Object_24",
  "Object_26",
  "Object_28",
  "Object_30",
  "Object_32",
  "Object_34",
  "Object_36",
  "Object_38",
  "Object_40",
  "Object_42",
  "Object_44",
  "Object_46",
  "Object_48",
  "Object_50",
  "Object_52",
  "Object_54",
  "Object_56",
  "Object_58",
  "Object_60",
  "Object_62",
  "Object_64",
  "Object_66",
  "Object_68",
  "Object_70",
  "Object_72",
  "Object_74",
  "Object_76",
  "Object_78",
  "Object_80",
  "Object_82",
  "Object_84",
  "Object_86",
  "Object_88",
  "Object_90",
  "Object_92",
  "Object_94",
  "Object_96",
  "Object_99",
  "Object_101",
  "Object_103",
  "Object_105",
  "Object_107",
  "Object_109",
  "Object_111",
  "Object_113",
  "Object_115",
  "Object_117",
  "Object_119",
  "Object_121",
  "Object_123",
  "Object_125",
  "Object_127",
  "Object_129",
  "Object_131",
];

const BASE_MESHES = MESH_LIST.slice(0, 44);
const LID_MESHES = MESH_LIST.slice(44);
const SCREEN_MESH = "Object_123";

const LID_OPEN_ANGLE = 0.0;
const LID_CLOSE_ANGLE = Math.PI / 1.62;
const DRAG_SENSITIVITY = 0.003;
const DRAG_MAX = THREE.MathUtils.degToRad(20);

const SCENE_THRESHOLDS = {
  scene2: 0.22,
  scene3: 0.36,
  scene4: 0.53,
  close: 0.75,
};

const TEX_FADE_DURATION = 0.45;

// ─── Config 3D par breakpoint ─────────────────────────────────────────────────
const RESPONSIVE_3D = {
  desktop: {
    initFromY: -3.5,
    initRestY: -2.06,
    initFromRotY: THREE.MathUtils.degToRad(8),
    openRestY: -1.35,
    scaleOpen: 0.155,
    scaleClose: 0.14,
    scene2: { x: -1.2, y: -1.75, z: 0.5 },
    scene2rot: {
      y: THREE.MathUtils.degToRad(42),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene3: { x: 1.2, y: -1.75, z: 0.5 },
    scene3rot: {
      y: THREE.MathUtils.degToRad(-42),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene4: { x: 0, y: -1.0, z: -0.4 },
    scene5: { y: -1.2, z: -1 },
  },
  tablet: {
    initFromY: -3.2,
    initRestY: -1.8,
    initFromRotY: THREE.MathUtils.degToRad(6),
    openRestY: -1.15,
    scaleOpen: 0.11,
    scaleClose: 0.1,
    scene2: { x: -0.7, y: -1.5, z: 0 },
    scene2rot: {
      y: THREE.MathUtils.degToRad(30),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene3: { x: 0.7, y: -1.5, z: 0.3 },
    scene3rot: {
      y: THREE.MathUtils.degToRad(-30),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene4: { x: 0, y: -0.8, z: 0 },
    scene5: { y: -1.0, z: 0 },
  },
  mobile: {
    initFromY: -1.0,
    initRestY: -1.15,
    initFromRotY: THREE.MathUtils.degToRad(4),
    openRestY: -1.62,
    scaleOpen: 0.09,
    scaleClose: 0.08,
    scene2: { x: 0, y: -1.5, z: 0 },
    scene2rot: {
      y: THREE.MathUtils.degToRad(25),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene3: { x: 0, y: -1.5, z: 0 },
    scene3rot: {
      y: THREE.MathUtils.degToRad(-25),
      x: THREE.MathUtils.degToRad(-2),
    },
    scene4: { x: 0, y: -1.2, z: 0 },
    scene5: { y: -1.0, z: 0 },
  },
} as const;

export function LaptopScene() {
  const macbookRef = useRef<THREE.Group>(null);
  const dragWrapperRef = useRef<THREE.Group>(null);
  const lidPivotRef = useRef<THREE.Group>(null);
  const lidMeshesRef = useRef<THREE.Group>(null);
  const screenMeshRef = useRef<THREE.Mesh>(null);

  const isClosedRef = useRef(false);
  const currentTexRef = useRef(-1);
  const texTransitionRef = useRef<gsap.core.Tween | null>(null);
  const screenProxy = useRef({ intensity: 0 });

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ mouseX: 0, mouseY: 0, rotX: 0, rotY: 0 });
  const returnTween = useRef<gsap.core.Tween | null>(null);

  const bp = useBreakpoint();
  const cfg = RESPONSIVE_3D[bp];

  const { nodes } = useGLTF(
    "/models/macbook-m5-pro.draco.glb",
  ) as unknown as GLTFResult;

  // Images touristiques de Nosy Be pour l'écran
  const [tex1, tex2, tex3, tex4] = useTexture([
    "/textures/nosybe-hero.png",
    "/textures/nosybe-plages.jpg",
    "/textures/nosybe-activites.jpg",
    "/textures/nosybe-coucher.jpg",
  ]);

  const texturesRef = useRef<THREE.Texture[]>([]);

  // ─── Setup matériau & hinge ────────────────────────────────────────────────
  useEffect(() => {
    [tex1, tex2, tex3, tex4].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = true;
      tex.needsUpdate = true;
    });
    texturesRef.current = [tex1, tex2, tex3, tex4];

    if (screenMeshRef.current) {
      const mat = new THREE.MeshPhysicalMaterial({
        map: tex1,
        emissiveMap: tex1,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0,
        roughness: 0.22, // avant 0.05 → trop "miroir"
        metalness: 0,
        specularIntensity: 0.12, // ← tue le halo blanc (réflexion quasi nulle)
        specularColor: new THREE.Color("#cfc6ff"), // reflet résiduel violet doux
        clearcoat: 0,
        envMapIntensity: 0,
      });
      screenMeshRef.current.material = mat;
      mat.needsUpdate = true;
      currentTexRef.current = 0;
    }

    const hingeY = -12;
    if (lidPivotRef.current && lidMeshesRef.current) {
      lidPivotRef.current.position.set(0, hingeY, 0);
      lidMeshesRef.current.position.set(0, -hingeY, 0);
    }

    MESH_LIST.forEach((name) => {
      if (nodes[name]) {
        nodes[name].castShadow = true;
        nodes[name].receiveShadow = true;

        // Keep the original GLB materials/textures intact.
        // The light redesign changes the environment, not the MacBook's baked material.
      }
    });
  }, [nodes, tex1, tex2, tex3, tex4]);

  // ─── Drag events ──────────────────────────────────────────────────────────
  useEffect(() => {
    const touchDir = { dominant: null as "horizontal" | "vertical" | null };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, select, textarea, [data-no-drag]"))
        return;
      if (returnTween.current) {
        returnTween.current.kill();
        returnTween.current = null;
      }
      isDragging.current = true;
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        rotX: dragOffset.current.x,
        rotY: dragOffset.current.y,
      };
      document.body.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;

      dragOffset.current.y = THREE.MathUtils.clamp(
        dragStart.current.rotY + dx * DRAG_SENSITIVITY,
        -DRAG_MAX,
        DRAG_MAX,
      );
      dragOffset.current.x = THREE.MathUtils.clamp(
        dragStart.current.rotX + dy * DRAG_SENSITIVITY,
        -DRAG_MAX,
        DRAG_MAX,
      );
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      returnTween.current = gsap.to(dragOffset.current, {
        x: 0,
        y: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.45)",
      });
    };

    const onMouseLeave = () => {
      if (isDragging.current) onMouseUp();
    };

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, [data-no-drag]")) return;
      if (returnTween.current) {
        returnTween.current.kill();
        returnTween.current = null;
      }
      touchDir.dominant = null;
      const t = e.touches[0];
      isDragging.current = true;
      dragStart.current = {
        mouseX: t.clientX,
        mouseY: t.clientY,
        rotX: dragOffset.current.x,
        rotY: dragOffset.current.y,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.mouseX;
      const dy = t.clientY - dragStart.current.mouseY;

      if (
        touchDir.dominant === null &&
        (Math.abs(dx) > 4 || Math.abs(dy) > 4)
      ) {
        touchDir.dominant =
          Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      const currentBp = getBreakpoint(window.innerWidth);
      if (currentBp === "mobile" || currentBp === "tablet") {
        if (touchDir.dominant === "vertical") return;
        dragOffset.current.y = THREE.MathUtils.clamp(
          dragStart.current.rotY + dx * DRAG_SENSITIVITY * 0.8,
          -DRAG_MAX,
          DRAG_MAX,
        );
        dragOffset.current.x = 0;
      } else {
        if (touchDir.dominant === "vertical") return;
        dragOffset.current.y = THREE.MathUtils.clamp(
          dragStart.current.rotY + dx * DRAG_SENSITIVITY,
          -DRAG_MAX,
          DRAG_MAX,
        );
        dragOffset.current.x = THREE.MathUtils.clamp(
          dragStart.current.rotX + dy * DRAG_SENSITIVITY,
          -DRAG_MAX,
          DRAG_MAX,
        );
      }
    };

    const onTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      touchDir.dominant = null;
      returnTween.current = gsap.to(dragOffset.current, {
        x: 0,
        y: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.45)",
      });
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  useFrame(() => {
    if (!dragWrapperRef.current) return;
    const f = 0.1;
    dragCurrent.current.x += (dragOffset.current.x - dragCurrent.current.x) * f;
    dragCurrent.current.y += (dragOffset.current.y - dragCurrent.current.y) * f;
    dragWrapperRef.current.rotation.x = dragCurrent.current.x;
    dragWrapperRef.current.rotation.y = dragCurrent.current.y;
  });

  // ─── setTexture cross-fade ─────────────────────────────────────────────────
  const setTexture = (index: number) => {
    if (currentTexRef.current === index) return;
    if (!screenMeshRef.current) return;

    const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
    const nextTex = texturesRef.current[index];
    if (!nextTex) return;

    if (texTransitionRef.current) {
      texTransitionRef.current.kill();
      texTransitionRef.current = null;
    }

    currentTexRef.current = index;

    texTransitionRef.current = gsap.to(mat, {
      emissiveIntensity: 0,
      duration: TEX_FADE_DURATION / 2,
      ease: "power2.in",
      onUpdate: () => {
        mat.needsUpdate = true;
      },
      onComplete: () => {
        mat.map = nextTex;
        mat.emissiveMap = nextTex;
        mat.needsUpdate = true;
        texTransitionRef.current = gsap.to(mat, {
          emissiveIntensity: 0.6,
          duration: TEX_FADE_DURATION / 2,
          ease: "power2.out",
          onUpdate: () => {
            mat.needsUpdate = true;
          },
          onComplete: () => {
            texTransitionRef.current = null;
          },
        });
      },
    });
  };

  // ─── GSAP timelines (dépend du breakpoint) ────────────────────────────────
  useGSAP(() => {
    if (!macbookRef.current || !lidPivotRef.current) return;

    gsap.killTweensOf(macbookRef.current.position);
    gsap.killTweensOf(macbookRef.current.rotation);
    gsap.killTweensOf(macbookRef.current.scale);
    gsap.killTweensOf(lidPivotRef.current.rotation);
    gsap.killTweensOf(screenProxy.current);

    const canvasEl = document.getElementById("canvas-container");

    // ── Intro ────────────────────────────────────────────────────────────────
    const tlIntro = gsap.timeline({ delay: 0.2 });

    if (canvasEl) {
      tlIntro.to(
        canvasEl,
        { opacity: 1, duration: 0.9, ease: "power2.inOut" },
        0,
      );
    }

    tlIntro.fromTo(
      macbookRef.current.position,
      { y: cfg.initFromY },
      { y: cfg.initRestY, duration: 1.0, ease: "power3.out" },
      0,
    );

    tlIntro.fromTo(
      macbookRef.current.rotation,
      { y: cfg.initFromRotY },
      { y: 0, duration: 1.0, ease: "power3.out" },
      0,
    );

    // ── Scroll 3D ────────────────────────────────────────────────────────────
    const tl3d = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          if (screenMeshRef.current) {
            const mat = screenMeshRef.current
              .material as THREE.MeshStandardMaterial;
            if (!texTransitionRef.current) {
              mat.emissiveIntensity = screenProxy.current.intensity;
              mat.needsUpdate = true;
            }
          }

          if (p < SCENE_THRESHOLDS.scene2) setTexture(0);
          else if (p < SCENE_THRESHOLDS.scene3) setTexture(1);
          else if (p < SCENE_THRESHOLDS.scene4) setTexture(2);
          else if (p < SCENE_THRESHOLDS.close) setTexture(3);

          if (p > SCENE_THRESHOLDS.close && !isClosedRef.current) {
            isClosedRef.current = true;
            closeLid();
          } else if (p < SCENE_THRESHOLDS.close - 0.03 && isClosedRef.current) {
            isClosedRef.current = false;
            openLid();
          }
        },
      },
    });

    // Phase 0 : ouverture couvercle
    tl3d.to(
      macbookRef.current.position,
      { y: cfg.openRestY, duration: 1, ease: "power2.out" },
      0,
    );
    tl3d.to(
      lidPivotRef.current.rotation,
      { x: LID_OPEN_ANGLE, duration: 1, ease: "power2.inOut" },
      0,
    );
    tl3d.to(
      screenProxy.current,
      { intensity: 0.6, duration: 0.7, ease: "power2.out" },
      0.3,
    );

    // Phase 1 : scène 2
    tl3d.to(
      macbookRef.current.scale,
      {
        x: cfg.scaleOpen,
        y: cfg.scaleOpen,
        z: cfg.scaleOpen,
        duration: 1.2,
        ease: "power3.out",
      },
      1,
    );
    tl3d.to(
      macbookRef.current.position,
      { ...cfg.scene2, duration: 1, ease: "power2.inOut" },
      1,
    );
    tl3d.to(
      macbookRef.current.rotation,
      { ...cfg.scene2rot, duration: 1, ease: "power2.inOut" },
      1,
    );

    // Phase 2 : scène 3
    tl3d.to(
      macbookRef.current.position,
      { ...cfg.scene3, duration: 1, ease: "power2.inOut" },
      2,
    );
    tl3d.to(
      macbookRef.current.rotation,
      { ...cfg.scene3rot, duration: 1, ease: "power2.inOut" },
      2,
    );

    // Phase 3 : scène 4
    tl3d.to(
      macbookRef.current.position,
      { ...cfg.scene4, duration: 1.2, ease: "power3.inOut" },
      3,
    );
    tl3d.to(
      macbookRef.current.rotation,
      { x: 0, y: 0, duration: 1.2, ease: "power3.inOut" },
      3,
    );

    // Phase 4 : fermeture
    tl3d.to(
      macbookRef.current.position,
      { ...cfg.scene5, duration: 1, ease: "power3.in" },
      4,
    );
    tl3d.to(
      macbookRef.current.scale,
      {
        x: cfg.scaleClose,
        y: cfg.scaleClose,
        z: cfg.scaleClose,
        duration: 1,
        ease: "power3.in",
      },
      6,
    );

    // ── Scroll textes ────────────────────────────────────────────────────────
    const isMob = bp === "mobile";
    const isTab = bp === "tablet";
    const isTouch = isMob || isTab;

    const tlText = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tlText.to(
      ".scene-1-text",
      {
        scale: 0.7,
        opacity: 0,
        filter: "blur(2px)",
        y: -10,
        duration: 0.2,
        ease: "power2.in",
      },
      0,
    );

    tlText.fromTo(
      ".scene-2-text",
      { opacity: 0, x: isTouch ? 0 : 60, y: isTouch ? 20 : 0 },
      { opacity: 1, x: 0, y: 0, duration: 0.5, ease: "power3.out" },
      0.7,
    );
    tlText.to(
      ".scene-2-text",
      {
        opacity: 0,
        x: isTouch ? 0 : 60,
        y: isTouch ? -20 : 0,
        duration: 0.4,
        ease: "power2.in",
      },
      1.0,
    );

    tlText.fromTo(
      ".scene-3-text",
      { opacity: 0, x: isTouch ? 0 : -60, y: isTouch ? 20 : 0 },
      { opacity: 1, x: 0, y: 0, duration: 0.5, ease: "power3.out" },
      1.3,
    );
    tlText.to(
      ".scene-3-text",
      {
        opacity: 0,
        x: isTouch ? 0 : -60,
        y: isTouch ? -20 : 0,
        duration: 0.4,
        ease: "power2.in",
      },
      1.6,
    );

    tlText.fromTo(
      ".scene-4-text",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      2.0,
    );
    tlText.to(
      ".scene-4-text",
      { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
      2.4,
    );

    tlText.to(
      ".scene-5-overlay",
      { opacity: 1, duration: 0.8, ease: "power2.in" },
      2.7,
    );

    tlText.fromTo(
      ".scene-5-discover",
      { opacity: 0, y: -40, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      },
      3.0,
    );
  }, [bp]);

  // ─── closeLid / openLid ────────────────────────────────────────────────────
  const closeLid = () => {
    if (!lidPivotRef.current || !screenMeshRef.current) return;

    gsap.to(lidPivotRef.current.rotation, {
      x: LID_CLOSE_ANGLE,
      duration: 1.4,
      ease: "power3.inOut",
    });

    const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
    gsap.to(mat, {
      emissiveIntensity: 0,
      duration: 0.8,
      ease: "power2.in",
      delay: 0.2,
      onUpdate: () => {
        mat.needsUpdate = true;
      },
    });
  };

  const openLid = () => {
    if (!lidPivotRef.current || !screenMeshRef.current) return;

    gsap.to(lidPivotRef.current.rotation, {
      x: LID_OPEN_ANGLE,
      duration: 1.2,
      ease: "power3.inOut",
    });

    const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
    gsap.to(mat, {
      emissiveIntensity: 0.6,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        mat.needsUpdate = true;
      },
    });
  };

  return (
    <group ref={dragWrapperRef}>
      <group
        ref={macbookRef}
        position={[0, cfg.initFromY, 0]}
        scale={cfg.scaleClose}
        dispose={null}
      >
        <group rotation={[Math.PI / 2, 0, 0]}>
          {BASE_MESHES.map((name) =>
            nodes[name] ? (
              <mesh
                key={name}
                geometry={nodes[name].geometry}
                material={nodes[name].material}
                castShadow
                receiveShadow
              />
            ) : null,
          )}

          <group ref={lidPivotRef} rotation={[LID_CLOSE_ANGLE, 0, 0]}>
            <group ref={lidMeshesRef}>
              {LID_MESHES.map((name) =>
                nodes[name] ? (
                  name === SCREEN_MESH ? (
                    <mesh
                      key={name}
                      ref={screenMeshRef}
                      geometry={nodes[name].geometry}
                      material={nodes[name].material}
                      castShadow
                      receiveShadow
                    />
                  ) : (
                    <mesh
                      key={name}
                      geometry={nodes[name].geometry}
                      material={nodes[name].material}
                      castShadow
                      receiveShadow
                    />
                  )
                ) : null,
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
