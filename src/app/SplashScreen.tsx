"use client"

import React, { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Simula la carga de recursos iniciales
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setLoading(false)
        onFinish()
      }, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onFinish])

  if (!loading) return null

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#2C1810] via-[#4A2C1F] to-[#6B3E2E] transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Wine Glass Icon */}
      <div className="relative mb-8 animate-float">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Wine Glass */}
          <path
            d="M35 20 C35 20, 40 45, 45 55 C50 65, 55 70, 60 75 L60 95 L45 95 L45 105 L75 105 L75 95 L60 95 L60 75 C65 70, 70 65, 75 55 C80 45, 85 20, 85 20 Z"
            fill="#E8D4C0"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Wine inside glass */}
          <path
            d="M37 22 C37 22, 41 42, 46 52 C50 60, 54 65, 58 68 C62 65, 66 60, 70 52 C75 42, 79 22, 79 22 Z"
            fill="#8B1538"
            opacity="0.9"
          />
          {/* Shine effect */}
          <ellipse cx="48" cy="35" rx="8" ry="15" fill="white" opacity="0.3" />
          {/* Grape decoration */}
          <circle cx="25" cy="15" r="4" fill="#8B1538" opacity="0.6" />
          <circle cx="30" cy="12" r="4" fill="#8B1538" opacity="0.6" />
          <circle cx="35" cy="10" r="4" fill="#8B1538" opacity="0.6" />
          <path d="M32 8 Q30 5, 28 3" stroke="#4A7C59" strokeWidth="2" fill="none" />
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-[#D4AF37] opacity-20 animate-pulse"></div>
      </div>

      {/* Brand Name */}
      <h1 className="text-white text-4xl font-serif font-bold mb-2 tracking-wide text-center px-4">
        Vinatería Corazón Huasteco
      </h1>

      {/* Decorative line */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="2" fill="#D4AF37" />
        </svg>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
      </div>

      {/* Loading text */}
      <p className="text-[#E8D4C0] text-lg font-light tracking-widest">Cargando aplicación...</p>

      {/* Loading dots animation */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  )
}

export default SplashScreen
