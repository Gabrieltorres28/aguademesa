"use server"

import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import type { CashMovement, Delivery, Filling, OwnClient, StockItem } from "@/lib/types"

export type DashboardPeriod = "today" | "week" | "month" | "custom"

export interface DashboardFilters {
  period?: DashboardPeriod
  from?: string
  to?: string
}

export interface DashboardData {
  period: DashboardPeriod
  rangeFrom: string
  rangeTo: string
  periodLabel: string
  ingresosHoy: number
  gastosHoy: number
  balanceHoy: number
  ingresosPeriodo: number
  gastosPeriodo: number
  balancePeriodo: number
  pendienteCobroPeriodo: number
  repartosRegistrados: number
  bidonesEntregados: number
  bidonesEnCalle: number
  clientesConDeuda: number
  llenadosRegistrados: number
  bidonesLlenadosHoy: number
  bidonesLlenadosPeriodo: number
  marcasConSaldo: number
  pendientesMarcas: number
  pendientesClientes: number
  gastosMes: number
  stockCritico: number
  ultimosMovimientos: CashMovement[]
  ultimosLlenados: Filling[]
  ultimosRepartos: Delivery[]
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDateAr(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value
  return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

function getDashboardRange(filters: DashboardFilters = {}) {
  const today = new Date()
  const period = filters.period || "today"
  let from = toIsoDate(today)
  let to = from

  if (period === "week") {
    const day = today.getDay() || 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - day + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    from = toIsoDate(monday)
    to = toIsoDate(sunday)
  }

  if (period === "month") {
    from = toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1))
    to = toIsoDate(new Date(today.getFullYear(), today.getMonth() + 1, 0))
  }

  if (period === "custom" && filters.from && filters.to) {
    from = filters.from
    to = filters.to
  }

  const labels: Record<DashboardPeriod, string> = {
    today: `Hoy (${formatDateAr(from)})`,
    week: `Semana (${formatDateAr(from)} al ${formatDateAr(to)})`,
    month: `Mes (${formatDateAr(from)} al ${formatDateAr(to)})`,
    custom: `Personalizado (${formatDateAr(from)} al ${formatDateAr(to)})`,
  }

  return { period, from, to, label: labels[period] }
}

function emptyDashboard(filters: DashboardFilters = {}): DashboardData {
  const range = getDashboardRange(filters)
  return {
    period: range.period,
    rangeFrom: range.from,
    rangeTo: range.to,
    periodLabel: range.label,
    ingresosHoy: 0,
    gastosHoy: 0,
    balanceHoy: 0,
    ingresosPeriodo: 0,
    gastosPeriodo: 0,
    balancePeriodo: 0,
    pendienteCobroPeriodo: 0,
    repartosRegistrados: 0,
    bidonesEntregados: 0,
    bidonesEnCalle: 0,
    clientesConDeuda: 0,
    llenadosRegistrados: 0,
    bidonesLlenadosHoy: 0,
    bidonesLlenadosPeriodo: 0,
    marcasConSaldo: 0,
    pendientesMarcas: 0,
    pendientesClientes: 0,
    gastosMes: 0,
    stockCritico: 0,
    ultimosMovimientos: [],
    ultimosLlenados: [],
    ultimosRepartos: [],
  }
}

export async function getDashboardData(filters: DashboardFilters = {}): Promise<DashboardData> {
  const range = getDashboardRange(filters)
  const empty = emptyDashboard(filters)

  if (!hasSupabaseEnv()) return empty

  const supabase = await createClient()
  const today = toIsoDate(new Date())
  const monthStart = today.slice(0, 8) + "01"

  const [
    fillingsRes,
    deliveriesRes,
    movementsRes,
    clientsRes,
    stockRes,
    periodFillingsRes,
    periodDeliveriesRes,
    periodMovementsRes,
    monthMovementsRes,
    allFillingsRes,
  ] = await Promise.all([
    supabase.from("fillings").select("*, brands(id, name, phone)").order("filling_date", { ascending: false }).limit(5),
    supabase.from("deliveries").select("*, own_clients(id, name, phone, address)").order("delivery_date", { ascending: false }).limit(5),
    supabase.from("cash_movements").select("*, brands(id, name, phone), own_clients(id, name, phone, address)").order("movement_date", { ascending: false }).limit(5),
    supabase.from("own_clients").select("balance, bottles_in_street"),
    supabase.from("stock_items").select("*"),
    supabase.from("fillings").select("*, brands(id, name, phone)").gte("filling_date", range.from),
    supabase.from("deliveries").select("*, own_clients(id, name, phone, address)").gte("delivery_date", range.from),
    supabase.from("cash_movements").select("*, brands(id, name, phone), own_clients(id, name, phone, address)").gte("movement_date", range.from),
    supabase.from("cash_movements").select("movement_date, type, amount").gte("movement_date", monthStart),
    supabase.from("fillings").select("brand_id, total_amount, paid_amount"),
  ])

  const fillings = (fillingsRes.data || []) as Filling[]
  const deliveries = (deliveriesRes.data || []) as Delivery[]
  const movements = (movementsRes.data || []) as CashMovement[]
  const clients = (clientsRes.data || []) as OwnClient[]
  const stockItems = (stockRes.data || []) as StockItem[]
  const periodFillings = ((periodFillingsRes.data || []) as Filling[]).filter((item) => item.filling_date <= range.to)
  const periodDeliveries = ((periodDeliveriesRes.data || []) as Delivery[]).filter((item) => item.delivery_date <= range.to)
  const periodMovements = ((periodMovementsRes.data || []) as CashMovement[]).filter((item) => item.movement_date <= range.to)
  const monthMovements = (monthMovementsRes.data || []) as Pick<CashMovement, "movement_date" | "type" | "amount">[]
  const allFillings = (allFillingsRes.data || []) as Pick<Filling, "brand_id" | "total_amount" | "paid_amount">[]

  const ingresosPeriodo = periodMovements.filter((m) => m.type === "INGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)
  const gastosPeriodo = periodMovements.filter((m) => m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)
  const pendingBrandIds = new Set(
    allFillings
      .filter((f) => Math.max(Number(f.total_amount || 0) - Number(f.paid_amount || 0), 0) > 0)
      .map((f) => f.brand_id)
  )
  const pendientesRepartosPeriodo = periodDeliveries.reduce((acc, delivery) => acc + Math.max(Number(delivery.total_amount || 0) - Number(delivery.paid_amount || 0), 0), 0)
  const pendientesLlenadosPeriodo = periodFillings.reduce((acc, filling) => acc + Math.max(Number(filling.total_amount || 0) - Number(filling.paid_amount || 0), 0), 0)
  const ingresosHoy = monthMovements.filter((m) => m.movement_date === today && m.type === "INGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)
  const gastosHoy = monthMovements.filter((m) => m.movement_date === today && m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)

  return {
    period: range.period,
    rangeFrom: range.from,
    rangeTo: range.to,
    periodLabel: range.label,
    ingresosHoy,
    gastosHoy,
    balanceHoy: ingresosHoy - gastosHoy,
    ingresosPeriodo,
    gastosPeriodo,
    balancePeriodo: ingresosPeriodo - gastosPeriodo,
    pendienteCobroPeriodo: pendientesRepartosPeriodo + pendientesLlenadosPeriodo,
    repartosRegistrados: periodDeliveries.length,
    bidonesEntregados: periodDeliveries.reduce((acc, delivery) => acc + Number(delivery.delivered_qty || 0), 0),
    pendientesMarcas: allFillings.reduce((acc, f) => acc + Math.max(Number(f.total_amount || 0) - Number(f.paid_amount || 0), 0), 0),
    pendientesClientes: clients.reduce((acc, c) => acc + Number(c.balance || 0), 0),
    clientesConDeuda: clients.filter((client) => Number(client.balance || 0) > 0).length,
    bidonesEnCalle: clients.reduce((acc, client) => acc + Number(client.bottles_in_street || 0), 0),
    marcasConSaldo: pendingBrandIds.size,
    llenadosRegistrados: periodFillings.length,
    bidonesLlenadosHoy: periodFillings.filter((f) => f.filling_date === today).reduce((acc, f) => acc + Number(f.filled_qty || 0), 0),
    bidonesLlenadosPeriodo: periodFillings.reduce((acc, f) => acc + Number(f.filled_qty || 0), 0),
    gastosMes: monthMovements.filter((m) => m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0),
    stockCritico: stockItems.filter(item => item.current_stock <= item.min_stock).length,
    ultimosMovimientos: movements,
    ultimosLlenados: fillings,
    ultimosRepartos: deliveries,
  }
}
