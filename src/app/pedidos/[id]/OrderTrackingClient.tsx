'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  CreditCard, 
  User, 
  Clock, 
  Info,
  Phone,
  MessageSquare,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useOrderTracking } from '@/hooks/useOrderTracking'
import OrderTrackingMap from '@/components/orders/OrderTrackingMap'
import OrderTimeline from '@/components/orders/OrderTimeline'
import { toast } from 'sonner'

const STATUS_LABELS: Record<string, string> = {
  recibido: 'Recibido',
  pendiente_pago: 'Pendiente Pago',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  en_camino: 'En Camino',
  listo_retiro: 'Listo para Retiro',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  recibido: 'bg-blue-100 text-blue-800 border-blue-200',
  pendiente_pago: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  preparando: 'bg-orange-100 text-orange-800 border-orange-200',
  en_camino: 'bg-green-100 text-green-800 border-green-200',
  listo_retiro: 'bg-purple-100 text-purple-800 border-purple-200',
  entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  recibido: <Package className="h-4 w-4" />,
  pendiente_pago: <Clock className="h-4 w-4" />,
  confirmado: <CheckCircle2 className="h-4 w-4" />,
  preparando: <Truck className="h-4 w-4" />,
  en_camino: <Truck className="h-4 w-4" />,
  listo_retiro: <MapPin className="h-4 w-4" />,
  entregado: <CheckCircle2 className="h-4 w-4" />,
  cancelado: <Package className="h-4 w-4" />,
}

interface OrderTrackingClientProps {
  orderId: string
}

export default function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const {
    currentStatus,
    driverLocation,
    estimatedTime,
    driverInfo,
    timestamps,
    isTracking,
    storeLocation,
    deliveryAddress,
    order,
    startTracking,
  } = useOrderTracking(orderId)

  const [activeTab, setActiveTab] = useState<'tracking' | 'details'>('tracking')

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-background rounded-3xl border shadow-lg max-w-md mx-auto"
        >
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-black text-foreground mb-2">Pedido no encontrado</h2>
          <p className="text-muted-foreground text-sm mb-6">
            El pedido <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{orderId}</code> no existe en nuestro sistema.
          </p>
          <Link href="/perfil">
            <Button className="rounded-xl">Ver mis pedidos</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const isActiveTracking = ['confirmado', 'preparando', 'en_camino'].includes(currentStatus)
  const isDelivered = currentStatus === 'entregado'
  const isCancelled = currentStatus === 'cancelado'

  const handleCallDriver = () => {
    if (driverInfo?.phone) {
      window.open(`tel:${driverInfo.phone}`)
    }
  }

  const handleMessageDriver = () => {
    if (driverInfo?.phone) {
      window.open(`https://wa.me/${driverInfo.phone.replace(/\D/g, '')}?text=Hola%20${driverInfo.name}%2C%20consulta%20sobre%20mi%20pedido%20${orderId}`)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/perfil" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium text-sm hidden sm:inline">Volver</span>
            </Link>
            
            <div className="flex-1 text-center">
              <h1 className="font-black text-foreground text-lg">Seguimiento de Pedido</h1>
              <p className="text-xs text-muted-foreground">#{order.id}</p>
            </div>

            <div className="w-20" />
          </div>

          {/* Status Badge */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div
                key={currentStatus}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm uppercase tracking-wider ${STATUS_COLORS[currentStatus] || 'bg-muted text-muted-foreground border-muted'}`}
              >
                {STATUS_ICONS[currentStatus] || <Package className="h-4 w-4" />}
                <span>{STATUS_LABELS[currentStatus] || currentStatus}</span>
                {isActiveTracking && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-current animate-pulse"
                  />
                )}
              </motion.div>

              {isActiveTracking && estimatedTime !== 'Entregado' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>ETA: {estimatedTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna principal - Mapa y Timeline */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-1 bg-background rounded-xl p-1 border shadow-sm">
              <button
                onClick={() => setActiveTab('tracking')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'tracking'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Truck className="h-4.5 w-4.5" />
                Seguimiento
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'details'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Info className="h-4.5 w-4.5" />
                Detalles
              </button>
            </div>

            {/* Contenido Tracking */}
            {activeTab === 'tracking' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Mapa */}
                <div className="bg-background rounded-2xl border shadow-xl overflow-hidden">
                  <OrderTrackingMap
                    driverLocation={driverLocation}
                    deliveryAddress={deliveryAddress}
                    storeLocation={storeLocation}
                    status={currentStatus}
                    estimatedTime={estimatedTime}
                    driverName={driverInfo?.name || 'Asignando...'}
                    driverVehicle={driverInfo?.vehicle || ''}
                    onCallDriver={handleCallDriver}
                    onMessageDriver={handleMessageDriver}
                  />
                </div>

                {/* Timeline */}
                <div className="bg-background rounded-2xl border shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Progreso del Pedido
                    </h3>
                    {isTracking && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startTracking}
                        className="gap-1.5"
                      >
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Actualizar
                      </Button>
                    )}
                  </div>
                  <OrderTimeline
                    currentStatus={currentStatus}
                    timestamps={timestamps}
                  />
                </div>
              </motion.div>
            )}

            {/* Contenido Detalles */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Info del pedido */}
                <div className="bg-background rounded-2xl border shadow-xl p-6 space-y-6">
                  <h3 className="font-bold text-lg border-b pb-4">Información del Pedido</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow label="Fecha del pedido" value={order.date} />
                    <DetailRow label="Método de entrega" value={order.deliveryMethod === 'delivery' ? 'Envío a domicilio' : 'Retiro en fábrica'} />
                    <DetailRow label="Método de pago" value={order.paymentMethod === 'cash' ? 'Efectivo contra entrega' : order.paymentMethod === 'card' ? 'Tarjeta de crédito' : 'Transferencia QR'} />
                    <DetailRow label="Dirección" value={order.address} />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-sm mb-3">Productos</h4>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.presentation} • Cant: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm">Bs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Subtotal</p>
                      <p className="font-bold">Bs. {order.subtotal.toFixed(2)}</p>
                    </div>
                    {order.discount > 0 && (
                      <div className="text-chart-3">
                        <p className="text-muted-foreground">Descuento</p>
                        <p className="font-bold">- Bs. {order.discount.toFixed(2)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Envío</p>
                      <p className="font-bold">{order.shipping === 0 ? 'Gratuito' : `Bs. ${order.shipping.toFixed(2)}`}</p>
                    </div>
                    <div className="sm:col-span-2 border-t pt-3">
                      <p className="text-muted-foreground">Total pagado</p>
                      <p className="font-black text-lg">Bs. {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {order.observations && (
                    <div className="p-4 rounded-xl bg-muted/50 border text-sm">
                      <p className="font-bold mb-1">Observaciones</p>
                      <p className="text-muted-foreground">{order.observations}</p>
                    </div>
                  )}
                </div>

                {/* Info del repartidor */}
                {driverInfo && isActiveTracking && (
                  <div className="bg-background rounded-2xl border shadow-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Tu Repartidor
                    </h3>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{driverInfo.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Truck className="h-4 w-4" />{driverInfo.vehicle}</span>
                          <span className="flex items-center gap-1 text-warning"><CheckCircle2 className="h-3.5 w-3.5" />{driverInfo.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleMessageDriver} className="gap-1.5">
                          <MessageSquare className="h-4 w-4" />
                          Mensaje
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCallDriver} className="gap-1.5">
                          <Phone className="h-4 w-4" />
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones finales */}
                {(isDelivered || isCancelled) && (
                  <div className="bg-background rounded-2xl border shadow-xl p-6 text-center space-y-4">
                    <div className={`p-4 rounded-2xl inline-flex ${isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {isDelivered ? (
                        <CheckCircle2 className="h-10 w-10" />
                      ) : (
                        <Package className="h-10 w-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{isDelivered ? '¡Pedido Entregado!' : 'Pedido Cancelado'}</h3>
                      <p className="text-muted-foreground mt-1">
                        {isDelivered 
                          ? 'Gracias por confiar en Industrias Vivo. Tu pedido ha sido entregado exitosamente.'
                          : 'Tu pedido ha sido cancelado. Contacta soporte si necesitas ayuda.'}
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Link href="/perfil">
                        <Button variant="outline" className="rounded-xl">Ver Historial</Button>
                      </Link>
                      <Link href="/catalogo">
                        <Button className="rounded-xl">Seguir Comprando</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar - Resumen rápido */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card resumen */}
            <div className="bg-background rounded-2xl border shadow-xl p-6 space-y-4 sticky top-24">
              <h3 className="font-bold text-lg border-b pb-3">Resumen del Pedido</h3>
              
              <div className="space-y-3">
                {order.items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm">Bs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">+{order.items.length - 3} productos más</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">Bs. {order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-chart-3">
                    <span>Descuento</span>
                    <span className="font-bold">- Bs. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-bold">{order.shipping === 0 ? 'Gratuito' : `Bs. ${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-black">
                  <span>Total</span>
                  <span>Bs. {order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Estado actual destacado */}
              <div className={`p-4 rounded-xl border ${STATUS_COLORS[currentStatus] || 'bg-muted border-muted'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {STATUS_ICONS[currentStatus] || <Package className="h-5 w-5" />}
                    <span className="font-bold capitalize">{STATUS_LABELS[currentStatus] || currentStatus}</span>
                  </div>
                  {isActiveTracking && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="h-2.5 w-2.5 rounded-full bg-current"
                    />
                  )}
                </div>
                {estimatedTime !== 'Entregado' && isActiveTracking && (
                  <p className="mt-2 text-sm font-medium flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Llegada estimada: {estimatedTime}
                  </p>
                )}
              </div>
            </div>

            {/* Ayuda */}
            <div className="bg-background rounded-2xl border shadow-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                ¿Necesitas ayuda?
              </h3>
              <div className="space-y-3">
                <a href="tel:+59133333333" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                  <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-sm">Llamar a soporte</p>
                    <p className="text-xs text-muted-foreground">+591 3 333 3333</p>
                  </div>
                </a>
                <a href="https://wa.me/59177777777" target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                  <MessageSquare className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Atención 24/7</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur-sm mt-12">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground">
          <p>Industrias Vivo - Productos de limpieza directo de fábrica</p>
          <p className="mt-1">Tu pedido está en buenas manos 🚚</p>
        </div>
      </footer>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="p-4 rounded-xl bg-muted/30 border">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{label}</p>
      <p className="font-medium text-sm text-foreground">{value}</p>
    </div>
  )
}