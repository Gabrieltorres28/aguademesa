import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOwnClientAction, deactivateOwnClientAction, deleteOwnClientAction, reactivateOwnClientAction, updateOwnClientAction } from "@/lib/actions/deliveries"
import { clientSectors, clientTypeOptions, habitualDayOptions } from "@/lib/client/client-segments"
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
              <Label htmlFor="address">Dirección o referencia</Label>
              <Input id="address" name="address" defaultValue={client?.address || ""} placeholder="Calle, número, referencia" />
            </div>
            <div className="grid gap-4 min-[520px]:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <select id="sector" name="sector" defaultValue={client?.sector || "Otros"} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {clientSectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_type">Tipo de cliente</Label>
                <select id="client_type" name="client_type" defaultValue={client?.client_type || "fijo"} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {clientTypeOptions.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_group">Grupo</Label>
              <Input id="delivery_group" name="delivery_group" defaultValue={client?.delivery_group || ""} placeholder="Facultad, oficina, punto de entrega..." />
            </div>
            <div className="space-y-2">
              <Label>Día habitual</Label>
              <div className="grid gap-2 min-[420px]:grid-cols-2">
                {habitualDayOptions.map((day) => (
                  <label key={day.value} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <input name="habitual_days" type="checkbox" value={day.value} defaultChecked={client?.habitual_days?.includes(day.value)} className="h-4 w-4" />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Sirve como sugerencia para el recorrido; el pedido real lleva fecha.</p>
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

      {client && (
        <div className="grid gap-2 min-[420px]:grid-cols-2">
          {client.is_active !== false ? (
            <form action={deactivateOwnClientAction}>
              <input type="hidden" name="id" value={client.id} />
              <Button type="submit" variant="outline" className="w-full text-warning hover:text-warning">
                Desactivar cliente
              </Button>
            </form>
          ) : (
            <form action={reactivateOwnClientAction}>
              <input type="hidden" name="id" value={client.id} />
              <Button type="submit" variant="outline" className="w-full text-success hover:text-success">
                Reactivar cliente
              </Button>
            </form>
          )}
          <form action={deleteOwnClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <DeleteSubmitButton
              label="Eliminar definitivamente"
              title="Eliminar cliente definitivamente"
              description="¿Seguro que querés eliminar este registro? Esta acción no se puede deshacer."
              confirmLabel="Eliminar definitivamente"
              className="w-full text-destructive hover:text-destructive"
            />
          </form>
        </div>
      )}
    </div>
  )
}
