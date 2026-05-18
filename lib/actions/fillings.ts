"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { calculatePaymentStatus, numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { Filling } from "@/lib/types"

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
  const filledQty = numberFromForm(formData, "filled_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = filledQty * unitPrice
  const paymentStatus = calculatePaymentStatus(paidAmount, total)

  const { data, error } = await supabase
    .from("fillings")
    .insert({
      brand_id: brandId,
      filling_date: stringFromForm(formData, "filling_date"),
      received_qty: numberFromForm(formData, "received_qty"),
      filled_qty: filledQty,
      withdrawn_qty: numberFromForm(formData, "withdrawn_qty"),
      unit_price: unitPrice,
      paid_amount: paidAmount,
      payment_status: paymentStatus,
      notes: stringFromForm(formData, "notes") || null,
      created_by: user.id,
    })
    .select("id")
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

export async function registerFillingPaymentAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const totalAmount = numberFromForm(formData, "total_amount")
  const brandId = stringFromForm(formData, "brand_id")
  const paymentStatus = calculatePaymentStatus(paidAmount, totalAmount)

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
