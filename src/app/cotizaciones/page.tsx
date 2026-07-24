import React from 'react'
import QuotationForm from '@/components/quotes/QuotationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cotizaciones Empresariales | Industrias Vivo',
  description: 'Solicita cotizaciones al por mayor de nuestros productos químicos de limpieza para tu empresa, industria u hotel.',
}

export default function CotizacionesPage() {
  return <QuotationForm />
}
