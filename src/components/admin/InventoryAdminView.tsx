'use client'

import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  PackageOpen, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  SlidersHorizontal, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInventoryStore, InventoryMovement } from '@/store/useInventoryStore'
import { useProductStore } from '@/store/useProductStore'
import { toast } from 'sonner'

// Zod Schema for Inventory Movement
const movementFormSchema = zod.object({
  productId: zod.string().min(1, 'Debe seleccionar un producto'),
  type: zod.enum(['entry', 'exit', 'adjustment']),
  quantity: zod.number().min(1, 'La cantidad debe ser mayor a 0'),
  reason: zod.string().min(5, 'Debe indicar un motivo o detalle de mínimo 5 caracteres')
})

type MovementFormValues = zod.infer<typeof movementFormSchema>

export default function InventoryAdminView() {
  const { movements, registerMovement } = useInventoryStore()
  const { products } = useProductStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      type: 'entry'
    }
  })

  // Filtered movements list
  const filteredMovements = useMemo(() => {
    let list = [...movements]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      list = list.filter(m => m.productName.toLowerCase().includes(term))
    }

    if (typeFilter !== 'all') {
      list = list.filter(m => m.type === typeFilter)
    }

    return list
  }, [movements, searchTerm, typeFilter])

  // Low Stock Alerts List
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock)
  }, [products])

  const onSubmitMovement = (data: MovementFormValues) => {
    const targetProd = products.find(p => p.id === data.productId)
    if (!targetProd) return

    registerMovement({
      productId: data.productId,
      productName: targetProd.name,
      type: data.type,
      quantity: data.quantity,
      reason: data.reason
    })

    toast.success('Movimiento de stock registrado', {
      description: `Tipo: ${data.type === 'entry' ? 'Entrada' : data.type === 'exit' ? 'Salida' : 'Ajuste'} | Cantidad: ${data.quantity}`
    })

    handleCloseModal()
  }

  const handleCloseModal = () => {
    reset({ productId: '', type: 'entry', quantity: 0, reason: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Control de Inventario</h1>
          <p className="text-xs text-muted-foreground">Registra entradas, salidas o ajustes de stock que alteran el catálogo en tiempo real.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="rounded-xl">
          <Plus className="mr-1 h-5 w-5" />
          Registrar Movimiento
        </Button>
      </div>

      {/* Low stock alerts widgets */}
      {lowStockProducts.length > 0 && (
        <div className="border border-destructive/20 bg-destructive/5 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-destructive flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            Alertas de Stock Bajo / Crítico
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="bg-background border rounded-xl p-3 flex justify-between items-center shadow-xs">
                <div>
                  <span className="font-bold text-xs block text-foreground leading-tight">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.presentation}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    p.stock === 0 ? 'bg-destructive/10 text-destructive' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.stock === 0 ? 'Sin Stock' : `${p.stock} un.`}
                  </span>
                  <span className="text-[9px] text-muted-foreground block mt-1">Mínimo: {p.minStock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre de producto..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:border-primary outline-hidden"
          >
            <option value="all">Todos los Movimientos</option>
            <option value="entry">Entradas (+)</option>
            <option value="exit">Salidas (-)</option>
            <option value="adjustment">Ajustes (Reconciliación)</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">Fecha / Hora</th>
              <th className="p-4">Producto</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Motivo / Detalle</th>
              <th className="p-4">Administrador</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredMovements.map(m => (
              <tr key={m.id} className="hover:bg-muted/10">
                <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                  <span>{m.date}</span>
                  <span className="block text-[10px]">{m.time}</span>
                </td>
                <td className="p-4 font-bold text-foreground">{m.productName}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-max ${
                    m.type === 'entry' 
                      ? 'bg-chart-3/15 text-chart-3' 
                      : m.type === 'exit' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {m.type === 'entry' ? <ArrowDownLeft className="h-3 w-3" /> : m.type === 'exit' ? <ArrowUpRight className="h-3 w-3" /> : <PackageOpen className="h-3 w-3" />}
                    {m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Salida' : 'Ajuste'}
                  </span>
                </td>
                <td className={`p-4 font-extrabold ${
                  m.type === 'entry' ? 'text-chart-3' : m.type === 'exit' ? 'text-destructive' : 'text-foreground'
                }`}>
                  {m.type === 'entry' ? `+${m.quantity}` : m.type === 'exit' ? `-${m.quantity}` : `${m.quantity}`}
                </td>
                <td className="p-4 text-xs text-muted-foreground max-w-xs truncate" title={m.reason}>
                  {m.reason}
                </td>
                <td className="p-4 text-xs font-semibold text-foreground">{m.user}</td>
              </tr>
            ))}
            {filteredMovements.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                  No se registraron movimientos en el almacén.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">Registrar Movimiento de Almacén</h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitMovement)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Producto</label>
                <select
                  {...register('productId')}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-hidden"
                >
                  <option value="">-- Seleccionar --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name} ({p.presentation}) - Stock: {p.stock} un.
                    </option>
                  ))}
                </select>
                {errors.productId && <span className="text-[10px] text-destructive mt-1 block">{errors.productId.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Tipo Movimiento</label>
                  <select
                    {...register('type')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  >
                    <option value="entry">Entrada (+)</option>
                    <option value="exit">Salida (-)</option>
                    <option value="adjustment">Ajuste (Fijar Absoluto)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Cantidad</label>
                  <input
                    type="number"
                    {...register('quantity', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.quantity && <span className="text-[10px] text-destructive mt-1 block">{errors.quantity.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Motivo / Detalle</label>
                <textarea
                  {...register('reason')}
                  rows={3}
                  placeholder="Ej. Ingreso por fin de lote de producción #923, merma por envase roto..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden resize-none"
                />
                {errors.reason && <span className="text-[10px] text-destructive mt-1 block">{errors.reason.message}</span>}
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
                  Registrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
