import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useProductStore } from './useProductStore'

export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  type: 'entry' | 'exit' | 'adjustment'
  quantity: number
  reason: string
  date: string
  time: string
  user: string
}

interface InventoryState {
  movements: InventoryMovement[]
  registerMovement: (movement: Omit<InventoryMovement, 'id' | 'date' | 'time' | 'user'>) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      movements: [
        {
          id: 'mov-1',
          productId: 'prod-1',
          productName: 'Desinfectante Multiuso Lavanda',
          type: 'entry',
          quantity: 50,
          reason: 'Lote de producción finalizado - Fábrica principal',
          date: '17/07/2026',
          time: '08:30',
          user: 'Admin Juan'
        }
      ],

      registerMovement: (mov) => {
        const id = `mov-${Date.now()}`
        const now = new Date()
        const date = now.toLocaleDateString('es-ES')
        const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        const user = 'Admin Juan' // Simulado del admin activo

        const newMovement: InventoryMovement = {
          ...mov,
          id,
          date,
          time,
          user
        }

        // Reactively update stock in useProductStore!
        const productStore = useProductStore.getState()
        const targetProduct = productStore.products.find(p => p.id === mov.productId)
        
        if (targetProduct) {
          let nextStock = targetProduct.stock
          if (mov.type === 'entry') {
            nextStock += mov.quantity
          } else if (mov.type === 'exit') {
            nextStock = Math.max(0, nextStock - mov.quantity)
          } else if (mov.type === 'adjustment') {
            nextStock = mov.quantity // Set absolute quantity in case of adjustment
          }
          productStore.updateProduct(mov.productId, { stock: nextStock })
        }

        set({ movements: [newMovement, ...get().movements] })
      }
    }),
    {
      name: 'vivo-inventory-storage'
    }
  )
)
