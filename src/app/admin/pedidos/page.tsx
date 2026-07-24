import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import OrdersAdminView from '@/components/admin/OrdersAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Pedidos | Panel Administrador',
  description: 'Seguimiento de compras, actualización de estados de despacho y validación de cobros QR.',
}

export default function AdminPedidosPage() {
  return (
    <AdminLayout>
      <OrdersAdminView />
    </AdminLayout>
  )
}
