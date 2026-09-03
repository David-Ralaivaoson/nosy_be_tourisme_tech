import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Decoder Draco hébergé par Google (CDN rapide)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);
dracoLoader.setDecoderConfig({ type: "js" }); // "js" pour compatibilité mobile, "wasm" pour desktop

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export { gltfLoader };
