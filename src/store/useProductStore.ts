import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Category, Brand, BranchStock, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/types/product.types'

interface ProductStoreState {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  updateBranchStock: (productId: string, branchId: keyof BranchStock, newStock: number) => void
  transferBranchStock: (productId: string, fromBranchId: keyof BranchStock, toBranchId: keyof BranchStock, quantity: number) => void
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

      updateBranchStock: (productId, branchId, newStock) => {
        set({
          products: get().products.map((p) => {
            if (p.id !== productId) return p
            const currentBranches: BranchStock = p.branchesStock || {
              'cocha-1': Math.floor(p.stock * 0.3),
              'cocha-2': Math.floor(p.stock * 0.2),
              'sucre-1': Math.floor(p.stock * 0.2),
              'sucre-2': Math.floor(p.stock * 0.15),
              'sucre-3': Math.floor(p.stock * 0.15)
            }
            const updatedBranches = { ...currentBranches, [branchId]: Math.max(0, newStock) }
            const totalStock = Object.values(updatedBranches).reduce((a, b) => a + b, 0)
            return {
              ...p,
              stock: totalStock,
              branchesStock: updatedBranches
            }
          })
        })
      },

      transferBranchStock: (productId, fromBranchId, toBranchId, quantity) => {
        set({
          products: get().products.map((p) => {
            if (p.id !== productId) return p
            const currentBranches: BranchStock = p.branchesStock || {
              'cocha-1': Math.floor(p.stock * 0.3),
              'cocha-2': Math.floor(p.stock * 0.2),
              'sucre-1': Math.floor(p.stock * 0.2),
              'sucre-2': Math.floor(p.stock * 0.15),
              'sucre-3': Math.floor(p.stock * 0.15)
            }
            const availableInFrom = currentBranches[fromBranchId] || 0
            const actualQty = Math.min(availableInFrom, Math.max(0, quantity))
            
            const updatedBranches: BranchStock = {
              ...currentBranches,
              [fromBranchId]: availableInFrom - actualQty,
              [toBranchId]: (currentBranches[toBranchId] || 0) + actualQty
            }
            const totalStock = Object.values(updatedBranches).reduce((a, b) => a + b, 0)
            return {
              ...p,
              stock: totalStock,
              branchesStock: updatedBranches
            }
          })
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
