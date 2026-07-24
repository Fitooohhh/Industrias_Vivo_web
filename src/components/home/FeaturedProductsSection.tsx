'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Eye, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsService } from '@/services/products.service'
import { useAppStore } from '@/store/useAppStore'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'

export default function FeaturedProductsSection() {
  const { addItem } = useCartStore()
  
  const products = ProductsService.getFeaturedProducts()

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sku: product.sku,
      presentation: product.presentation,
    })
    toast.success(`${product.name} agregado al carrito`, {
      description: `Presentación: ${product.presentation}`,
      action: {
        label: 'Ver Carrito',
        onClick: () => window.location.href = '/carrito'
      }
    })
  }

  return (
    <section className="py-20 bg-primary/5 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Nuestra Selección</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground text-sm">
              Conoce nuestras soluciones estrella en limpieza y desinfección, formuladas para rendir al máximo.
            </p>
          </div>
          <Link href="/catalogo">
            <Button variant="outline" className="rounded-full bg-background">
              Ver Todo el Catálogo
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price
              const discountPercentage = hasDiscount 
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                : 0

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative bg-background/70 backdrop-blur-md border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgba(2,132,199,0.15)] hover:border-primary/40 active:border-primary/50 transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Image Header */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-bounce-slow">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>-{discountPercentage}%</span>
                      </div>
                    )}

                    {/* Mobile visible action button */}
                    <div className="sm:hidden absolute top-3 right-3 z-10">
                      <Link href={`/producto/${product.id}`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md bg-background/80 backdrop-blur-md text-primary active:scale-90">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <Link href={`/producto/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Desktop overlay */}
                    <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 items-center justify-center gap-3 backdrop-blur-[2px] pointer-events-none group-hover:pointer-events-auto">
                      <Link href={`/producto/${product.id}`}>
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-400">
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-bold uppercase tracking-wider text-primary/80">{product.brand}</span>
                        <div className="flex items-center space-x-1 text-chart-5 font-bold bg-chart-5/10 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3 fill-chart-5" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <Link href={`/producto/${product.id}`}>
                        <h3 className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.shortDescription}
                      </p>
                      <div className="pt-2 text-xs text-primary/80 font-medium">
                        Presentación: <span className="text-foreground font-semibold">{product.presentation}</span>
                      </div>
                    </div>

                    {/* Pricing & Add Cart */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            Bs. {product.originalPrice?.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg sm:text-xl font-black text-foreground">
                          Bs. {product.price.toFixed(2)}
                        </span>
                      </div>
                      <Button 
                        onClick={(e) => handleAddToCart(product, e)}
                        size="sm" 
                        className="rounded-full font-bold shadow-md active:scale-90 transition-transform px-4"
                      >
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
