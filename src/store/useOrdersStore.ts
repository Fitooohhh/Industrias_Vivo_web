import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OrderItem {
  id: string
  name: string
  price: number
  presentation: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  deliveryMethod: 'pickup' | 'delivery'
  paymentMethod: 'cash' | 'card' | 'qr'
  address: string
  status: 'recibido' | 'pendiente_pago' | 'confirmado' | 'preparando' | 'en_camino' | 'listo_retiro' | 'entregado' | 'cancelado'
  date: string
  observations?: string
}

interface OrdersState {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => string
  updateOrderStatus: (id: string, status: Order['status'], observations?: string) => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'VIVO-482910',
          customerName: 'Juan Pérez',
          customerEmail: 'juan@correo.com',
          items: [
            { id: 'prod-1', name: 'Desinfectante Multiuso Lavanda', presentation: 'Galón (3.8 Litros)', price: 35.00, quantity: 2 },
            { id: 'prod-2', name: 'Detergente Líquido Activo', presentation: 'Botella de 3 Litros', price: 45.00, quantity: 1 }
          ],
          subtotal: 115.00,
          discount: 0,
          shipping: 15.00,
          total: 130.00,
          deliveryMethod: 'delivery',
          paymentMethod: 'qr',
          address: 'Av. Banzer entre 3er y 4to anillo, Calle Mapiri #15, Santa Cruz',
          status: 'pendiente_pago',
          date: '17/07/2026',
          observations: 'Comprobante de QR subido por el cliente. Pendiente de validación bancaria.'
        }
      ],

      addOrder: (order) => {
        const id = `VIVO-${Math.floor(100000 + Math.random() * 900000)}`
        const date = new Date().toLocaleDateString('es-ES')
        const newOrder: Order = {
          ...order,
          id,
          status: order.paymentMethod === 'cash' ? 'recibido' : 'pendiente_pago',
          date
        }
        set({ orders: [newOrder, ...get().orders] })
        return id
      },

      updateOrderStatus: (id, status, observations) => {
        set({
          orders: get().orders.map(o => 
            o.id === id 
              ? { ...o, status, observations: observations !== undefined ? observations : o.observations } 
              : o
          )
        })
      }
    }),
    {
      name: 'vivo-global-orders-storage'
    }
  )
)
