"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { calculatePaymentStatus, numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { Filling } from "@/lib/types"

function isDeleteBlockedByPolicy(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || ""
  return Boolean(error?.code === "42501" || message.includes("row-level security") || message.includes("permission denied"))
}

export async function listFillings(): Promise<Filling[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("fillings")
    .select("*, brands(id, name)")
    .order("filling_date", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) return []
  return data as Filling[]
}

export async function getFilling(id: string): Promise<Filling | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from("fillings").select("*, brands(id, name)").eq("id", id).single()
  if (error) return null
  return data as Filling
}

export async function createFillingAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const brandId = stringFromForm(formData, "brand_id")
  const receivedQty = numberFromForm(formData, "received_qty")
  const filledQty = numberFromForm(formData, "filled_qty")
  const withdrawnQty = numberFromForm(formData, "withdrawn_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = filledQty * unitPrice
  const paymentStatus = calculatePaymentStatus(paidAmount, total)

  if (!brandId) redirect("/llenados/nuevo?error=no-brand")
  if ([receivedQty, filledQty, withdrawnQty, unitPrice, paidAmount].some((value) => value < 0)) {
    redirect("/llenados/nuevo?error=negative")
  }
  if (paidAmount > total) redirect("/llenados/nuevo?error=paid-too-high")

  const { data, error } = await supabase
    .from("fillings")
    .insert({
      brand_id: brandId,
      filling_date: stringFromForm(formData, "filling_date"),
      received_qty: receivedQty,
      filled_qty: filledQty,
      withdrawn_qty: withdrawnQty,
      unit_price: unitPrice,
      paid_amount: paidAmount,
      payment_status: paymentStatus,
      notes: stringFromForm(formData, "notes") || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) redirect(`/llenados/nuevo?error=${encodeURIComponent(error.message)}`)

  if (paidAmount > 0) {
    await supabase.from("cash_movements").insert({
      movement_date: stringFromForm(formData, "filling_date"),
      type: "INGRESO",
      category: "Llenado",
      description: "Cobro por servicio de llenado",
      amount: paidAmount,
      related_brand_id: brandId,
      created_by: user.id,
    })
  }

  revalidatePath("/")
  revalidatePath("/llenados")
  revalidatePath("/caja")
  redirect(`/llenados/${data.id}`)
}

export async function updateFillingAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const brandId = stringFromForm(formData, "brand_id")
  const receivedQty = numberFromForm(formData, "received_qty")
  const filledQty = numberFromForm(formData, "filled_qty")
  const withdrawnQty = numberFromForm(formData, "withdrawn_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = filledQty * unitPrice

  if (!id) redirect("/llenados")
  if (!brandId) redirect(`/llenados/${id}/editar?error=no-brand`)
  if ([receivedQty, filledQty, withdrawnQty, unitPrice, paidAmount].some((value) => value < 0)) {
    redirect(`/llenados/${id}/editar?error=negative`)
  }
  if (paidAmount > total) redirect(`/llenados/${id}/editar?error=paid-too-high`)

  const { error } = await supabase
    .from("fillings")
    .update({
      brand_id: brandId,
      filling_date: stringFromForm(formData, "filling_date"),
      received_qty: receivedQty,
      filled_qty: filledQty,
      withdrawn_qty: withdrawnQty,
      unit_price: unitPrice,
      paid_amount: paidAmount,
      payment_status: calculatePaymentStatus(paidAmount, total),
      notes: stringFromForm(formData, "notes") || null,
    })
    .eq("id", id)

  if (error) redirect(`/llenados/${id}/editar?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/")
  revalidatePath("/llenados")
  revalidatePath(`/llenados/${id}`)
  revalidatePath("/reportes")
  redirect(`/llenados/${id}?updated=1`)
}

export async function deleteFillingAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/llenados")

  const { data: deletedFilling, error } = await supabase.from("fillings").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "fillings", id, data: deletedFilling, error })
  if (error) {
    redirect(`/llenados?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedFilling || deletedFilling.length === 0) {
    redirect(`/llenados?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }

  revalidatePath("/")
  revalidatePath("/llenados")
  revalidatePath("/reportes")
  redirect("/llenados?deleted=1")
}

export async function registerFillingPaymentAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const totalAmount = numberFromForm(formData, "total_amount")
  const brandId = stringFromForm(formData, "brand_id")
  const paymentStatus = calculatePaymentStatus(paidAmount, totalAmount)

  if (paidAmount < 0) redirect(`/llenados/${id}?error=negative`)
  if (paidAmount > totalAmount) redirect(`/llenados/${id}?error=paid-too-high`)

  const { error } = await supabase.from("fillings").update({ paid_amount: paidAmount, payment_status: paymentStatus }).eq("id", id)
  if (!error && paidAmount > 0) {
    await supabase.from("cash_movements").insert({
      movement_date: new Date().toISOString().slice(0, 10),
      type: "INGRESO",
      category: "Llenado",
      description: "Pago registrado de llenado",
      amount: paidAmount,
      related_brand_id: brandId,
      created_by: user.id,
    })
  }

  revalidatePath(`/llenados/${id}`)
  revalidatePath("/llenados")
}
