"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { StockItem } from "@/lib/types"

function isDeleteBlockedByPolicy(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || ""
  return Boolean(error?.code === "42501" || message.includes("row-level security") || message.includes("permission denied"))
}

export async function listStockItems(): Promise<StockItem[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from("stock_items").select("*").order("name")
  if (error) return []
  return data as StockItem[]
}

export async function createStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const { error } = await supabase.from("stock_items").insert({
    name: stringFromForm(formData, "name"),
    category: stringFromForm(formData, "category"),
    current_stock: numberFromForm(formData, "current_stock"),
    min_stock: numberFromForm(formData, "min_stock"),
    unit: stringFromForm(formData, "unit", "unidad"),
    notes: stringFromForm(formData, "notes") || null,
  })
  if (error) {
    console.error("Error creating stock item", error)
    redirect(`/stock?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/stock")
  redirect("/stock?created=1")
}

export async function updateStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/stock")
  const { error } = await supabase.from("stock_items").update({
    current_stock: numberFromForm(formData, "current_stock"),
    min_stock: numberFromForm(formData, "min_stock"),
  }).eq("id", id)
  if (error) {
    console.error("Error updating stock item", error)
    redirect(`/stock?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/stock")
  redirect("/stock?updated=1")
}

export async function deleteStockItemAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/stock")
  const { data: deletedStockItem, error } = await supabase.from("stock_items").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "stock_items", id, data: deletedStockItem, error })
  if (error) {
    redirect(`/stock?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedStockItem || deletedStockItem.length === 0) {
    redirect(`/stock?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }
  revalidatePath("/stock")
  revalidatePath("/reportes")
  redirect("/stock?deleted=1")
}
