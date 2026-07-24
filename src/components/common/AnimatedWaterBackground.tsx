'use client'

import React from 'react'

export default function AnimatedWaterBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-linear-to-b from-[#e3f6fc] via-[#f4fbfe] to-[#ffffff] dark:from-[#0a1827] dark:via-[#0c1e31] dark:to-[#08121f] transition-colors duration-500">
      
      {/* Primary Water Wave Layer (User's Exact Image) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-85 dark:opacity-20 animate-water-drift"
        style={{
          backgroundImage: `url('/images/water-background.png')`,
          width: '112%',
          height: '112%',
          top: '-6%',
          left: '-6%'
        }}
      />

      {/* Secondary Water Wave Layer (Offset & Reverse Drift for Fluid Interference Effect) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen animate-water-drift-reverse"
        style={{
          backgroundImage: `url('/images/water-background.png')`,
          width: '116%',
          height: '116%',
          top: '-8%',
          left: '-8%',
          transformOrigin: 'center center'
        }}
      />

      {/* Overlay to ensure readability and subtle air freshness effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/35 dark:to-transparent pointer-events-none" />

      {/* CSS Animations injected safely */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes water-drift {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(-2%, 1.5%) scale(1.04) rotate(0.8deg);
          }
          66% {
            transform: translate(1.5%, -1%) scale(1.07) rotate(-0.5deg);
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes water-drift-reverse {
          0% {
            transform: translate(0, 0) scale(1.05) rotate(0deg);
          }
          33% {
            transform: translate(1.5%, -1%) scale(1.02) rotate(-0.6deg);
          }
          66% {
            transform: translate(-1.5%, 1.5%) scale(1.08) rotate(0.8deg);
          }
          100% {
            transform: translate(0, 0) scale(1.05) rotate(0deg);
          }
        }
        .animate-water-drift {
          animation: water-drift 6s infinite ease-in-out;
        }
        .animate-water-drift-reverse {
          animation: water-drift-reverse 8s infinite ease-in-out;
        }
      `}} />
    </div>
  )
}
