import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ClientsAdminView from '@/components/admin/ClientsAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Directorio de Clientes | Panel Administrador',
  description: 'Administración de perfiles de clientes, volumen acumulado de compras corporativas e historial comercial.',
}

export default function AdminClientesPage() {
  return (
    <AdminLayout>
      <ClientsAdminView />
    </AdminLayout>
  )
}
