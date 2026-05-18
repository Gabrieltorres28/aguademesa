import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import type { PaymentStatus } from "@/lib/types"

export function numberFromForm(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key) || fallback)
  return Number.isFinite(value) ? value : fallback
}

export function stringFromForm(formData: FormData, key: string, fallback = "") {
  return String(formData.get(key) || fallback).trim()
}

export function calculatePaymentStatus(paid: number, total: number): PaymentStatus {
  if (paid >= total && total > 0) return "PAGADO"
  if (paid > 0) return "PARCIAL"
  return "PENDIENTE"
}

export async function requireSupabase() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase no está configurado")
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/login")

  return { supabase, user: data.user }
}
