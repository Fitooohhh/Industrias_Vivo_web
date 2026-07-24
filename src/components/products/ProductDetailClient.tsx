'use client'

import React, { useState } from 'react'
import { 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star,
  CheckCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, ProductsService } from '@/services/products.service'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, updateQuantity, items } = useCartStore()

  // States
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' })

  // Find related products
  const relatedProducts = React.useMemo(() => {
    return ProductsService.getProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
  }, [product])

  // Frequently bought together (select another product randomly or first related)
  const frequentlyBoughtTogether = React.useMemo(() => {
    return ProductsService.getProducts()
      .filter(p => p.id !== product.id && p.targetMode === product.targetMode)
      .slice(0, 2)
  }, [product])

  const handleAddToCart = () => {
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        sku: product.sku,
        presentation: product.presentation,
      })
    }
    toast.success(`${product.name} agregado al carrito`, {
      description: `Cantidad: ${quantity} | Presentación: ${product.presentation}`
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/carrito'
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      toast.success(`${product.name} agregado a favoritos`)
    } else {
      toast.info(`${product.name} eliminado de favoritos`)
    }
  }

  // Zoom logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.pageX - left - window.scrollX) / width) * 100
    const y = ((e.pageY - top - window.scrollY) / height) * 100
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' })
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      
      {/* Back button */}
      <Link href="/catalogo" className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary mb-8 font-semibold transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al Catálogo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Gallery / Zoom Column */}
        <div className="lg:col-span-6 space-y-4">
          <div 
            className="relative aspect-square border rounded-2xl overflow-hidden bg-muted cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 bg-secondary text-secondary-foreground text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <Sparkles className="h-3.5 w-3.5" />
                <span>-{discountPercentage}%</span>
              </span>
            )}
            
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />

            {/* Lens zoom container */}
            <div 
              className="absolute inset-0 pointer-events-none border rounded-2xl bg-no-repeat"
              style={zoomStyle}
            />
          </div>

          {/* Thumbnails */}
          {product.gallery.length > 1 && (
            <div className="flex gap-4">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-muted transition-all ${
                    activeImage === img ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name}-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{product.brand}</span>
              <div className="flex items-center space-x-1 text-chart-5 text-sm font-bold">
                <Star className="h-4 w-4 fill-chart-5" />
                <span>{product.rating}</span>
                <span className="text-muted-foreground text-xs font-normal">(12 opiniones)</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-foreground">{product.name}</h1>
            <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
          </div>

          {/* Pricing & Stock */}
          <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border">
            <div>
              <span className="text-xs text-muted-foreground block">Precio de Fábrica</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-black text-foreground">Bs. {product.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    Bs. {product.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Disponibilidad</span>
              {product.stock > 0 ? (
                <span className="text-sm font-bold text-chart-3 flex items-center justify-end gap-1">
                  <CheckCircle className="h-4 w-4" />
                  En Stock ({product.stock} un.)
                </span>
              ) : (
                <span className="text-sm font-bold text-destructive">Agotado</span>
              )}
            </div>
          </div>

          {/* Presentation & Details */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-muted-foreground">Presentación</span>
            <div className="inline-block border px-3 py-1.5 rounded-lg text-sm bg-background font-bold text-foreground">
              {product.presentation}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-muted-foreground block">Descripción</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-muted-foreground block">Beneficios Clave</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-chart-3 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Instructions */}
          <div className="space-y-2 bg-muted/50 p-4 rounded-xl border">
            <span className="text-xs font-bold uppercase text-muted-foreground block">Modo de Uso</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.usageInstructions}</p>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t">
            {/* Quantity Selector */}
            <div className="flex items-center border rounded-xl bg-background p-1.5 w-full sm:w-auto justify-between">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-muted rounded-lg"
              >
                -
              </button>
              <span className="px-6 font-bold text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 flex items-center justify-center font-bold text-lg hover:bg-muted rounded-lg"
              >
                +
              </button>
            </div>

            <div className="flex gap-3 w-full">
              <Button onClick={handleAddToCart} className="flex-1 rounded-xl h-12 font-semibold">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
              <Button onClick={handleBuyNow} variant="secondary" className="flex-1 rounded-xl h-12 font-semibold">
                Comprar Ahora
              </Button>
              <Button 
                onClick={toggleFavorite}
                variant="outline" 
                size="icon" 
                className={`rounded-xl h-12 w-12 border ${
                  isFavorite ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-background'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Shipping & Returns Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Envío seguro y rápido</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-chart-3 flex-shrink-0" />
              <span>Calidad Certificada</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-secondary-foreground flex-shrink-0" />
              <span>Garantía de Satisfacción</span>
            </div>
          </div>

        </div>
      </div>

      {/* Frequently bought together */}
      {frequentlyBoughtTogether.length > 0 && (
        <section className="mt-20 pt-10 border-t space-y-6">
          <h3 className="text-xl font-bold text-foreground">Comprados Juntos Frecuentemente</h3>
          <div className="bg-primary/5 p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Products Chain */}
            <div className="md:col-span-9 flex flex-col sm:flex-row items-center gap-6">
              {/* Main Product */}
              <div className="flex items-center gap-4 bg-background border p-3 rounded-xl shadow-xs">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                <div>
                  <span className="text-xs font-bold block line-clamp-1">{product.name}</span>
                  <span className="text-sm font-black text-primary">Bs. {product.price.toFixed(2)}</span>
                </div>
              </div>
              
              <span className="text-xl font-bold text-muted-foreground">+</span>

              {/* Related Chain */}
              {frequentlyBoughtTogether.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <span className="text-xl font-bold text-muted-foreground">+</span>}
                  <div className="flex items-center gap-4 bg-background border p-3 rounded-xl shadow-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <span className="text-xs font-bold block line-clamp-1">{item.name}</span>
                      <span className="text-sm font-black text-primary">Bs. {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Total Block */}
            <div className="md:col-span-3 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 text-center md:text-right space-y-3">
              <div>
                <span className="text-xs text-muted-foreground block">Precio del Combo</span>
                <span className="text-2xl font-black text-foreground">
                  Bs. {(product.price + frequentlyBoughtTogether.reduce((a, b) => a + b.price, 0)).toFixed(2)}
                </span>
              </div>
              <Button 
                onClick={() => {
                  addItem({ id: product.id, name: product.name, price: product.price, image: product.image, sku: product.sku, presentation: product.presentation })
                  frequentlyBoughtTogether.forEach((item) => {
                    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, sku: item.sku, presentation: item.presentation })
                  })
                  toast.success('Combo completo agregado al carrito')
                }}
                className="w-full rounded-xl"
              >
                Agregar el Combo
              </Button>
            </div>

          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-extrabold text-foreground">Productos Relacionados</h3>
            <Link href="/catalogo" className="text-xs font-bold text-primary hover:underline">Ver todo el catálogo →</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-background border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase block">{item.brand}</span>
                    <Link href={`/producto/${item.id}`}>
                      <h4 className="font-bold text-base hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-base font-black text-foreground">Bs. {item.price.toFixed(2)}</span>
                    <Link href={`/producto/${item.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
