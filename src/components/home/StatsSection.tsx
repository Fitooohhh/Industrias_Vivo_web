'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, CheckCircle2, Factory } from 'lucide-react'

export default function StatsSection() {
  const stats = [
    { id: 1, name: 'Años de Experiencia', value: '15+', icon: Award, color: 'text-primary' },
    { id: 2, name: 'Clientes Satisfechos', value: '10K+', icon: Users, color: 'text-secondary-foreground' },
    { id: 3, name: 'Productos en Catálogo', value: '50+', icon: Factory, color: 'text-chart-3' },
    { id: 4, name: 'Entregas Mensuales', value: '25K+', icon: CheckCircle2, color: 'text-chart-4' },
  ]

  return (
    <section className="bg-primary/5 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-4 bg-background rounded-xl border shadow-xs"
              >
                <div className={`p-3 rounded-full bg-primary/5 ${stat.color} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-muted-foreground mt-1">
                  {stat.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
