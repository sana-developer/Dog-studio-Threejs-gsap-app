import * as THREE from "three";
import { OrbitControls, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = ({ selectedMatcap }) => {
  gsap.registerPlugin(ScrollTrigger);
  const dogRef = useRef();
  
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


  useGSAP(() => {
  if (!dogRef.current) return;

  const section = document.querySelector('#section-1');

  // 🔥 smooth setters
  const rotX = gsap.quickTo(dogRef.current.rotation, "x", {
    duration: 0.6,
    ease: "power3.out",
  });

  const rotY = gsap.quickTo(dogRef.current.rotation, "y", {
    duration: 0.6,
    ease: "power3.out",
  });

  const posX = gsap.quickTo(dogRef.current.position, "x", {
    duration: 0.6,
    ease: "power3.out",
  });

  const posY = gsap.quickTo(dogRef.current.position, "y", {
    duration: 0.6,
    ease: "power3.out",
  });

  const handleMove = (e) => {
    const xRatio = e.clientX / window.innerWidth;
    const yRatio = e.clientY / window.innerHeight;

    // convert to -1 → 1 range
    const x = (xRatio - 0.5) * 2;
    const y = (yRatio - 0.5) * 2;

    // 🎯 rotate slightly
    rotX(-0.1 + y * 0.03);
    rotY(Math.PI / 5 + x * 0.01);

    // 🎯 small position shift (parallax)
    posX(0.15 + x * 0.03);
    posY(-0.65 + y * 0.01);
  };

  const handleLeave = () => {
    rotX(-0.1);
    rotY(Math.PI / 5);
    posX(0.15);
    posY(-0.65);
  };

  section?.addEventListener("pointermove", handleMove);
  section?.addEventListener("pointerleave", handleLeave);

  return () => {
    section?.removeEventListener("pointermove", handleMove);
    section?.removeEventListener("pointerleave", handleLeave);
  };

}, []);

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

  const [normalMap, branchMap, branchNormalMap] = useTexture([
    "/dog_normals.jpg",
    "/branches_diffuse.jpg",
    "/branches_normals.jpg"
  ]).map((texture) => {
    // to improve the texture
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
  ] = (useTexture([
    "/matcap/mat-1.png",
    "/matcap/mat-2.png",
    "/matcap/mat-3.png",
    "/matcap/mat-4.png",
    "/matcap/mat-5.png",
  ])).map((texture) => {
    // to improve the texture
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const matcaps = {
  "mat-1": mat1,
  "mat-2": mat2,
  "mat-3": mat3,
  "mat-4": mat4,
  "mat-5": mat5,
};

  const material = useRef({
    uMatcap1: { value: mat5 },
    uMatcap2: { value: mat3 }, //it takes the progress value
    uProgress: {value: 0.0 }
  })  

  const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: mat5,
      });

  const branchesMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap
  })

    function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    dogMaterial.onBeforeCompile = onBeforeCompile

  // with traverse, we can access each item of the modal individually
  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial
    } else {
        child.material = branchesMaterial;
    }
  });

  useEffect(() => {
  if (!selectedMatcap) return;

  const newMatcap = matcaps[selectedMatcap];

  material.current.uMatcap1.value = newMatcap;

  gsap.to(material.current.uProgress, {
    value: 0,
    duration: 1,
    onComplete: () => {
      material.current.uMatcap2.value = newMatcap;
      material.current.uProgress.value = 1;
    },
  });
}, [selectedMatcap]);

  const modelRef = useRef(model);
  
  return (
    <>
      <primitive
        ref={dogRef}
        object={model.scene}
        position={[0.15, -0.65, 0]}
        rotation={[-0.1, Math.PI / 5, -0.1]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      
    </>
  );
};

export default Dog;
