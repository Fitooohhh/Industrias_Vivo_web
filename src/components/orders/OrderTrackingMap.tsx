'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Truck, MapPin, User, Clock, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icon issue in Next.js/React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DriverLocation {
  lat: number
  lng: number
}

interface OrderTrackingMapProps {
  driverLocation: DriverLocation
  deliveryAddress: DriverLocation
  storeLocation: DriverLocation
  status: string
  estimatedTime: string
  driverName: string
  driverVehicle: string
  onCallDriver?: () => void
  onMessageDriver?: () => void
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  recibido: { color: 'bg-primary', label: 'Recibido', icon: <MapPin className="h-4 w-4" /> },
  pendiente_pago: { color: 'bg-yellow-500', label: 'Pendiente Pago', icon: <Clock className="h-4 w-4" /> },
  confirmado: { color: 'bg-blue-500', label: 'Confirmado', icon: <Truck className="h-4 w-4" /> },
  preparando: { color: 'bg-orange-500', label: 'Preparando', icon: <Truck className="h-4 w-4" /> },
  en_camino: { color: 'bg-green-500', label: 'En Camino', icon: <Truck className="h-4 w-4" /> },
  listo_retiro: { color: 'bg-purple-500', label: 'Listo para Retiro', icon: <MapPin className="h-4 w-4" /> },
  entregado: { color: 'bg-emerald-600', label: 'Entregado', icon: <MapPin className="h-4 w-4" /> },
  cancelado: { color: 'bg-red-500', label: 'Cancelado', icon: <MapPin className="h-4 w-4" /> },
}

const DRIVER_ICON = `
  <div class="relative">
    <div class="w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-bounce">
      <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 17.5c.6.8 1.5 1.2 2.5 1.2s1.9-.4 2.5-1.2a4.5 4.5 0 0 0 0-6.6l-2.8-2.8a4.5 4.5 0 0 0-6.4 0L7 11.9"/></svg>
    </div>
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-green-500 rounded-full border-2 border-white animate-ping opacity-75" />
  </div>
`

const STORE_ICON = `
  <div class="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
    <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 17.5c.6.8 1.5 1.2 2.5 1.2s1.9-.4 2.5-1.2a4.5 4.5 0 0 0 0-6.6l-2.8-2.8a4.5 4.5 0 0 0-6.4 0L7 11.9"/></svg>
  </div>
`

const DELIVERY_ICON = `
  <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
    <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  </div>
`

const routePolyline: [number, number][] = [
  [-17.7833, -63.1833],
  [-17.7900, -63.1750],
  [-17.7950, -63.1700],
  [-17.7980, -63.1650],
  [-17.8000, -63.1600],
  [-17.8010, -63.1550],
  [-17.8020, -63.1500],
]

function MapView({ 
  driverLocation, 
  deliveryAddress, 
  storeLocation, 
  status,
  shouldShowRoute 
}: {
  driverLocation: DriverLocation
  deliveryAddress: DriverLocation
  storeLocation: DriverLocation
  status: string
  shouldShowRoute: boolean
}) {
  const map = useMap()
  
  useEffect(() => {
    if (status === 'en_camino' || status === 'preparando') {
      map.flyTo([driverLocation.lat, driverLocation.lng], 15, { duration: 1 })
    }
  }, [driverLocation, status, map])

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shouldShowRoute && (
        <>
          <Polyline 
            positions={routePolyline} 
            color="#3B82F6" 
            weight={4} 
            opacity={0.6}
            dashArray="8, 8"
          />
          <Polyline 
            positions={routePolyline.slice(0, routePolyline.length - 2)} 
            color="#10B981" 
            weight={4} 
            opacity={0.9}
          />
        </>
      )}
      <Marker position={storeLocation} icon={L.divIcon({ className: '', html: STORE_ICON })} />
      <Marker position={deliveryAddress} icon={L.divIcon({ className: '', html: DELIVERY_ICON })} />
      <Marker position={driverLocation} icon={L.divIcon({ className: '', html: DRIVER_ICON })} />
    </>
  )
}

export default function OrderTrackingMap({
  driverLocation,
  deliveryAddress,
  storeLocation,
  status,
  estimatedTime,
  driverName,
  driverVehicle,
  onCallDriver,
  onMessageDriver,
}: OrderTrackingMapProps) {
  const [mapPosition, setMapPosition] = useState<[number, number]>([driverLocation.lat, driverLocation.lng])
  const shouldShowRoute = status === 'en_camino' || status === 'preparando'

  useEffect(() => {
    setMapPosition([driverLocation.lat, driverLocation.lng])
  }, [driverLocation.lat, driverLocation.lng])

  return (
    <div className="space-y-4">
      {(status === 'en_camino' || status === 'preparando' || status === 'confirmado') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border shadow-lg flex items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
          <div className="relative z-10 flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
              <User className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-foreground text-sm truncate">Tu Repartidor</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusConfig[status]?.color}/20 text-${statusConfig[status]?.color.replace('bg-', '')} flex items-center gap-1`}>
                {statusConfig[status]?.icon}
                {statusConfig[status]?.label}
              </span>
            </div>
            <p className="font-semibold text-foreground mt-0.5">{driverName}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Navigation className="h-3 w-3" />{driverVehicle}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{estimatedTime}</span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={onMessageDriver}
              className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              title="Enviar mensaje"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
            <button
              onClick={onCallDriver}
              className="p-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg shadow-green-500/25"
              title="Llamar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </button>
          </div>
        </motion.div>
      )}

      <div className="relative">
        <div className="h-[320px] md:h-[400px] rounded-2xl overflow-hidden border shadow-xl relative">
          <MapContainer
            center={mapPosition}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full absolute inset-0"
          >
            <MapView 
              driverLocation={driverLocation}
              deliveryAddress={deliveryAddress}
              storeLocation={storeLocation}
              status={status}
              shouldShowRoute={shouldShowRoute}
            />
          </MapContainer>

          <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-auto flex flex-wrap gap-2 justify-center md:justify-end">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-foreground">Repartidor</span>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border flex items-center gap-2 text-xs hidden md:flex">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-medium text-foreground">Fábrica</span>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border flex items-center gap-2 text-xs hidden md:flex">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium text-foreground">Tu ubicación</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border flex items-center gap-2"
          >
            <Clock className="h-4.5 w-4.5 text-primary" />
            <div className="text-right leading-tight">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tiempo estimado</p>
              <p className="font-black text-foreground text-lg">{estimatedTime}</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <StatCard
            icon={<Truck className="h-5 w-5" />}
            label="Distancia"
            value="~3.2 km"
            color="blue"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Tiempo restante"
            value={estimatedTime}
            color="green"
          />
          <StatCard
            icon={<Navigation className="h-5 w-5" />}
            label="Estado actual"
            value={statusConfig[status]?.label || 'Procesando'}
            color="orange"
          />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    green: 'bg-green-500/10 text-green-600 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`rounded-xl p-4 border ${colors[color]} flex flex-col items-center text-center`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-current/10 mb-2">
        {icon}
      </div>
      <p className="font-bold text-sm">{value}</p>
      <p className="text-[10px] opacity-75">{label}</p>
    </motion.div>
  )
}