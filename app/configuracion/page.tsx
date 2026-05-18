import { AppLayout } from "@/components/app-layout"
import { ThemeControls } from "@/components/settings/theme-controls"
import { updatePasswordAction } from "@/lib/actions/settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; updated?: string }>
}) {
  const { error, updated } = await searchParams

  const errorMessage =
    error === "password-length" ? "La contraseña debe tener al menos 6 caracteres." :
    error === "password-match" ? "Las contraseñas no coinciden." :
    error ? decodeURIComponent(error) : ""

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">Preferencias de la cuenta y apariencia</p>
        </div>

        {updated && (
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
            Contraseña actualizada correctamente.
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Apariencia</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeControls />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cambiar contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updatePasswordAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmar contraseña</Label>
                <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required />
              </div>
              <Button type="submit" className="w-full">Actualizar contraseña</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
