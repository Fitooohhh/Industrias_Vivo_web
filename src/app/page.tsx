import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection'
import PromoSection from '@/components/home/PromoSection'

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedProductsSection />
      <PromoSection />
    </div>
  )
}
