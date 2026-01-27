"use client"

import { useEffect, useRef } from "react"

export function Spotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(147, 51, 234, 0.15), transparent 80%)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <div ref={spotlightRef} className="pointer-events-none fixed inset-0 z-30 transition duration-300" />
}
