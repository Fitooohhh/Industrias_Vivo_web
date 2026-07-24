'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function GallerySection() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
      title: 'Control de Calidad',
      category: 'Laboratorio'
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      title: 'Envasado Automatizado',
      category: 'Planta'
    },
    {
      url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
      title: 'Almacén de Insumos',
      category: 'Logística'
    },
    {
      url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600',
      title: 'Fórmulas Premium',
      category: 'Química'
    }
  ]

  return (
    <section className="py-20 bg-primary/5 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-bold">Proceso Vivo</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Instalaciones y Proceso de Fabricación
          </h2>
          <p className="text-muted-foreground">
            Una mirada interna a nuestra planta industrial, donde la precisión química y las normas de seguridad e higiene garantizan la máxima efectividad de cada producto.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-md aspect-square bg-muted cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{img.category}</span>
                <h4 className="text-base font-bold">{img.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
