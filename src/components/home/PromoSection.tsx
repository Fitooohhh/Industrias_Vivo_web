'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Percent, Gift, Truck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PromoSection() {
  const promos = [
    {
      title: '20% Descuento Directo',
      desc: 'En tu primera compra de desinfectantes de galón o bidón. ¡Ahorra en volumen!',
      icon: Percent,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Combos de Limpieza Total',
      desc: 'Llevando el combo Hogar Seguro o el combo Desinfección Pro ahorras hasta un 15% del total.',
      icon: Gift,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      title: 'Envío Gratis a Domicilio',
      desc: 'Por compras superiores a 150 Bs. en toda la ciudad. Rápido, seguro y confiable.',
      icon: Truck,
      color: 'from-amber-600 to-orange-600',
    },
  ]

  return (
    <section className="py-20 bg-transparent transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Promociones Activas</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Ahorra en tus Compras
          </h2>
          <p className="text-muted-foreground">
            Aprovecha nuestras ofertas temporales y combos diseñados para maximizar la higiene al mejor precio.
          </p>
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promos.map((promo, index) => {
            const Icon = promo.icon
            return (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br ${promo.color} shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col justify-between h-68 sm:h-72 border border-white/20 backdrop-blur-md active:scale-98`}
              >
                {/* Decorative background glow & light sweep */}
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/20 blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="inline-flex p-3 sm:p-3.5 rounded-2xl bg-white/20 backdrop-blur-md group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-inner">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{promo.title}</h3>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">{promo.desc}</p>
                </div>

                <div className="pt-3 sm:pt-4 relative z-10">
                  <Link href="/catalogo">
                    <Button variant="secondary" size="default" className="rounded-full font-extrabold bg-white text-foreground hover:bg-white/95 shadow-md active:scale-95 transition-all duration-300 text-xs sm:text-sm px-5 sm:px-6">
                      Aprovechar Oferta
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
