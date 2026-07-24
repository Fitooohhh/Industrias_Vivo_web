import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import InventoryAdminView from '@/components/admin/InventoryAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Control de Inventario | Panel Administrador',
  description: 'Bitácora de movimientos de almacén, entradas de producción y alertas de stock mínimo.',
}

export default function AdminInventarioPage() {
  return (
    <AdminLayout>
      <InventoryAdminView />
    </AdminLayout>
  )
}
