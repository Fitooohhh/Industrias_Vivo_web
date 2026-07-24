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
  MapPin,
  ArrowRightLeft,
  CheckCircle,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInventoryStore } from '@/store/useInventoryStore'
import { useProductStore } from '@/store/useProductStore'
import { BranchStock } from '@/types/product.types'
import { toast } from 'sonner'

export type BranchId = 'all' | keyof BranchStock

const BRANCH_CONFIG: Record<keyof BranchStock, { name: string; city: string; address: string }> = {
  'cocha-1': { name: 'Tienda 1', city: 'Cochabamba', address: 'Sucursal Tienda 1' },
  'cocha-2': { name: 'Tienda 2', city: 'Cochabamba', address: 'Sucursal Tienda 2' },
  'sucre-1': { name: 'Tienda 1', city: 'Sucre', address: 'Sucursal Tienda 1' },
  'sucre-2': { name: 'Tienda 2', city: 'Sucre', address: 'Sucursal Tienda 2' },
  'sucre-3': { name: 'Tienda 3', city: 'Sucre', address: 'Sucursal Tienda 3' },
}

export default function InventoryAdminView() {
  const { movements, registerMovement } = useInventoryStore()
  const { products, updateBranchStock, transferBranchStock } = useProductStore()

  // States
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  
  // Transfer Form State
  const [transferProductId, setTransferProductId] = useState('')
  const [transferFrom, setTransferFrom] = useState<keyof BranchStock>('cocha-1')
  const [transferTo, setTransferTo] = useState<keyof BranchStock>('cocha-2')
  const [transferQty, setTransferQty] = useState(5)

  // Quick Adjust State
  const [adjustProductId, setAdjustProductId] = useState('')
  const [adjustBranchId, setAdjustBranchId] = useState<keyof BranchStock>('cocha-1')
  const [adjustQty, setAdjustQty] = useState(10)

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      return matchSearch
    })
  }, [products, searchTerm])

  // Low stock products count
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock).length
  }, [products])

  // Execute Transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferProductId) {
      toast.error('Debe seleccionar un producto')
      return
    }
    if (transferFrom === transferTo) {
      toast.error('La sucursal de origen y destino deben ser distintas')
      return
    }
    const targetProd = products.find(p => p.id === transferProductId)
    if (!targetProd) return

    transferBranchStock(transferProductId, transferFrom, transferTo, transferQty)
    toast.success(`Transferencia completada`, {
      description: `Se movieron ${transferQty} un. de ${BRANCH_CONFIG[transferFrom].name} a ${BRANCH_CONFIG[transferTo].name}`
    })
    setShowTransferModal(false)
  }

  // Execute Quick Adjust
  const handleExecuteAdjust = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustProductId) return
    
    updateBranchStock(adjustProductId, adjustBranchId, adjustQty)
    toast.success(`Stock actualizado en ${BRANCH_CONFIG[adjustBranchId].name}`, {
      description: `Nuevo stock fijado: ${adjustQty} unidades`
    })
    setShowAdjustModal(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gestión de Inventario por Sucursal</h1>
          <p className="text-xs text-muted-foreground">Control aislado de stock para las 5 sucursales de Cochabamba y Sucre.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowTransferModal(true)} 
            variant="outline"
            className="rounded-xl border-primary/30 text-primary hover:bg-primary/5"
          >
            <ArrowRightLeft className="mr-1.5 h-4 w-4" />
            Transferir entre Tiendas
          </Button>
        </div>
      </div>

      {/* Branch Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedBranch('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            selectedBranch === 'all'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-background border hover:bg-muted text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Todas las Sucursales</span>
        </button>

        {(Object.keys(BRANCH_CONFIG) as Array<keyof BranchStock>).map((bId) => {
          const cfg = BRANCH_CONFIG[bId]
          return (
            <button
              key={bId}
              onClick={() => setSelectedBranch(bId)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedBranch === bId
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border hover:bg-muted text-foreground'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
              <span>[{cfg.city}] {cfg.name}</span>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código SKU o nombre de producto..."
            className="w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-primary outline-hidden font-medium"
          />
        </div>

        <div className="text-xs text-muted-foreground font-semibold">
          Mostrando productos para: <strong className="text-foreground">{selectedBranch === 'all' ? 'Consolidado General' : BRANCH_CONFIG[selectedBranch].name}</strong>
        </div>
      </div>

      {/* Products Branch Matrix Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-extrabold uppercase tracking-wider">
              <th className="p-4">SKU / Producto</th>
              <th className="p-4">Categoría</th>
              {selectedBranch === 'all' ? (
                <>
                  <th className="p-3 text-center bg-primary/5 border-l">Cocha 1</th>
                  <th className="p-3 text-center bg-primary/5">Cocha 2</th>
                  <th className="p-3 text-center bg-secondary/10 border-l">Sucre 1</th>
                  <th className="p-3 text-center bg-secondary/10">Sucre 2</th>
                  <th className="p-3 text-center bg-secondary/10">Sucre 3</th>
                  <th className="p-4 text-right font-black border-l">Total General</th>
                </>
              ) : (
                <>
                  <th className="p-4 text-center">Stock en {BRANCH_CONFIG[selectedBranch].name}</th>
                  <th className="p-4 text-center">Estado de Stock</th>
                  <th className="p-4 text-right">Acción</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredProducts.map(p => {
              const bStock = p.branchesStock || {
                'cocha-1': Math.floor(p.stock * 0.3),
                'cocha-2': Math.floor(p.stock * 0.2),
                'sucre-1': Math.floor(p.stock * 0.2),
                'sucre-2': Math.floor(p.stock * 0.15),
                'sucre-3': Math.floor(p.stock * 0.15)
              }

              const currentBranchQty = selectedBranch !== 'all' ? bStock[selectedBranch] : p.stock

              return (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover border" />
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground font-bold block">{p.sku}</span>
                        <span className="font-extrabold text-foreground block text-sm">{p.name}</span>
                        <span className="text-xs text-muted-foreground block">{p.presentation}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold capitalize text-muted-foreground">{p.category}</td>

                  {selectedBranch === 'all' ? (
                    <>
                      <td className="p-3 text-center font-bold text-xs bg-primary/5 border-l">{bStock['cocha-1']}</td>
                      <td className="p-3 text-center font-bold text-xs bg-primary/5">{bStock['cocha-2']}</td>
                      <td className="p-3 text-center font-bold text-xs bg-secondary/10 border-l">{bStock['sucre-1']}</td>
                      <td className="p-3 text-center font-bold text-xs bg-secondary/10">{bStock['sucre-2']}</td>
                      <td className="p-3 text-center font-bold text-xs bg-secondary/10">{bStock['sucre-3']}</td>
                      <td className="p-4 text-right font-black text-base text-primary border-l">{p.stock} un.</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-center font-black text-base text-foreground">
                        {currentBranchQty} un.
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                          currentBranchQty === 0
                            ? 'bg-destructive/10 text-destructive'
                            : currentBranchQty <= p.minStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-chart-3/15 text-chart-3'
                        }`}>
                          {currentBranchQty === 0 ? 'Agotado en Tienda' : currentBranchQty <= p.minStock ? 'Stock Bajo' : 'Disponible'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAdjustProductId(p.id)
                            setAdjustBranchId(selectedBranch)
                            setAdjustQty(currentBranchQty)
                            setShowAdjustModal(true)
                          }}
                          className="rounded-xl text-xs font-bold"
                        >
                          Ajustar Stock
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Transfer Stock Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-2 text-primary">
                <ArrowRightLeft className="h-5 w-5" />
                <h3 className="font-extrabold text-lg">Transferir Inventario entre Tiendas</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Producto</label>
                <select
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:border-primary outline-hidden font-bold"
                >
                  <option value="">-- Selecciona el Producto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name} ({p.presentation}) - Total: {p.stock} un.
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Origen (Sale de)</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value as keyof BranchStock)}
                    className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:border-primary outline-hidden font-bold"
                  >
                    {(Object.keys(BRANCH_CONFIG) as Array<keyof BranchStock>).map(bId => (
                      <option key={bId} value={bId}>[{BRANCH_CONFIG[bId].city}] {BRANCH_CONFIG[bId].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Destino (Entra a)</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value as keyof BranchStock)}
                    className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:border-primary outline-hidden font-bold"
                  >
                    {(Object.keys(BRANCH_CONFIG) as Array<keyof BranchStock>).map(bId => (
                      <option key={bId} value={bId}>[{BRANCH_CONFIG[bId].city}] {BRANCH_CONFIG[bId].name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Cantidad a Transferir</label>
                <input
                  type="number"
                  min={1}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:border-primary outline-hidden font-extrabold"
                />
              </div>

              <div className="flex gap-3 justify-end border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setShowTransferModal(false)} className="rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  Ejecutar Transferencia
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base border-b pb-3">Ajustar Stock Físico</h3>
            <form onSubmit={handleExecuteAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nueva Cantidad de Stock</label>
                <input
                  type="number"
                  min={0}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full rounded-xl border bg-background px-4 py-2.5 text-lg font-black text-primary focus:border-primary outline-hidden"
                />
              </div>
              <div className="flex gap-3 justify-end border-t pt-3">
                <Button type="button" variant="outline" onClick={() => setShowAdjustModal(false)} className="rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  Guardar Ajuste
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
