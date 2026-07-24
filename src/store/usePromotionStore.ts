import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Promotion {
  id: string
  name: string
  description: string
  type: 'percentage' | 'flat' | '2x1' | 'free_shipping'
  value: number
  startDate: string
  endDate: string
  active: boolean
}

interface PromotionState {
  promotions: Promotion[]
  addPromotion: (promo: Omit<Promotion, 'id'>) => void
  updatePromotion: (id: string, promo: Partial<Promotion>) => void
  deletePromotion: (id: string) => void
  togglePromotionStatus: (id: string) => void
}

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set, get) => ({
      promotions: [
        {
          id: 'promo-1',
          name: 'Descuento de Temporada',
          description: '10% de descuento directo en compras mayores a 200 Bs.',
          type: 'percentage',
          value: 10,
          startDate: '2026-07-01',
          endDate: '2026-08-31',
          active: true
        },
        {
          id: 'promo-2',
          name: 'Envío Gratis de Fábrica',
          description: 'Envío gratuito por compras que superen los 150 Bs. en toda la ciudad.',
          type: 'free_shipping',
          value: 0,
          startDate: '2026-06-01',
          endDate: '2026-12-31',
          active: true
        }
      ],

      addPromotion: (promo) => {
        const id = `promo-${Date.now()}`
        set({ promotions: [...get().promotions, { ...promo, id }] })
      },

      updatePromotion: (id, updatedFields) => {
        set({
          promotions: get().promotions.map(p => p.id === id ? { ...p, ...updatedFields } : p)
        })
      },

      deletePromotion: (id) => {
        set({ promotions: get().promotions.filter(p => p.id !== id) })
      },

      togglePromotionStatus: (id) => {
        set({
          promotions: get().promotions.map(p =>
            p.id === id ? { ...p, active: !p.active } : p
          )
        })
      }
    }),
    {
      name: 'vivo-promotions-storage'
    }
  )
)
