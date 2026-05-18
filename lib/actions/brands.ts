"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireSupabase, stringFromForm } from "./utils"
import type { Brand } from "@/lib/types"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

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
  }).select("id").single()

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
  if (error) redirect(`/marcas/${id}/editar?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/marcas")
  revalidatePath("/llenados")
  redirect("/marcas?deactivated=1")
}
