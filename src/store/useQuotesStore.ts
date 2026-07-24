import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuoteItem {
  productId: string
  name: string
  presentation: string
  price: number
  quantity: number
}

export interface QuoteRequest {
  id: string
  company: string
  contactName: string
  email: string
  phone: string
  city: string
  notes?: string
  items: QuoteItem[]
  status: 'pending' | 'responded' | 'rejected'
  date: string
  totalEstimate: number
}

interface QuotesState {
  quotes: QuoteRequest[]
  addQuote: (quote: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => string
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void
}

export const useQuotesStore = create<QuotesState>()(
  persist(
    (set, get) => ({
      quotes: [
        {
          id: 'COT-928301',
          company: 'Hotel Santa Cruz S.A.',
          contactName: 'Carlos Mendizabal',
          email: 'mantenimiento@hotelsantacruz.com',
          phone: '+591 71020304',
          city: 'Santa Cruz',
          notes: 'Requerimos muestras de desengrasante para pisos antes de compra mayor.',
          items: [
            { productId: 'prod-4', name: 'Desengrasante Industrial Alcalino', presentation: 'Bidón de 20 Litros', price: 280.00, quantity: 5 },
            { productId: 'prod-5', name: 'Detergente Clorado Espumígeno', presentation: 'Bidón de 20 Litros', price: 310.00, quantity: 3 }
          ],
          status: 'pending',
          date: '15/07/2026',
          totalEstimate: 2330.00
        }
      ],

      addQuote: (quote) => {
        const id = `COT-${Math.floor(100000 + Math.random() * 900000)}`
        const date = new Date().toLocaleDateString('es-ES')
        const newQuote: QuoteRequest = {
          ...quote,
          id,
          status: 'pending',
          date
        }
        set({ quotes: [...get().quotes, newQuote] })
        return id
      },

      updateQuoteStatus: (id, status) => {
        set({
          quotes: get().quotes.map(q => q.id === id ? { ...q, status } : q)
        })
      }
    }),
    {
      name: 'vivo-quotes-storage'
    }
  )
)
