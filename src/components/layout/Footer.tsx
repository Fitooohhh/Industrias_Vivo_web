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
                <span className="text-primary-foreground/80">Parque Industrial, Manzana 12, Santa Cruz, Bolivia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80">+591 3 3456789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80">contacto@industriasvivo.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours & Socials */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Horarios de Atención</h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-secondary flex-shrink-0" />
                <div className="text-primary-foreground/80">
                  <p>Lunes a Viernes: 08:00 - 18:00</p>
                  <p>Sábados: 08:30 - 12:30</p>
                </div>
              </div>
            </div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <Instagram className="h-5 w-5" />
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
