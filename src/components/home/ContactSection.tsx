'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const contactSchema = zod.object({
  name: zod.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: zod.string().email('Debe ingresar un correo válido'),
  phone: zod.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  message: zod.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormValues = zod.infer<typeof contactSchema>

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    // Simular el envío
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    toast.success('Mensaje enviado con éxito', {
      description: 'Nos pondremos en contacto contigo a la brevedad posible.'
    })
    reset()
  }

  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-bold">Contacto</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Escríbenos o Visítanos
          </h2>
          <p className="text-muted-foreground">
            ¿Tienes alguna consulta técnica, comercial o de volumen? Envíanos tus datos y nos comunicaremos contigo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info cards & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl border bg-primary/5">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground">Ubicación</h4>
                  <p className="text-sm text-muted-foreground">Parque Industrial, Manzana 12, Santa Cruz, Bolivia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl border bg-secondary/5">
                <Phone className="h-6 w-6 text-secondary-foreground flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground">Teléfono</h4>
                  <p className="text-sm text-muted-foreground">+591 3 3456789 / +591 70000000</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl border bg-chart-3/5">
                <Mail className="h-6 w-6 text-chart-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-foreground">Correo Electrónico</h4>
                  <p className="text-sm text-muted-foreground">contacto@industriasvivo.com</p>
                </div>
              </div>
            </div>

            {/* Simulated Map */}
            <div className="relative rounded-2xl overflow-hidden border h-64 bg-muted flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')" }} />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              <div className="relative z-10 text-center p-4 bg-background/95 backdrop-blur-md rounded-xl border shadow-lg max-w-xs">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2 animate-bounce" />
                <span className="text-xs font-bold block text-foreground">Industrias Vivo S.R.L.</span>
                <span className="text-[10px] text-muted-foreground block mt-1">Parque Industrial, Santa Cruz de la Sierra</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-background border rounded-2xl p-8 shadow-xs">
            <h3 className="text-xl font-bold text-foreground mb-6">Formulario de Contacto Rápido</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre Completo</label>
                  <input
                    {...register('name')}
                    placeholder="Ej. Juan Pérez"
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-primary transition-all"
                  />
                  {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Correo Electrónico</label>
                  <input
                    {...register('email')}
                    placeholder="Ej. juan@correo.com"
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-primary transition-all"
                  />
                  {errors.email && <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Teléfono o WhatsApp</label>
                <input
                  {...register('phone')}
                  placeholder="Ej. +591 70000000"
                  className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-primary transition-all"
                />
                {errors.phone && <span className="text-xs text-destructive mt-1 block">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Mensaje o Consulta</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-hidden focus:border-primary transition-all resize-none"
                />
                {errors.message && <span className="text-xs text-destructive mt-1 block">{errors.message.message}</span>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full rounded-lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Consulta
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}
