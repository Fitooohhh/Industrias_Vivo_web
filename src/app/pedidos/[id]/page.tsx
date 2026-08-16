import { Metadata } from 'next'
import OrderTrackingClient from './OrderTrackingClient'

export const metadata: Metadata = {
  title: 'Seguimiento de Pedido | Industrias Vivo',
  description: 'Rastrea tu pedido en tiempo real. Ve la ubicación de tu repartidor y el estado de tu entrega.',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoTrackingPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <OrderTrackingClient orderId={id} />
    </div>
  )
}