'use client'

import React, { useMemo } from 'react'
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Percent, 
  FileSpreadsheet, 
  Printer, 
  Download,
  Calendar
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useProductStore } from '@/store/useProductStore'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ReportsView() {
  const { orders } = useOrdersStore()
  const { products } = useProductStore()

  // Dynamically calculate metrics
  const stats = useMemo(() => {
    let totalSales = 0
    let totalCost = 0
    const totalOrders = orders.length

    orders.forEach(order => {
      totalSales += order.total
      
      // Calculate formulation costs for each item in the order
      order.items.forEach(item => {
        // Find product to read its production cost
        const product = products.find(p => p.id === item.id)
        const unitCost = product ? product.cost : (item.price * 0.45) // fallback to 45% cost
        totalCost += unitCost * item.quantity
      })
    })

    const totalProfit = totalSales - totalCost
    const marginPercentage = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0

    return {
      totalSales,
      totalCost,
      totalProfit,
      marginPercentage,
      averageTicket,
      totalOrders
    }
  }, [orders, products])

  // Historical chart data
  const monthlyData = [
    { name: 'Feb', Ingresos: 28000, Costos: 12600, Utilidad: 15400 },
    { name: 'Mar', Ingresos: 35000, Costos: 15750, Utilidad: 19250 },
    { name: 'Abr', Ingresos: 30000, Costos: 13500, Utilidad: 16500 },
    { name: 'May', Ingresos: 42000, Costos: 18900, Utilidad: 23100 },
    { name: 'Jun', Ingresos: 48290, Costos: 21730, Utilidad: 26560 },
    { name: 'Jul', Ingresos: stats.totalSales || 12000, Costos: stats.totalCost || 5400, Utilidad: stats.totalProfit || 6600 },
  ]

  // CSV Excel export simulation
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error('No hay pedidos registrados para exportar')
      return
    }

    // Generate CSV contents
    const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Email', 'Metodo Entrega', 'Metodo Pago', 'Subtotal', 'Descuento', 'Envio', 'Total', 'Estado']
    const rows = orders.map(o => [
      o.id,
      o.date,
      o.customerName,
      o.customerEmail,
      o.deliveryMethod,
      o.paymentMethod,
      o.subtotal.toFixed(2),
      o.discount.toFixed(2),
      o.shipping.toFixed(2),
      o.total.toFixed(2),
      o.status
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `reporte_ventas_vivo_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Reporte Excel (CSV) descargado con éxito')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8 print:p-0 print:bg-white">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Informes Financieros</h1>
          <p className="text-xs text-muted-foreground">Analiza el rendimiento comercial, costos de formulación y rentabilidad de producción.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="rounded-xl flex items-center gap-1.5 text-xs font-bold">
            <Printer className="h-4.5 w-4.5" />
            Imprimir Reporte
          </Button>
          <Button onClick={handleExportCSV} className="rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-md shadow-primary/10">
            <FileSpreadsheet className="h-4.5 w-4.5" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total revenue */}
        <div className="bg-background border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">Ventas Totales (Facturado)</span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground block">Bs. {stats.totalSales.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-1.5">Monto bruto acumulado</span>
          </div>
        </div>

        {/* Formulation Costs */}
        <div className="bg-background border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">Costos de Formulación</span>
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground block">Bs. {stats.totalCost.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-1.5">Insumos químicos y envases</span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-background border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">Margen de Utilidad Bruta</span>
            <div className="p-2.5 rounded-xl bg-chart-3/15 text-chart-3">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground block">{stats.marginPercentage.toFixed(1)}%</span>
            <span className="text-[10px] text-muted-foreground block mt-1.5">Utilidad Neta: Bs. {stats.totalProfit.toFixed(2)}</span>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-background border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-muted-foreground">Valor Ticket Promedio</span>
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-foreground block">Bs. {stats.averageTicket.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-1.5">Sobre {stats.totalOrders} pedidos totales</span>
          </div>
        </div>

      </div>

      {/* Profitability Chart (AreaChart) */}
      <div className="bg-background border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-foreground">Análisis Mensual de Rendimiento</h3>
            <p className="text-[10px] text-muted-foreground">Comparativa de ingresos de facturación vs costos e insumos de producción</p>
          </div>
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Últimos 6 meses
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `Bs.${v}`} />
              <Tooltip formatter={(v) => [`Bs. ${v}`]} contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Ingresos" stroke="#0284c7" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} />
              <Area type="monotone" dataKey="Utilidad" stroke="#10b981" fillOpacity={1} fill="url(#colorUtilidad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
