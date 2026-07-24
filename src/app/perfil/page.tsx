import React from 'react'
import ProfileClient from '@/components/profile/ProfileClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Perfil | Industrias Vivo',
  description: 'Gestiona tus datos personales, direcciones de entrega reales con mapa integrado y revisa tu historial de compras.',
}

export default function PerfilPage() {
  return <ProfileClient />
}
