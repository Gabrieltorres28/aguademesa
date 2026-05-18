import Image from "next/image"
import { signInAction } from "@/lib/actions/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { hasSupabaseEnv } from "@/lib/supabase/config"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const missingEnv = !hasSupabaseEnv() || error === "missing-env"
  const decodedError = error && error !== "missing-env" ? decodeURIComponent(error) : ""

  return (
    <main className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-3 size-16 overflow-hidden rounded-xl bg-white ring-1 ring-border">
            <Image src="/images/logo-aguademesa.png" alt="Agua de Mesa Dos Hermanas" fill className="object-contain p-1" priority />
          </div>
          <CardTitle>Agua de Mesa Dos Hermanas</CardTitle>
          <p className="text-sm text-muted-foreground">Ingresá para usuario y contraseña</p>
        </CardHeader>
        <CardContent>
          {missingEnv && (
            <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-muted-foreground">
              Configurá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`.
            </div>
          )}
          {decodedError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {decodedError === "Invalid login credentials" ? "Email o contraseña inválidos." : decodedError}
            </div>
          )}
          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button className="w-full" type="submit" disabled={missingEnv}>
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
