'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  UserCheck, 
  XCircle,
  Loader2
} from 'lucide-react'

interface TimelineStep {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'pending' | 'failed'
  timestamp?: string
}

const ORDER_STEPS: TimelineStep[] = [
  {
    id: 'recibido',
    label: 'Pedido Recibido',
    description: 'Tu pedido ha sido registrado en nuestro sistema',
    icon: <Package className="h-5 w-5" />,
    status: 'pending',
  },
  {
    id: 'confirmado',
    label: 'Confirmado',
    description: 'Hemos verificado el pago y confirmado tu pedido',
    icon: <CheckCircle className="h-5 w-5" />,
    status: 'pending',
  },
  {
    id: 'preparando',
    label: 'Preparando',
    description: 'Estamos preparando tus productos en fábrica',
    icon: <Truck className="h-5 w-5" />,
    status: 'pending',
  },
  {
    id: 'en_camino',
    label: 'En Camino',
    description: 'Tu repartidor está en camino a tu dirección',
    icon: <MapPin className="h-5 w-5" />,
    status: 'pending',
  },
  {
    id: 'entregado',
    label: 'Entregado',
    description: 'Tu pedido ha sido entregado exitosamente',
    icon: <UserCheck className="h-5 w-5" />,
    status: 'pending',
  },
]

const STATUS_ORDER = ['recibido', 'confirmado', 'preparando', 'en_camino', 'entregado']

const stepConfig: Record<string, { color: string; bgColor: string }> = {
  completed: { color: 'text-emerald-600', bgColor: 'bg-emerald-600' },
  current: { color: 'text-primary', bgColor: 'bg-primary' },
  pending: { color: 'text-muted-foreground/40', bgColor: 'bg-muted' },
  failed: { color: 'text-destructive', bgColor: 'bg-destructive' },
}

interface OrderTimelineProps {
  currentStatus: string
  timestamps?: Record<string, string>
  className?: string
}

export default function OrderTimeline({ 
  currentStatus, 
  timestamps = {},
  className = ''
}: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  const isDelivered = currentStatus === 'entregado'
  const isCancelled = currentStatus === 'cancelado'

  const steps = ORDER_STEPS.map((step, index) => {
    let status: TimelineStep['status'] = 'pending'
    if (isCancelled) {
      status = index === 0 ? 'completed' : 'failed'
    } else if (isDelivered) {
      status = 'completed'
    } else if (index < currentIndex) {
      status = 'completed'
    } else if (index === currentIndex) {
      status = 'current'
    }
    return { ...step, status, timestamp: timestamps[step.id] }
  })

  return (
    <div className={`space-y-1 ${className}`}>
      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            className="relative flex gap-3"
          >
            {/* Línea vertical conectora */}
            <div className="relative flex-shrink-0 w-6 flex items-start justify-center">
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: index * 0.08 + 0.1, duration: 0.4 }}
                  className="absolute top-10 bottom-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full"
                  style={{
                    background: step.status === 'completed' 
                      ? 'linear-gradient(to bottom, #10B981, #10B981)' 
                      : 'linear-gradient(to bottom, #E5E7EB, #E5E7EB)'
                  }}
                />
              )}
              
              {/* Círculo del paso */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.08 + 0.15, 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20 
                }}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  stepConfig[step.status].bgColor
                } ${
                  step.status === 'completed' ? 'border-emerald-600' :
                  step.status === 'current' ? 'border-primary animate-pulse-ring' :
                  'border-muted'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : step.status === 'current' ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-white"
                  />
                ) : step.status === 'failed' ? (
                  <XCircle className="h-5 w-5 text-white" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </motion.div>
            </div>

            {/* Contenido del paso */}
            <div className="flex-1 min-w-0 pt-1 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 300 }}
                      className={`flex-shrink-0 p-2 rounded-xl ${step.status === 'current' ? 'bg-primary/10' : step.status === 'completed' ? 'bg-emerald-100' : 'bg-muted/50'}`}
                    >
                      {step.icon}
                    </motion.div>
                    <div>
                      <h4 className={`font-bold text-sm transition-colors ${
                        step.status === 'completed' ? 'text-emerald-700' :
                        step.status === 'current' ? 'text-primary' :
                        step.status === 'failed' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs transition-colors ${
                        step.status === 'completed' ? 'text-emerald-600' :
                        step.status === 'current' ? 'text-primary/80' :
                        step.status === 'failed' ? 'text-destructive/80' :
                        'text-muted-foreground'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {step.timestamp && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{step.timestamp}</span>
                    </motion.p>
                  )}
                </div>

                {step.status === 'current' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 + 0.3 }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider animate-pulse"
                  >
                    En progreso
                    <Loader2 className="ml-1.5 h-3 w-3 animate-spin inline" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Resumen final si entregado o cancelado */}
      {(isDelivered || isCancelled) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.08 + 0.2 }}
          className={`mt-4 p-4 rounded-2xl border flex items-center gap-3 ${
            isDelivered 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-destructive/5 border-destructive/20 text-destructive'
          }`}
        >
          <div className="p-2 rounded-xl bg-current/10">
            {isDelivered ? (
              <UserCheck className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{isDelivered ? '¡Pedido Entregado!' : 'Pedido Cancelado'}</p>
            <p className="text-xs opacity-80">
              {isDelivered 
                ? 'Gracias por confiar en Industrias Vivo. Tu pedido ha sido entregado exitosamente.' 
                : 'Tu pedido ha sido cancelado. Contacta soporte si necesitas ayuda.'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}