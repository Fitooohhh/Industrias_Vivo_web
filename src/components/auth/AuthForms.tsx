'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useGoogleLogin } from '@react-oauth/google'
import { Loader2, ArrowLeft, Mail, Lock } from 'lucide-react'

// Validation Schemas
const loginSchema = zod.object({
  email: zod.string().email('Debe ingresar un correo válido'),
  password: zod.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  isAdmin: zod.boolean().optional()
})

const registerSchema = zod.object({
  name: zod.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: zod.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: zod.string().email('Debe ingresar un correo válido'),
  phone: zod.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  password: zod.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: zod.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
  acceptTerms: zod.boolean().refine(val => val === true, 'Debe aceptar los términos')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

const recoverySchema = zod.object({
  email: zod.string().email('Debe ingresar un correo válido')
})

type LoginFormValues = zod.infer<typeof loginSchema>
type RegisterFormValues = zod.infer<typeof registerSchema>
type RecoveryFormValues = zod.infer<typeof recoverySchema>

export default function AuthForms() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const { loginSimulated } = useAuthStore()
  
  const [isActive, setIsActive] = useState(false) // Toggle sign-in vs sign-up
  const [authModeMobile, setAuthModeMobile] = useState<'login' | 'register'>('login') // For mobile screens
  const [isRecovery, setIsRecovery] = useState(false) // Password recovery overlay state
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Forms
  const { register: regLogin, handleSubmit: handleL, formState: { errors: errorsL } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { isAdmin: false }
  })

  const { register: regRegister, handleSubmit: handleR, formState: { errors: errorsR } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  })

  const { register: regRecovery, handleSubmit: handleRec, formState: { errors: errorsRec } } = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema)
  })

  // Submit Handlers
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    const role = data.isAdmin ? 'admin' : 'client'
    loginSimulated(data.email, role)
    toast.success('Sesión iniciada con éxito', {
      description: `Ingresaste como: ${role === 'admin' ? 'Administrador' : 'Cliente'}`
    })
    router.replace(redirect)
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsLoading(false)
    
    loginSimulated(data.email, 'client')
    toast.success('Cuenta creada y sesión iniciada', {
      description: '¡Bienvenido a Industrias Vivo!'
    })
    router.replace(redirect)
  }

  const onRecoverySubmit = async (data: RecoveryFormValues) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success('Enlace enviado', {
      description: `Se envió un correo de restauración a: ${data.email}`
    })
    setIsRecovery(false)
  }

  const handleGoogleLoginReal = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true)
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const user = await res.json()
        loginSimulated(user.email || 'usuario.google@gmail.com', 'client')
        toast.success(`¡Bienvenido, ${user.name || user.given_name || 'Usuario Google'}!`, {
          description: `Autenticado con Google: ${user.email}`
        })
        router.replace(redirect)
      } catch {
        loginSimulated('usuario.google@gmail.com', 'client')
        toast.success('Sesión iniciada con Google', {
          description: 'Conectado exitosamente'
        })
        router.replace(redirect)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      toast.error('Inicio de sesión cancelado en Google')
    }
  })

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center p-2 relative">
      
      {/* Unified Master Double Slider Form (PC, Tablet & Mobile) */}
      <div className={`relative w-full max-w-[768px] min-h-[540px] sm:min-h-[520px] bg-background border border-primary/20 rounded-[30px] shadow-2xl overflow-hidden transition-all duration-500 ${isActive ? 'active' : ''}`}>
        
        {/* Sign Up Container */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 ${isActive ? 'translate-x-full opacity-100 z-50 animate-move-signup' : 'opacity-0 z-10'}`}>
          <form onSubmit={handleR(onRegisterSubmit)} className="bg-background flex flex-col items-center justify-center h-full px-3 sm:px-10 py-4 sm:py-6 text-center space-y-2 sm:space-y-3">
            <h1 className="text-lg sm:text-2xl font-black text-foreground">Crea una cuenta</h1>
            
            {/* Real Google Button */}
            <button
              type="button"
              onClick={() => handleGoogleLoginReal()}
              className="flex items-center justify-center w-full py-2 px-4 border border-border rounded-xl bg-background hover:bg-muted/40 text-foreground font-bold text-xs shadow-xs transition-all active:scale-95 my-1"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continuar con Google
            </button>

            <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">o usa tu correo electrónico</span>
            
            <div className="w-full space-y-1.5 sm:space-y-2">
              <input {...regRegister('name')} type="text" placeholder="Nombre" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              <input {...regRegister('lastName')} type="text" placeholder="Apellido" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              <input {...regRegister('email')} type="email" placeholder="Correo electrónico" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              <input {...regRegister('phone')} type="text" placeholder="Teléfono" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              <input {...regRegister('password')} type="password" placeholder="Contraseña" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              <input {...regRegister('confirmPassword')} type="password" placeholder="Confirmar Contraseña" required className="w-full rounded-lg border bg-muted/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
            </div>

            <Button type="submit" disabled={isLoading} className="bg-[#00A8E8] hover:bg-[#00A8E8]/90 text-white font-extrabold text-[11px] sm:text-xs px-4 sm:px-10 py-2 sm:py-2.5 rounded-xl uppercase tracking-wide transition-all mt-1 w-full shadow-md active:scale-95">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Regístrate'}
            </Button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${isActive ? 'translate-x-full opacity-0' : ''}`}>
          {!isRecovery ? (
            <form onSubmit={handleL(onLoginSubmit)} className="bg-background flex flex-col items-center justify-center h-full px-3 sm:px-10 py-4 sm:py-6 text-center space-y-3 sm:space-y-4">
              <h1 className="text-lg sm:text-2xl font-black text-foreground">Inicia sesión</h1>
              
              {/* Real Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleLoginReal()}
                className="flex items-center justify-center w-full py-2 px-4 border border-border rounded-xl bg-background hover:bg-muted/40 text-foreground font-bold text-xs shadow-xs transition-all active:scale-95 my-1"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar con Google
              </button>

              <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">o usa tu correo y contraseña</span>
              
              <div className="w-full space-y-2 sm:space-y-3">
                <input {...regLogin('email')} type="email" placeholder="Correo electrónico" required className="w-full rounded-lg border bg-muted/30 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
                <input {...regLogin('password')} type="password" placeholder="Contraseña" required className="w-full rounded-lg border bg-muted/30 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
              </div>

              {/* Admin Role Simulation */}
              <div className="flex items-center space-x-2 w-full bg-primary/5 p-2 rounded-lg border text-left">
                <input {...regLogin('isAdmin')} type="checkbox" id="isAdminD" className="h-4 w-4 rounded border-gray-300 text-[#00A8E8] focus:ring-[#00A8E8]" />
                <label htmlFor="isAdminD" className="text-[10px] sm:text-[11px] font-extrabold text-primary cursor-pointer flex items-center gap-1 select-none">
                  Simular Ingreso Admin
                </label>
              </div>

              <button type="button" onClick={() => setIsRecovery(true)} className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors mt-1 font-semibold">
                ¿Olvidaste tu contraseña?
              </button>

              <Button type="submit" disabled={isLoading} className="bg-[#00A8E8] hover:bg-[#00A8E8]/90 text-white font-extrabold text-[11px] sm:text-xs px-4 sm:px-10 py-2 sm:py-2.5 rounded-xl uppercase tracking-wide transition-all w-full shadow-md active:scale-95">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Iniciar sesión'}
              </Button>
            </form>
          ) : (
            // Recovery Form Desktop
            <form onSubmit={handleRec(onRecoverySubmit)} className="bg-background flex flex-col items-center justify-center h-full px-3 sm:px-10 py-4 sm:py-6 text-center space-y-3 sm:space-y-4">
              <button type="button" onClick={() => setIsRecovery(false)} className="self-start flex items-center text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors font-semibold">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
              <h1 className="text-lg sm:text-2xl font-black text-foreground">Recuperar contraseña</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground px-2 sm:px-4">Introduce tu correo electrónico registrado para enviarte las instrucciones.</p>
              
              <div className="w-full space-y-3">
                <input {...regRecovery('email')} type="email" placeholder="Correo electrónico" required className="w-full rounded-lg border bg-muted/30 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs focus:border-primary outline-hidden font-medium" />
                {errorsRec.email && <span className="text-[10px] text-destructive mt-1 block">{errorsRec.email.message}</span>}
              </div>

              <Button type="submit" disabled={isLoading} className="bg-[#00A8E8] hover:bg-[#00A8E8]/90 text-white font-extrabold text-[11px] sm:text-xs px-4 sm:px-10 py-2 sm:py-2.5 rounded-xl uppercase tracking-wide transition-all w-full shadow-md active:scale-95">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Enviar enlace'}
              </Button>
            </form>
          )}
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-100 ${isActive ? '-translate-x-full rounded-r-[90px] sm:rounded-r-[150px] rounded-l-none' : 'rounded-l-[90px] sm:rounded-l-[150px]'}`}>
          <div className={`bg-[#00A8E8] h-full text-white relative -left-full w-[200%] transform transition-all duration-600 ease-in-out ${isActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00A8E8] to-[#0284c7] flex">
              
              {/* Left Panel */}
              <div className={`w-1/2 h-full flex flex-col items-center justify-center px-3 sm:px-10 text-center transition-all duration-600 ease-in-out ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
                <h1 className="text-sm sm:text-2xl font-extrabold leading-tight">¿Ya tienes una cuenta?</h1>
                <p className="text-[10px] sm:text-xs leading-4 sm:leading-5 my-2 sm:my-4 opacity-95">Inicia sesión para acceder a todas las funciones</p>
                <button onClick={() => setIsActive(false)} className="bg-transparent border border-white text-white font-extrabold text-[10px] sm:text-xs px-3 sm:px-10 py-1.5 sm:py-2.5 rounded-xl uppercase tracking-wide hover:bg-white/10 active:scale-95 transition-all">
                  Inicia sesión
                </button>
              </div>

              {/* Right Panel */}
              <div className={`w-1/2 h-full flex flex-col items-center justify-center px-3 sm:px-10 text-center transition-all duration-600 ease-in-out right-0 absolute ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
                <h1 className="text-sm sm:text-2xl font-extrabold leading-tight">¿No tienes una cuenta?</h1>
                <p className="text-[10px] sm:text-xs leading-4 sm:leading-5 my-2 sm:my-4 opacity-95">Regístrate para usar todas las funciones del sitio</p>
                <button onClick={() => setIsActive(true)} className="bg-transparent border border-white text-white font-extrabold text-[10px] sm:text-xs px-3 sm:px-10 py-1.5 sm:py-2.5 rounded-xl uppercase tracking-wide hover:bg-white/10 active:scale-95 transition-all">
                  Regístrate
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Global CSS keyframes inline helper for move animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes move-signup {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
        .animate-move-signup {
          animation: move-signup 0.6s;
        }
      `}} />
    </div>
  )
}
