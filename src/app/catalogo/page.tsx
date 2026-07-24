'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ShoppingCart, 
  Eye, 
  Star,
  Sparkles,
  ArrowUpDown,
  FilterX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsService, Product } from '@/services/products.service'
import { useAppStore } from '@/store/useAppStore'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CatalogoPage() {
  const { addItem } = useCartStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // Fetch all base data
  const categories = useMemo(() => ProductsService.getCategories(), [])
  const brands = useMemo(() => ProductsService.getBrands(), [])
  
  // Filter products based on search, category, brand
  const filteredProducts = useMemo(() => {
    let list = ProductsService.getProducts()

    // 1. Filter by Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      list = list.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term) ||
             p.sku.toLowerCase().includes(term)
      )
    }

    // 2. Filter by selected category
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory)
    }

    // 3. Filter by selected brand
    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand === selectedBrand)
    }

    // 4. Sort products
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [searchTerm, selectedCategory, selectedBrand, sortBy])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
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
      description: `Presentación: ${product.presentation}`
    })
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setSortBy('default')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 transition-colors duration-300">
      {/* Title / Banner */}
      <div className="bg-gradient-to-r from-primary via-cyan-600 to-secondary text-primary-foreground rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            Catálogo Oficial de Fábrica
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Catálogo Completo de Productos
          </h1>
          <p className="text-primary-foreground/90 text-sm leading-relaxed font-medium">
            Explora todas nuestras líneas de desinfectantes, lavavajillas, desengrasantes, limpiadores y detergentes formulados para cualquier necesidad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 border p-6 rounded-2xl bg-background">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Filtros
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold"
            >
              <FilterX className="h-3 w-3" />
              Limpiar
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, SKU..."
                className="w-full rounded-lg border bg-background pl-9 pr-4 py-2.5 text-sm outline-hidden focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categorías</label>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-left text-sm py-1.5 px-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Todas las categorías
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left text-sm py-1.5 px-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border p-4 rounded-xl bg-background">
            <div className="text-sm font-semibold text-muted-foreground">
              Mostrando <span className="text-foreground font-bold">{filteredProducts.length}</span> productos
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Select */}
              <div className="flex items-center gap-2 relative">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:border-primary focus:outline-hidden"
                >
                  <option value="default">Recomendados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Popularidad</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-0.5 bg-muted">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground'}`}
                  title="Vista cuadrícula"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground'}`}
                  title="Vista lista"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center gap-1 bg-background"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl space-y-4 bg-background">
              <div className="text-muted-foreground text-5xl">🔍</div>
              <h3 className="font-bold text-xl">No se encontraron productos</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Intenta limpiando los filtros de búsqueda o seleccionando otra categoría.
              </p>
              <Button onClick={resetFilters} size="sm">Limpiar Filtros</Button>
            </div>
          )}

          {/* Products List / Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const hasDiscount = product.originalPrice && product.originalPrice > product.price
                const discountPercentage = hasDiscount 
                  ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                  : 0

                if (viewMode === 'grid') {
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-background/70 backdrop-blur-md border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgba(2,132,199,0.12)] hover:border-primary/40 active:border-primary/50 transition-all duration-500 flex flex-col justify-between"
                    >
                      {/* Image Header */}
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        {hasDiscount && (
                          <div className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-bounce-slow">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            <span>-{discountPercentage}%</span>
                          </div>
                        )}

                        {/* Mobile action button */}
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

                        <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 items-center justify-center gap-3 backdrop-blur-[2px] pointer-events-none group-hover:pointer-events-auto">
                          <Link href={`/producto/${product.id}`}>
                            <Button size="icon" variant="secondary" className="rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-400">
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
                            <div className="flex items-center space-x-1 text-chart-5 font-bold">
                              <Star className="h-3 w-3 fill-chart-5" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          <Link href={`/producto/${product.id}`}>
                            <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {product.shortDescription}
                          </p>
                          <div className="pt-1 text-[11px] text-primary/80 font-medium">
                            Presentación: <span className="text-foreground">{product.presentation}</span>
                          </div>
                        </div>

                        {/* Price & Cart */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t">
                          <div className="flex flex-col">
                            {hasDiscount && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                Bs. {product.originalPrice?.toFixed(2)}
                              </span>
                            )}
                            <span className="text-base font-black text-foreground">
                              Bs. {product.price.toFixed(2)}
                            </span>
                          </div>
                          <Button 
                            onClick={(e) => handleAddToCart(product, e)}
                            size="sm" 
                            className="rounded-full h-8 px-3.5 text-xs font-bold active:scale-90 transition-transform shadow-xs"
                          >
                            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                }

                // List View
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-background/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm hover:shadow-[0_10px_25px_rgba(2,132,199,0.12)] hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                        {hasDiscount && (
                          <span className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                            -{discountPercentage}%
                          </span>
                        )}
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{product.brand}</span>
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md font-medium text-foreground">{product.presentation}</span>
                        </div>
                        <Link href={`/producto/${product.id}`}>
                          <h3 className="font-bold text-base hover:text-primary transition-colors text-foreground">{product.name}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
                        <div className="flex items-center gap-1 text-chart-5 text-xs font-semibold">
                          <Star className="h-3.5 w-3.5 fill-chart-5" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                      <div className="flex flex-col sm:text-right">
                        {hasDiscount && (
                          <span className="text-xs text-muted-foreground line-through">
                            Bs. {product.originalPrice?.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-black text-foreground">
                          Bs. {product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/producto/${product.id}`}>
                          <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">
                            Ver Detalle
                          </Button>
                        </Link>
                        <Button 
                          onClick={(e) => handleAddToCart(product, e)}
                          size="sm" 
                          className="rounded-full h-8 text-xs"
                        >
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="w-full max-w-xs bg-background h-full p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-lg">Filtros</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFiltersMobile(false)}>
                  ✕
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, SKU..."
                    className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categorías</label>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setShowFiltersMobile(false); }}
                    className={`text-left text-sm py-1.5 px-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowFiltersMobile(false); }}
                      className={`text-left text-sm py-1.5 px-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === cat.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-2">
              <Button onClick={resetFilters} variant="outline" className="w-full">
                Limpiar
              </Button>
              <Button onClick={() => setShowFiltersMobile(false)} className="w-full">
                Aplicar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
