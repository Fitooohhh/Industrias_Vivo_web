import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  freeShippingMin: number
  volumeDiscountMin: number
  volumeDiscountPercent: number
  whatsappNumber: string
  supportEmail: string
  shippingCostDefault: number
  updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      freeShippingMin: 150,
      volumeDiscountMin: 200,
      volumeDiscountPercent: 10,
      whatsappNumber: '+59177112500',
      supportEmail: 'contacto@industriasvivo.com',
      shippingCostDefault: 15,

      updateSettings: (newSettings) => {
        set((state) => ({ ...state, ...newSettings }))
      }
    }),
    {
      name: 'vivo-global-settings-storage'
    }
  )
)
