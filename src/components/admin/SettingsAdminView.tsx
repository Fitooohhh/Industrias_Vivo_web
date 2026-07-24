'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  Settings, 
  Save, 
  Truck, 
  Percent, 
  Phone, 
  Mail,
  Sliders
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/useSettingsStore'
import { toast } from 'sonner'

// Zod Schema
const settingsSchema = zod.object({
  freeShippingMin: zod.number().min(0, 'El valor mínimo no puede ser negativo'),
  volumeDiscountMin: zod.number().min(0, 'El valor mínimo no puede ser negativo'),
  volumeDiscountPercent: zod.number().min(0, 'El porcentaje no puede ser negativo').max(100, 'El porcentaje no puede superar 100'),
  shippingCostDefault: zod.number().min(0, 'El costo no puede ser negativo'),
  whatsappNumber: zod.string().min(8, 'El número de WhatsApp debe tener al menos 8 caracteres'),
  supportEmail: zod.string().email('Debe ser una dirección de email válida')
})

type SettingsFormValues = zod.infer<typeof settingsSchema>

export default function SettingsAdminView() {
  const { 
    freeShippingMin, 
    volumeDiscountMin, 
    volumeDiscountPercent, 
    whatsappNumber, 
    supportEmail, 
    shippingCostDefault,
    updateSettings 
  } = useSettingsStore()

  // Form hook
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema)
  })

  // Load values on mount
  useEffect(() => {
    setValue('freeShippingMin', freeShippingMin)
    setValue('volumeDiscountMin', volumeDiscountMin)
    setValue('volumeDiscountPercent', volumeDiscountPercent)
    setValue('shippingCostDefault', shippingCostDefault)
    setValue('whatsappNumber', whatsappNumber)
    setValue('supportEmail', supportEmail)
  }, [freeShippingMin, volumeDiscountMin, volumeDiscountPercent, whatsappNumber, supportEmail, shippingCostDefault, setValue])

  const onSubmitSettings = (data: SettingsFormValues) => {
    updateSettings(data)
    toast.success('Parámetros globales guardados con éxito', {
      description: 'Los cambios afectarán el carrito y cobros de clientes de forma inmediata.'
    })
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Configuración Global</h1>
            <p className="text-xs text-muted-foreground">Define límites de envíos gratis, porcentajes de descuento y datos de contacto.</p>
          </div>
        </div>
      </div>

      {/* Settings Form Card */}
      <div className="bg-background border rounded-3xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-6">
          
          {/* E-Commerce parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider border-l-2 border-primary pl-2">
              <Sliders className="h-4.5 w-4.5 text-primary" />
              Parámetros de Venta y Despacho
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Monto Mínimo Envío Gratis (Bs)</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="number"
                    {...register('freeShippingMin', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.freeShippingMin && <span className="text-[10px] text-destructive mt-1 block">{errors.freeShippingMin.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Costo de Envío Base (Bs)</label>
                <input
                  type="number"
                  {...register('shippingCostDefault', { valueAsNumber: true })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.shippingCostDefault && <span className="text-[10px] text-destructive mt-1 block">{errors.shippingCostDefault.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Compra Mínima Descuento Volumen (Bs)</label>
                <input
                  type="number"
                  {...register('volumeDiscountMin', { valueAsNumber: true })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.volumeDiscountMin && <span className="text-[10px] text-destructive mt-1 block">{errors.volumeDiscountMin.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Porcentaje Descuento Volumen (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="number"
                    {...register('volumeDiscountPercent', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.volumeDiscountPercent && <span className="text-[10px] text-destructive mt-1 block">{errors.volumeDiscountPercent.message}</span>}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider border-l-2 border-primary pl-2">
              <Phone className="h-4.5 w-4.5 text-primary" />
              Canales de Soporte Corporativo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Número WhatsApp Oficial</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('whatsappNumber')}
                    placeholder="+59170000000"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.whatsappNumber && <span className="text-[10px] text-destructive mt-1 block">{errors.whatsappNumber.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Email de Contacto</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    {...register('supportEmail')}
                    placeholder="contacto@industriasvivo.com"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                </div>
                {errors.supportEmail && <span className="text-[10px] text-destructive mt-1 block">{errors.supportEmail.message}</span>}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="rounded-xl font-bold px-6 shadow-md shadow-primary/10 flex items-center gap-1.5">
              <Save className="h-4.5 w-4.5" />
              Guardar Configuración
            </Button>
          </div>

        </form>
      </div>

    </div>
  )
}
