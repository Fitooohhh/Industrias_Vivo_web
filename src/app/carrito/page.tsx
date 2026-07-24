'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Info,
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, CartItem } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import LottieEmptyCart from '@/components/cart/LottieEmptyCart'

export default function CarritoPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getDiscount, 
    getShippingCost, 
    getTotal,
    clearCart
  } = useCartStore()

  const { isAuthenticated } = useAuthStore()

  const [mounted, setMounted] = useState(false)

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex items-center justify-center">
        <span className="text-sm font-semibold text-muted-foreground">Cargando carrito...</span>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = getShippingCost()
  const total = getTotal()

  const handleCheckoutRedirect = (e: React.MouseEvent) => {
    if (items.length === 0) {
      e.preventDefault()
      toast.error('Tu carrito está vacío')
      return
    }
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login informando del checkout
      window.location.href = '/login?redirect=checkout'
    } else {
      window.location.href = '/checkout'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 transition-colors duration-300">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b pb-6 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Tu Carrito de Compras</h1>
          <p className="text-xs text-muted-foreground">Revisa los productos seleccionados y procede con el pago seguro.</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border rounded-2xl overflow-hidden bg-background">
              <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Productos ({items.length})
                </span>
                <button 
                  onClick={() => {
                    clearCart()
                    toast.info('Carrito vaciado')
                  }}
                  className="text-xs text-destructive hover:underline font-bold flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Vaciar todo
                </button>
              </div>

              <div className="divide-y">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Presentación: {item.presentation}</p>
                          <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>
                        </div>
                      </div>

                      {/* Controls and prices */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                        {/* Selector */}
                        <div className="flex items-center border rounded-lg bg-background p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 flex items-center justify-center font-bold text-sm hover:bg-muted rounded-md"
                          >
                            -
                          </button>
                          <span className="px-4 font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 flex items-center justify-center font-bold text-sm hover:bg-muted rounded-md"
                          >
                            +
                          </button>
                        </div>

                        {/* Prices */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-sm font-black text-foreground">
                            Bs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-muted-foreground block">
                              Bs. {item.price.toFixed(2)} c/u
                            </span>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => {
                            removeItem(item.id)
                            toast.info(`${item.name} removido del carrito`)
                          }}
                          className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/5 transition-colors"
                          title="Quitar del carrito"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Shopping Incentives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-start space-x-3 p-4 border rounded-xl bg-background">
                <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-foreground mb-0.5">Envío Gratis</h5>
                  <p>Consigue envío sin costo sumando compras mayores a 150 Bs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-xl bg-background">
                <Gift className="h-5 w-5 text-secondary-foreground flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-foreground mb-0.5">Descuento de Fábrica</h5>
                  <p>Obtén un 10% de descuento directo en compras que superen los 200 Bs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border rounded-2xl p-6 bg-background shadow-xs space-y-6">
              <h3 className="font-bold text-lg border-b pb-3">Resumen del Pedido</h3>

              {/* Subtotal */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-foreground">Bs. {subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-chart-3 bg-chart-3/5 px-2 py-1 rounded-md">
                    <span className="flex items-center gap-1 font-semibold">
                      <Gift className="h-4 w-4" />
                      Descuento por Volumen
                    </span>
                    <span className="font-bold">- Bs. {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Costo de Envío</span>
                  <span className="font-bold text-foreground">
                    {shipping === 0 ? (
                      <span className="text-chart-3 font-semibold uppercase text-xs">Gratuito</span>
                    ) : (
                      `Bs. ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted p-2 rounded-lg">
                    <Info className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>Agrega <b>Bs. {(150 - subtotal).toFixed(2)}</b> más para obtener envío gratuito.</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4 flex justify-between items-end">
                <div>
                  <span className="text-xs text-muted-foreground block">Total a Pagar</span>
                  <span className="text-2xl font-black text-foreground">Bs. {total.toFixed(2)}</span>
                </div>
                <div className="text-right text-[10px] text-muted-foreground font-semibold">
                  Directo de Fábrica
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleCheckoutRedirect}
                  className="w-full rounded-xl h-12 font-bold shadow-md shadow-primary/10"
                >
                  Proceder al Pago
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Link href="/catalogo" className="block text-center">
                  <Button variant="ghost" className="w-full rounded-xl text-xs flex items-center justify-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Seguir Comprando
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-chart-3" />
              <span>Transacciones seguras y encriptadas</span>
            </div>
          </div>

        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20 px-6 border-2 border-dashed border-primary/20 rounded-3xl space-y-6 bg-background/60 backdrop-blur-md max-w-2xl mx-auto shadow-xl"
        >
          <LottieEmptyCart />
          
          <div className="space-y-2">
            <h3 className="font-extrabold text-2xl text-foreground">Tu carrito está vacío</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Explora nuestro catálogo de productos biodegradables e industriales de alta efectividad para comenzar a añadir tus compras.
            </p>
          </div>

          <Link href="/catalogo" className="inline-block pt-2">
            <Button size="lg" className="group rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 px-8">
              Ir al Catálogo de Productos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>
      )}

    </div>
  )
}
