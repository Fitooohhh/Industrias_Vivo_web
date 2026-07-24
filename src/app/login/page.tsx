import React, { Suspense } from 'react'
import AuthForms from '@/components/auth/AuthForms'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Industrias Vivo',
  description: 'Inicia sesión o regístrate en la plataforma oficial de Industrias Vivo para gestionar tus cotizaciones, compras e inventario.',
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-radial from-secondary/20 via-background to-background min-h-[70vh]">
      <Suspense fallback={
        <div className="w-full max-w-md bg-background border rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-semibold text-muted-foreground">Cargando formulario...</span>
        </div>
      }>
        <AuthForms />
      </Suspense>
    </div>
  )
}
