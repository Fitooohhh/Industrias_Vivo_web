'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore, UserMode } from '@/store/useAppStore'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Building2, 
  Home as HomeIcon,
  Sparkles,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const { mode, setMode, theme, toggleTheme } = useAppStore()
  const { items } = useCartStore()
  const { user, logoutSimulated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Inicializar clase de tema
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">INDUSTRIAS VIVO</span>
          </div>
        </div>
      </header>
    )
  }

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Calculadora', href: '/calculadora' },
    { name: 'Cotizaciones', href: '/cotizaciones' },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
  ]

  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md transition-colors duration-300">
      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
          <img
            src="/images/logo-vivo.jpg"
            alt="Industrias Vivo - Limpieza que inspira vida"
            className="h-10 w-auto object-contain rounded-xl shadow-md border border-primary/20 transition-all duration-300 group-hover:shadow-[0_4px_15px_rgba(2,132,199,0.3)]"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-bold py-1.5 transition-colors duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-transform duration-300 origin-left ${
                  isActive ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            )
          })}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center space-x-1 text-sm font-bold text-chart-3 hover:text-chart-3/80 transition-colors"
            >
              <Settings className="h-4 w-4 animate-spin-slow" />
              <span>Panel Admin</span>
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-muted-foreground hover:text-primary"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Cart Icon */}
          <Link href="/carrito" className="relative group">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground animate-bounce">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold">{user.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logoutSimulated}
                className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full font-medium">
                <UserIcon className="mr-2 h-4 w-4" />
                Ingresar
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-secondary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b bg-background/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl rounded-b-3xl"
          >
            {/* Nav Links */}
            <nav className="flex flex-col space-y-1.5 pt-1">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between text-base font-bold py-2.5 px-4 rounded-xl transition-all active:scale-98 ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-xs' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
                    </Link>
                  </motion.div>
                )
              })}

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base font-bold text-chart-3 py-2.5 px-4 rounded-xl bg-chart-3/10 border border-chart-3/30"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 animate-spin-slow" />
                    Panel Admin
                  </span>
                </Link>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t pt-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2 rounded-xl active:scale-95"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">Modo Oscuro</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold">Modo Claro</span>
                  </>
                )}
              </Button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-foreground">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logoutSimulated()
                      setIsOpen(false)
                    }}
                    className="text-destructive font-bold hover:bg-destructive/10 rounded-xl active:scale-95"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Salir
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="rounded-full px-5 font-bold shadow-md active:scale-95">
                    <UserIcon className="mr-1.5 h-4 w-4" />
                    Ingresar
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
