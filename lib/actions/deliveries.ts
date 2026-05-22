"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { calculatePaymentStatus, numberFromForm, requireSupabase, stringFromForm } from "./utils"
import type { Delivery, OwnClient } from "@/lib/types"

const clientProfileColumns = ["is_active", "sector", "delivery_group", "habitual_days", "client_type"]

function isMissingOwnClientProfileColumn(error: { message?: string } | null) {
  return clientProfileColumns.some((column) => error?.message?.includes(column))
}

function isForeignKeyError(error: { code?: string; message?: string } | null) {
  return Boolean(error?.code === "23503" || error?.message?.toLowerCase().includes("foreign key"))
}

function isDeleteBlockedByPolicy(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || ""
  return Boolean(error?.code === "42501" || message.includes("row-level security") || message.includes("permission denied"))
}

export async function listOwnClients(): Promise<OwnClient[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from("own_clients").select("*").order("name")
  if (error) return []
  return data as OwnClient[]
}

function clientProfilePayload(formData: FormData) {
  return {
    sector: stringFromForm(formData, "sector", "Otros"),
    delivery_group: stringFromForm(formData, "delivery_group") || null,
    habitual_days: formData.getAll("habitual_days").map((day) => String(day)),
    client_type: stringFromForm(formData, "client_type", "fijo"),
  }
}

export async function createOwnClientAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const name = stringFromForm(formData, "name")
  if (!name) redirect("/clientes/nuevo?error=nombre")

  const payload = {
    name,
    phone: stringFromForm(formData, "phone") || null,
    address: stringFromForm(formData, "address") || null,
    ...clientProfilePayload(formData),
    notes: stringFromForm(formData, "notes") || null,
  }

  let { data, error } = await supabase
    .from("own_clients")
    .insert({
      ...payload,
      is_active: formData.get("is_active") === "on",
    })
    .select()
    .single()

  if (isMissingOwnClientProfileColumn(error)) {
    const legacyPayload = { name: payload.name, phone: payload.phone, address: payload.address, notes: payload.notes }
    const retry = await supabase.from("own_clients").insert(legacyPayload).select().single()
    data = retry.data
    error = retry.error
  }

  if (error) redirect(`/clientes/nuevo?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath("/repartos")
  revalidatePath("/recorrido")
  redirect(`/clientes/${data.id}?created=1`)
}

export async function updateOwnClientAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const name = stringFromForm(formData, "name")
  if (!id || !name) redirect(`/clientes/${id}/editar?error=nombre`)

  const payload = {
    name,
    phone: stringFromForm(formData, "phone") || null,
    address: stringFromForm(formData, "address") || null,
    ...clientProfilePayload(formData),
    notes: stringFromForm(formData, "notes") || null,
  }

  let { error } = await supabase
    .from("own_clients")
    .update({
      ...payload,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)

  if (isMissingOwnClientProfileColumn(error)) {
    const legacyPayload = { name: payload.name, phone: payload.phone, address: payload.address, notes: payload.notes }
    const retry = await supabase.from("own_clients").update(legacyPayload).eq("id", id)
    error = retry.error
  }

  if (error) redirect(`/clientes/${id}/editar?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
  revalidatePath("/repartos")
  revalidatePath("/recorrido")
  redirect(`/clientes/${id}?updated=1`)
}

export async function deactivateOwnClientAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/clientes")

  const { error } = await supabase.from("own_clients").update({ is_active: false }).eq("id", id)
  if (isMissingOwnClientProfileColumn(error)) {
    redirect(`/clientes/${id}/editar?error=${encodeURIComponent("Para desactivar clientes, primero ejecutá la migración de is_active en Supabase.")}`)
  }
  if (error) {
    console.error("Error deactivating own client", error)
    redirect(`/clientes?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
  revalidatePath("/repartos")
  revalidatePath("/recorrido")
  redirect("/clientes?deactivated=1")
}

export async function reactivateOwnClientAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/clientes")

  const { error } = await supabase.from("own_clients").update({ is_active: true }).eq("id", id)
  if (error) {
    console.error("Error reactivating own client", error)
    redirect(`/clientes?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
  revalidatePath("/repartos")
  revalidatePath("/recorrido")
  redirect("/clientes?reactivated=1")
}

export async function deleteOwnClientAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/clientes")

  const [{ data: deliveries, error: deliveriesError }, { data: cashMovements, error: cashError }] = await Promise.all([
    supabase.from("deliveries").select().eq("client_id", id),
    supabase.from("cash_movements").select().eq("related_client_id", id),
  ])

  if (deliveriesError || cashError) {
    console.error("Error checking own client associations before delete", deliveriesError || cashError)
    redirect(`/clientes?error=${encodeURIComponent("No se pudo verificar si el cliente tiene movimientos asociados.")}`)
  }

  if ((deliveries?.length || 0) > 0 || (cashMovements?.length || 0) > 0) {
    redirect(`/clientes?error=${encodeURIComponent("No se puede eliminar este cliente porque tiene repartos o movimientos asociados. Podés desactivarlo.")}`)
  }

  const { data: deletedClient, error } = await supabase.from("own_clients").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "own_clients", id, data: deletedClient, error })
  if (error) {
    if (isForeignKeyError(error)) {
      redirect(`/clientes?error=${encodeURIComponent("No se puede eliminar este cliente porque tiene repartos o movimientos asociados. Podés desactivarlo.")}`)
    }
    redirect(`/clientes?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedClient || deletedClient.length === 0) {
    redirect(`/clientes?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }

  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath("/repartos")
  revalidatePath("/caja")
  redirect("/clientes?deleted=1")
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
    .select("*, own_clients(id, name, phone, address)")
    .order("delivery_date", { ascending: false })
  if (error) return []
  return data as Delivery[]
}

export async function getDelivery(id: string): Promise<Delivery | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from("deliveries").select("*, own_clients(id, name, phone, address)").eq("id", id).single()
  if (error) return null
  return data as Delivery
}

export async function createDeliveryAction(formData: FormData) {
  const { supabase, user } = await requireSupabase()
  const clientId = stringFromForm(formData, "client_id")
  const deliveredQty = numberFromForm(formData, "delivered_qty")
  const returnedEmptyQty = numberFromForm(formData, "returned_empty_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = deliveredQty * unitPrice
  const pendingAmount = Math.max(total - paidAmount, 0)

  if (!clientId) redirect("/repartos/nuevo?error=no-client")
  if ([deliveredQty, returnedEmptyQty, unitPrice, paidAmount].some((value) => value < 0)) {
    redirect("/repartos/nuevo?error=negative")
  }
  if (paidAmount > total) redirect("/repartos/nuevo?error=paid-too-high")

  const { data, error } = await supabase
    .from("deliveries")
    .insert({
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
    .select("id")
    .single()

  if (error) redirect(`/repartos/nuevo?error=${encodeURIComponent(error.message)}`)

  const { data: client } = await supabase.from("own_clients").select("bottles_in_street, balance").eq("id", clientId).single()
  const nextBottles = Math.max(0, Number(client?.bottles_in_street || 0) + deliveredQty - returnedEmptyQty)
  const nextBalance = Number(client?.balance || 0) + pendingAmount
  await supabase.from("own_clients").update({ bottles_in_street: nextBottles, balance: nextBalance }).eq("id", clientId)

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

  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath("/repartos")
  revalidatePath("/caja")
  redirect(`/repartos/${data.id}?created=1`)
}

export async function updateDeliveryAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const clientId = stringFromForm(formData, "client_id")
  const deliveredQty = numberFromForm(formData, "delivered_qty")
  const returnedEmptyQty = numberFromForm(formData, "returned_empty_qty")
  const unitPrice = numberFromForm(formData, "unit_price")
  const paidAmount = numberFromForm(formData, "paid_amount")
  const total = deliveredQty * unitPrice
  const nextPending = Math.max(total - paidAmount, 0)

  if (!id) redirect("/repartos")
  if (!clientId) redirect(`/repartos/${id}/editar?error=no-client`)
  if ([deliveredQty, returnedEmptyQty, unitPrice, paidAmount].some((value) => value < 0)) {
    redirect(`/repartos/${id}/editar?error=negative`)
  }
  if (paidAmount > total) redirect(`/repartos/${id}/editar?error=paid-too-high`)

  const { data: previous } = await supabase
    .from("deliveries")
    .select("client_id, delivered_qty, returned_empty_qty, total_amount, paid_amount")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("deliveries")
    .update({
      client_id: clientId,
      delivery_date: stringFromForm(formData, "delivery_date"),
      product: stringFromForm(formData, "product", "Bidón 20L"),
      delivered_qty: deliveredQty,
      returned_empty_qty: returnedEmptyQty,
      unit_price: unitPrice,
      paid_amount: paidAmount,
      payment_status: calculatePaymentStatus(paidAmount, total),
      notes: stringFromForm(formData, "notes") || null,
    })
    .eq("id", id)

  if (error) redirect(`/repartos/${id}/editar?error=${encodeURIComponent(error.message)}`)

  if (previous) {
    const previousClientId = String(previous.client_id)
    const previousBottleDelta = Number(previous.delivered_qty || 0) - Number(previous.returned_empty_qty || 0)
    const previousPending = Math.max(Number(previous.total_amount || 0) - Number(previous.paid_amount || 0), 0)
    const nextBottleDelta = deliveredQty - returnedEmptyQty

    if (previousClientId === clientId) {
      const { data: client } = await supabase.from("own_clients").select("bottles_in_street, balance").eq("id", clientId).single()
      await supabase
        .from("own_clients")
        .update({
          bottles_in_street: Math.max(0, Number(client?.bottles_in_street || 0) - previousBottleDelta + nextBottleDelta),
          balance: Number(client?.balance || 0) - previousPending + nextPending,
        })
        .eq("id", clientId)
    } else {
      const { data: oldClient } = await supabase.from("own_clients").select("bottles_in_street, balance").eq("id", previousClientId).single()
      await supabase
        .from("own_clients")
        .update({
          bottles_in_street: Math.max(0, Number(oldClient?.bottles_in_street || 0) - previousBottleDelta),
          balance: Number(oldClient?.balance || 0) - previousPending,
        })
        .eq("id", previousClientId)

      const { data: newClient } = await supabase.from("own_clients").select("bottles_in_street, balance").eq("id", clientId).single()
      await supabase
        .from("own_clients")
        .update({
          bottles_in_street: Math.max(0, Number(newClient?.bottles_in_street || 0) + nextBottleDelta),
          balance: Number(newClient?.balance || 0) + nextPending,
        })
        .eq("id", clientId)
    }
  }

  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath("/repartos")
  revalidatePath(`/repartos/${id}`)
  revalidatePath("/reportes")
  redirect(`/repartos/${id}?updated=1`)
}

export async function deleteDeliveryAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/repartos")

  const { data: previous } = await supabase
    .from("deliveries")
    .select("client_id, delivered_qty, returned_empty_qty, total_amount, paid_amount")
    .eq("id", id)
    .single()

  const { data: deletedDelivery, error } = await supabase.from("deliveries").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "deliveries", id, data: deletedDelivery, error })
  if (error) {
    redirect(`/repartos?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedDelivery || deletedDelivery.length === 0) {
    redirect(`/repartos?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }

  if (previous) {
    const clientId = String(previous.client_id)
    const bottleDelta = Number(previous.delivered_qty || 0) - Number(previous.returned_empty_qty || 0)
    const pending = Math.max(Number(previous.total_amount || 0) - Number(previous.paid_amount || 0), 0)
    const { data: client } = await supabase.from("own_clients").select("bottles_in_street, balance").eq("id", clientId).single()
    await supabase
      .from("own_clients")
      .update({
        bottles_in_street: Math.max(0, Number(client?.bottles_in_street || 0) - bottleDelta),
        balance: Number(client?.balance || 0) - pending,
      })
      .eq("id", clientId)
  }

  revalidatePath("/")
  revalidatePath("/clientes")
  revalidatePath("/repartos")
  revalidatePath("/reportes")
  redirect("/repartos?deleted=1")
}
