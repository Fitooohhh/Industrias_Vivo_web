import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserMode = 'hogar' | 'empresas'
export type SelectedCity = 'cochabamba' | 'sucre'

interface AppState {
  mode: UserMode
  setMode: (mode: UserMode) => void
  city: SelectedCity
  setCity: (city: SelectedCity) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'hogar',
      setMode: (mode) => set({ mode }),
      city: 'cochabamba',
      setCity: (city) => set({ city }),
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'light' ? 'dark' : 'light'
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(nextTheme)
          }
          return { theme: nextTheme }
        }),
    }),
    {
      name: 'vivo-app-storage',
    }
  )
)
