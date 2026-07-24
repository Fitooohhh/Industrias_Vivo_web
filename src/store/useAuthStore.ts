import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  lastName: string
  role: 'client' | 'admin'
  phone?: string
  company?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loginSimulated: (email: string, role: 'client' | 'admin') => void
  logoutSimulated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginSimulated: (email, role) => {
        const isDefaultAdmin = role === 'admin' || email.includes('admin')
        const name = isDefaultAdmin ? 'Administrador' : 'Juan'
        const lastName = isDefaultAdmin ? 'Vivo' : 'Pérez'
        
        set({
          user: {
            id: isDefaultAdmin ? 'admin-123' : 'client-456',
            email,
            name,
            lastName,
            role: isDefaultAdmin ? 'admin' : 'client',
            phone: '+591 70000000',
            company: isDefaultAdmin ? 'Industrias Vivo' : undefined,
          },
          isAuthenticated: true,
        })
      },
      logoutSimulated: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'vivo-auth-storage',
    }
  )
)
