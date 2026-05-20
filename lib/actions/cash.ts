"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { CashMovement } from "@/lib/types"

function isDeleteBlockedByPolicy(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || ""
  return Boolean(error?.code === "42501" || message.includes("row-level security") || message.includes("permission denied"))
}

export async function listCashMovements(): Promise<CashMovement[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cash_movements")
    .select("*, brands(id, name, phone), own_clients(id, name, phone, address)")
    .order("movement_date", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) return []
  return data as CashMovement[]
}

export async function createCashMovementAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const { error } = await supabase.from("cash_movements").insert({
    movement_date: stringFromForm(formData, "movement_date"),
    type: stringFromForm(formData, "type"),
    category: stringFromForm(formData, "category"),
    description: stringFromForm(formData, "description"),
    amount: numberFromForm(formData, "amount"),
    created_by: user.id,
  })
  if (error) {
    console.error("Error creating cash movement", error)
    redirect(`/caja?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/")
  revalidatePath("/caja")
  redirect("/caja?created=1")
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

  if (error) {
    console.error("Error updating cash movement", error)
    redirect(`/caja?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/")
  revalidatePath("/caja")
  revalidatePath("/reportes")
  redirect("/caja?updated=1")
}

export async function deleteCashMovementAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/caja")
  const { data: deletedMovement, error } = await supabase.from("cash_movements").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "cash_movements", id, data: deletedMovement, error })
  if (error) {
    redirect(`/caja?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedMovement || deletedMovement.length === 0) {
    redirect(`/caja?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }
  revalidatePath("/")
  revalidatePath("/caja")
  revalidatePath("/reportes")
  redirect("/caja?deleted=1")
}
