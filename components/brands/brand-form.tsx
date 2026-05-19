import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBrandAction, deactivateBrandAction, updateBrandAction } from "@/lib/actions/brands"
import type { Brand } from "@/lib/types"

export function BrandForm({
  brand,
  error,
  created,
  updated,
}: {
  brand?: Brand | null
  error?: string
  created?: string
  updated?: string
}) {
  const isEditing = Boolean(brand)

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/marcas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Editar marca" : "Nueva marca"}</h1>
          <p className="text-sm text-muted-foreground">Revendedores y clientes de llenado</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error === "nombre" ? "El nombre es obligatorio." : decodeURIComponent(error)}
        </div>
      )}
      {created && (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Marca creada correctamente.
        </div>
      )}
      {updated && (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Marca actualizada correctamente.
        </div>
      )}

      <form action={isEditing ? updateBrandAction : createBrandAction} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos de la marca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brand && <input type="hidden" name="id" value={brand.id} />}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" name="name" defaultValue={brand?.name || ""} placeholder="Ej: Nueva marca" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" defaultValue={brand?.phone || ""} placeholder="Teléfono o WhatsApp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" name="notes" defaultValue={brand?.notes || ""} rows={4} placeholder="Condiciones, contacto, forma de pago..." />
            </div>
            <label className="flex items-center justify-between rounded-lg border p-3">
              <span>
                <span className="block text-sm font-medium">Marca activa</span>
                <span className="block text-xs text-muted-foreground">Las marcas inactivas no aparecen como opción para nuevos llenados.</span>
              </span>
              <input name="is_active" type="checkbox" defaultChecked={brand?.is_active ?? true} className="h-5 w-5" />
            </label>
          </CardContent>
        </Card>

        <Button className="w-full h-12" type="submit">
          {isEditing ? "Guardar cambios" : "Crear marca"}
        </Button>
      </form>

      {brand?.is_active && (
        <form action={deactivateBrandAction}>
          <input type="hidden" name="id" value={brand.id} />
          <DeleteSubmitButton
            label="Desactivar marca"
            title="Desactivar marca"
            description="La marca no aparecerá para nuevos llenados, pero se conserva su historial."
            confirmLabel="Desactivar"
            className="w-full text-destructive hover:text-destructive"
          />
        </form>
      )}
    </div>
  )
}
