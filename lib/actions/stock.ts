"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { StockItem } from "@/lib/types"

export async function listStockItems(): Promise<StockItem[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from("stock_items").select("*").order("name")
  if (error) return []
  return data as StockItem[]
}

export async function createStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  await supabase.from("stock_items").insert({
    name: stringFromForm(formData, "name"),
    category: stringFromForm(formData, "category"),
    current_stock: numberFromForm(formData, "current_stock"),
    min_stock: numberFromForm(formData, "min_stock"),
    unit: stringFromForm(formData, "unit", "unidad"),
    notes: stringFromForm(formData, "notes") || null,
  })
  revalidatePath("/stock")
}

export async function updateStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  await supabase.from("stock_items").update({
    current_stock: numberFromForm(formData, "current_stock"),
    min_stock: numberFromForm(formData, "min_stock"),
  }).eq("id", stringFromForm(formData, "id"))
  revalidatePath("/stock")
}
