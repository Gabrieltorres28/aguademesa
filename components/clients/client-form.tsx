import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOwnClientAction, deactivateOwnClientAction, updateOwnClientAction } from "@/lib/actions/deliveries"
import type { OwnClient } from "@/lib/types"

export function ClientForm({
  client,
  error,
}: {
  client?: OwnClient | null
  error?: string
}) {
  const isEditing = Boolean(client)

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link href={client ? `/clientes/${client.id}` : "/clientes"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Editar cliente" : "Nuevo cliente"}</h1>
          <p className="text-sm text-muted-foreground">Cliente propio del reparto de Dos Hermanas</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error === "nombre" ? "El nombre es obligatorio." : decodeURIComponent(error)}
        </div>
      )}

      <form action={isEditing ? updateOwnClientAction : createOwnClientAction} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client && <input type="hidden" name="id" value={client.id} />}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" name="name" defaultValue={client?.name || ""} placeholder="Familia, comercio u oficina" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" defaultValue={client?.phone || ""} placeholder="Teléfono o WhatsApp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" name="address" defaultValue={client?.address || ""} placeholder="Calle, número, referencia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" name="notes" defaultValue={client?.notes || ""} rows={4} placeholder="Horarios, indicaciones, forma de pago..." />
            </div>
            <label className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <span>
                <span className="block text-sm font-medium">Cliente activo</span>
                <span className="block text-xs text-muted-foreground">Los clientes inactivos no aparecen en nuevos repartos.</span>
              </span>
              <input name="is_active" type="checkbox" defaultChecked={client?.is_active !== false} className="h-5 w-5" />
            </label>
          </CardContent>
        </Card>

        <Button className="h-12 w-full" type="submit">
          {isEditing ? "Guardar cambios" : "Crear cliente"}
        </Button>
      </form>

      {client?.is_active !== false && client && (
        <form action={deactivateOwnClientAction}>
          <input type="hidden" name="id" value={client.id} />
          <DeleteSubmitButton
            label="Desactivar cliente"
            title="Desactivar cliente"
            description="El cliente no aparecerá para nuevos repartos, pero se conserva su historial."
            confirmLabel="Desactivar"
            className="w-full text-destructive hover:text-destructive"
          />
        </form>
      )}
    </div>
  )
}
