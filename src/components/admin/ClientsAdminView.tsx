'use client'

import React, { useState, useMemo } from 'react'
import { 
  Users, 
  Search, 
  Eye, 
  FileText, 
  ShoppingBag, 
  Ban, 
  Unlock,
  ShieldCheck,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useQuotesStore } from '@/store/useQuotesStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

export interface ClientProfile {
  name: string
  email: string
  phone: string
  company: string
  ordersCount: number
  totalSpent: number
  quotesCount: number
  active: boolean
}

export default function ClientsAdminView() {
  const { orders } = useOrdersStore()
  const { quotes } = useQuotesStore()
  const { user: currentUser } = useAuthStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null)
  const [blockedEmails, setBlockedEmails] = useState<string[]>([])

  // Dynamic aggregation of clients from orders, quotes and active session
  const clientsList = useMemo(() => {
    const clientsMap = new Map<string, ClientProfile>()

    // Default seed clients to ensure the table is not empty
    const seedClients = [
      { name: 'Juan Pérez', email: 'juan@correo.com', phone: '+591 70010203', company: 'Independiente', ordersCount: 0, totalSpent: 0, quotesCount: 0, active: true },
      { name: 'Carlos Mendizabal', email: 'mantenimiento@hotelsantacruz.com', phone: '+591 71020304', company: 'Hotel Santa Cruz S.A.', ordersCount: 0, totalSpent: 0, quotesCount: 0, active: true }
    ]

    // Add active user if not present
    if (currentUser) {
      seedClients.push({
        name: `${currentUser.name} ${currentUser.lastName}`,
        email: currentUser.email,
        phone: currentUser.phone || 'S/N',
        company: currentUser.company || 'Distribuidora Hogar',
        ordersCount: 0,
        totalSpent: 0,
        quotesCount: 0,
        active: true
      })
    }

    seedClients.forEach(c => clientsMap.set(c.email, c))

    // Aggregate orders data
    orders.forEach(order => {
      const existing = clientsMap.get(order.customerEmail)
      if (existing) {
        existing.ordersCount += 1
        existing.totalSpent += order.total
      } else {
        clientsMap.set(order.customerEmail, {
          name: order.customerName,
          email: order.customerEmail,
          phone: 'S/N',
          company: 'Independiente',
          ordersCount: 1,
          totalSpent: order.total,
          quotesCount: 0,
          active: true
        })
      }
    })

    // Aggregate quotes data
    quotes.forEach(quote => {
      const existing = clientsMap.get(quote.email)
      if (existing) {
        existing.quotesCount += 1
        if (quote.company) {
          existing.company = quote.company
        }
      } else {
        clientsMap.set(quote.email, {
          name: quote.contactName,
          email: quote.email,
          phone: quote.phone,
          company: quote.company || 'Independiente',
          ordersCount: 0,
          totalSpent: 0,
          quotesCount: 1,
          active: true
        })
      }
    })

    // Apply blocked status from state
    return Array.from(clientsMap.values()).map(c => ({
      ...c,
      active: !blockedEmails.includes(c.email)
    }))
  }, [orders, quotes, currentUser, blockedEmails])

  // Filter clients
  const filteredClients = useMemo(() => {
    if (searchTerm.trim() === '') return clientsList
    const term = searchTerm.toLowerCase()
    return clientsList.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.email.toLowerCase().includes(term) ||
      c.company.toLowerCase().includes(term)
    )
  }, [clientsList, searchTerm])

  const handleToggleBlock = (email: string) => {
    if (blockedEmails.includes(email)) {
      setBlockedEmails(blockedEmails.filter(e => e !== email))
      toast.success('Acceso del cliente restaurado')
    } else {
      setBlockedEmails([...blockedEmails, email])
      toast.warning('Acceso del cliente bloqueado temporalmente')
    }
    // Close modal if selected
    if (selectedClient && selectedClient.email === email) {
      setSelectedClient(null)
    }
  }

  // Get orders associated with selected email
  const clientOrders = useMemo(() => {
    if (!selectedClient) return []
    return orders.filter(o => o.customerEmail === selectedClient.email)
  }, [selectedClient, orders])

  // Get quotes associated with selected email
  const clientQuotes = useMemo(() => {
    if (!selectedClient) return []
    return quotes.filter(q => q.email === selectedClient.email)
  }, [selectedClient, quotes])

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Directorio de Clientes</h1>
          <p className="text-xs text-muted-foreground">Consulta los perfiles, compras acumuladas e historial comercial de tus clientes.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, empresa..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">Cliente</th>
              <th className="p-4">Empresa</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4 text-center">Pedidos</th>
              <th className="p-4 text-center">Cotizaciones</th>
              <th className="p-4">Total Comprado</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredClients.map(c => (
              <tr key={c.email} className="hover:bg-muted/10">
                <td className="p-4">
                  <div>
                    <span className="font-bold text-foreground block leading-tight">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="font-semibold">{c.company}</span>
                  </div>
                </td>
                <td className="p-4 text-xs text-muted-foreground">{c.phone}</td>
                <td className="p-4 text-center font-semibold">{c.ordersCount}</td>
                <td className="p-4 text-center font-semibold">{c.quotesCount}</td>
                <td className="p-4 font-black text-primary">Bs. {c.totalSpent.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.active ? 'bg-chart-3/10 text-chart-3' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {c.active ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setSelectedClient(c)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-bold"
                      title="Ver Ficha Comercial"
                    >
                      <Eye className="h-4 w-4" />
                      Ficha
                    </button>
                    <button 
                      onClick={() => handleToggleBlock(c.email)}
                      className={`p-1.5 rounded-lg border ${
                        c.active ? 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive' : 'hover:bg-chart-3/15 text-destructive hover:text-chart-3'
                      }`}
                      title={c.active ? 'Suspender Acceso' : 'Habilitar Acceso'}
                    >
                      {c.active ? <Ban className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client Detail Sheet Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">Ficha Comercial: {selectedClient.name}</h3>
              <button onClick={() => setSelectedClient(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            {/* Profile fields card */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 border rounded-2xl bg-muted/20">
              <div>
                <span className="text-muted-foreground block font-semibold">Correo Electrónico</span>
                <span className="font-bold text-foreground">{selectedClient.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-semibold">Teléfono</span>
                <span className="font-bold text-foreground">{selectedClient.phone}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-muted-foreground block font-semibold">Empresa / Razón</span>
                <span className="font-bold text-foreground">{selectedClient.company}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-muted-foreground block font-semibold">Volumen de Compra</span>
                <span className="font-black text-primary text-sm">Bs. {selectedClient.totalSpent.toFixed(2)}</span>
              </div>
            </div>

            {/* Orders list */}
            {clientOrders.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-muted-foreground block">Pedidos Registrados ({clientOrders.length})</span>
                <div className="border rounded-xl divide-y max-h-40 overflow-y-auto">
                  {clientOrders.map(o => (
                    <div key={o.id} className="p-3 flex justify-between items-center hover:bg-muted/10">
                      <div>
                        <span className="font-bold text-primary font-mono">{o.id}</span>
                        <span className="text-muted-foreground block mt-0.5">Fecha: {o.date} | Pago: {o.paymentMethod.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block">Bs. {o.total.toFixed(2)}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded capitalize">{o.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quotes list */}
            {clientQuotes.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-muted-foreground block">Solicitudes de Cotización ({clientQuotes.length})</span>
                <div className="border rounded-xl divide-y max-h-40 overflow-y-auto">
                  {clientQuotes.map(q => (
                    <div key={q.id} className="p-3 flex justify-between items-center hover:bg-muted/10">
                      <div>
                        <span className="font-bold text-secondary font-mono">{q.id}</span>
                        <span className="text-muted-foreground block mt-0.5">Fecha: {q.date} | Ciudad: {q.city}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block">Bs. {q.totalEstimate.toFixed(2)}</span>
                        <span className="text-[10px] bg-secondary/15 text-secondary px-1.5 py-0.5 rounded capitalize">{q.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions footer */}
            <div className="flex gap-3 justify-end border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedClient(null)}
                className="rounded-lg"
              >
                Cerrar Ficha
              </Button>
              <Button 
                variant={selectedClient.active ? 'destructive' : 'default'} 
                onClick={() => handleToggleBlock(selectedClient.email)}
                className="rounded-lg font-bold"
              >
                {selectedClient.active ? 'Suspender Cliente' : 'Habilitar Cliente'}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
