"use server"

import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import type { CashMovement, Filling, StockItem } from "@/lib/types"

export interface DashboardData {
  bidonesLlenadosHoy: number
  ingresosHoy: number
  pendientesMarcas: number
  pendientesClientes: number
  gastosMes: number
  stockCritico: number
  ultimosMovimientos: CashMovement[]
  ultimosLlenados: Filling[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    bidonesLlenadosHoy: 0,
    ingresosHoy: 0,
    pendientesMarcas: 0,
    pendientesClientes: 0,
    gastosMes: 0,
    stockCritico: 0,
    ultimosMovimientos: [],
    ultimosLlenados: [],
  }

  if (!hasSupabaseEnv()) return empty

  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = today.slice(0, 8) + "01"

  const [fillingsRes, movementsRes, clientsRes, stockRes, allFillingsRes, allMovementsRes] = await Promise.all([
    supabase.from("fillings").select("*, brands(id, name)").order("filling_date", { ascending: false }).limit(5),
    supabase.from("cash_movements").select("*, brands(id, name), own_clients(id, name)").order("movement_date", { ascending: false }).limit(8),
    supabase.from("own_clients").select("balance"),
    supabase.from("stock_items").select("*"),
    supabase.from("fillings").select("filling_date, filled_qty, total_amount, paid_amount"),
    supabase.from("cash_movements").select("movement_date, type, amount").gte("movement_date", monthStart),
  ])

  const fillings = (fillingsRes.data || []) as Filling[]
  const movements = (movementsRes.data || []) as CashMovement[]
  const stockItems = (stockRes.data || []) as StockItem[]
  const allFillings = allFillingsRes.data || []
  const allMovements = allMovementsRes.data || []

  return {
    bidonesLlenadosHoy: allFillings.filter(f => f.filling_date === today).reduce((acc, f) => acc + Number(f.filled_qty || 0), 0),
    ingresosHoy: allMovements.filter(m => m.movement_date === today && m.type === "INGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0),
    pendientesMarcas: allFillings.reduce((acc, f) => acc + Math.max(Number(f.total_amount || 0) - Number(f.paid_amount || 0), 0), 0),
    pendientesClientes: (clientsRes.data || []).reduce((acc, c) => acc + Number(c.balance || 0), 0),
    gastosMes: allMovements.filter(m => m.type === "EGRESO").reduce((acc, m) => acc + Number(m.amount || 0), 0),
    stockCritico: stockItems.filter(item => item.current_stock <= item.min_stock).length,
    ultimosMovimientos: movements,
    ultimosLlenados: fillings,
  }
}
