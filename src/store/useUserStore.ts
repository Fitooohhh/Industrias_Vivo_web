import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserAddress {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lng: number
}

interface UserState {
  addresses: UserAddress[]
  favoriteIds: string[]
  addAddress: (address: Omit<UserAddress, 'id'>) => void
  removeAddress: (id: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      addresses: [
        {
          id: 'addr-1',
          name: 'Casa Principal',
          address: 'Av. Banzer entre 3er y 4to anillo, Calle Mapiri #15',
          city: 'Santa Cruz',
          lat: -17.7654,
          lng: -63.1789
        }
      ],
      favoriteIds: [],

      addAddress: (addr) => {
        const id = `addr-${Date.now()}`
        set({ addresses: [...get().addresses, { ...addr, id }] })
      },

      removeAddress: (id) => {
        set({ addresses: get().addresses.filter(a => a.id !== id) })
      },

      toggleFavorite: (productId) => {
        const current = get().favoriteIds
        if (current.includes(productId)) {
          set({ favoriteIds: current.filter(id => id !== productId) })
        } else {
          set({ favoriteIds: [...current, productId] })
        }
      },

      isFavorite: (productId) => {
        return get().favoriteIds.includes(productId)
      }
    }),
    {
      name: 'vivo-user-storage'
    }
  )
)
