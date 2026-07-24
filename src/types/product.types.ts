export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  description: string
  shortDescription: string
  features: string[]
  usageInstructions: string
  presentation: string
  price: number
  originalPrice?: number
  cost: number
  stock: number
  minStock: number
  status: 'active' | 'inactive'
  image: string
  gallery: string[]
  rating: number
  isFeatured: boolean
  targetMode: 'hogar' | 'empresas' | 'both'
}

export interface Category {
  id: string
  name: string
  icon: string
  image: string
  active: boolean
}

export interface Brand {
  id: string
  name: string
  logo: string
  description: string
  active: boolean
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'lavavajillas', name: 'Lavavajillas', icon: 'Sparkles', image: '/images/cat-multiusos.jpg', active: true },
  { id: 'desengrasantes', name: 'Desengrasantes', icon: 'Flame', image: '/images/cat-industrial.jpg', active: true },
  { id: 'desinfectantes', name: 'Desinfectantes', icon: 'ShieldAlert', image: '/images/cat-desinfectantes.jpg', active: true },
  { id: 'detergentes', name: 'Detergentes', icon: 'Droplet', image: '/images/cat-detergentes.jpg', active: true },
  { id: 'limpia-pisos', name: 'Limpia Pisos', icon: 'Sparkles', image: '/images/cat-multiusos.jpg', active: true },
  { id: 'jabon-manos', name: 'Jabón para Manos', icon: 'Droplets', image: '/images/cat-detergentes.jpg', active: true },
  { id: 'shampoo', name: 'Shampoo & Capilar', icon: 'Smile', image: '/images/cat-multiusos.jpg', active: true },
  { id: 'industrial', name: 'Línea Industrial & Automotriz', icon: 'Factory', image: '/images/cat-industrial.jpg', active: true },
]

export const MOCK_BRANDS: Brand[] = [
  { id: 'vivo-hogar', name: 'Vivo Hogar', logo: '/images/brand-hogar.png', description: 'Productos diseñados para el cuidado de tu familia y hogar.', active: true },
  { id: 'vivo-pro', name: 'Vivo Pro', logo: '/images/brand-pro.png', description: 'Soluciones químicas industriales de alta concentración.', active: true },
  { id: 'vivo-auto', name: 'Vivo Auto', logo: '/images/brand-auto.png', description: 'Cuidado y brillo superior para todo tipo de vehículos.', active: true },
]

export const MOCK_PRODUCTS: Product[] = [
  // HOGAR
  {
    id: 'prod-1',
    name: 'Desinfectante Multiuso Lavanda',
    sku: 'DV-LAV-01',
    category: 'desinfectantes',
    brand: 'Vivo Hogar',
    description: 'Elimina el 99.9% de gérmenes y bacterias de tus pisos y superficies, dejando un aroma fresco y duradero a lavanda silvestre.',
    shortDescription: 'Desinfectante líquido aromatizado de lavanda para pisos y superficies.',
    features: ['Elimina 99.9% de bacterias', 'Efecto ambientador prolongado', 'No daña superficies delicadas'],
    usageInstructions: 'Diluir 100ml en un balde de agua para limpieza general. Para desinfección profunda, aplicar directamente con un paño húmedo y dejar actuar por 5 minutos.',
    presentation: 'Galón (3.8 Litros)',
    price: 35.00,
    originalPrice: 42.00,
    cost: 15.00,
    stock: 120,
    minStock: 20,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    isFeatured: true,
    targetMode: 'hogar'
  },
  {
    id: 'prod-2',
    name: 'Detergente Líquido Activo',
    sku: 'DV-DET-02',
    category: 'detergentes',
    brand: 'Vivo Hogar',
    description: 'Detergente líquido concentrado con enzimas activas que remueven las manchas más difíciles en ropa blanca y de color, protegiendo los tejidos.',
    shortDescription: 'Detergente concentrado con enzimas activas para ropa.',
    features: ['Remueve manchas difíciles', 'Protección de colores', 'Apto para todo tipo de lavadoras'],
    usageInstructions: 'Utilizar 1 tapa para carga regular, o 1.5 tapas para cargas pesadas o muy sucias.',
    presentation: 'Botella de 3 Litros',
    price: 45.00,
    cost: 20.00,
    stock: 85,
    minStock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1610557892470-76d739a98b9b?auto=format&fit=crop&q=80&w=600',
    gallery: ['https://images.unsplash.com/photo-1610557892470-76d739a98b9b?auto=format&fit=crop&q=80&w=600'],
    rating: 4.7,
    isFeatured: true,
    targetMode: 'hogar'
  },
  {
    id: 'prod-3',
    name: 'Limpia Vidrios y Cristales Ultra-Brillo',
    sku: 'DV-VID-03',
    category: 'multiusos',
    brand: 'Vivo Hogar',
    description: 'Fórmula anti-empañante de secado rápido que disuelve la suciedad y grasa de ventanas, espejos y superficies vitrificadas sin dejar vetas.',
    shortDescription: 'Limpiador de vidrios con fórmula anti-empañante.',
    features: ['Brillo sin marcas', 'Secado instantáneo', 'Efecto anti-empañante'],
    usageInstructions: 'Rociar a 20cm de la superficie y limpiar con un paño seco de microfibra.',
    presentation: 'Atomizador de 1 Litro',
    price: 18.00,
    cost: 7.00,
    stock: 200,
    minStock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    gallery: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'],
    rating: 4.5,
    isFeatured: false,
    targetMode: 'hogar'
  },
  
  // INDUSTRIAL / DESENGRASANTES
  {
    id: 'prod-4',
    name: 'Desengrasante Industrial Alcalino',
    sku: 'DV-IND-04',
    category: 'desengrasantes',
    brand: 'Vivo Pro',
    description: 'Desengrasante de alta potencia formulado para remover aceites, grasas pesadas, brea y suciedad acumulada en maquinarias, pisos de talleres y cocinas industriales.',
    shortDescription: 'Desengrasante ultra-concentrado de uso pesado.',
    features: ['Remueve grasas y aceites pesados', 'Fórmula biodegradable concentrada', 'Bajo nivel de espuma para fácil enjuague'],
    usageInstructions: 'Dilución pesada: 1 parte de producto por 5 de agua. Dilución ligera: 1 parte por 20 de agua.',
    presentation: 'Bidón de 20 Litros',
    price: 280.00,
    originalPrice: 320.00,
    cost: 110.00,
    stock: 45,
    minStock: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
    gallery: ['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600'],
    rating: 4.9,
    isFeatured: true,
    targetMode: 'empresas'
  },
  {
    id: 'prod-5',
    name: 'Detergente Clorado Espumígeno',
    sku: 'DV-IND-05',
    category: 'detergentes',
    brand: 'Vivo Pro',
    description: 'Detergente sanitizante con cloro activo ideal para limpieza por espuma de paredes, pisos y equipos en plantas procesadoras de alimentos y mataderos.',
    shortDescription: 'Sanitizante alcalino clorado de alta espuma.',
    features: ['Alto poder sanitizante', 'Espuma de larga adherencia', 'Excelente remoción de proteínas'],
    usageInstructions: 'Aplicar preferiblemente mediante cañón de espuma en diluciones del 2% al 5% según la suciedad.',
    presentation: 'Bidón de 20 Litros',
    price: 310.00,
    cost: 130.00,
    stock: 30,
    minStock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600',
    gallery: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600'],
    rating: 4.8,
    isFeatured: true,
    targetMode: 'empresas'
  },

  // LAVAVAJILLAS
  {
    id: 'prod-7',
    name: 'Lavavajillas Poder Desengrasante',
    sku: 'DV-LAV-07',
    category: 'lavavajillas',
    brand: 'Vivo Hogar',
    description: 'Lavavajillas concentrado con fórmula reforzada que arranca la grasa más difícil de platos, ollas y sartenes cuidando tus manos.',
    shortDescription: 'Lavavajillas concentrado con poder desengrasante.',
    features: ['Fórmula reforzada', 'Arranca la grasa pegada', 'Suave con la piel'],
    usageInstructions: 'Aplicar unas gotas sobre una esponja húmeda o diluir en agua.',
    presentation: 'Botella de 1 Litro',
    price: 15.00,
    originalPrice: 18.00,
    cost: 6.00,
    stock: 150,
    minStock: 20,
    status: 'active',
    image: '/images/hero-lavavajillas.jpg',
    gallery: ['/images/hero-lavavajillas.jpg'],
    rating: 5.0,
    isFeatured: true,
    targetMode: 'hogar'
  },

  // SHAMPOO AUTOMOTRIZ
  {
    id: 'prod-6',
    name: 'Shampoo Siliconado para Auto',
    sku: 'DV-AUT-06',
    category: 'shampoo',
    brand: 'Vivo Auto',
    description: 'Shampoo neutro de alta espuma con ceras y siliconas que limpia suavemente la carrocería del auto, aportando un brillo espectacular y una capa protectora contra el polvo.',
    shortDescription: 'Shampoo con ceras y siliconas protectoras.',
    features: ['Espuma densa y pH neutro', 'Aporta brillo y protección UV', 'No barre ceras previas'],
    usageInstructions: 'Diluir 50ml en un balde de 10 litros de agua. Lavar con esponja o guante y enjuagar con abundante agua a presión.',
    presentation: 'Botella de 1 Litro',
    price: 25.00,
    cost: 10.00,
    stock: 60,
    minStock: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600',
    gallery: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600'],
    rating: 4.6,
    isFeatured: false,
    targetMode: 'hogar'
  }
]
