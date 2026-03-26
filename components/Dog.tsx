import * as THREE from "three";
import { OrbitControls, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = () => {
  gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);
  
  useGSAP(()=> {
    if(!modelRef.current) return;

    // modal movement animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        endTrigger: '#section-3',
        end: 'bottom bottom',
        scrub: true,
        markers: true,
      }
    });

    tl
    .to(modelRef.current.scene.position, {
        z: '-=0.5',
        y: '+=0.2'
    })
    .to(modelRef.current.scene.rotation, {
      x: `+=${Math.PI / 10}`
    })
    .to(modelRef.current.scene.rotation, {
      y: `-=${Math.PI}`,
      z: `-=${Math.PI / 10}`,
    })
    .to(modelRef.current.scene.position, {
      x: '-=0.2'
    }, "<")
  }, [])

  // -----------------  MODAL INITIAL VALUES  -------------------

  // models loads in our component
  const model = useGLTF("/models/dog.drc.glb");

  useThree(({ camera, scene, gl }) => {
    console.log(camera.position);
    camera.position.z = 0.3;
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

  const modelRef = useRef(model);
  
  return (
    <>
      <primitive
        object={model.scene}
        position={[0.15, -0.65, 0]}
        rotation={[-0.1, Math.PI / 5, -0.1]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
