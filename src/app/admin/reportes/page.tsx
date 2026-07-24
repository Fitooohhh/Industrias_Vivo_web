import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ReportsView from '@/components/admin/ReportsView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informes Financieros | Panel Administrador',
  description: 'Auditoría de ingresos de facturación, márgenes de utilidad y reportes exportables.',
}

export default function AdminReportesPage() {
  return (
    <AdminLayout>
      <ReportsView />
    </AdminLayout>
  )
}
