import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductsAdminView from '@/components/admin/ProductsAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Productos | Panel Administrador',
  description: 'Administración del catálogo de productos, SKU, inventario y precios de Industrias Vivo.',
}

export default function AdminProductosPage() {
  return (
    <AdminLayout>
      <ProductsAdminView />
    </AdminLayout>
  )
}
