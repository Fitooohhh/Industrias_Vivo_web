'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore, UserMode, SelectedCity } from '@/store/useAppStore'
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
  Settings,
  MapPin,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const { mode, setMode, city, setCity, theme, toggleTheme } = useAppStore()
  const { items } = useCartStore()
  const { user, logoutSimulated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false)
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

  const currentCity = city || 'cochabamba'

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

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Custom Animated City Selector Combobox */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center bg-primary/10 hover:bg-primary/20 border border-primary/25 rounded-full px-3.5 py-1.5 text-xs font-black text-primary shadow-xs transition-all active:scale-95 space-x-1.5 cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-primary animate-pulse flex-shrink-0" />
              <span className="capitalize">{currentCity}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-primary transition-transform duration-300 ${isCityMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCityMenuOpen && (
                <>
                  {/* Backdrop for click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsCityMenuOpen(false)} />

                  {/* Combobox Dropdown Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 z-50 w-52 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-2 shadow-2xl space-y-1 text-left"
                  >
                    <div className="px-3 py-1.5 border-b border-border/60">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                        Ciudad de Cobertura
                      </span>
                    </div>

                    {/* Cochabamba Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setCity('cochabamba')
                        setIsCityMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentCity === 'cochabamba'
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>Cochabamba</span>
                        <span className="text-[10px] font-medium text-muted-foreground">2 Sucursales activas</span>
                      </div>
                      {currentCity === 'cochabamba' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>

                    {/* Sucre Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setCity('sucre')
                        setIsCityMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentCity === 'sucre'
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>Sucre</span>
                        <span className="text-[10px] font-medium text-muted-foreground">3 Sucursales activas</span>
                      </div>
                      {currentCity === 'sucre' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

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

        {/* Mobile top action bar */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile City Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center bg-primary/10 hover:bg-primary/20 border border-primary/25 rounded-full px-2.5 py-1 text-xs font-black text-primary space-x-1 cursor-pointer active:scale-95 transition-transform"
            >
              <MapPin className="h-3 w-3 text-primary animate-pulse flex-shrink-0" />
              <span className="capitalize text-xs">{currentCity}</span>
              <ChevronDown className={`h-3 w-3 text-primary transition-transform duration-300 ${isCityMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCityMenuOpen && (
                <>
                  {/* Backdrop for click outside */}
                  <div className="fixed inset-0 z-100" onClick={() => setIsCityMenuOpen(false)} />

                  {/* Mobile Dropdown Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/3 top-full mt-2 z-110 w-52 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-2 shadow-2xl space-y-1 text-left"
                  >
                    <div className="px-3 py-1.5 border-b border-border/60">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                        Ciudad de Cobertura
                      </span>
                    </div>

                    {/* Cochabamba Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setCity('cochabamba')
                        setIsCityMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentCity === 'cochabamba'
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>Cochabamba</span>
                        <span className="text-[10px] font-medium text-muted-foreground">2 Sucursales activas</span>
                      </div>
                      {currentCity === 'cochabamba' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>

                    {/* Sucre Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setCity('sucre')
                        setIsCityMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentCity === 'sucre'
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>Sucre</span>
                        <span className="text-[10px] font-medium text-muted-foreground">3 Sucursales activas</span>
                      </div>
                      {currentCity === 'sucre' && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground relative h-9 w-9">
              <ShoppingCart className="h-4.5 w-4.5" />
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
            className="text-muted-foreground h-9 w-9"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b bg-background/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl rounded-b-3xl"
          >
            {/* Mobile City Choice Card */}
            <div className="p-3 border rounded-2xl bg-primary/5 space-y-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground block">Tu Ciudad de Cobertura</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCity('cochabamba')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                    currentCity === 'cochabamba'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background border text-foreground'
                  }`}
                >
                  <span>Cochabamba</span>
                  {currentCity === 'cochabamba' && <Check className="h-3.5 w-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCity('sucre')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                    currentCity === 'sucre'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background border text-foreground'
                  }`}
                >
                  <span>Sucre</span>
                  {currentCity === 'sucre' && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
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
