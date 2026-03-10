'use client'
import Dog from "@/components/Dog";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Canvas>
        <Dog />
      </Canvas>
    </div>
  );
}
