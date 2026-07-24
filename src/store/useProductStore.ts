import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Category, Brand, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/types/product.types'

interface ProductStoreState {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  duplicateProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  toggleCategoryStatus: (id: string) => void
  addBrand: (brand: Omit<Brand, 'id'>) => void
  updateBrand: (id: string, brand: Partial<Brand>) => void
  deleteBrand: (id: string) => void
  toggleBrandStatus: (id: string) => void
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      categories: MOCK_CATEGORIES,
      brands: MOCK_BRANDS,

      addProduct: (prod) => {
        const id = `prod-${Date.now()}`
        const newProduct: Product = {
          ...prod,
          id,
        }
        set({ products: [newProduct, ...get().products] })
      },

      updateProduct: (id, updatedFields) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
        })
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) })
      },

      duplicateProduct: (id) => {
        const target = get().products.find(p => p.id === id)
        if (!target) return
        const newId = `prod-${Date.now()}`
        const cloned: Product = {
          ...target,
          id: newId,
          name: `${target.name} (Copia)`,
          sku: `${target.sku}-COPY`
        }
        set({ products: [cloned, ...get().products] })
      },

      toggleProductStatus: (id) => {
        set({
          products: get().products.map(p =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
          )
        })
      },

      addCategory: (cat) => {
        const id = `cat-${Date.now()}`
        set({ categories: [...get().categories, { ...cat, id }] })
      },

      updateCategory: (id, updatedFields) => {
        set({
          categories: get().categories.map(c => c.id === id ? { ...c, ...updatedFields } : c)
        })
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter(c => c.id !== id) })
      },

      toggleCategoryStatus: (id) => {
        set({
          categories: get().categories.map(c =>
            c.id === id ? { ...c, active: !c.active } : c
          )
        })
      },

      addBrand: (brand) => {
        const id = `brand-${Date.now()}`
        set({ brands: [...get().brands, { ...brand, id }] })
      },

      updateBrand: (id, updatedFields) => {
        set({
          brands: get().brands.map(b => b.id === id ? { ...b, ...updatedFields } : b)
        })
      },

      deleteBrand: (id) => {
        set({ brands: get().brands.filter(b => b.id !== id) })
      },

      toggleBrandStatus: (id) => {
        set({
          brands: get().brands.map(b =>
            b.id === id ? { ...b, active: !b.active } : b
          )
        })
      }
    }),
    {
      name: 'vivo-global-products-storage'
    }
  )
)
