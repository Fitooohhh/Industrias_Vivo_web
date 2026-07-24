'use client'

import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  Box, 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye,
  SlidersHorizontal,
  FolderMinus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/store/useProductStore'
import { Product } from '@/services/products.service'
import { toast } from 'sonner'
import Link from 'next/link'

// Zod Schema for Product CRUD Form
const productFormSchema = zod.object({
  name: zod.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  sku: zod.string().min(3, 'El código SKU debe tener al menos 3 caracteres'),
  category: zod.string().min(1, 'Debe elegir una categoría'),
  brand: zod.string().min(1, 'Debe ingresar una marca'),
  description: zod.string().min(5, 'La descripción es obligatoria'),
  shortDescription: zod.string().min(3, 'La descripción corta es obligatoria'),
  presentation: zod.string().min(1, 'Ej. Galón, Litro, Bidón'),
  price: zod.number().min(0.1, 'El precio de venta debe ser mayor a 0'),
  originalPrice: zod.number().optional(),
  cost: zod.number().min(0.1, 'El costo de producción debe ser mayor a 0'),
  stock: zod.number().min(0, 'El stock no puede ser negativo'),
  minStock: zod.number().min(0, 'El stock mínimo no puede ser negativo'),
  targetMode: zod.enum(['hogar', 'empresas', 'both']),
  image: zod.string().min(10, 'La dirección URL de la imagen principal es obligatoria')
})

type ProductFormValues = zod.infer<typeof productFormSchema>

export default function ProductsAdminView() {
  const { products, addProduct, updateProduct, deleteProduct, duplicateProduct, toggleProductStatus, categories } = useProductStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema)
  })

  // Filtered product listing
  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      list = list.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
      )
    }

    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter)
    }

    return list
  }, [products, searchTerm, categoryFilter])

  // Create or Update Form submit
  const onSubmitProduct = (data: ProductFormValues) => {
    const formatted = {
      ...data,
      features: ['Fórmula concentrada', 'Biodegradable', 'Máxima efectividad'],
      usageInstructions: 'Aplicar según especificaciones del envase.',
      gallery: [data.image],
      rating: editingProduct ? editingProduct.rating : 4.5,
      isFeatured: editingProduct ? editingProduct.isFeatured : false,
      status: editingProduct ? editingProduct.status : 'active' as const
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formatted)
      toast.success('Producto actualizado exitosamente')
    } else {
      addProduct(formatted)
      toast.success('Nuevo producto agregado al catálogo')
    }

    handleCloseModal()
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setValue('name', product.name)
    setValue('sku', product.sku)
    setValue('category', product.category)
    setValue('brand', product.brand)
    setValue('description', product.description)
    setValue('shortDescription', product.shortDescription)
    setValue('presentation', product.presentation)
    setValue('price', product.price)
    setValue('originalPrice', product.originalPrice)
    setValue('cost', product.cost)
    setValue('stock', product.stock)
    setValue('minStock', product.minStock)
    setValue('targetMode', product.targetMode)
    setValue('image', product.image)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingProduct(null)
    reset({
      name: '',
      sku: '',
      category: '',
      brand: 'Vivo Hogar',
      description: '',
      shortDescription: '',
      presentation: '',
      price: 0,
      originalPrice: undefined,
      cost: 0,
      stock: 0,
      minStock: 0,
      targetMode: 'hogar',
      image: ''
    })
    setShowModal(false)
  }

  const handleDuplicate = (id: string) => {
    duplicateProduct(id)
    toast.success('Producto duplicado con éxito')
  }

  const handleToggleStatus = (id: string) => {
    toggleProductStatus(id)
    toast.info('Estado del producto modificado')
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto: "${name}"?`)) {
      deleteProduct(id)
      toast.success('Producto eliminado del catálogo')
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gestión de Productos</h1>
          <p className="text-xs text-muted-foreground">Crea, edita, duplica o remueve productos del catálogo comercial.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="rounded-xl">
          <Plus className="mr-1 h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, SKU..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:border-primary outline-hidden"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">SKU</th>
              <th className="p-4">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Modo</th>
              <th className="p-4">Costo</th>
              <th className="p-4">Precio Venta</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-muted/10">
                <td className="p-4 font-mono text-xs">{p.sku}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                    <div>
                      <span className="font-bold block text-foreground leading-tight">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground">{p.presentation}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-semibold capitalize text-muted-foreground">{p.category}</td>
                <td className="p-4 text-xs">
                  <span className="bg-primary/5 px-2 py-0.5 rounded text-primary font-semibold capitalize">
                    {p.targetMode}
                  </span>
                </td>
                <td className="p-4 text-xs text-muted-foreground">Bs. {p.cost.toFixed(2)}</td>
                <td className="p-4 font-bold">Bs. {p.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`font-bold ${p.stock <= p.minStock ? 'text-destructive' : 'text-foreground'}`}>
                    {p.stock}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">Mín: {p.minStock}</span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggleStatus(p.id)}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      p.status === 'active' 
                        ? 'bg-chart-3/10 text-chart-3' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {p.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicate(p.id)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg border hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground italic">
                  No se encontraron productos en la base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto de Limpieza'}
              </h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre Comercial</label>
                  <input
                    {...register('name')}
                    placeholder="Desinfectante Lavanda"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.name && <span className="text-[10px] text-destructive">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Código SKU</label>
                  <input
                    {...register('sku')}
                    placeholder="DV-LAV-01"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.sku && <span className="text-[10px] text-destructive">{errors.sku.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Categoría</label>
                  <select
                    {...register('category')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  >
                    <option value="">-- Seleccionar --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <span className="text-[10px] text-destructive">{errors.category.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Marca</label>
                  <input
                    {...register('brand')}
                    placeholder="Vivo Hogar"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.brand && <span className="text-[10px] text-destructive">{errors.brand.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Presentación comercial</label>
                  <input
                    {...register('presentation')}
                    placeholder="Galón (3.8 Litros)"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.presentation && <span className="text-[10px] text-destructive">{errors.presentation.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Costo Producción (Bs)</label>
                  <input
                    type="number"
                    step="any"
                    {...register('cost', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.cost && <span className="text-[10px] text-destructive">{errors.cost.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Precio Venta (Bs)</label>
                  <input
                    type="number"
                    step="any"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.price && <span className="text-[10px] text-destructive">{errors.price.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Precio Promocional (Bs - Opcional)</label>
                  <input
                    type="number"
                    step="any"
                    {...register('originalPrice', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.stock && <span className="text-[10px] text-destructive">{errors.stock.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Stock Mínimo Alerta</label>
                  <input
                    type="number"
                    {...register('minStock', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.minStock && <span className="text-[10px] text-destructive">{errors.minStock.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Segmento Objetivo</label>
                  <select
                    {...register('targetMode')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  >
                    <option value="hogar">Hogar</option>
                    <option value="empresas">Empresas / Industrial</option>
                    <option value="both">Ambos segmentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">URL de la Imagen Principal</label>
                <input
                  {...register('image')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.image && <span className="text-[10px] text-destructive">{errors.image.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Descripción de Producto</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden resize-none"
                />
                {errors.description && <span className="text-[10px] text-destructive">{errors.description.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Descripción Corta (Ficha)</label>
                <input
                  {...register('shortDescription')}
                  placeholder="Detergente sanitizante de alta espuma..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.shortDescription && <span className="text-[10px] text-destructive">{errors.shortDescription.message}</span>}
              </div>

              <div className="flex gap-3 justify-end border-t pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseModal}
                  className="rounded-lg"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-lg font-bold">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
