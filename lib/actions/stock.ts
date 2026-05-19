"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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

export async function deleteStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/stock")
  const { error } = await supabase.from("stock_items").delete().eq("id", id)
  if (error) redirect(`/stock?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/stock")
  revalidatePath("/reportes")
  redirect("/stock?deleted=1")
}
