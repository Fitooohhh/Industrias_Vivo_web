'use client'

import React, { useState, useMemo } from 'react'
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  SlidersHorizontal, 
  CheckCircle, 
  XCircle,
  Truck,
  Store,
  CreditCard,
  QrCode,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrdersStore, Order } from '@/store/useOrdersStore'
import { toast } from 'sonner'

export default function OrdersAdminView() {
  const { orders, updateOrderStatus } = useOrdersStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [obsInput, setObsInput] = useState('')
  const [statusInput, setStatusInput] = useState<Order['status']>('recibido')

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    let list = [...orders]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      list = list.filter(o => 
        o.id.toLowerCase().includes(term) || 
        o.customerName.toLowerCase().includes(term)
      )
    }

    if (statusFilter !== 'all') {
      list = list.filter(o => o.status === statusFilter)
    }

    return list
  }, [orders, searchTerm, statusFilter])

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order)
    setStatusInput(order.status)
    setObsInput(order.observations || '')
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null)
  }

  const handleUpdateStatus = () => {
    if (!selectedOrder) return
    updateOrderStatus(selectedOrder.id, statusInput, obsInput)
    toast.success('Estado del pedido actualizado con éxito')
    setSelectedOrder(null)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gestión de Pedidos</h1>
          <p className="text-xs text-muted-foreground">Revisa las compras de clientes, confirma depósitos QR y despacha productos.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, Cliente..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:border-primary outline-hidden"
          >
            <option value="all">Todos los Estados</option>
            <option value="recibido">Recibidos</option>
            <option value="pendiente_pago">Pendientes de Pago</option>
            <option value="confirmado">Confirmados</option>
            <option value="preparando">Preparando</option>
            <option value="en_camino">En Camino</option>
            <option value="listo_retiro">Listo para Retirar</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">Pedido ID</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Entrega</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-muted/10">
                <td className="p-4 font-mono font-bold text-primary text-xs">{o.id}</td>
                <td className="p-4 text-xs text-muted-foreground">{o.date}</td>
                <td className="p-4">
                  <div>
                    <span className="font-bold text-foreground block leading-tight">{o.customerName}</span>
                    <span className="text-[10px] text-muted-foreground">{o.customerEmail}</span>
                  </div>
                </td>
                <td className="p-4 text-xs font-semibold capitalize text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {o.paymentMethod === 'cash' ? <Store className="h-3.5 w-3.5" /> : o.paymentMethod === 'card' ? <CreditCard className="h-3.5 w-3.5" /> : <QrCode className="h-3.5 w-3.5 text-primary" />}
                    {o.paymentMethod === 'cash' ? 'Contra entrega' : o.paymentMethod === 'card' ? 'Tarjeta' : 'QR Bancario'}
                  </span>
                </td>
                <td className="p-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {o.deliveryMethod === 'delivery' ? <Truck className="h-3.5 w-3.5 text-primary" /> : <Store className="h-3.5 w-3.5" />}
                    {o.deliveryMethod === 'delivery' ? 'Domicilio' : 'Retiro Fábrica'}
                  </span>
                </td>
                <td className="p-4 font-black">Bs. {o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                    o.status === 'entregado' 
                      ? 'bg-chart-3/10 text-chart-3' 
                      : o.status === 'cancelado' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary animate-pulse'
                  }`}>
                    {o.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleOpenDetail(o)}
                    className="p-1.5 rounded-lg border hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Eye className="h-4 w-4" />
                    Detalles / Gestionar
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground italic">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details and Edit Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">Detalles del Pedido: {selectedOrder.id}</h3>
              <button onClick={handleCloseDetail} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs">
              <span className="block font-bold uppercase text-muted-foreground">Datos del Cliente</span>
              <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
                <span className="font-bold text-foreground block">Nombre: {selectedOrder.customerName}</span>
                <span className="block text-muted-foreground">Email: {selectedOrder.customerEmail}</span>
                <span className="block text-muted-foreground">Destino: {selectedOrder.address}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 text-xs">
              <span className="block font-bold uppercase text-muted-foreground">Productos Solicitados</span>
              <div className="divide-y border rounded-xl overflow-hidden bg-background">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="p-3 flex justify-between items-center hover:bg-muted/10">
                    <div>
                      <span className="font-bold block text-foreground">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">{item.presentation} x{item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold">Bs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="p-3 bg-muted/10 flex justify-between font-black text-sm">
                  <span>Total Facturado</span>
                  <span>Bs. {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Change Status Form */}
            <div className="space-y-4 pt-4 border-t">
              <span className="block text-xs font-bold uppercase text-muted-foreground">Actualización Logística</span>
              
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Estado del Pedido</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-hidden"
                >
                  <option value="recibido">Recibido</option>
                  <option value="pendiente_pago">Pendiente Pago</option>
                  <option value="confirmado">Confirmado / Pago Aprobado</option>
                  <option value="preparando">Preparando Despacho</option>
                  <option value="en_camino">En Camino (Distribución)</option>
                  <option value="listo_retiro">Listo para Retiro en Fábrica</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Observaciones Administrativas</label>
                <textarea
                  value={obsInput}
                  onChange={(e) => setObsInput(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden resize-none"
                  placeholder="Ej. Comprobante QR validado. Programado para entrega de mañana..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDetail}
                className="rounded-lg"
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus} className="rounded-lg font-bold">
                Actualizar Pedido
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
