"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { calculatePaymentStatus, numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { Delivery, OwnClient } from "@/lib/types"

export async function listOwnClients(): Promise<OwnClient[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from("own_clients").select("*").order("name")
  if (error) return []
  return data as OwnClient[]
}

export async function getOwnClient(id: string): Promise<OwnClient | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from("own_clients").select("*").eq("id", id).single()
  if (error) return null
  return data as OwnClient
}

export async function listDeliveries(): Promise<Delivery[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deliveries")
    .select("*, own_clients(id, name)")
    .order("delivery_date", { ascending: false })
  if (error) return []
  return data as Delivery[]
}

export async function createDeliveryAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const clientId = stringFromForm(formData, "client_id")
  const deliveredQty = numberFromForm(formData, "delivered_qty")
  const returnedEmptyQty = numberFromForm(formData, "returned_empty_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = deliveredQty * unitPrice

  const { error } = await supabase.from("deliveries").insert({
    client_id: clientId,
    delivery_date: stringFromForm(formData, "delivery_date"),
    product: stringFromForm(formData, "product", "Bidón 20L"),
    delivered_qty: deliveredQty,
    returned_empty_qty: returnedEmptyQty,
    unit_price: unitPrice,
    paid_amount: paidAmount,
    payment_status: calculatePaymentStatus(paidAmount, total),
    notes: stringFromForm(formData, "notes") || null,
    created_by: user.id,
  })

  if (!error) {
    const { data: client } = await supabase.from("own_clients").select("bottles_in_street").eq("id", clientId).single()
    const nextBottles = Math.max(0, Number(client?.bottles_in_street || 0) + deliveredQty - returnedEmptyQty)
    await supabase.from("own_clients").update({ bottles_in_street: nextBottles }).eq("id", clientId)

    if (paidAmount > 0) {
      await supabase.from("cash_movements").insert({
        movement_date: stringFromForm(formData, "delivery_date"),
        type: "INGRESO",
        category: "Reparto propio",
        description: "Cobro por reparto propio",
        amount: paidAmount,
        related_client_id: clientId,
        created_by: user.id,
      })
    }
  }

  revalidatePath("/")
  revalidatePath("/marcas")
  revalidatePath("/caja")
}
