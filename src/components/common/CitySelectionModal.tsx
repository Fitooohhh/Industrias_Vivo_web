'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Building2, CheckCircle2, Sparkles, Navigation } from 'lucide-react'
import { useAppStore, SelectedCity } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CitySelectionModal() {
  const { city, setCity } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user has already selected a city in this session
    const hasChosen = localStorage.getItem('vivo-city-chosen')
    if (!hasChosen) {
      setIsOpen(true)
    }
  }, [])

  if (!mounted) return null

  const handleSelectCity = (selectedCity: SelectedCity) => {
    setCity(selectedCity)
    localStorage.setItem('vivo-city-chosen', 'true')
    setIsOpen(false)
    toast.success(`Ciudad seleccionada: ${selectedCity === 'cochabamba' ? 'Cochabamba' : 'Sucre'}`, {
      description: 'Los inventarios y sucursales se han personalizado para tu ubicación.'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg bg-background/95 backdrop-blur-2xl border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden"
          >
            {/* Background Glow decorative element */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Navigation className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
                  Bienvenido a Industrias Vivo
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Selecciona tu Ciudad
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                  Elige tu ubicación para mostrarte la disponibilidad de productos y sucursales en tiempo real.
                </p>
              </div>
            </div>

            {/* City Selection Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* Cochabamba Option */}
              <button
                type="button"
                onClick={() => handleSelectCity('cochabamba')}
                className={`group flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden ${
                  city === 'cochabamba'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-lg'
                    : 'border-border bg-background hover:bg-muted/40 hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                  Cochabamba
                </h3>
                <span className="text-[11px] text-muted-foreground font-semibold mt-1">
                  2 Sucursales activas
                </span>
                <div className="mt-3 text-[10px] font-bold text-chart-3 bg-chart-3/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Envíos & Recojo directo</span>
                </div>
              </button>

              {/* Sucre Option */}
              <button
                type="button"
                onClick={() => handleSelectCity('sucre')}
                className={`group flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden ${
                  city === 'sucre'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-lg'
                    : 'border-border bg-background hover:bg-muted/40 hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                  Sucre
                </h3>
                <span className="text-[11px] text-muted-foreground font-semibold mt-1">
                  3 Sucursales activas
                </span>
                <div className="mt-3 text-[10px] font-bold text-chart-3 bg-chart-3/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Envíos & Recojo directo</span>
                </div>
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground text-center relative z-10">
              Podrás cambiar tu ciudad en cualquier momento desde el menú superior.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
