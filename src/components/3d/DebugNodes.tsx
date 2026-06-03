// DebugNodes.tsx - Version avancée
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { Mesh, MeshStandardMaterial, Color } from "three";

export function DebugNodes() {
  const { scene } = useGLTF("/models/macbook-m5-pro.glb");

  useEffect(() => {
    const meshes: { index: number; name: string; mesh: Mesh }[] = [];
    let index = 0;

    scene.traverse((child) => {
      if (child instanceof Mesh) {
        meshes.push({ index, name: child.name, mesh: child });
        index++;
      }
    });

    console.log(`📦 Total meshes: ${meshes.length}`);

    // Expose une fonction pour colorier un mesh par index
    (window as any).highlightMesh = (i: number) => {
      // Reset tous
      meshes.forEach(({ mesh }) => {
        if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material = mesh.material.clone();
        }
      });

      // Colorie le mesh ciblé en rouge vif
      const target = meshes[i];
      if (!target)
        return console.log("❌ Index invalide, max:", meshes.length - 1);

      const mat = new MeshStandardMaterial({
        color: new Color("red"),
        emissive: new Color("red"),
        emissiveIntensity: 1,
      });
      target.mesh.material = mat;
      console.log(`🔴 Mesh [${i}] highlighted: "${target.name}"`);
    };

    // Expose la liste complète
    (window as any).listMeshes = () => {
      meshes.forEach(({ index, name }) => {
        console.log(`[${index}] "${name}"`);
      });
    };

    console.log("💡 Commandes disponibles:");
    console.log("   listMeshes()        → voir tous les meshes");
    console.log("   highlightMesh(0)    → colorier le mesh 0 en rouge");
  }, [scene]);

  return null;
}
