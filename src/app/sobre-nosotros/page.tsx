import React from 'react'
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection'
import AboutUsSection from '@/components/home/AboutUsSection'
import ContactSection from '@/components/home/ContactSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Industrias Vivo',
  description: 'Conoce nuestra historia, misión, visión, ventajas competitivas de fábrica y contáctanos.',
}

export default function SobreNosotrosPage() {
  return (
    <div className="w-full py-8 space-y-12">
      <AboutUsSection />
      <WhyChooseUsSection />
      <ContactSection />
    </div>
  )
}
