'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ClipboardList, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

export default function HeroSection() {
  const { mode } = useAppStore()

  const isHogar = mode === 'hogar'

  return (
    <section className="relative overflow-hidden bg-transparent py-20 lg:py-32">


      {/* Floating Blobs */}
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full border bg-background px-3 py-1 text-xs text-primary shadow-sm"
            >
              <Shield className="h-4 w-4 text-chart-3" />
              <span>100% Calidad garantizada</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
            >
              Higiene y Sanitización de Alta Eficiencia para tu <span className="text-primary bg-clip-text">Hogar o Empresa</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Fabricantes directos de desinfectantes, lavavajillas, desengrasantes, jabones de manos y limpiadores multisuperficie formulados para garantizar la máxima limpieza y economía.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link href="/catalogo">
                <Button size="lg" className="group relative rounded-full shadow-[0_10px_25px_rgba(2,132,199,0.3)] hover:shadow-[0_15px_35px_rgba(2,132,199,0.5)] hover:-translate-y-1 transition-all duration-300 font-bold px-8 py-6 text-base overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Ver Catálogo Completo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>

              <Link href="/cotizaciones">
                <Button size="lg" variant="outline" className="rounded-full font-bold px-8 py-6 text-base border-primary/30 bg-background/60 backdrop-blur-md hover:bg-primary/10 hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm">
                  <ClipboardList className="mr-2 h-5 w-5 text-primary animate-pulse" />
                  Solicitar Cotización
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Graphical/Image Content */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative w-full max-w-[450px] aspect-square rounded-3xl overflow-hidden border-2 border-primary/30 bg-gradient-to-tr from-primary/20 via-background/60 to-secondary/30 shadow-[0_20px_50px_rgba(2,132,199,0.25)] p-6 flex items-center justify-center backdrop-blur-md cursor-pointer transition-shadow duration-500 hover:shadow-[0_30px_60px_rgba(2,132,199,0.4)]"
            >
              <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
              <img
                src="/images/hero-lavavajillas.jpg"
                alt="Industrias Vivo - Lavavajillas Poder Desengrasante"
                className="w-full h-full object-cover rounded-2xl shadow-inner transition-all duration-700 hover:scale-110"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-background/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-primary/20 text-center transform transition-transform duration-300 hover:scale-105">
                <span className="text-xs font-black text-primary block uppercase tracking-widest animate-pulse">Industrias Vivo</span>
                <span className="text-sm font-bold block text-foreground">
                  Fórmulas Biodegradables & Concentradas
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
