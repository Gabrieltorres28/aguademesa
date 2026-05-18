"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDeliveryAction } from "@/lib/actions/deliveries"
import type { OwnClient } from "@/lib/types"

export function NewDeliveryForm({ clients = [] }: { clients?: OwnClient[] }) {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/repartos"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Nuevo reparto propio</h1>
          <p className="text-sm text-muted-foreground">Operación propia de Dos Hermanas</p>
        </div>
      </div>
      <form action={createDeliveryAction} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Datos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente propio</Label>
              <select name="client_id" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Seleccionar cliente</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div className="grid gap-4 min-[420px]:grid-cols-2">
              <div className="space-y-2"><Label>Fecha</Label><Input name="delivery_date" type="date" defaultValue={today} required /></div>
              <div className="space-y-2"><Label>Producto</Label><Input name="product" defaultValue="Bidón 20L" required /></div>
              <div className="space-y-2"><Label>Entregados</Label><Input name="delivered_qty" type="number" defaultValue="0" required /></div>
              <div className="space-y-2"><Label>Vacíos devueltos</Label><Input name="returned_empty_qty" type="number" defaultValue="0" required /></div>
              <div className="space-y-2"><Label>Precio unitario</Label><Input name="unit_price" type="number" step="0.01" defaultValue="0" required /></div>
              <div className="space-y-2"><Label>Monto cobrado</Label><Input name="paid_amount" type="number" step="0.01" defaultValue="0" required /></div>
            </div>
            <div className="space-y-2"><Label>Observaciones</Label><Textarea name="notes" rows={3} /></div>
          </CardContent>
        </Card>
        <Button className="w-full h-12">Guardar reparto</Button>
      </form>
    </div>
  )
}
