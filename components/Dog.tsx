import * as THREE from "three";
import { OrbitControls, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const Dog = () => {

  // models loads in our component
  const model = useGLTF("/models/dog.drc.glb");

  useThree(({ camera, scene, gl }) => {
    console.log(camera.position);
    camera.position.z = 0.45;
    // to improve the image quality
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  // to play the modal animation
  const {actions} = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play()
  },[actions])

  const [normalMap, sampleMapCap, branchMap, branchNormalMap] = useTexture([
    "/dog_normals.jpg",
    "/mat-2.png",
    "/branches_diffuse.jpg",
    "/branches_normals.jpg"
  ]).map((texture) => {
    // to improve the texture
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: sampleMapCap,
      });

  const branchesMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap
  })

  // with traverse, we can access each item of the modal individually
  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial
    } else {
        child.material = branchesMaterial;
    }
  });

  return (
    <>
      {/* <mesh>
            <meshBasicMaterial color={0x00FF00} />
            <boxGeometry args={[1,1,1]} />
        </mesh> */}
      <primitive
        object={model.scene}
        position={[0.15, -0.65, 0]}
        rotation={[0, Math.PI / 5, 0]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      <OrbitControls />
    </>
  );
};

export default Dog;
