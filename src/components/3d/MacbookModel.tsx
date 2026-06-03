// MacbookModel.tsx - DEBUG CORRIGÉ
import * as THREE from "three";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { JSX, useEffect, useRef } from "react";
import { GLTF } from "three-stdlib";

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

export function MacbookDebug(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/macbook-m5-pro.glb",
  ) as unknown as GLTFResult;

  // ← Refs vers les vrais objets Three.js dans la scène
  const meshRefs = useRef<{ [key: string]: THREE.Mesh | null }>({});
  const originalMats = useRef<{ [key: string]: THREE.Material }>({});

  useEffect(() => {
    // Sauvegarde les matériaux depuis les REFS (pas les nodes)
    MESH_LIST.forEach((name) => {
      const mesh = meshRefs.current[name];
      if (mesh) {
        originalMats.current[name] = mesh.material as THREE.Material;
      }
    });

    console.log(
      "✅ Refs chargées:",
      Object.keys(meshRefs.current).filter((k) => meshRefs.current[k]).length,
      "meshes",
    );

    // ── highlightMesh(index) ──────────────────────────────────────
    (window as any).highlightMesh = (index: number) => {
      const name = MESH_LIST[index];
      if (!name) {
        console.log(`❌ Index ${index} invalide. Max: ${MESH_LIST.length - 1}`);
        return;
      }

      // Reset tous les meshes
      MESH_LIST.forEach((n) => {
        const mesh = meshRefs.current[n];
        if (mesh && originalMats.current[n]) {
          mesh.material = originalMats.current[n];
        }
      });

      // Applique rouge sur le mesh cible
      const targetMesh = meshRefs.current[name];
      if (!targetMesh) {
        console.log(`❌ Mesh "${name}" non trouvé dans les refs`);
        return;
      }

      targetMesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("red"),
        emissive: new THREE.Color("red"),
        emissiveIntensity: 5,
        depthTest: true,
        depthWrite: true,
      });

      console.log(`🔴 [${index}] "${name}" → rouge`);
    };

    // ── hr(from, to, color) ───────────────────────────────────────
    (window as any).hr = (from: number, to: number, color = "lime") => {
      // Reset
      MESH_LIST.forEach((n) => {
        const mesh = meshRefs.current[n];
        if (mesh && originalMats.current[n]) {
          mesh.material = originalMats.current[n];
        }
      });

      for (let i = from; i <= to; i++) {
        const name = MESH_LIST[i];
        const mesh = meshRefs.current[name];
        if (mesh) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(color),
            emissiveIntensity: 3,
          });
        }
      }
      console.log(`🎨 [${from}..${to}] en ${color}`);
    };

    // ── r() reset ────────────────────────────────────────────────
    (window as any).r = () => {
      MESH_LIST.forEach((n) => {
        const mesh = meshRefs.current[n];
        if (mesh && originalMats.current[n]) {
          mesh.material = originalMats.current[n];
        }
      });
      console.log("✅ Reset");
    };

    // ── hideAll / showOnly / showAll ──────────────────────────────
    (window as any).hideAll = () => {
      MESH_LIST.forEach((n) => {
        const mesh = meshRefs.current[n];
        if (mesh) mesh.visible = false;
      });
      console.log("👁️ Tout caché");
    };
    (window as any).showOnly = (from: number, to: number) => {
      MESH_LIST.forEach((n, i) => {
        const mesh = meshRefs.current[n];
        if (mesh) mesh.visible = i >= from && i <= to;
      });
      console.log(`👁️ Seulement [${from}..${to}] visibles`);
    };
    (window as any).showAll = () => {
      MESH_LIST.forEach((n) => {
        const mesh = meshRefs.current[n];
        if (mesh) mesh.visible = true;
      });
      console.log("👁️ Tout visible");
    };

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔧 COMMANDES:");
    console.log("   highlightMesh(0)    → rouge sur 1 mesh");
    console.log("   hr(0, 30)           → couleur sur plage");
    console.log("   r()                 → reset");
    console.log("   hideAll()           → cache tout");
    console.log("   showOnly(0, 30)     → isole une partie");
    console.log("   showAll()           → tout visible");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }, []); // ← [] pas de dépendances, les refs sont stables

  return (
    <>
      {/* ← Ajoute OrbitControls ici */}
      <OrbitControls
        enableZoom={true} // Molette pour zoom
        enablePan={true} // Click droit pour déplacer
        enableRotate={true} // Click gauche pour tourner
        minDistance={5} // Distance min caméra
        maxDistance={20} // Distance max caméra
        target={[0, 0, 0]} // Point ciblé par la caméra
      />
      <group {...props} dispose={null}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          {MESH_LIST.map((name) =>
            nodes[name] ? (
              <mesh
                key={name}
                // ← ref callback pour stocker chaque mesh
                ref={(el) => {
                  meshRefs.current[name] = el;
                }}
                geometry={nodes[name].geometry}
                material={nodes[name].material}
                castShadow
                receiveShadow
              />
            ) : null,
          )}
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/models/macbook-m5-pro.glb");
