import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserMode = 'hogar' | 'empresas'

interface AppState {
  mode: UserMode
  setMode: (mode: UserMode) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'hogar',
      setMode: (mode) => set({ mode }),
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
