"use server"

import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import type { CashMovement, Delivery, Filling, OwnClient, StockItem } from "@/lib/types"

type DashboardFillingRow = Pick<Filling, "brand_id" | "filling_date" | "filled_qty" | "total_amount" | "paid_amount">
type DashboardMovementRow = Pick<CashMovement, "movement_date" | "type" | "amount">

export interface DashboardData {
  bidonesLlenadosHoy: number
  ingresosHoy: number
  gastosHoy: number
  balanceHoy: number
  pendientesMarcas: number
  pendientesClientes: number
  clientesConDeuda: number
  bidonesEnCalle: number
  marcasConSaldo: number
  gastosMes: number
  stockCritico: number
  ultimosMovimientos: CashMovement[]
  ultimosLlenados: Filling[]
  ultimosRepartos: Delivery[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    bidonesLlenadosHoy: 0,
    ingresosHoy: 0,
    gastosHoy: 0,
    balanceHoy: 0,
    pendientesMarcas: 0,
    pendientesClientes: 0,
    clientesConDeuda: 0,
    bidonesEnCalle: 0,
    marcasConSaldo: 0,
    gastosMes: 0,
    stockCritico: 0,
    ultimosMovimientos: [],
    ultimosLlenados: [],
    ultimosRepartos: [],
  }

  if (!hasSupabaseEnv()) return empty

  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = today.slice(0, 8) + "01"

  const [fillingsRes, deliveriesRes, movementsRes, clientsRes, stockRes, allFillingsRes, allMovementsRes] = await Promise.all([
    supabase.from("fillings").select("*, brands(id, name)").order("filling_date", { ascending: false }).limit(5),
    supabase.from("deliveries").select("*, own_clients(id, name)").order("delivery_date", { ascending: false }).limit(5),
    supabase.from("cash_movements").select("*, brands(id, name), own_clients(id, name)").order("movement_date", { ascending: false }).limit(8),
    supabase.from("own_clients").select("balance, bottles_in_street"),
    supabase.from("stock_items").select("*"),
    supabase.from("fillings").select("brand_id, filling_date, filled_qty, total_amount, paid_amount"),
    supabase.from("cash_movements").select("movement_date, type, amount").gte("movement_date", monthStart),
  ])

  const fillings = (fillingsRes.data || []) as Filling[]
  const deliveries = (deliveriesRes.data || []) as Delivery[]
  const movements = (movementsRes.data || []) as CashMovement[]
  const clients = (clientsRes.data || []) as OwnClient[]
  const stockItems = (stockRes.data || []) as StockItem[]
  const allFillings = (allFillingsRes.data || []) as DashboardFillingRow[]
  const allMovements = (allMovementsRes.data || []) as DashboardMovementRow[]
  const ingresosHoy = allMovements.filter((m) => m.movement_date === today && m.type === "INGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)
  const gastosHoy = allMovements.filter((m) => m.movement_date === today && m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0)
  const pendingBrandIds = new Set(
    allFillings
      .filter((f) => Math.max(Number(f.total_amount || 0) - Number(f.paid_amount || 0), 0) > 0)
      .map((f) => f.brand_id)
  )

  return {
    bidonesLlenadosHoy: allFillings.filter((f) => f.filling_date === today).reduce((acc, f) => acc + Number(f.filled_qty || 0), 0),
    ingresosHoy,
    gastosHoy,
    balanceHoy: ingresosHoy - gastosHoy,
    pendientesMarcas: allFillings.reduce((acc, f) => acc + Math.max(Number(f.total_amount || 0) - Number(f.paid_amount || 0), 0), 0),
    pendientesClientes: clients.reduce((acc, c) => acc + Number(c.balance || 0), 0),
    clientesConDeuda: clients.filter((client) => Number(client.balance || 0) > 0).length,
    bidonesEnCalle: clients.reduce((acc, client) => acc + Number(client.bottles_in_street || 0), 0),
    marcasConSaldo: pendingBrandIds.size,
    gastosMes: allMovements.filter((m) => m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0),
    stockCritico: stockItems.filter(item => item.current_stock <= item.min_stock).length,
    ultimosMovimientos: movements,
    ultimosLlenados: fillings,
    ultimosRepartos: deliveries,
  }
}
