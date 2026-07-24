'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, Truck, Sparkles, PiggyBank, Briefcase } from 'lucide-react'

export default function WhyChooseUsSection() {
  const advantages = [
    {
      title: 'Productos de Alta Calidad',
      description: 'Fórmulas certificadas que garantizan la eliminación de gérmenes y remoción de suciedad difícil.',
      icon: ShieldCheck,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Amplia Experiencia',
      description: 'Más de 15 años en el mercado químico industrial respaldan cada uno de nuestros desarrollos.',
      icon: Briefcase,
      color: 'bg-secondary/20 text-secondary-foreground',
    },
    {
      title: 'Entregas Rápidas',
      description: 'Flota propia de distribución para abastecer a hogares y plantas a tiempo y sin demoras.',
      icon: Truck,
      color: 'bg-chart-3/10 text-chart-3',
    },
    {
      title: 'Atención Personalizada',
      description: 'Asesoría técnica y soporte directo para cotizaciones corporativas o consultas hogareñas.',
      icon: Sparkles,
      color: 'bg-chart-4/10 text-chart-4',
    },
    {
      title: 'Precios Competitivos',
      description: 'Venta directa de fábrica sin intermediarios, optimizando el costo por litro de producto.',
      icon: PiggyBank,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Hogar e Industria',
      description: 'Gama diversificada desde pequeños atomizadores domésticos hasta bidones de alta concentración.',
      icon: Check,
      color: 'bg-secondary/20 text-secondary-foreground',
    },
  ]

  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Ventajas Vivo</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            ¿Por qué elegir Industrias Vivo?
          </h2>
          <p className="text-muted-foreground">
            Combinamos tecnología, insumos premium y procesos estandarizados para ofrecer la mejor experiencia en limpieza y sanitización del mercado.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((adv, index) => {
            const Icon = adv.icon
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-background border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-xl ${adv.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {adv.description}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-bold text-primary flex items-center space-x-1">
                    <span>Saber más</span>
                    <span>→</span>
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
