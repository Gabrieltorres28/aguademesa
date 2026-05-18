"use server"

import { redirect } from "next/navigation"
import { requireSupabase, stringFromForm } from "./utils"

export async function updatePasswordAction(formData: FormData) {
  const { supabase } = await requireSupabase()
  const password = stringFromForm(formData, "password")
  const confirm = stringFromForm(formData, "confirm_password")

  if (password.length < 6) redirect("/configuracion?error=password-length")
  if (password !== confirm) redirect("/configuracion?error=password-match")

  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(`/configuracion?error=${encodeURIComponent(error.message)}`)

  redirect("/configuracion?updated=1")
}
