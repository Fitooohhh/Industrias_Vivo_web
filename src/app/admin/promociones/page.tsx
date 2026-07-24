import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import PromotionsAdminView from '@/components/admin/PromotionsAdminView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Promociones | Panel Administrador',
  description: 'Administración de campañas comerciales, cupones, 2x1 e incentivos de e-commerce.',
}

export default function AdminPromocionesPage() {
  return (
    <AdminLayout>
      <PromotionsAdminView />
    </AdminLayout>
  )
}
