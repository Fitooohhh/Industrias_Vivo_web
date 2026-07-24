'use client'

import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Send, 
  Loader2, 
  CheckCircle,
  Building2,
  Phone,
  Mail,
  User,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsService, Product } from '@/services/products.service'
import { useQuotesStore, QuoteItem } from '@/store/useQuotesStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Form Zod Schema
const quoteSchema = zod.object({
  company: zod.string().min(3, 'El nombre de la empresa debe tener al menos 3 caracteres'),
  contactName: zod.string().min(3, 'El nombre de contacto debe tener al menos 3 caracteres'),
  email: zod.string().email('Debe ingresar un correo de contacto válido'),
  phone: zod.string().min(7, 'El teléfono de contacto debe tener al menos 7 dígitos'),
  city: zod.string().min(3, 'La ciudad/región es obligatoria'),
  notes: zod.string().optional()
})

type QuoteFormValues = zod.infer<typeof quoteSchema>

export default function QuotationForm() {
  const { addQuote } = useQuotesStore()
  const allProducts = useMemo(() => ProductsService.getProducts(), [])

  // States
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([])
  const [selectedProductVal, setSelectedProductVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quoteSuccessId, setQuoteSuccessId] = useState<string | null>(null)

  // Forms
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema)
  })

  // Add Product to the Quote List
  const handleAddItem = () => {
    if (!selectedProductVal) return

    const product = allProducts.find(p => p.id === selectedProductVal)
    if (!product) return

    const existing = selectedItems.find(item => item.productId === product.id)
    if (existing) {
      toast.warning('Este producto ya se encuentra en tu lista de cotización')
      return
    }

    setSelectedItems([
      ...selectedItems,
      {
        productId: product.id,
        name: product.name,
        presentation: product.presentation,
        price: product.price,
        quantity: 1
      }
    ])
    setSelectedProductVal('')
    toast.success('Producto añadido a la lista')
  }

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== id))
    toast.info('Producto quitado de la lista')
  }

  // Update Item Quantity
  const handleQuantityChange = (id: string, qty: number) => {
    if (qty <= 0) return
    setSelectedItems(
      selectedItems.map(item => item.productId === id ? { ...item, quantity: qty } : item)
    )
  }

  // Estimated total calculation
  const totalEstimate = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Submit Handler
  const onSubmitQuote = async (data: QuoteFormValues) => {
    if (selectedItems.length === 0) {
      toast.error('Debe seleccionar al menos un producto para cotizar')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)

    const quoteId = addQuote({
      ...data,
      items: selectedItems,
      totalEstimate
    })

    setQuoteSuccessId(quoteId)
    toast.success('Solicitud de cotización enviada')
  }

  const handleReset = () => {
    reset()
    setSelectedItems([])
    setQuoteSuccessId(null)
  }

  if (quoteSuccessId) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="border bg-background rounded-3xl p-6 md:p-10 shadow-xl text-center space-y-6">
          <div className="inline-flex p-3 rounded-full bg-chart-3/15 text-chart-3 mb-2 animate-bounce">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-foreground">¡Solicitud Enviada con Éxito!</h2>
          <p className="text-sm text-muted-foreground">
            Hemos recibido los requerimientos de tu empresa. Un asesor comercial evaluará tu pedido por volumen para aplicarte descuentos adicionales.
          </p>

          <div className="border rounded-2xl p-4 bg-muted/20 text-left space-y-2">
            <span className="text-xs text-muted-foreground block">Código de Cotización</span>
            <span className="font-mono font-bold text-primary text-lg">{quoteSuccessId}</span>
            <p className="text-[10px] text-muted-foreground pt-1">
              Guarda este número para realizar el seguimiento desde tu perfil o por vía telefónica.
            </p>
          </div>

          <div className="pt-4 border-t flex justify-center gap-3">
            <Button onClick={handleReset} variant="outline" className="rounded-xl">
              Solicitar Otra Cotización
            </Button>
            <Link href="/">
              <Button className="rounded-xl">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="bg-background border rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b pb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Cotizador Corporativo</h1>
            <p className="text-xs text-muted-foreground">Ideal para compras por volumen, industrias, hospitales, hoteles y restaurantes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitQuote)} className="space-y-6">
          
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm border-l-2 border-primary pl-2 uppercase tracking-wider">
              Datos de la Empresa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Razón Social / Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('company')}
                    placeholder="Ej. Distribuidora Santa Cruz S.R.L."
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.company && <span className="text-[10px] text-destructive mt-1 block">{errors.company.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre de Contacto</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('contactName')}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.contactName && <span className="text-[10px] text-destructive mt-1 block">{errors.contactName.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.email && <span className="text-[10px] text-destructive mt-1 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('phone')}
                    placeholder="70000000"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.phone && <span className="text-[10px] text-destructive mt-1 block">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Ciudad / Región</label>
                <input
                  {...register('city')}
                  placeholder="Santa Cruz"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary outline-hidden"
                />
                {errors.city && <span className="text-[10px] text-destructive mt-1 block">{errors.city.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Observaciones / Especificaciones Adicionales</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Por favor indícanos si necesitas dosificaciones especiales, fichas técnicas o cotización para transporte fuera de la ciudad..."
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Product Picker */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-bold text-foreground text-sm border-l-2 border-primary pl-2 uppercase tracking-wider">
              Productos a Cotizar
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-grow">
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Seleccionar de Catálogo</label>
                <select
                  value={selectedProductVal}
                  onChange={(e) => setSelectedProductVal(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-hidden"
                >
                  <option value="">-- Elige un producto --</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.brand}] {p.name} ({p.presentation}) - Bs. {p.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="button" onClick={handleAddItem} className="rounded-lg h-[42px] px-6">
                <Plus className="mr-1 h-4 w-4" />
                Añadir
              </Button>
            </div>

            {/* Selected items list */}
            {selectedItems.length > 0 ? (
              <div className="border rounded-2xl overflow-hidden bg-background">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
                      <th className="p-3">Producto</th>
                      <th className="p-3">Presentación</th>
                      <th className="p-3">Cantidad (Unidades)</th>
                      <th className="p-3">Est. Unitario</th>
                      <th className="p-3">Subtotal</th>
                      <th className="p-3 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {selectedItems.map(item => (
                      <tr key={item.productId} className="hover:bg-muted/10">
                        <td className="p-3 font-bold text-foreground">{item.name}</td>
                        <td className="p-3 text-muted-foreground">{item.presentation}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 rounded border bg-background px-2 py-1 text-center font-bold"
                          />
                        </td>
                        <td className="p-3 text-muted-foreground">Bs. {item.price.toFixed(2)}</td>
                        <td className="p-3 font-bold">Bs. {(item.price * item.quantity).toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 bg-muted/20 border-t flex justify-between items-center text-sm">
                  <span className="font-bold text-muted-foreground">Presupuesto Estimado Inicial</span>
                  <span className="text-lg font-black text-primary">Bs. {totalEstimate.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed rounded-2xl text-xs text-muted-foreground">
                Aún no has añadido ningún producto para cotizar.
              </div>
            )}
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground max-w-md">
              <Info className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Los precios desplegados son de catálogo de fábrica. Para solicitudes mayoristas evaluaremos un descuento de volumen especial al responder.</span>
            </div>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-11 px-8 font-bold shadow-md shadow-primary/10">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
