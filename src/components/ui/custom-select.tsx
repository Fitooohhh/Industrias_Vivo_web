'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  description?: string
}

interface CustomSelectProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
  icon,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(o => o.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-background/90 hover:bg-background border border-primary/25 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-foreground shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'ring-2 ring-primary/40 border-primary' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {icon && <span className="text-primary flex-shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-1.5 z-100 w-full min-w-[200px] bg-background/95 backdrop-blur-2xl border border-primary/20 rounded-2xl p-1.5 shadow-2xl max-h-60 overflow-y-auto space-y-1 scrollbar-none"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-foreground hover:bg-muted/80'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.description && (
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
                </button>
              )
            })}
            {options.length === 0 && (
              <div className="p-3 text-xs text-muted-foreground text-center italic">
                Sin opciones disponibles
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
