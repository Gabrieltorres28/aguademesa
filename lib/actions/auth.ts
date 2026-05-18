"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"

export async function signInAction(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login?error=missing-env")

  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message || "invalid")}`)
  redirect("/")
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect("/login")
}
