'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] rounded-xl border bg-muted flex items-center justify-center animate-pulse">
        <span className="text-xs font-semibold text-muted-foreground">Cargando mapa interactivo...</span>
      </div>
    )
  }
)

interface InteractiveMapProps {
  lat: number
  lng: number
  onChangeLocation: (lat: number, lng: number) => void
}

export default function InteractiveMap({ lat, lng, onChangeLocation }: InteractiveMapProps) {
  return <MapComponent lat={lat} lng={lng} onChangeLocation={onChangeLocation} />
}
