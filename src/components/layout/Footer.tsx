import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/90 border-t border-primary/20">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/images/logo-vivo.jpg"
                alt="Industrias Vivo Logo"
                className="h-10 w-auto object-contain rounded-xl shadow-md border border-white/20"
              />
            </div>
            <p className="text-sm text-primary-foreground/75 leading-relaxed">
              Fabricación y comercialización de productos de limpieza de alta calidad. Soluciones profesionales e innovadoras para hogares, comercios e industrias.
            </p>
            <div className="flex items-center space-x-2 text-xs text-primary-foreground/60">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>Garantía de Higiene y Seguridad</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-all">Inicio</Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white hover:underline transition-all">Catálogo de Productos</Link>
              </li>
              <li>
                <Link href="/calculadora" className="hover:text-white hover:underline transition-all">Calculadora de Limpieza</Link>
              </li>
              <li>
                <Link href="/cotizaciones" className="hover:text-white hover:underline transition-all">Solicitar Cotización</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">Calle 16 de Julio # 748, Cochabamba, Bolivia</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-primary-foreground/80 space-y-1">
                  <p><strong className="text-white">Cochabamba:</strong> 77112500 - 77112504</p>
                  <p><strong className="text-white">Sucre:</strong> 70335651 - 77440111</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80 text-xs">contacto@industriasvivo.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours & Socials */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Horarios de Atención</h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-secondary flex-shrink-0" />
                <div className="text-primary-foreground/80 text-xs">
                  <p>Lunes a Viernes: 08:00 - 18:00</p>
                  <p>Sábados: 08:30 - 12:30</p>
                </div>
              </div>
            </div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Síguenos</h4>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/IndustriasVivo/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                title="Facebook Industrias Vivo"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/IndustriasVivo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                title="Instagram Industrias Vivo"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@industrias.vivo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                title="TikTok Industrias Vivo"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.6a6.34 6.34 0 0 0-5.6 6.31 6.34 6.34 0 0 0 10.74 4.54 6.3 6.3 0 0 0 1.95-4.57V8.71a8.3 8.3 0 0 0 5.02 1.66V6.92a4.83 4.83 0 0 1-2-0.23z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-primary-foreground/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Industrias Vivo. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline">Políticas de Privacidad</a>
            <a href="#" className="hover:underline">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
