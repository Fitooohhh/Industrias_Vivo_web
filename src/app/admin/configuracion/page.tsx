import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import SettingsAdminView from '@/components/admin/SettingsAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración Global | Panel Administrador',
  description: 'Ajuste de parámetros comerciales, números de contacto corporativos y soporte.',
}

export default function AdminConfiguracionPage() {
  return (
    <AdminLayout>
      <SettingsAdminView />
    </AdminLayout>
  )
}
