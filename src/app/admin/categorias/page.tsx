import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CategoriesAdminView from '@/components/admin/CategoriesAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Categorías | Panel Administrador',
  description: 'Administración de las categorías químicas del catálogo comercial de Industrias Vivo.',
}

export default function AdminCategoriasPage() {
  return (
    <AdminLayout>
      <CategoriesAdminView />
    </AdminLayout>
  )
}
