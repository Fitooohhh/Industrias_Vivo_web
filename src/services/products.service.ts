import { useProductStore } from '@/store/useProductStore'
import { Product, Category, Brand, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/types/product.types'

export type { Product, Category, Brand }
export { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS }

export const ProductsService = {
  getProducts: (mode?: 'hogar' | 'empresas'): Product[] => {
    // Read from the global reactive Zustand store!
    const products = useProductStore.getState().products
    if (!mode) return products.filter(p => p.status === 'active')
    return products.filter(
      p => p.status === 'active' && (p.targetMode === mode || p.targetMode === 'both')
    )
  },

  getProductById: (id: string): Product | undefined => {
    const products = useProductStore.getState().products
    return products.find(p => p.id === id)
  },

  getFeaturedProducts: (mode?: 'hogar' | 'empresas'): Product[] => {
    const products = ProductsService.getProducts(mode)
    return products.filter(p => p.isFeatured)
  },

  getCategories: (): Category[] => {
    return useProductStore.getState().categories.filter(c => c.active)
  },

  getBrands: (): Brand[] => {
    return useProductStore.getState().brands.filter(b => b.active)
  }
}
