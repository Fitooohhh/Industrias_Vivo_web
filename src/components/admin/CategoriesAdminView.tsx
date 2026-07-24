'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { 
  Tags, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/store/useProductStore'
import { Category } from '@/types/product.types'
import { toast } from 'sonner'

const categoryFormSchema = zod.object({
  name: zod.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  icon: zod.string().min(2, 'Debe escribir el nombre de un icono Lucide (ej. Droplet, Sparkles)'),
  image: zod.string().min(5, 'La URL de la imagen referencial es obligatoria')
})

type CategoryFormValues = zod.infer<typeof categoryFormSchema>

export default function CategoriesAdminView() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useProductStore()

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema)
  })

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmitCategory = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      toast.success('Categoría actualizada con éxito')
    } else {
      addCategory({
        ...data,
        active: true
      })
      toast.success('Nueva categoría creada')
    }
    handleCloseModal()
  }

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat)
    setValue('name', cat.name)
    setValue('icon', cat.icon)
    setValue('image', cat.image)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingCategory(null)
    reset({ name: '', icon: '', image: '' })
    setShowModal(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría: "${name}"?`)) {
      deleteCategory(id)
      toast.success('Categoría eliminada')
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Gestión de Categorías</h1>
          <p className="text-xs text-muted-foreground">Administra las clasificaciones del catálogo comercial.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="rounded-xl">
          <Plus className="mr-1 h-5 w-5" />
          Nueva Categoría
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background border p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categoría..."
            className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden bg-background shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-muted/40 border-b text-xs text-muted-foreground font-bold">
              <th className="p-4">ID</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Icono Referencial</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredCategories.map(c => (
              <tr key={c.id} className="hover:bg-muted/10">
                <td className="p-4 font-mono text-xs text-muted-foreground">{c.id}</td>
                <td className="p-4 font-bold text-foreground">{c.name}</td>
                <td className="p-4 text-xs font-mono text-muted-foreground">{c.icon}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleCategoryStatus(c.id)}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      c.active 
                        ? 'bg-chart-3/10 text-chart-3' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {c.active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {c.active ? 'Habilitada' : 'Inhabilitada'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(c)}
                      className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id, c.name)}
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
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitCategory)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Nombre</label>
                <input
                  {...register('name')}
                  placeholder="Desinfectantes"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Icono Lucide</label>
                <input
                  {...register('icon')}
                  placeholder="Droplet"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.icon && <span className="text-xs text-destructive">{errors.icon.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Imagen Referencial (URL)</label>
                <input
                  {...register('image')}
                  placeholder="/images/cat-desinfectantes.jpg"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary outline-hidden"
                />
                {errors.image && <span className="text-xs text-destructive">{errors.image.message}</span>}
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
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
