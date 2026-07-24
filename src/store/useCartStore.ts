import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from './useSettingsStore'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  sku: string
  presentation: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getDiscount: () => number
  getShippingCost: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },
      
      getDiscount: () => {
        const subtotal = get().getSubtotal()
        const settings = useSettingsStore.getState()
        if (subtotal >= settings.volumeDiscountMin) {
          return subtotal * (settings.volumeDiscountPercent / 100)
        }
        return 0
      },
      
      getShippingCost: () => {
        const subtotal = get().getSubtotal()
        const settings = useSettingsStore.getState()
        if (subtotal === 0 || subtotal >= settings.freeShippingMin) {
          return 0
        }
        return settings.shippingCostDefault
      },
      
      getTotal: () => {
        return get().getSubtotal() - get().getDiscount() + get().getShippingCost()
      },
    }),
    {
      name: 'vivo-cart-storage',
    }
  )
)
