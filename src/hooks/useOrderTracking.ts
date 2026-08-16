'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useOrdersStore } from '@/store/useOrdersStore'

interface DriverInfo {
  name: string
  phone: string
  vehicle: string
  rating: number
}

interface TrackingState {
  driverLocation: { lat: number; lng: number }
  estimatedTime: string
  driverInfo: DriverInfo | null
  timestamps: Record<string, string>
  isTracking: boolean
}

const STORE_LOCATION = { lat: -17.7833, lng: -63.1833 }
const DELIVERY_AREA_BOUNDS = {
  minLat: -17.85, maxLat: -17.70,
  minLng: -63.25, maxLng: -63.10
}

const DRIVERS: DriverInfo[] = [
  { name: 'Carlos Mendoza', phone: '+591 7xxxxxxx', vehicle: 'Motocicleta Roja', rating: 4.9 },
  { name: 'Ana Rodríguez', phone: '+591 7xxxxxxx', vehicle: 'Motocicleta Azul', rating: 4.8 },
  { name: 'Luis García', phone: '+591 7xxxxxxx', vehicle: 'Camioneta Blanca', rating: 4.7 },
  { name: 'María López', phone: '+591 7xxxxxxx', vehicle: 'Motocicleta Negra', rating: 4.9 },
]

const STATUS_DURATIONS: Record<string, number> = {
  recibido: 30000,
  confirmado: 45000,
  preparando: 60000,
  en_camino: 120000,
}

type OrderStatus = 'recibido' | 'confirmado' | 'preparando' | 'en_camino' | 'entregado' | 'pendiente_pago' | 'listo_retiro' | 'cancelado'

function interpolateCoords(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number
) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  }
}

function generateRandomDeliveryPoint(): { lat: number; lng: number } {
  return {
    lat: DELIVERY_AREA_BOUNDS.minLat + Math.random() * (DELIVERY_AREA_BOUNDS.maxLat - DELIVERY_AREA_BOUNDS.minLat),
    lng: DELIVERY_AREA_BOUNDS.minLng + Math.random() * (DELIVERY_AREA_BOUNDS.maxLng - DELIVERY_AREA_BOUNDS.minLng),
  }
}

export function useOrderTracking(orderId: string) {
  const { orders, updateOrderStatus } = useOrdersStore()
  const order = orders.find(o => o.id === orderId)
  const isTrackingRef = useRef(false)

  const [state, setState] = useState<TrackingState>({
    driverLocation: STORE_LOCATION,
    estimatedTime: 'Calculando...',
    driverInfo: null,
    timestamps: {},
    isTracking: false,
  })

  const startTracking = useCallback(() => {
    if (!order || isTrackingRef.current) return

    isTrackingRef.current = true
    const deliveryPoint = generateRandomDeliveryPoint()
    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)]
    const timestamps: Record<string, string> = {
      recibido: order.date,
    }

    setState(prev => ({
      ...prev,
      isTracking: true,
      driverInfo: driver,
      driverLocation: STORE_LOCATION,
      estimatedTime: '15-20 min',
    }))

    const statusSequence: OrderStatus[] = ['recibido', 'confirmado', 'preparando', 'en_camino', 'entregado']
    const currentIndex = statusSequence.indexOf(order.status as OrderStatus)
    
    let sequenceIndex = Math.max(currentIndex, 0)

    const advanceStatus = () => {
      if (sequenceIndex >= statusSequence.length) return

      const newStatus = statusSequence[sequenceIndex]
      const now = new Date()
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      
      timestamps[newStatus] = timeStr
      
      updateOrderStatus(orderId, newStatus)

      setState(prev => ({
        ...prev,
        timestamps: { ...timestamps },
      }))

      sequenceIndex++

      if (newStatus === 'entregado') {
        setState(prev => ({
          ...prev,
          estimatedTime: 'Entregado',
          driverLocation: deliveryPoint,
          isTracking: false,
        }))
        isTrackingRef.current = false
        return
      }

      const duration = STATUS_DURATIONS[newStatus] || 30000

      const animateProgress = (startProgress = 0) => {
        const start = Date.now()
        
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(startProgress + elapsed / duration, 1)
          
          let currentLocation: { lat: number; lng: number }
          let eta: string

          if (newStatus === 'preparando') {
            currentLocation = STORE_LOCATION
            eta = `${Math.ceil((duration - elapsed) / 60000)} min para salir`
          } else if (newStatus === 'en_camino') {
            currentLocation = interpolateCoords(STORE_LOCATION, deliveryPoint, progress)
            const remainingMin = Math.ceil((duration - elapsed) / 60000)
            eta = `${remainingMin} min`
          } else {
            currentLocation = STORE_LOCATION
            eta = `${Math.ceil((duration - elapsed) / 60000)} min`
          }

          setState(prev => ({
            ...prev,
            driverLocation: currentLocation,
            estimatedTime: eta,
          }))

          if (progress < 1) {
            requestAnimationFrame(tick)
          } else {
            setTimeout(advanceStatus, 500)
          }
        }

        requestAnimationFrame(tick)
      }

      animateProgress()
    }

    setTimeout(advanceStatus, 1000)
  }, [order, orderId, updateOrderStatus])

  useEffect(() => {
    if (order && !isTrackingRef.current && ['recibido', 'pendiente_pago', 'confirmado', 'preparando'].includes(order.status)) {
      startTracking()
    }
  }, [order, startTracking])

  return {
    ...state,
    currentStatus: order?.status || 'recibido',
    storeLocation: STORE_LOCATION,
    deliveryAddress: order?.deliveryMethod === 'delivery' 
      ? { lat: -17.8020, lng: -63.1500 } 
      : STORE_LOCATION,
    order,
    startTracking,
  }
}