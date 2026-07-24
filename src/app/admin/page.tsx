import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardView from '@/components/admin/DashboardView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Administrador | Industrias Vivo',
  description: 'Estadísticas, reportes, inventario y control de cotizaciones e-commerce de Industrias Vivo.',
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardView />
    </AdminLayout>
  )
}
