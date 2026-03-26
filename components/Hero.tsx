'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import * as React from 'react'

export default function Hero() {
  const text = "We Make Good Shit"
  const words = text.split(" ")

  useGSAP(() => {
    gsap.from(".hero-word", {
      y: 80,                // comes from below
      x: 60,                // slight horizontal offset
      rotationX: 170,        // flip from bottom (KEY 🔥)
      opacity: 0,
      transformOrigin: "bottom center",
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  return (
    <>
      <div className='w-1/2 h-[83vh] flex justify-end items-center'>
        <h1 className='font-extrabold text-8xl w-90 font-serif text-end gap-0 pr-4'>
          
          {words.map((word, index) => (
            <span key={index} className="inline-block mr-3 overflow-hidden">
              
              {/* MASK WRAPPER 👇 */}
              <span className="hero-word inline-block">
                {word}
              </span>

            </span>
          ))}

        </h1>
      </div>

      <div className='w-1/2 flex flex-col gap-2 px-6 ml-auto mb-60'>
        <h1 className='font-bold text-2xl'>
          Dogstudio is a multidisciplinary creative studio at the intersection
          of art, design and technology.
        </h1>

        <p>
          Our goal is to deliver amazing experiences that make
          people talk, and build strategic value for brands, tech,
          entertainment, arts & culture.
        </p>

        <p className='mt-4 text-gray-300 cursor-pointer'>
          Facebook / Instagram / Dribbble / Twitter / Newsletter
        </p>
      </div>
    </>
  )
}