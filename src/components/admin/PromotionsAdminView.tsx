'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePromotionStore, Promotion } from '@/store/usePromotionStore'
import { toast } from 'sonner'

const promoFormSchema = zod.object({
  name: zod.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: zod.string().min(5, 'La descripción es obligatoria'),
  type: zod.enum(['percentage', 'flat', '2x1', 'free_shipping']),
  value: zod.number().min(0, 'El valor no puede ser negativo'),
  startDate: zod.string().min(10, 'La fecha de inicio es obligatoria'),
  endDate: zod.string().min(10, 'La fecha de finalización es obligatoria')
})

type PromoFormValues = zod.infer<typeof promoFormSchema>

export default function PromotionsAdminView() {
  const { promotions, addPromotion, updatePromotion, deletePromotion, togglePromotionStatus } = usePromotionStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PromoFormValues>({
    resolver: zodResolver(promoFormSchema)
  })

  const filteredPromos = promotions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmitPromo = (data: PromoFormValues) => {
    if (editingPromo) {
      updatePromotion(editingPromo.id, data)
      toast.success('Promoción actualizada con éxito')
    } else {
      addPromotion({
        ...data,
        active: true
      })
      toast.success('Nueva promoción creada')
    }
    handleCloseModal()
  }

  const handleEditClick = (promo: Promotion) => {
    setEditingPromo(promo)
    setValue('name', promo.name)
    setValue('description', promo.description)
    setValue('type', promo.type)
    setValue('value', promo.value)
    setValue('startDate', promo.startDate)
    setValue('endDate', promo.endDate)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingPromo(null)
    reset({ name: '', description: '', type: 'percentage', value: 0, startDate: '', endDate: '' })
    setShowModal(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la promoción: "${name}"?`)) {
      deletePromotion(id)
      toast.success('Promoción eliminada')
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gestión de Promociones</h1>
          <p className="text-xs text-muted-foreground">Administra los descuentos de fábrica y combos del sistema comercial.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="rounded-xl">
          <Plus className="mr-1 h-5 w-5" />
          Nueva Promoción
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar promoción..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">Promoción</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Vigencia</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredPromos.map(p => (
              <tr key={p.id} className="hover:bg-muted/10">
                <td className="p-4">
                  <div>
                    <span className="font-bold block text-foreground leading-tight">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{p.description}</span>
                  </div>
                </td>
                <td className="p-4 text-xs font-semibold capitalize text-muted-foreground">{p.type}</td>
                <td className="p-4 font-semibold">
                  {p.type === 'percentage' ? `${p.value}%` : p.type === 'flat' ? `Bs. ${p.value}` : 'N/A'}
                </td>
                <td className="p-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{p.startDate} al {p.endDate}</span>
                  </div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => togglePromotionStatus(p.id)}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      p.active 
                        ? 'bg-chart-3/10 text-chart-3' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {p.active ? 'Activa' : 'Inactiva'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg border hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">
                {editingPromo ? 'Editar Promoción' : 'Nueva Promoción'}
              </h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitPromo)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre</label>
                <input
                  {...register('name')}
                  placeholder="20% Descuento Especial"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Descripción</label>
                <input
                  {...register('description')}
                  placeholder="Por compras mayores a cierto monto..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.description && <span className="text-xs text-destructive">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Tipo Descuento</label>
                  <select
                    {...register('type')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  >
                    <option value="percentage">Porcentual</option>
                    <option value="flat">Fijo (Monto)</option>
                    <option value="2x1">2x1</option>
                    <option value="free_shipping">Envío Gratis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Valor</label>
                  <input
                    type="number"
                    step="any"
                    {...register('value', { valueAsNumber: true })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.value && <span className="text-xs text-destructive">{errors.value.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Inicio Vigencia</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.startDate && <span className="text-xs text-destructive">{errors.startDate.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Fin Vigencia</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                  />
                  {errors.endDate && <span className="text-xs text-destructive">{errors.endDate.message}</span>}
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseModal}
                  className="rounded-lg"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-lg font-bold">
                  {editingPromo ? 'Guardar Cambios' : 'Crear Promoción'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
