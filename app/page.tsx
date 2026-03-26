'use client'
import Dog from "@/components/Dog";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OurValues from "@/components/OurValues";
import Projects from "@/components/Projects";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <main id="mainpage" className="relative text-white bg-[#1e2438]">
      {/* dog modal */}
      <div className="w-screen h-screen fixed top-0 left-0 bg-[url('/background.png')] bg-cover bg-center z-0">
        <Canvas className="w-full h-full">
          <Dog />
        </Canvas>
      </div>

      {/* main sections */}
      <section className="relative min-h-screen border-2 border-red-800 z-10" id="section-1">
        <Navbar />
        <Hero />
      </section>
      <section className="relative min-h-screen border-2 border-red-800 z-10" id="section-2">
        <Projects />
      </section>
      <section className="min-h-screen border-2 border-red-800" id="section-3">
        <OurValues />
      </section>
    </main>
  );
}
