import React from 'react'
import CheckoutClient from '@/components/checkout/CheckoutClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Finalizar Compra | Industrias Vivo',
  description: 'Procesa el pago de tus productos de limpieza de forma rápida y segura.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
