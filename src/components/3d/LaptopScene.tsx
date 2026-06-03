// src/components/3d/LaptopScene.tsx
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { GLTF } from "three-stdlib";

useGLTF.preload("/models/macbook-m5-pro.glb");

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
  scene2: 0.23,
  scene3: 0.41,
  scene4: 0.6,
  close: 0.75,
};

// ─── Portal textes : composant React NORMAL (pas dans le Canvas) ──────────────
// Rendu via createPortal dans <body>, complètement hors du tree R3F.
// On l'exporte pour le monter depuis page.tsx, EN DEHORS du <Canvas>.
export function SceneTexts() {
  const [mounted, setMounted] = useState(false);

  // S'assure qu'on est côté client (Next.js SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      id="scene-texts-portal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 15,
        pointerEvents: "none",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* SCENE 1 — hero centré */}
      <div
        className="scene-1-text"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "#60a5fa",
            marginBottom: "1rem",
          }}
        >
          Studio Digital d'Exception
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 300,
            textAlign: "center",
            lineHeight: 0.95,
            marginBottom: "1.5rem",
          }}
        >
          Solutions{" "}
          <em style={{ color: "#a78bfa", fontFamily: "Georgia, serif" }}>
            digitales
          </em>
          <br />
          <strong
            style={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            sur mesure.
          </strong>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "1.1rem",
            fontWeight: 300,
          }}
        >
          Scroll pour explorer →
        </p>
        <div
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              height: "4rem",
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
            }}
          />
          <p
            style={{
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Scroll
          </p>
        </div>
      </div>

      {/* SCENE 2 — droite */}
      <div
        className="scene-2-text"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 clamp(2rem, 8vw, 5rem)",
          opacity: 0,
        }}
      >
        <div style={{ maxWidth: "420px", textAlign: "right" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#a78bfa",
              marginBottom: "0.75rem",
            }}
          >
            01 — Solutions Web
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: "1.25rem",
            }}
          >
            Sites web{" "}
            <strong style={{ display: "block", fontWeight: 900 }}>
              haute performance.
            </strong>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            Des interfaces immersives pensées pour convertir, avec des
            animations fluides et une UX irréprochable.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "flex-end",
            }}
          >
            {["Next.js", "React", "Three.js", "GSAP"].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "0.2rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(167,139,250,0.3)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#a78bfa",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SCENE 3 — gauche */}
      <div
        className="scene-3-text"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 clamp(2rem, 8vw, 5rem)",
          opacity: 0,
        }}
      >
        <div style={{ maxWidth: "420px", textAlign: "left" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#60a5fa",
              marginBottom: "0.75rem",
            }}
          >
            02 — Applications Mobile
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ display: "block", fontWeight: 900 }}>
              Scalable.
            </strong>
            <em style={{ color: "#60a5fa", fontFamily: "Georgia, serif" }}>
              Élégant.
            </em>
            <span style={{ display: "block" }}>Puissant.</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            Des dashboards et applications mobiles sur mesure, conçus pour les
            entreprises en croissance.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {["React Native", "TypeScript", "Supabase", "Stripe"].map(
              (tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "0.2rem 1rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(96,165,250,0.3)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#60a5fa",
                    width: "fit-content",
                  }}
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* SCENE 4 — bas */}
      <div
        className="scene-4-text"
        style={{
          position: "absolute",
          bottom: "4rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: 0,
          padding: "0 2rem",
        }}
      >
        <div style={{ maxWidth: "640px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "#34d399",
              marginBottom: "0.75rem",
            }}
          >
            03 — Résultats
          </p>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            <strong style={{ fontWeight: 900 }}>+200 projets</strong> livrés.{" "}
            <em style={{ color: "#34d399", fontFamily: "Georgia, serif" }}>
              99.9% uptime.
            </em>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontWeight: 300,
              fontSize: "1rem",
            }}
          >
            Des solutions robustes qui perdurent dans le temps.
          </p>
        </div>
      </div>

      {/* SCENE 5 — overlay fermeture */}
      <div
        className="scene-5-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "#050505",
          opacity: 0,
          zIndex: 10,
        }}
      />
    </div>,
    document.body,
  );
}

// ─── Composant 3D principal (rendu DANS le Canvas) ────────────────────────────
export function LaptopScene() {
  const macbookRef = useRef<THREE.Group>(null);
  const dragWrapperRef = useRef<THREE.Group>(null);
  const lidPivotRef = useRef<THREE.Group>(null);
  const lidMeshesRef = useRef<THREE.Group>(null);
  const screenMeshRef = useRef<THREE.Mesh>(null);

  const isClosedRef = useRef(false);
  const currentTexRef = useRef(-1);

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ mouseX: 0, mouseY: 0, rotX: 0, rotY: 0 });
  const returnTween = useRef<gsap.core.Tween | null>(null);

  const { nodes } = useGLTF(
    "/models/macbook-m5-pro.glb",
  ) as unknown as GLTFResult;

  const [tex1, tex2, tex3, tex4] = useTexture([
    "/textures/screen-1.jpg",
    "/textures/screen-2.png",
    "/textures/screen-3.jpg",
    "/textures/screen-4.jpg",
  ]);
  const texturesRef = useRef<THREE.Texture[]>([]);

  useEffect(() => {
    [tex1, tex2, tex3, tex4].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = true;
      tex.needsUpdate = true;
    });
    texturesRef.current = [tex1, tex2, tex3, tex4];

    if (screenMeshRef.current) {
      const mat = new THREE.MeshStandardMaterial({
        map: tex1,
        emissiveMap: tex1,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.6,
        roughness: 0.05,
        metalness: 0.0,
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
      }
    });
  }, [nodes, tex1, tex2, tex3, tex4]);

  useEffect(() => {
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
      dragOffset.current.y = THREE.MathUtils.clamp(
        dragStart.current.rotY +
          (t.clientX - dragStart.current.mouseX) * DRAG_SENSITIVITY,
        -DRAG_MAX,
        DRAG_MAX,
      );
      dragOffset.current.x = THREE.MathUtils.clamp(
        dragStart.current.rotX +
          (t.clientY - dragStart.current.mouseY) * DRAG_SENSITIVITY,
        -DRAG_MAX,
        DRAG_MAX,
      );
    };

    const onTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
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

  const setTexture = (index: number) => {
    if (currentTexRef.current === index) return;
    currentTexRef.current = index;
    const tex = texturesRef.current[index];
    if (!tex || !screenMeshRef.current) return;
    const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.map = tex;
    mat.emissiveMap = tex;
    mat.emissiveIntensity = 0.6;
    mat.needsUpdate = true;
  };

  useGSAP(() => {
    if (!macbookRef.current) return;

    // Timeline 3D
    const tl3d = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
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

    const canvasEl = document.getElementById("canvas-container");
    if (canvasEl)
      tl3d.to(canvasEl, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0);

    tl3d.to(
      macbookRef.current.scale,
      { x: 0.15, y: 0.15, z: 0.15, duration: 1.2, ease: "power3.out" },
      0,
    );
    tl3d.to(
      macbookRef.current.position,
      { y: -1.5, duration: 1.2, ease: "power3.out" },
      0,
    );
    tl3d.to(
      macbookRef.current.rotation,
      { x: THREE.MathUtils.degToRad(-4), duration: 1.2, ease: "power3.out" },
      0,
    );
    tl3d.to(
      macbookRef.current.position,
      { x: -1.2, y: -1.75, z: 0.5, duration: 1, ease: "power2.inOut" },
      1,
    );
    tl3d.to(
      macbookRef.current.rotation,
      {
        y: THREE.MathUtils.degToRad(42),
        x: THREE.MathUtils.degToRad(-2),
        duration: 1,
        ease: "power2.inOut",
      },
      1,
    );
    tl3d.to(
      macbookRef.current.position,
      { x: 1.2, y: -1.75, z: 0.5, duration: 1, ease: "power2.inOut" },
      2,
    );
    tl3d.to(
      macbookRef.current.rotation,
      {
        y: THREE.MathUtils.degToRad(-42),
        x: THREE.MathUtils.degToRad(-2),
        duration: 1,
        ease: "power2.inOut",
      },
      2,
    );
    tl3d.to(
      macbookRef.current.position,
      { x: 0, y: -1.0, z: -0.4, duration: 1.2, ease: "power3.inOut" },
      3,
    );
    tl3d.to(
      macbookRef.current.rotation,
      { x: 0, y: 0, duration: 1.2, ease: "power3.inOut" },
      3,
    );
    tl3d.to(
      macbookRef.current.position,
      { y: -1.2, z: -1, duration: 1, ease: "power3.in" },
      4,
    );
    tl3d.to(
      macbookRef.current.scale,
      { x: 0.13, y: 0.13, z: 0.13, duration: 1, ease: "power3.in" },
      5,
    );

    // Timeline textes (synchronisée sur le même scroll-wrapper)
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
      { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" },
      0.7,
    );
    tlText.fromTo(
      ".scene-2-text",
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
      1,
    );
    tlText.to(
      ".scene-2-text",
      { opacity: 0, x: 60, duration: 0.4, ease: "power2.in" },
      1.7,
    );
    tlText.fromTo(
      ".scene-3-text",
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
      2,
    );
    tlText.to(
      ".scene-3-text",
      { opacity: 0, x: -60, duration: 0.4, ease: "power2.in" },
      2.7,
    );
    tlText.fromTo(
      ".scene-4-text",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      3,
    );
    tlText.to(
      ".scene-4-text",
      { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
      3.8,
    );
    tlText.to(
      ".scene-5-overlay",
      { opacity: 1, duration: 0.8, ease: "power2.in" },
      4.2,
    );
  }, []);

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

  // Rendu purement Three.js — aucun élément HTML ici
  return (
    <group ref={dragWrapperRef}>
      <group
        ref={macbookRef}
        position={[0, -1.0, 0]}
        scale={0.08}
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
          <group ref={lidPivotRef} rotation={[LID_OPEN_ANGLE, 0, 0]}>
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
