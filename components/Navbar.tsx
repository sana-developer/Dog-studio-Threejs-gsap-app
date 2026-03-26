'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as React from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function Navbar() {

  useGSAP(() => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".navbar",
        start: "top top",
        toggleActions: "restart none none none", 
        // 👆 replays animation every time it re-enters
      }
    })

    tl.from(".logo", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      immediateRender: false,
      ease: "back.out(1.7)"
    }, "+=0.5")
    .from(".contact-button", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      immediateRender: false
    }, "-=0.5")

  }, [])

  return (
    <div className='navbar flex justify-between items-center px-6 py-12 font-bold text-2xl'>
      
      <span className='logo'>DogStudio</span>
      <span className='showreel text-base'>Our Showreel</span>
      <span className='contact-button'>Contact</span>

    </div>
  )
}