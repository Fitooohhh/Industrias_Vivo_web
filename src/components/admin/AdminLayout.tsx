'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useAppStore } from '@/store/useAppStore'
import { 
  LayoutDashboard, 
  Box, 
  Tags, 
  Bookmark, 
  Sparkles, 
  PackageOpen, 
  ShoppingBag, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight,
  Bell,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logoutSimulated } = useAuthStore()
  const { theme, toggleTheme } = useAppStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Route protection
  useEffect(() => {
    if (mounted) {
      if (!user || user.role !== 'admin') {
        toastError()
        router.replace('/login?redirect=/admin')
      }
    }
  }, [user, mounted, router])

  const toastError = () => {
    // Evitar llamadas duplicadas antes de montar
    if (typeof window !== 'undefined') {
      const { toast } = require('sonner')
      toast.error('Acceso restringido', {
        description: 'Debes iniciar sesión con rol de Administrador.'
      })
    }
  }

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm font-semibold text-muted-foreground">Verificando credenciales administrativas...</span>
        </div>
      </div>
    )
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/productos', icon: Box },
    { name: 'Categorías', href: '/admin/categorias', icon: Tags },
    { name: 'Promociones', href: '/admin/promociones', icon: Sparkles },
    { name: 'Inventario', href: '/admin/inventario', icon: PackageOpen },
    { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { name: 'Cotizaciones', href: '/admin/cotizaciones', icon: FileSpreadsheet },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Informes', href: '/admin/reportes', icon: TrendingUp },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ]

  const handleLogout = () => {
    logoutSimulated()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-muted/30 flex transition-colors duration-300">
      
      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Header logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-primary">VIVO</span>
              <span className="bg-chart-3 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
          ) : (
            <span className="text-lg font-black tracking-tight text-primary mx-auto">V</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-muted"
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-3 border-t space-y-2">
          <Link href="/" className="w-full block">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-bold text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Ver Tienda Pública</span>}
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 py-2 px-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main shell */}
      <div className="flex-grow flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-muted-foreground capitalize">
              Panel Administrativo
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme selector */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-muted-foreground"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-chart-3 animate-ping" />
            </Button>

            {/* Profile */}
            <div className="flex items-center space-x-2 border-l pl-4">
              <div className="h-8 w-8 rounded-full bg-chart-3 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-foreground hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
