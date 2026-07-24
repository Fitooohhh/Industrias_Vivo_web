'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Home as HomeIcon, 
  Factory, 
  Car, 
  ShoppingCart,
  CheckCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsService, Product } from '@/services/products.service'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'
import Link from 'next/link'

interface QuestionStep {
  title: string
  description: string
  options: {
    label: string
    value: string
    icon?: any
  }[]
}

export default function CalculadoraPage() {
  const { addItem } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Selection States
  const [area, setArea] = useState<string>('')
  const [surface, setSurface] = useState<string>('')
  const [dirtLevel, setDirtLevel] = useState<string>('')
  
  // Recommendation result state
  const [recommendations, setRecommendations] = useState<Product[]>([])

  const steps: Record<number, QuestionStep> = {
    1: {
      title: '¿Qué área principal deseas limpiar?',
      description: 'Selecciona el sector general para adaptar las formulaciones químicas adecuadas.',
      options: [
        { label: 'Hogar / Oficinas comunes', value: 'hogar', icon: HomeIcon },
        { label: 'Industria / Fábricas / Cocinas comerciales', value: 'industrial', icon: Factory },
        { label: 'Vehículos / Línea Automotriz', value: 'automotriz', icon: Car },
      ]
    },
    2: {
      title: '¿Cuál es la superficie u objeto específico?',
      description: 'Elige la superficie para evitar daños en materiales y maximizar el brillo.',
      options: area === 'hogar' ? [
        { label: 'Cocina (grasa y mesones)', value: 'cocina' },
        { label: 'Baños (sarro y desinfección)', value: 'banos' },
        { label: 'Pisos generales (madera / cerámica)', value: 'pisos' },
        { label: 'Vidrios y cristales', value: 'vidrios' },
        { label: 'Ropa y tejidos', value: 'ropa' },
      ] : area === 'industrial' ? [
        { label: 'Maquinarias y motores (grasas pesadas)', value: 'maquinaria' },
        { label: 'Pisos de talleres y concreto', value: 'pisos_talleres' },
        { label: 'Sanitización de mesones y utensilios de alimentos', value: 'alimentos' },
        { label: 'Sanitarios y baños comunes de personal', value: 'banos_comunes' },
      ] : [
        { label: 'Carrocería exterior y pintura', value: 'carroceria' },
        { label: 'Neumáticos y llantas', value: 'llantas' },
        { label: 'Limpieza interna de plásticos y tapiz', value: 'interno' },
      ]
    },
    3: {
      title: '¿Cuál es el nivel o tipo de suciedad?',
      description: 'Esto nos permite recomendar la concentración exacta del producto.',
      options: [
        { label: 'Ligera / Mantenimiento de rutina', value: 'ligera' },
        { label: 'Moderada / Suciedad acumulada', value: 'moderada' },
        { label: 'Pesada / Manchas difíciles, grasas o sarro profundo', value: 'pesada' },
      ]
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !area) {
      toast.warning('Por favor selecciona una opción para continuar')
      return
    }
    if (currentStep === 2 && !surface) {
      toast.warning('Por favor selecciona una opción para continuar')
      return
    }
    if (currentStep === 3 && !dirtLevel) {
      toast.warning('Por favor selecciona una opción para continuar')
      return
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateRecommendation()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateRecommendation = () => {
    let result: Product[] = []

    // Algorithm mapping
    if (area === 'hogar') {
      if (surface === 'banos' || surface === 'pisos') {
        // Recommend Lavender Disinfectant
        const p = ProductsService.getProductById('prod-1')
        if (p) result.push(p)
      } else if (surface === 'ropa') {
        const p = ProductsService.getProductById('prod-2')
        if (p) result.push(p)
      } else if (surface === 'vidrios') {
        const p = ProductsService.getProductById('prod-3')
        if (p) result.push(p)
      } else {
        // Fallback multiuso
        const p1 = ProductsService.getProductById('prod-1')
        const p3 = ProductsService.getProductById('prod-3')
        if (p1) result.push(p1)
        if (p3) result.push(p3)
      }
    } else if (area === 'industrial') {
      if (surface === 'maquinaria' || surface === 'pisos_talleres') {
        const p = ProductsService.getProductById('prod-4')
        if (p) result.push(p)
      } else if (surface === 'alimentos') {
        const p = ProductsService.getProductById('prod-5')
        if (p) result.push(p)
      } else {
        const p4 = ProductsService.getProductById('prod-4')
        const p5 = ProductsService.getProductById('prod-5')
        if (p4) result.push(p4)
        if (p5) result.push(p5)
      }
    } else {
      // Automotriz
      const p = ProductsService.getProductById('prod-6')
      if (p) result.push(p)
    }

    setRecommendations(result)
    setCurrentStep(4) // Result Step
  }

  const handleAddAllToCart = () => {
    recommendations.forEach((prod) => {
      addItem({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        image: prod.image,
        sku: prod.sku,
        presentation: prod.presentation,
      })
    })
    toast.success('Todos los productos recomendados agregados al carrito', {
      description: 'Hemos cargado las presentaciones recomendadas.'
    })
  }

  const resetWizard = () => {
    setArea('')
    setSurface('')
    setDirtLevel('')
    setRecommendations([])
    setCurrentStep(1)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      
      {/* Wizard Box */}
      <div className="border bg-background rounded-3xl p-6 md:p-10 shadow-xl transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b pb-6 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Calculadora de Recomendaciones</h1>
            <p className="text-xs text-muted-foreground">Encuentra los productos exactos según tus necesidades de limpieza.</p>
          </div>
        </div>

        {/* Step Progress bar */}
        {currentStep <= 3 && (
          <div className="relative w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-primary"
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Question Step Content */}
        <AnimatePresence mode="wait">
          {currentStep <= 3 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-primary uppercase block tracking-wider mb-1">
                  Paso {currentStep} de 3
                </span>
                <h2 className="text-xl font-bold text-foreground">{steps[currentStep].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>

              {/* Options list */}
              <div className="grid grid-cols-1 gap-3">
                {steps[currentStep].options.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = 
                    (currentStep === 1 && area === opt.value) ||
                    (currentStep === 2 && surface === opt.value) ||
                    (currentStep === 3 && dirtLevel === opt.value)

                  const handleSelect = () => {
                    if (currentStep === 1) {
                      setArea(opt.value)
                      setSurface('') // reset child selections
                    }
                    if (currentStep === 2) setSurface(opt.value)
                    if (currentStep === 3) setDirtLevel(opt.value)
                  }

                  return (
                    <button
                      key={opt.value}
                      onClick={handleSelect}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary' 
                          : 'bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                        <span className="text-sm font-bold">{opt.label}</span>
                      </div>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : ''
                      }`}>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-background" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between pt-6 border-t mt-8">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  disabled={currentStep === 1}
                  className="rounded-xl"
                >
                  <ChevronLeft className="mr-1 h-5 w-5" />
                  Atrás
                </Button>
                <Button onClick={handleNext} className="rounded-xl font-semibold px-6 shadow-md shadow-primary/10">
                  {currentStep === 3 ? 'Calcular recomendación' : 'Siguiente'}
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-chart-3/15 text-chart-3 mb-2 animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-foreground">¡Tenemos tus Recomendaciones!</h2>
                <p className="text-sm text-muted-foreground">Basado en tus respuestas, estos son los limpiadores ideales:</p>
              </div>

              {/* Recommended Products Grid */}
              <div className="grid grid-cols-1 gap-4">
                {recommendations.map((prod) => (
                  <div key={prod.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-background shadow-xs hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{prod.brand}</span>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{prod.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{prod.shortDescription}</p>
                        <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-md mt-1 inline-block">
                          {prod.presentation}
                        </span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 border-t sm:border-0 pt-3 sm:pt-0">
                      <span className="text-base font-black text-foreground">Bs. {prod.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/producto/${prod.id}`}>
                          <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs">
                            Detalles
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => {
                            addItem({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, sku: prod.sku, presentation: prod.presentation })
                            toast.success(`${prod.name} agregado al carrito`)
                          }}
                          size="sm" 
                          className="rounded-lg h-8 text-xs"
                        >
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Combined actions */}
              <div className="bg-primary/5 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Precio del Combo Recomendado</span>
                  <span className="text-xl font-black text-foreground">
                    Bs. {recommendations.reduce((a, b) => a + b.price, 0).toFixed(2)}
                  </span>
                </div>
                <Button onClick={handleAddAllToCart} className="w-full sm:w-auto rounded-lg font-bold">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar Todo al Carrito
                </Button>
              </div>

              <div className="flex justify-center pt-6 border-t">
                <Button onClick={resetWizard} variant="ghost" className="rounded-xl flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar Calculadora
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
