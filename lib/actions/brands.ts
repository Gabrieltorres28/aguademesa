"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireSupabase, stringFromForm } from "./utils"
import type { Brand } from "@/lib/types"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

function isForeignKeyError(error: { code?: string; message?: string } | null) {
  return Boolean(error?.code === "23503" || error?.message?.toLowerCase().includes("foreign key"))
}

function isDeleteBlockedByPolicy(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || ""
  return Boolean(error?.code === "42501" || message.includes("row-level security") || message.includes("permission denied"))
}

export async function listBrands(): Promise<Brand[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase.from("brands").select("*").order("name")
  if (error) return []
  return data as Brand[]
}

export async function getBrand(id: string): Promise<Brand | null> {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from("brands").select("*").eq("id", id).single()
  if (error) return null
  return data as Brand
}

export async function createBrandAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const name = stringFromForm(formData, "name")
  if (!name) redirect("/marcas/nueva?error=nombre")

  const { data, error } = await supabase.from("brands").insert({
    name,
    phone: stringFromForm(formData, "phone") || null,
    notes: stringFromForm(formData, "notes") || null,
    is_active: formData.get("is_active") === "on",
  }).select().single()

  if (error) redirect(`/marcas/nueva?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/marcas")
  revalidatePath("/marcas")
  revalidatePath("/llenados")
  redirect(`/marcas/${data.id}/editar?created=1`)
}

export async function updateBrandAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  const name = stringFromForm(formData, "name")
  if (!id || !name) redirect(`/marcas/${id}/editar?error=nombre`)

  const { error } = await supabase.from("brands").update({
    name,
    phone: stringFromForm(formData, "phone") || null,
    notes: stringFromForm(formData, "notes") || null,
    is_active: formData.get("is_active") === "on",
  }).eq("id", id)

  if (error) redirect(`/marcas/${id}/editar?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/marcas")
  revalidatePath(`/marcas/${id}/editar`)
  revalidatePath("/llenados")
  redirect(`/marcas/${id}/editar?updated=1`)
}

export async function deactivateBrandAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/marcas")

  const { error } = await supabase.from("brands").update({ is_active: false }).eq("id", id)
  if (error) {
    console.error("Error deactivating brand", error)
    redirect(`/marcas?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/marcas")
  revalidatePath(`/marcas/${id}`)
  revalidatePath("/llenados")
  redirect("/marcas?deactivated=1")
}

export async function reactivateBrandAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/marcas")

  const { error } = await supabase.from("brands").update({ is_active: true }).eq("id", id)
  if (error) {
    console.error("Error reactivating brand", error)
    redirect(`/marcas?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath("/marcas")
  revalidatePath(`/marcas/${id}`)
  revalidatePath("/llenados")
  redirect("/marcas?reactivated=1")
}

export async function deleteBrandAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const id = stringFromForm(formData, "id")
  if (!id) redirect("/marcas")

  const [{ data: fillings, error: fillingsError }, { data: cashMovements, error: cashError }] = await Promise.all([
    supabase.from("fillings").select().eq("brand_id", id),
    supabase.from("cash_movements").select().eq("related_brand_id", id),
  ])

  if (fillingsError || cashError) {
    console.error("Error checking brand associations before delete", fillingsError || cashError)
    redirect(`/marcas?error=${encodeURIComponent("No se pudo verificar si la marca tiene movimientos asociados.")}`)
  }

  if ((fillings?.length || 0) > 0 || (cashMovements?.length || 0) > 0) {
    redirect(`/marcas?error=${encodeURIComponent("No se puede eliminar esta marca porque tiene llenados asociados.")}`)
  }

  const { data: deletedBrand, error } = await supabase.from("brands").delete().eq("id", id).select()
  console.error("Supabase delete result", { table: "brands", id, data: deletedBrand, error })
  if (error) {
    if (isForeignKeyError(error)) {
      redirect(`/marcas?error=${encodeURIComponent("No se puede eliminar esta marca porque tiene llenados asociados.")}`)
    }
    redirect(`/marcas?error=${encodeURIComponent(error.message)}`)
  }
  if (!deletedBrand || deletedBrand.length === 0) {
    redirect(`/marcas?error=${encodeURIComponent("No se encontró el registro para eliminar.")}`)
  }

  revalidatePath("/marcas")
  revalidatePath("/llenados")
  revalidatePath("/caja")
  redirect("/marcas?deleted=1")
}
