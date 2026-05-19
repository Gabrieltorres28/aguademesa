"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { CashMovement } from "@/lib/types"

export async function listCashMovements(): Promise<CashMovement[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cash_movements")
    .select("*, brands(id, name), own_clients(id, name)")
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) return []
  return data as CashMovement[]
}

export async function createCashMovementAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  await supabase.from("cash_movements").insert({
    movement_date: stringFromForm(formData, "movement_date"),
    type: stringFromForm(formData, "type"),
    category: stringFromForm(formData, "category"),
    description: stringFromForm(formData, "description"),
    amount: numberFromForm(formData, "amount"),
    created_by: user.id,
  })
  revalidatePath("/")
  revalidatePath("/caja")
}

export async function updateCashMovementAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/caja")
  const { error } = await supabase
    .from("cash_movements")
    .update({
      movement_date: stringFromForm(formData, "movement_date"),
      type: stringFromForm(formData, "type"),
      category: stringFromForm(formData, "category"),
      description: stringFromForm(formData, "description"),
      amount: numberFromForm(formData, "amount"),
    })
    .eq("id", id)

  if (error) redirect(`/caja?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/")
  revalidatePath("/caja")
  revalidatePath("/reportes")
  redirect("/caja?updated=1")
}

export async function deleteCashMovementAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/caja")
  const { error } = await supabase.from("cash_movements").delete().eq("id", id)
  if (error) redirect(`/caja?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/")
  revalidatePath("/caja")
  revalidatePath("/reportes")
  redirect("/caja?deleted=1")
}
