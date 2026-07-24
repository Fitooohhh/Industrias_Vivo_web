'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  User as UserIcon, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Save, 
  Star,
  Map,
  Compass,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore, UserAddress } from '@/store/useUserStore'
import { useCartStore } from '@/store/useCartStore'
import { ProductsService } from '@/services/products.service'
import InteractiveMap from '@/components/common/InteractiveMap'
import { useOrdersStore } from '@/store/useOrdersStore'
import { toast } from 'sonner'
import Link from 'next/link'

// Validation Schemas
const profileSchema = zod.object({
  name: zod.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: zod.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: zod.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  company: zod.string().optional()
})

const addressSchema = zod.object({
  name: zod.string().min(2, 'El nombre (ej. Casa) es obligatorio'),
  address: zod.string().min(5, 'La dirección es obligatoria'),
  city: zod.string().min(3, 'La ciudad es obligatoria'),
  lat: zod.number(),
  lng: zod.number()
})

type ProfileFormValues = zod.infer<typeof profileSchema>
type AddressFormValues = zod.infer<typeof addressSchema>

export default function ProfileClient() {
  const { user, loginSimulated } = useAuthStore()
  const { addresses, addAddress, removeAddress, favoriteIds } = useUserStore()
  const { addItem } = useCartStore()
  const { orders } = useOrdersStore()

  // State
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'favorites' | 'orders'>('profile')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [mapLat, setMapLat] = useState(-17.7833) // Center of Santa Cruz
  const [mapLng, setMapLng] = useState(-63.1833)
  const [mounted, setMounted] = useState(false)

  // Forms
  const { register: regProfile, handleSubmit: handleProf, setValue: setProfValue, formState: { errors: errorsProf } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  })

  const { register: regAddress, handleSubmit: handleAddr, setValue: setAddrValue, watch: watchAddr, reset: resetAddr, formState: { errors: errorsAddr } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      lat: -17.7833,
      lng: -63.1833
    }
  })

  const currentLat = watchAddr('lat')
  const currentLng = watchAddr('lng')

  useEffect(() => {
    setMounted(true)
    if (user) {
      setProfValue('name', user.name)
      setProfValue('lastName', user.lastName)
      setProfValue('phone', user.phone || '')
      setProfValue('company', user.company || '')
    }
  }, [user, setProfValue])

  if (!mounted || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <span className="text-sm font-semibold text-muted-foreground">Acceso no autorizado o cargando datos...</span>
      </div>
    )
  }

  // Handle location update from map click
  const handleLocationChange = (lat: number, lng: number) => {
    setAddrValue('lat', lat)
    setAddrValue('lng', lng)
    setMapLat(lat)
    setMapLng(lng)
    toast.info(`Coordenadas fijadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }

  const onProfileSubmit = (data: ProfileFormValues) => {
    // Simular guardado actualizando store
    loginSimulated(user.email, user.role)
    // Sobrescribir campos guardados en session simulada
    user.name = data.name
    user.lastName = data.lastName
    user.phone = data.phone
    user.company = data.company
    toast.success('Datos de perfil actualizados con éxito')
  }

  const onAddressSubmit = (data: AddressFormValues) => {
    addAddress(data)
    toast.success('Nueva dirección guardada con éxito')
    resetAddr({ name: '', address: '', city: 'Santa Cruz', lat: -17.7833, lng: -63.1833 })
    setShowAddAddress(false)
  }

  // Load favorite products
  const favoriteProducts = ProductsService.getProducts().filter(p => favoriteIds.includes(p.id))

  // Load real orders from store
  const userOrders = orders.filter(o => o.customerEmail === user.email)

  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: UserIcon },
    { id: 'addresses', name: 'Direcciones', icon: MapPin },
    { id: 'favorites', name: 'Mis Favoritos', icon: Heart },
    { id: 'orders', name: 'Mis Pedidos', icon: ShoppingBag },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 border rounded-2xl bg-background p-4 space-y-4">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-foreground line-clamp-1">{user.name} {user.lastName}</h4>
              <span className="text-[10px] text-muted-foreground capitalize font-semibold bg-muted px-2 py-0.5 rounded-md mt-0.5 inline-block">
                Rol: {user.role === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 text-sm py-2.5 px-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content Box */}
        <main className="lg:col-span-9 border rounded-2xl bg-background p-6 md:p-8 shadow-xs min-h-[500px]">
          
          {/* Mi Perfil Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black border-b pb-3">Información Personal</h3>
              <form onSubmit={handleProf(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre</label>
                    <input
                      {...regProfile('name')}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                    />
                    {errorsProf.name && <span className="text-[10px] text-destructive mt-1 block">{errorsProf.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Apellido</label>
                    <input
                      {...regProfile('lastName')}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                    />
                    {errorsProf.lastName && <span className="text-[10px] text-destructive mt-1 block">{errorsProf.lastName.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Correo Electrónico (No modificable)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Teléfono</label>
                    <input
                      {...regProfile('phone')}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                    />
                    {errorsProf.phone && <span className="text-[10px] text-destructive mt-1 block">{errorsProf.phone.message}</span>}
                  </div>
                  {user.role === 'admin' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Empresa</label>
                      <input
                        {...regProfile('company')}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="rounded-lg font-bold flex items-center gap-1.5 shadow-md">
                  <Save className="h-4.5 w-4.5" />
                  Guardar Perfil
                </Button>
              </form>
            </div>
          )}

          {/* Direcciones Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xl font-black">Direcciones de Envío</h3>
                {!showAddAddress && (
                  <Button onClick={() => setShowAddAddress(true)} size="sm" className="rounded-lg">
                    <Plus className="mr-1 h-4 w-4" />
                    Nueva Dirección
                  </Button>
                )}
              </div>

              {showAddAddress ? (
                <form onSubmit={handleAddr(onAddressSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre (ej. Casa, Oficina)</label>
                      <input
                        {...regAddress('name')}
                        placeholder="Mi Casa"
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                      />
                      {errorsAddr.name && <span className="text-[10px] text-destructive mt-1 block">{errorsAddr.name.message}</span>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Dirección Completa</label>
                      <input
                        {...regAddress('address')}
                        placeholder="Av. Principal, Calle 4, Nro. 12"
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                      />
                      {errorsAddr.address && <span className="text-[10px] text-destructive mt-1 block">{errorsAddr.address.message}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Ciudad</label>
                      <input
                        {...regAddress('city')}
                        placeholder="Santa Cruz"
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                      />
                      {errorsAddr.city && <span className="text-[10px] text-destructive mt-1 block">{errorsAddr.city.message}</span>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Latitud</label>
                      <input
                        type="number"
                        step="any"
                        value={currentLat}
                        disabled
                        className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Longitud</label>
                      <input
                        type="number"
                        step="any"
                        value={currentLng}
                        disabled
                        className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Real leaflet map to drop a Pin */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Map className="h-4 w-4 text-primary" />
                      Ubicación en Mapa (Haz clic en el mapa para ubicar tu entrega)
                    </label>
                    <div className="h-64 rounded-xl border overflow-hidden relative">
                      <InteractiveMap 
                        lat={mapLat} 
                        lng={mapLng} 
                        onChangeLocation={handleLocationChange} 
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddAddress(false)}
                      className="rounded-lg"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-lg font-bold">
                      Guardar Dirección
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="border p-4 rounded-xl space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <MapPin className="h-4.5 w-4.5 text-primary" />
                          {addr.name}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{addr.address}, {addr.city}</p>
                        <span className="text-[10px] text-muted-foreground font-mono block">
                          Coords: {addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex gap-2 justify-end border-t pt-3 mt-2">
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-xs text-destructive hover:underline font-bold flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <p className="text-sm text-muted-foreground italic col-span-2 py-4">No tienes direcciones guardadas.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Favoritos Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black border-b pb-3">Mis Productos Favoritos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteProducts.map(prod => (
                  <div key={prod.id} className="border p-4 rounded-xl flex gap-4 items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <Link href={`/producto/${prod.id}`}>
                          <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">{prod.name}</h4>
                        </Link>
                        <span className="text-[10px] text-muted-foreground block">{prod.presentation}</span>
                        <span className="text-xs font-bold text-primary block">Bs. {prod.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        addItem({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, sku: prod.sku, presentation: prod.presentation })
                        toast.success(`${prod.name} agregado al carrito`)
                      }}
                      size="sm" 
                      className="rounded-lg text-xs h-8"
                    >
                      <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                      Comprar
                    </Button>
                  </div>
                ))}
                {favoriteProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground italic col-span-2 py-4">No tienes productos en favoritos.</p>
                )}
              </div>
            </div>
          )}

          {/* Mis Pedidos Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black border-b pb-3">Historial de Pedidos</h3>
              <div className="border rounded-xl overflow-hidden bg-background">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
                      <th className="p-4">Pedido ID</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Método</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {userOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-muted/20">
                        <td className="p-4 font-mono font-bold text-primary">{ord.id}</td>
                        <td className="p-4 text-muted-foreground">{ord.date}</td>
                        <td className="p-4 font-bold text-foreground">Bs. {ord.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            ord.status === 'entregado' 
                              ? 'bg-chart-3/10 text-chart-3' 
                              : ord.status === 'cancelado'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-primary/10 text-primary animate-pulse'
                          }`}>
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground capitalize">
                          {ord.paymentMethod === 'cash' ? 'efectivo' : ord.paymentMethod === 'card' ? 'tarjeta' : 'QR'}
                        </td>
                      </tr>
                    ))}
                    {userOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                          No tienes pedidos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
