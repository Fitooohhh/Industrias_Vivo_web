'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  CheckCircle, 
  MapPin, 
  Truck, 
  CreditCard, 
  QrCode, 
  Upload, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Store,
  FileText,
  Printer,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useAppStore } from '@/store/useAppStore'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Validation Schemas
const checkoutSchema = zod.object({
  addressId: zod.string().min(1, 'Debe seleccionar una dirección de entrega'),
  deliveryMethod: zod.enum(['pickup', 'delivery']),
  paymentMethod: zod.enum(['cash', 'card', 'qr']),
  // Card details (optional based on selection)
  cardNumber: zod.string().optional(),
  cardExpiry: zod.string().optional(),
  cardCvv: zod.string().optional(),
  // QR details (optional based on selection)
  qrProof: zod.any().optional()
})

type CheckoutFormValues = zod.infer<typeof checkoutSchema>

export default function CheckoutClient() {
  const { city } = useAppStore()
  const { items, getSubtotal, getDiscount, getShippingCost, getTotal, clearCart } = useCartStore()
  const { addresses } = useUserStore()
  const { user } = useAuthStore()
  const { addOrder } = useOrdersStore()

  // State
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState<string>(city === 'cochabamba' ? 'cocha-1' : 'sucre-1')
  const [orderCompleted, setOrderCompleted] = useState<any>(null)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [mounted, setMounted] = useState(false)

  // Forms
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: addresses[0]?.id || '',
      deliveryMethod: 'delivery',
      paymentMethod: 'cash'
    }
  })

  const watchDeliveryMethod = watch('deliveryMethod')
  const watchPaymentMethod = watch('paymentMethod')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex items-center justify-center">
        <span className="text-sm font-semibold text-muted-foreground">Cargando Checkout...</span>
      </div>
    )
  }

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-foreground">Tu carrito está vacío</h2>
        <p className="text-muted-foreground text-sm">No puedes realizar el pago sin productos en tu carrito.</p>
        <Link href="/catalogo">
          <Button className="rounded-xl">Ir al Catálogo</Button>
        </Link>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = watchDeliveryMethod === 'pickup' ? 0 : getShippingCost()
  const total = subtotal - discount + shipping

  // Handle File Input for QR Code proof
  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0])
      toast.success('Comprobante de pago QR seleccionado')
    }
  }

  const onCheckoutSubmit = async (data: CheckoutFormValues) => {
    // Basic conditional validation
    if (data.paymentMethod === 'card') {
      if (!data.cardNumber || !data.cardExpiry || !data.cardCvv) {
        toast.error('Por favor complete los datos de su tarjeta de crédito/débito')
        return
      }
    }
    if (data.paymentMethod === 'qr' && !qrFile) {
      toast.error('Debe subir una fotografía del comprobante de transferencia QR')
      return
    }

    // Process order simulation
    toast.loading('Procesando tu pedido, por favor espera...', { id: 'checkout-load' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.dismiss('checkout-load')

    const addressStr = data.deliveryMethod === 'delivery' 
      ? addresses.find(a => a.id === data.addressId)?.address || 'Dirección no especificada'
      : 'Showroom Parque Industrial, Santa Cruz'

    const orderId = addOrder({
      customerName: `${user?.name} ${user?.lastName}`,
      customerEmail: user?.email || '',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        presentation: item.presentation,
        quantity: item.quantity
      })),
      subtotal,
      discount,
      shipping,
      total,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      address: addressStr,
      observations: data.paymentMethod === 'qr' ? 'Comprobante de transferencia QR adjunto.' : 'Pago en efectivo contra entrega.'
    })

    setOrderCompleted({
      id: orderId,
      items: [...items],
      subtotal,
      discount,
      shipping,
      total,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      address: { name: user?.name, address: addressStr, city: 'Santa Cruz' },
      status: data.paymentMethod === 'cash' ? 'recibido' : 'pendiente_pago'
    })
    
    // Clear shopping cart
    clearCart()
    toast.success('¡Pedido procesado con éxito!')
  }

  const handlePrint = () => {
    window.print()
  }

  // Render Completed screen
  if (orderCompleted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-6 print:p-0">
        <div className="border bg-background rounded-3xl p-6 md:p-10 shadow-xl space-y-6 text-center print:border-0 print:shadow-none">
          <div className="inline-flex p-3 rounded-full bg-chart-3/15 text-chart-3 mb-2 animate-bounce print:hidden">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-foreground">¡Gracias por tu Compra!</h1>
          <p className="text-sm text-muted-foreground print:hidden">
            Tu pedido ha sido recibido y ya se encuentra registrado en nuestro sistema de distribución de fábrica.
          </p>

          {/* Receipt Content */}
          <div className="border rounded-2xl p-6 text-left space-y-4 bg-muted/20">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs text-muted-foreground block">Código de Pedido</span>
                <span className="font-mono font-bold text-primary text-lg">{orderCompleted.id}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Estado del Pedido</span>
                <span className="text-xs font-bold text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-full uppercase">
                  {orderCompleted.status}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 text-sm border-b pb-3">
              <span className="text-xs font-bold uppercase text-muted-foreground block">Datos de Entrega</span>
              <span className="font-bold text-foreground block">{orderCompleted.address.name}</span>
              <span className="text-muted-foreground block text-xs">{orderCompleted.address.address}, {orderCompleted.address.city}</span>
            </div>

            {/* Items */}
            <div className="space-y-2 border-b pb-3">
              <span className="text-xs font-bold uppercase text-muted-foreground block">Productos</span>
              <div className="divide-y divide-muted">
                {orderCompleted.items.map((item: any) => (
                  <div key={item.id} className="py-2 flex justify-between text-xs">
                    <span>{item.name} ({item.presentation}) x{item.quantity}</span>
                    <span className="font-bold">Bs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">Bs. {orderCompleted.subtotal.toFixed(2)}</span>
              </div>
              {orderCompleted.discount > 0 && (
                <div className="flex justify-between text-chart-3">
                  <span>Descuento por Volumen</span>
                  <span className="font-bold">- Bs. {orderCompleted.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-bold text-foreground">
                  {orderCompleted.shipping === 0 ? 'Gratuito' : `Bs. ${orderCompleted.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm text-foreground font-black">
                <span>Total Facturado</span>
                <span>Bs. {orderCompleted.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t print:hidden justify-center">
            <Button onClick={handlePrint} variant="outline" className="rounded-xl flex items-center gap-2">
              <Printer className="h-4.5 w-4.5" />
              Imprimir Comprobante
            </Button>
            <Link href="/perfil">
              <Button className="rounded-xl flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5" />
                Seguimiento de Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Wizard Form Column */}
        <div className="lg:col-span-8 bg-background border rounded-3xl p-6 md:p-8 shadow-xl">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-black text-foreground">Proceso de Pago Seguro</h2>
            <div className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
              Paso {currentStep} de 3
            </div>
          </div>

          <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-6">
            
            {/* Step 1: Dirección y Envío */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Método y Dirección de Entrega</h3>
                  <p className="text-xs text-muted-foreground">Indica cómo prefieres recibir tus productos de limpieza.</p>
                </div>

                {/* Delivery Method Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('deliveryMethod', 'delivery')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border font-bold transition-all ${
                      watchDeliveryMethod === 'delivery'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Truck className="h-5 w-5" />
                    <span>Envío a Domicilio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('deliveryMethod', 'pickup')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border font-bold transition-all ${
                      watchDeliveryMethod === 'pickup'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Store className="h-5 w-5" />
                    <span>Retiro en Fábrica</span>
                  </button>
                </div>

                {/* Conditional fields based on Delivery Method */}
                {watchDeliveryMethod === 'delivery' ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-muted-foreground">
                      Selecciona una Dirección Guardada
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {addresses.map(addr => (
                        <button
                          type="button"
                          key={addr.id}
                          onClick={() => setValue('addressId', addr.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                            watch('addressId') === addr.id
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm block">{addr.name}</span>
                            <span className="text-xs text-muted-foreground block">{addr.address}, {addr.city}</span>
                          </div>
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            watch('addressId') === addr.id ? 'border-primary bg-primary' : ''
                          }`}>
                            {watch('addressId') === addr.id && <span className="h-2 w-2 rounded-full bg-background" />}
                          </div>
                        </button>
                      ))}
                      {addresses.length === 0 && (
                        <div className="text-center p-6 border-2 border-dashed rounded-xl space-y-3">
                          <p className="text-xs text-muted-foreground">No tienes ninguna dirección registrada.</p>
                          <Link href="/perfil">
                            <Button size="sm" variant="outline">Configurar Dirección</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    {errors.addressId && <span className="text-xs text-destructive">{errors.addressId.message}</span>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-muted-foreground">
                      Selecciona la Tienda para Recoger en {city === 'cochabamba' ? 'Cochabamba' : 'Sucre'}
                    </label>
                    
                    {city === 'cochabamba' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedBranch('cocha-1')}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selectedBranch === 'cocha-1'
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <span className="font-extrabold text-sm block">Tienda 1</span>
                          <span className="text-[10px] text-chart-3 font-bold block mt-2">✓ Stock disponible para recojo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedBranch('cocha-2')}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selectedBranch === 'cocha-2'
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <span className="font-extrabold text-sm block">Tienda 2</span>
                          <span className="text-[10px] text-chart-3 font-bold block mt-2">✓ Stock disponible para recojo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedBranch('sucre-1')}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selectedBranch === 'sucre-1'
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <span className="font-extrabold text-sm block">Tienda 1</span>
                          <span className="text-[10px] text-chart-3 font-bold block mt-2">✓ Stock disponible</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedBranch('sucre-2')}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selectedBranch === 'sucre-2'
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <span className="font-extrabold text-sm block">Tienda 2</span>
                          <span className="text-[10px] text-chart-3 font-bold block mt-2">✓ Stock disponible</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedBranch('sucre-3')}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selectedBranch === 'sucre-3'
                              ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                              : 'bg-background hover:bg-muted text-foreground'
                          }`}
                        >
                          <span className="font-extrabold text-sm block">Tienda 3</span>
                          <span className="text-[10px] text-chart-3 font-bold block mt-2">✓ Stock disponible</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <Button type="button" onClick={() => setCurrentStep(2)} className="rounded-xl font-bold">
                    Continuar al Pago
                    <ChevronRight className="ml-1 h-4.5 w-4.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Método de Pago */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Método de Pago</h3>
                  <p className="text-xs text-muted-foreground">Selecciona el canal de pago de tu preferencia.</p>
                </div>

                {/* Payment Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'cash')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border gap-2 font-bold transition-all h-24 ${
                      watchPaymentMethod === 'cash'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Store className="h-5 w-5" />
                    <span className="text-xs">Efectivo / Entrega</span>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'card')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border gap-2 font-bold transition-all h-24 ${
                      watchPaymentMethod === 'card'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Tarjeta de Crédito</span>
                  </button>

                  {/* QR */}
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'qr')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border gap-2 font-bold transition-all h-24 ${
                      watchPaymentMethod === 'qr'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <QrCode className="h-5 w-5" />
                    <span className="text-xs">Pago código QR</span>
                  </button>
                </div>

                {/* Cash Info */}
                {watchPaymentMethod === 'cash' && (
                  <div className="p-4 border rounded-xl bg-muted/40 text-xs text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground mb-1">Pago contra entrega / al retirar</p>
                    Puedes pagar en efectivo o mediante tarjeta al momento de recibir tus productos a domicilio o al retirarlos en nuestro showroom del Parque Industrial.
                  </div>
                )}

                {/* Card Fields Simulation */}
                {watchPaymentMethod === 'card' && (
                  <div className="border p-4 rounded-xl space-y-4 bg-muted/20">
                    <span className="text-xs font-bold text-foreground block uppercase">Datos de la Tarjeta</span>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Número de Tarjeta</label>
                      <input
                        {...register('cardNumber')}
                        placeholder="4557 0000 0000 0000"
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Expiración</label>
                        <input
                          {...register('cardExpiry')}
                          placeholder="MM/AA"
                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">CVV</label>
                        <input
                          {...register('cardCvv')}
                          placeholder="123"
                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Fields Upload */}
                {watchPaymentMethod === 'qr' && (
                  <div className="border p-6 rounded-xl bg-muted/20 text-center space-y-4 flex flex-col items-center">
                    <span className="text-xs font-bold text-foreground uppercase block self-start">Pago Electrónico por QR</span>
                    
                    {/* Simulated QR graphic */}
                    <div className="p-3 bg-white rounded-xl border shadow-md w-40 h-40 flex items-center justify-center">
                      <QrCode className="h-32 w-32 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Escanea el código QR desde tu aplicación bancaria móvil para transferir, luego sube la captura de pantalla del comprobante abajo.
                    </p>

                    {/* File Upload Field */}
                    <div className="w-full max-w-xs">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-primary/5 border-primary/25 bg-background transition-all">
                        <Upload className="h-6 w-6 text-primary mb-1 animate-pulse" />
                        <span className="text-xs font-bold block text-foreground">
                          {qrFile ? qrFile.name : 'Subir Comprobante (Captura)'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-between pt-6 border-t">
                  <Button type="button" variant="ghost" onClick={() => setCurrentStep(1)} className="rounded-xl">
                    <ArrowLeft className="mr-1 h-5 w-5" />
                    Atrás
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(3)} className="rounded-xl font-bold">
                    Resumen Final
                    <ChevronRight className="ml-1 h-4.5 w-4.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Resumen Final y Envío */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Revisión y Confirmación</h3>
                  <p className="text-xs text-muted-foreground">Verifica toda la información de entrega y de facturación antes de confirmar.</p>
                </div>

                <div className="border rounded-2xl p-5 space-y-4 bg-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-0.5">Destinatario</span>
                      <span className="font-bold text-foreground capitalize">{user?.name} {user?.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-0.5">Contacto</span>
                      <span className="font-bold text-foreground">{user?.phone}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t pt-3">
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-0.5">Destino de Entrega</span>
                      <span className="font-bold text-foreground">
                        {watchDeliveryMethod === 'pickup' 
                          ? 'Showroom Parque Industrial' 
                          : addresses.find(a => a.id === watch('addressId'))?.address || 'No seleccionada'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-0.5">Canal de Pago</span>
                      <span className="font-bold text-foreground capitalize">
                        {watchPaymentMethod === 'cash' ? 'Efectivo contra entrega' : watchPaymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Transferencia por QR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-between pt-6 border-t">
                  <Button type="button" variant="ghost" onClick={() => setCurrentStep(2)} className="rounded-xl">
                    <ArrowLeft className="mr-1 h-5 w-5" />
                    Atrás
                  </Button>
                  <Button type="submit" className="rounded-xl font-bold px-6 shadow-md shadow-primary/10">
                    Confirmar Compra
                  </Button>
                </div>
              </motion.div>
            )}

          </form>
        </div>

        {/* Floating Cart Order Details Summary Column (Desktop) */}
        <div className="lg:col-span-4 border rounded-3xl p-6 bg-background shadow-xl space-y-6">
          <h3 className="font-bold text-lg border-b pb-3">Tu Pedido</h3>
          
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2 divide-y">
            {items.map(item => (
              <div key={item.id} className="pt-2 flex justify-between text-xs items-center">
                <div className="max-w-[70%]">
                  <span className="font-semibold block line-clamp-1">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground block">Cant: {item.quantity} | {item.presentation}</span>
                </div>
                <span className="font-bold">Bs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-foreground">Bs. {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-chart-3 bg-chart-3/5 px-2 py-0.5 rounded">
                <span>Descuento Volumen</span>
                <span className="font-bold">- Bs. {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-bold text-foreground">
                {shipping === 0 ? 'Gratuito' : `Bs. ${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm text-foreground font-black">
              <span>Total a pagar</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
