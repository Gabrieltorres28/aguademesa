import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseEnv, hasSupabaseEnv } from "./config"

export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot set cookies. Middleware refreshes sessions.
        }
      },
    },
  })
}

export async function getSessionUser() {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
