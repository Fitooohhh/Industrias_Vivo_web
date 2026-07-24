'use client'

import React from 'react'
import { 
  TrendingUp, 
  ShoppingBag, 
  PackageOpen, 
  FileSpreadsheet, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts'

export default function DashboardView() {
  
  // Simulated KPI numbers
  const kpis = [
    { name: 'Ventas Mensuales', value: 'Bs. 48,290.00', icon: TrendingUp, change: '+12.4%', up: true, desc: 'vs. mes anterior' },
    { name: 'Pedidos Activos', value: '18', icon: ShoppingBag, change: '+3', up: true, desc: 'para despacho' },
    { name: 'Cotizaciones Pendientes', value: '4', icon: FileSpreadsheet, change: '-1', up: false, desc: 'por responder' },
    { name: 'Alertas de Stock Bajo', value: '2', icon: AlertTriangle, change: 'Revisar', up: false, desc: 'productos sin stock' },
  ]

  // Data for Sales Chart
  const salesData = [
    { name: 'Ene', Ventas: 24000 },
    { name: 'Feb', Ventas: 28000 },
    { name: 'Mar', Ventas: 35000 },
    { name: 'Abr', Ventas: 30000 },
    { name: 'May', Ventas: 42000 },
    { name: 'Jun', Ventas: 48290 },
  ]

  // Data for Category Share Chart
  const categoryData = [
    { name: 'Desinfectantes', value: 400 },
    { name: 'Detergentes', value: 300 },
    { name: 'Multiusos', value: 200 },
    { name: 'Industrial', value: 500 },
  ]

  const COLORS = ['#0284c7', '#38bdf8', '#10b981', '#4f46e5']

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard General</h1>
        <p className="text-xs text-muted-foreground">Monitorea las ventas, pedidos, cotizaciones e inventario de Industrias Vivo.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.name} className="bg-background border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground">{kpi.name}</span>
                <div className={`p-2.5 rounded-xl ${
                  kpi.name.includes('Alertas') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">{kpi.value}</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-xs font-bold flex items-center ${
                    kpi.up ? 'text-chart-3' : 'text-destructive'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{kpi.desc}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales Chart (BarChart) */}
        <div className="lg:col-span-8 bg-background border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-bold text-foreground">Volumen de Ventas (Bs)</h3>
              <p className="text-[10px] text-muted-foreground">Primer semestre del año actual</p>
            </div>
            <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
              <ArrowUpRight className="h-4 w-4 text-chart-3" />
              Directo Fábrica
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `Bs.${v}`} />
                <Tooltip formatter={(v) => [`Bs. ${v}`, 'Ventas']} contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="Ventas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Chart (PieChart) */}
        <div className="lg:col-span-4 bg-background border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-bold text-foreground">Participación por Categoría</h3>
            <p className="text-[10px] text-muted-foreground">Ventas por tipo de químicos</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} un.`, 'Vendido']} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  )
}
