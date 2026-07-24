import React from 'react'
import { notFound } from 'next/navigation'
import { ProductsService } from '@/services/products.service'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = ProductsService.getProductById(id)
  
  if (!product) {
    return {
      title: 'Producto no encontrado | Industrias Vivo',
    }
  }

  return {
    title: `${product.name} | Industrias Vivo`,
    description: product.description,
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = await params
  const product = ProductsService.getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
