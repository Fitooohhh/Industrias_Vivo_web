'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Eye, ShieldAlert, Target } from 'lucide-react'

export default function AboutUsSection() {
  const cards = [
    {
      title: 'Nuestra Misión',
      description: 'Fabricar y comercializar productos de limpieza e higiene que superen las expectativas de nuestros clientes en efectividad, rendimiento y seguridad, protegiendo al mismo tiempo el medio ambiente.',
      icon: Target,
      color: 'border-primary/20 bg-primary/5',
    },
    {
      title: 'Nuestra Visión',
      description: 'Ser la empresa líder en soluciones de limpieza e higiene en el mercado nacional para el 2030, reconocida por nuestra innovación química constante, calidad certificada y excelente servicio al cliente.',
      icon: Eye,
      color: 'border-secondary/20 bg-secondary/5',
    },
    {
      title: 'Valores Corporativos',
      description: 'Nos guían el compromiso con la calidad, la honestidad comercial, el respeto ambiental mediante insumos biodegradables, y la pasión por ofrecer soluciones de higiene confiables.',
      icon: ShieldAlert,
      color: 'border-chart-3/20 bg-chart-3/5',
    },
  ]

  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-bold">Nuestra Esencia</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Quiénes Somos e Institucional
          </h2>
          <p className="text-muted-foreground">
            En Industrias Vivo nos mueve la pasión por la limpieza y la frescura, proveyendo seguridad química tanto en hogares como en complejos industriales.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 ${card.color} flex flex-col items-center text-center`}
              >
                <div className="p-4 rounded-full bg-background border shadow-xs mb-6 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
