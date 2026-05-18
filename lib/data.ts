// Tipos de datos
export type EstadoPago = 'pagado' | 'pendiente' | 'parcial'

export interface Cliente {
  id: string
  nombre: string
  tipo: 'marca' | 'particular'
  saldoPendiente: number
  bidonesEnCalle: number
  ultimaEntrega: string
  estado: 'activo' | 'inactivo'
  bidonesActivos?: number
  stockPropio?: boolean
  totalLlenadoMes?: number
  ultimoLlenado?: string
  estadoCuenta?: 'al-dia' | 'pendiente' | 'parcial'
}

export interface Llenado {
  id: string
  fecha: string
  marca: string
  bidonesRecibidos: number
  bidonesLlenados: number
  bidonesRetirados: number
  precioUnidad: number
  montoCobrado: number
  montoTotal: number
  estadoPago: EstadoPago
  observaciones?: string
}

export interface Reparto {
  id: string
  fecha: string
  repartidor: string
  cliente: string
  bidonesEntregados: number
  vaciosDevueltos: number
  bidonesPendientes: number
  montoCobrado: number
  montoTotal: number
  estado: 'cobrado' | 'pendiente' | 'parcial'
  producto: string
  observaciones?: string
}

export interface Producto {
  id: string
  nombre: string
  stockActual: number
  stockMinimo: number
  estado: 'normal' | 'bajo' | 'critico'
  unidad: string
}

export interface Movimiento {
  id: string
  tipo: 'ingreso' | 'egreso'
  categoria: string
  descripcion: string
  monto: number
  fecha: string
}

export interface BidonPrestado {
  id: string
  cliente: string
  cantidadPrestada: number
  fechaEntrega: string
  pendientesDevolucion: number
}

export interface HistorialCliente {
  id: string
  fecha: string
  tipo: 'llenado' | 'retiro' | 'pago' | 'entrega' | 'devolucion'
  cantidad?: number
  monto?: number
  descripcion: string
}

export const revendedores = ['Aguita', 'Azulitas', 'Cuatro Hermanitos']

// Datos ficticios realistas para Agua de Mesa Dos Hermanas
export const clientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Aguita',
    tipo: 'marca',
    saldoPendiente: 33600,
    bidonesEnCalle: 0,
    ultimaEntrega: '18/05/2026',
    ultimoLlenado: '18/05/2026',
    totalLlenadoMes: 132,
    estadoCuenta: 'pendiente',
    estado: 'activo'
  },
  {
    id: '2',
    nombre: 'Azulitas',
    tipo: 'marca',
    saldoPendiente: 0,
    bidonesEnCalle: 0,
    ultimaEntrega: '18/05/2026',
    ultimoLlenado: '18/05/2026',
    totalLlenadoMes: 108,
    estadoCuenta: 'al-dia',
    estado: 'activo'
  },
  {
    id: '3',
    nombre: 'Cuatro Hermanitos',
    tipo: 'marca',
    saldoPendiente: 6800,
    bidonesEnCalle: 0,
    ultimaEntrega: '17/05/2026',
    ultimoLlenado: '17/05/2026',
    totalLlenadoMes: 72,
    estadoCuenta: 'parcial',
    estado: 'activo'
  },
  {
    id: '4',
    nombre: 'Dos Hermanas',
    tipo: 'marca',
    saldoPendiente: 0,
    bidonesEnCalle: 0,
    ultimaEntrega: '18/05/2026',
    estado: 'activo',
    bidonesActivos: 60,
    stockPropio: true
  },
  {
    id: '5',
    nombre: 'Familia Rodríguez',
    tipo: 'particular',
    saldoPendiente: 4500,
    bidonesEnCalle: 2,
    ultimaEntrega: '15/05/2026',
    estado: 'activo'
  },
  {
    id: '6',
    nombre: 'Oficina Central',
    tipo: 'particular',
    saldoPendiente: 12000,
    bidonesEnCalle: 5,
    ultimaEntrega: '14/05/2026',
    estado: 'activo'
  }
]

export const llenados: Llenado[] = [
  {
    id: '1',
    fecha: '18/05/2026',
    marca: 'Azulitas',
    bidonesRecibidos: 36,
    bidonesLlenados: 36,
    bidonesRetirados: 36,
    precioUnidad: 700,
    montoCobrado: 25200,
    montoTotal: 25200,
    estadoPago: 'pagado',
    observaciones: 'Retirado completo por la marca'
  },
  {
    id: '2',
    fecha: '18/05/2026',
    marca: 'Aguita',
    bidonesRecibidos: 50,
    bidonesLlenados: 48,
    bidonesRetirados: 48,
    precioUnidad: 700,
    montoCobrado: 0,
    montoTotal: 33600,
    estadoPago: 'pendiente',
    observaciones: 'Quedaron 2 bidones para revisar antes del lavado'
  },
  {
    id: '3',
    fecha: '17/05/2026',
    marca: 'Cuatro Hermanitos',
    bidonesRecibidos: 24,
    bidonesLlenados: 24,
    bidonesRetirados: 24,
    precioUnidad: 700,
    montoCobrado: 10000,
    montoTotal: 16800,
    estadoPago: 'parcial',
    observaciones: 'Saldo pendiente acordado para el próximo retiro'
  },
  {
    id: '4',
    fecha: '16/05/2026',
    marca: 'Aguita',
    bidonesRecibidos: 42,
    bidonesLlenados: 42,
    bidonesRetirados: 42,
    precioUnidad: 700,
    montoCobrado: 29400,
    montoTotal: 29400,
    estadoPago: 'pagado'
  },
  {
    id: '5',
    fecha: '15/05/2026',
    marca: 'Azulitas',
    bidonesRecibidos: 30,
    bidonesLlenados: 30,
    bidonesRetirados: 30,
    precioUnidad: 700,
    montoCobrado: 21000,
    montoTotal: 21000,
    estadoPago: 'pagado'
  }
]

export const repartos: Reparto[] = [
  {
    id: '1',
    fecha: '18/05/2026',
    repartidor: 'Darien',
    cliente: 'Familia Rodríguez',
    bidonesEntregados: 4,
    vaciosDevueltos: 2,
    bidonesPendientes: 2,
    montoCobrado: 6000,
    montoTotal: 6000,
    estado: 'cobrado',
    producto: 'Bidón 20L'
  },
  {
    id: '2',
    fecha: '18/05/2026',
    repartidor: 'Marcos',
    cliente: 'Oficina Central',
    bidonesEntregados: 8,
    vaciosDevueltos: 5,
    bidonesPendientes: 3,
    montoCobrado: 6000,
    montoTotal: 12000,
    estado: 'parcial',
    producto: 'Bidón 20L',
    observaciones: 'Pagan el resto el viernes'
  },
  {
    id: '3',
    fecha: '18/05/2026',
    repartidor: 'Luis',
    cliente: 'Kiosco El Puente',
    bidonesEntregados: 10,
    vaciosDevueltos: 10,
    bidonesPendientes: 0,
    montoCobrado: 0,
    montoTotal: 15000,
    estado: 'pendiente',
    producto: 'Bidón 20L',
    observaciones: 'Cobrar la próxima semana'
  },
  {
    id: '4',
    fecha: '17/05/2026',
    repartidor: 'Darien',
    cliente: 'Dos Hermanas',
    bidonesEntregados: 20,
    vaciosDevueltos: 18,
    bidonesPendientes: 2,
    montoCobrado: 30000,
    montoTotal: 30000,
    estado: 'cobrado',
    producto: 'Bidón 20L'
  },
  {
    id: '5',
    fecha: '17/05/2026',
    repartidor: 'Marcos',
    cliente: 'Familia Rodríguez',
    bidonesEntregados: 3,
    vaciosDevueltos: 2,
    bidonesPendientes: 1,
    montoCobrado: 4500,
    montoTotal: 4500,
    estado: 'cobrado',
    producto: 'Bidón 20L'
  },
  {
    id: '6',
    fecha: '16/05/2026',
    repartidor: 'Luis',
    cliente: 'Oficina Central',
    bidonesEntregados: 5,
    vaciosDevueltos: 3,
    bidonesPendientes: 2,
    montoCobrado: 0,
    montoTotal: 7500,
    estado: 'pendiente',
    producto: 'Bidón 12L'
  }
]

export const productos: Producto[] = [
  { id: '1', nombre: 'Bidón 20L', stockActual: 145, stockMinimo: 50, estado: 'normal', unidad: 'unidades' },
  { id: '2', nombre: 'Bidón 12L', stockActual: 42, stockMinimo: 30, estado: 'normal', unidad: 'unidades' },
  { id: '3', nombre: 'Agua saborizada', stockActual: 18, stockMinimo: 20, estado: 'bajo', unidad: 'unidades' },
  { id: '4', nombre: 'Dispensers', stockActual: 8, stockMinimo: 5, estado: 'normal', unidad: 'unidades' },
  { id: '5', nombre: 'Tapas', stockActual: 250, stockMinimo: 100, estado: 'normal', unidad: 'unidades' },
  { id: '6', nombre: 'Etiquetas', stockActual: 45, stockMinimo: 100, estado: 'critico', unidad: 'unidades' },
  { id: '7', nombre: 'Sal', stockActual: 5, stockMinimo: 10, estado: 'bajo', unidad: 'bolsas' },
  { id: '8', nombre: 'Insumos varios', stockActual: 12, stockMinimo: 10, estado: 'normal', unidad: 'kits' }
]

export const movimientos: Movimiento[] = [
  { id: '1', tipo: 'ingreso', categoria: 'Llenados', descripcion: 'Servicio de llenado Azulitas', monto: 25200, fecha: '18/05/2026' },
  { id: '2', tipo: 'ingreso', categoria: 'Llenados', descripcion: 'Pago parcial Cuatro Hermanitos', monto: 10000, fecha: '17/05/2026' },
  { id: '3', tipo: 'egreso', categoria: 'Combustible', descripcion: 'Nafta camioneta', monto: 15000, fecha: '18/05/2026' },
  { id: '4', tipo: 'egreso', categoria: 'Sueldos', descripcion: 'Adelanto Darien', monto: 10000, fecha: '17/05/2026' },
  { id: '5', tipo: 'ingreso', categoria: 'Ventas propias', descripcion: 'Reparto propio Dos Hermanas', monto: 30000, fecha: '17/05/2026' },
  { id: '6', tipo: 'egreso', categoria: 'Mantenimiento', descripcion: 'Reparación dispenser', monto: 3500, fecha: '16/05/2026' },
  { id: '7', tipo: 'egreso', categoria: 'Insumos', descripcion: 'Compra etiquetas', monto: 8000, fecha: '15/05/2026' },
  { id: '8', tipo: 'ingreso', categoria: 'Ventas', descripcion: 'Cobro Familia Rodríguez', monto: 4500, fecha: '17/05/2026' }
]

export const bidonesProcesadosTerceros = llenados.map((llenado) => ({
  id: llenado.id,
  marca: llenado.marca,
  cantidadRecibida: llenado.bidonesRecibidos,
  cantidadLlenada: llenado.bidonesLlenados,
  cantidadRetirada: llenado.bidonesRetirados,
  fecha: llenado.fecha
}))

export const bidonesPrestados: BidonPrestado[] = [
  { id: '4', cliente: 'Familia Rodríguez', cantidadPrestada: 2, fechaEntrega: '15/05/2026', pendientesDevolucion: 2 },
  { id: '5', cliente: 'Oficina Central', cantidadPrestada: 5, fechaEntrega: '14/05/2026', pendientesDevolucion: 5 }
]

export const historialCliente: Record<string, HistorialCliente[]> = {
  '1': [ // Aguita
    { id: '1', fecha: '18/05/2026', tipo: 'llenado', cantidad: 48, descripcion: 'Llenado de 48 bidones de Aguita' },
    { id: '2', fecha: '18/05/2026', tipo: 'retiro', cantidad: 48, descripcion: 'Retiro de bidones llenos por Aguita' },
    { id: '3', fecha: '16/05/2026', tipo: 'llenado', cantidad: 42, descripcion: 'Llenado de 42 bidones de Aguita' },
    { id: '4', fecha: '16/05/2026', tipo: 'pago', monto: 29400, descripcion: 'Pago del servicio de llenado' },
  ],
  '2': [ // Azulitas
    { id: '1', fecha: '18/05/2026', tipo: 'llenado', cantidad: 36, descripcion: 'Llenado de 36 bidones de Azulitas' },
    { id: '2', fecha: '18/05/2026', tipo: 'retiro', cantidad: 36, descripcion: 'Retiro completo de producción' },
    { id: '3', fecha: '18/05/2026', tipo: 'pago', monto: 25200, descripcion: 'Pago del servicio de llenado' },
  ],
  '3': [ // Cuatro Hermanitos
    { id: '1', fecha: '17/05/2026', tipo: 'llenado', cantidad: 24, descripcion: 'Llenado de 24 bidones de Cuatro Hermanitos' },
    { id: '2', fecha: '17/05/2026', tipo: 'retiro', cantidad: 24, descripcion: 'Retiro de bidones llenos' },
    { id: '3', fecha: '17/05/2026', tipo: 'pago', monto: 10000, descripcion: 'Pago parcial del servicio' },
  ]
}

export const repartidores = ['Darien', 'Marcos', 'Luis']

export const categorias = {
  ingresos: ['Llenados', 'Ventas propias', 'Cobros', 'Otros'],
  egresos: ['Combustible', 'Sueldos', 'Mantenimiento', 'Insumos', 'Impuestos', 'Servicios', 'Otros']
}

// Funciones de utilidad
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('ARS', '$')
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Estadísticas calculadas
export function getEstadisticasDiarias() {
  const hoy = '18/05/2026'
  const repartosHoy = repartos.filter(r => r.fecha === hoy)
  const llenadosHoy = llenados.filter(l => l.fecha === hoy)
  const movimientosHoy = movimientos.filter(m => m.fecha === hoy)
  const totalPendienteLlenados = llenados.reduce((acc, l) => acc + Math.max(l.montoTotal - l.montoCobrado, 0), 0)
  
  return {
    ventasDelDia: movimientosHoy.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0),
    ingresosPorLlenado: llenadosHoy.reduce((acc, l) => acc + l.montoCobrado, 0),
    bidonesLlenadosHoy: llenadosHoy.reduce((acc, l) => acc + l.bidonesLlenados, 0),
    bidonesEntregadosHoy: repartosHoy.reduce((acc, r) => acc + r.bidonesEntregados, 0),
    bidonesEnCalle: clientes.reduce((acc, c) => acc + c.bidonesEnCalle, 0),
    cuentasACobrar: clientes.reduce((acc, c) => acc + c.saldoPendiente, 0),
    llenadosPendientesCobro: totalPendienteLlenados,
    revendedoresActivos: clientes.filter(c => c.tipo === 'marca' && !c.stockPropio && c.estado === 'activo').length,
    produccionDelDia: llenadosHoy.reduce((acc, l) => acc + l.bidonesLlenados, 0) + repartosHoy.reduce((acc, r) => acc + r.bidonesEntregados, 0),
    gastosDelMes: movimientos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0),
    stockDisponible: productos.filter(p => p.nombre.includes('Bidón')).reduce((acc, p) => acc + p.stockActual, 0),
    repartosDelDia: repartosHoy.length,
    pendientesDevolución: bidonesPrestados.reduce((acc, b) => acc + b.pendientesDevolucion, 0)
  }
}

export function getEstadisticasBidones() {
  const bidones20L = productos.find(p => p.nombre === 'Bidón 20L')
  const bidones12L = productos.find(p => p.nombre === 'Bidón 12L')
  const propiosEnCalle = bidonesPrestados.reduce((acc, b) => acc + b.pendientesDevolucion, 0)
  const procesadosMes = llenados.reduce((acc, l) => acc + l.bidonesLlenados, 0)
  
  return {
    totalBidones: (bidones20L?.stockActual || 0) + (bidones12L?.stockActual || 0) + propiosEnCalle,
    bidonesLlenos: (bidones20L?.stockActual || 0) + (bidones12L?.stockActual || 0),
    bidonesVacios: 35, // Simulado
    bidonesEnCalle: propiosEnCalle,
    bidonesPrestados: bidonesPrestados.reduce((acc, b) => acc + b.cantidadPrestada, 0),
    bidonesRotos: 3, // Simulado
    bidonesProcesadosTerceros: procesadosMes
  }
}

export function getEstadisticasFinanzas() {
  const ingresosDelMes = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0)
  const egresosDelMes = movimientos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0)
  
  return {
    ingresosDelDia: movimientos.filter(m => m.tipo === 'ingreso' && m.fecha === '18/05/2026').reduce((acc, m) => acc + m.monto, 0),
    egresosDelDia: movimientos.filter(m => m.tipo === 'egreso' && m.fecha === '18/05/2026').reduce((acc, m) => acc + m.monto, 0),
    ingresosDelMes,
    egresosDelMes,
    balanceMensual: ingresosDelMes - egresosDelMes
  }
}
