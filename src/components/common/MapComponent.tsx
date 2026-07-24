'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icon issue in Next.js/React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  lat: number
  lng: number
  onChangeLocation: (lat: number, lng: number) => void
}

function MapEventsHandler({ onChangeLocation }: { onChangeLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChangeLocation(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapComponent({ lat, lng, onChangeLocation }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number]>([lat, lng])

  useEffect(() => {
    setPosition([lat, lng])
  }, [lat, lng])

  const handleMarkerDrag = (e: L.DragEndEvent) => {
    const marker = e.target
    if (marker != null) {
      const latLng = marker.getLatLng()
      onChangeLocation(latLng.lat, latLng.lng)
    }
  }

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border relative z-10">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full absolute inset-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDrag
          }}
        />
        <MapEventsHandler onChangeLocation={onChangeLocation} />
      </MapContainer>
    </div>
  )
}
