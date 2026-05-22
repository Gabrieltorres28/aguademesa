"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { ClientOrder, OrderStatus } from "@/lib/types"

const orderStatuses: OrderStatus[] = ["PENDIENTE", "ENTREGADO", "CANCELADO"]

export async function listOrdersForDate(date: string): Promise<ClientOrder[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*, own_clients(id, name, phone, address, sector, delivery_group, habitual_days, client_type)")
    .eq("order_date", date)
    .order("created_at", { ascending: true })

  if (error) return []
  return data as ClientOrder[]
}

export async function createQuickOrderAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const clientId = stringFromForm(formData, "client_id")
  const orderDate = stringFromForm(formData, "order_date")
  const quantity = numberFromForm(formData, "quantity")

  if (!clientId || !orderDate) redirect("/recorrido?error=pedido")
  if (quantity <= 0) redirect("/recorrido?error=cantidad")

  const { error } = await supabase.from("orders").insert({
    client_id: clientId,
    order_date: orderDate,
    product: stringFromForm(formData, "product", "Bidón 20L"),
    quantity,
    status: "PENDIENTE",
    notes: stringFromForm(formData, "notes") || null,
    created_by: user.id,
  })

  if (error) redirect(`/recorrido?error=${encodeURIComponent(error.message)}`)

  revalidatePath("/recorrido")
  redirect("/recorrido?created=1")
}

export async function setOrderStatusAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const status = stringFromForm(formData, "status") as OrderStatus

  if (!id || !orderStatuses.includes(status)) redirect("/recorrido?error=estado")

  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) redirect(`/recorrido?error=${encodeURIComponent(error.message)}`)

  revalidatePath("/recorrido")
  redirect("/recorrido?updated=1")
}
