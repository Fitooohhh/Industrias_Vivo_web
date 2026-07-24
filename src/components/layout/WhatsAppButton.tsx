'use client'

import React from 'react'
import { PhoneCall } from 'lucide-react'

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    // Redirigir a enlace de WhatsApp simulado o real
    window.open('https://wa.me/59177112500?text=Hola%20Industrias%20Vivo,%20quisiera%20solicitar%20información%20sobre%20sus%20productos.', '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform duration-300 active:scale-95 group"
      aria-label="Contactar por WhatsApp"
    >
      <PhoneCall className="h-6 w-6 group-hover:animate-bounce" />
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-background text-foreground text-xs font-bold px-3 py-1.5 rounded-lg border shadow-md transition-all duration-300 origin-right whitespace-nowrap">
        ¿En qué te ayudamos?
      </span>
    </button>
  )
}
