"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, MapPin, Plus, Search, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/data"
import { deactivateOwnClientAction, deleteOwnClientAction, reactivateOwnClientAction } from "@/lib/actions/deliveries"
import type { OwnClient } from "@/lib/types"

export function ClientsList({ clients = [], status, error }: { clients?: OwnClient[]; status?: string; error?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const query = searchTerm.trim().toLowerCase()
  const filtered = clients.filter((client) => {
    if (!query) return true
    return [client.name, client.phone, client.address].some((value) => value?.toLowerCase().includes(query))
  })
  const activeCount = clients.filter((client) => client.is_active !== false).length
  const debtCount = clients.filter((client) => Number(client.balance) > 0).length

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">Clientes propios del reparto de Dos Hermanas</p>
        </div>
        <Link href="/clientes/nuevo">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden min-[380px]:inline">Nuevo cliente</span>
          </Button>
        </Link>
      </div>

      {status && <StatusMessage text={status} />}
      {error && <ErrorMessage text={error} />}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Clientes activos</p>
            <p className="safe-number text-xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Con deuda</p>
            <p className="safe-number text-xl font-bold">{debtCount}</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Bidones en calle</p>
            <p className="safe-number text-xl font-bold">{clients.reduce((acc, client) => acc + Number(client.bottles_in_street || 0), 0)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nombre, teléfono o dirección..."
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((client) => (
            <Card key={client.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="font-semibold break-words">{client.name}</p>
                      <Badge variant={client.is_active !== false ? "default" : "secondary"} className="text-[10px]">
                        {client.is_active !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{client.phone || "Sin teléfono"}</p>
                    {client.address && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="break-words">{client.address}</span>
                      </p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Saldo</p>
                        <p className="font-semibold">{formatCurrency(Number(client.balance || 0))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bidones en calle</p>
                        <p className="font-semibold">{client.bottles_in_street}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  <Link href={`/clientes/${client.id}`}>
                    <Button variant="outline" size="sm">Ver</Button>
                  </Link>
                  <Link href={`/clientes/${client.id}/editar`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  {client.is_active !== false ? (
                    <form action={deactivateOwnClientAction}>
                      <input type="hidden" name="id" value={client.id} />
                      <Button type="submit" variant="outline" size="sm" className="text-warning hover:text-warning">
                        Desactivar
                      </Button>
                    </form>
                  ) : (
                    <form action={reactivateOwnClientAction}>
                      <input type="hidden" name="id" value={client.id} />
                      <Button type="submit" variant="outline" size="sm" className="text-success hover:text-success">
                        Reactivar
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
                    />
                  </form>
                </div>
              </CardContent>
            </Card>
        ))}

        {clients.length === 0 && (
          <Card>
            <CardContent className="space-y-3 p-6 text-center">
              <div>
                <p className="font-semibold">Todavía no hay clientes cargados</p>
                <p className="mt-1 text-sm text-muted-foreground">Cargá tus clientes para poder registrar repartos propios.</p>
              </div>
              <Link href="/clientes/nuevo">
                <Button>Nuevo cliente</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {clients.length > 0 && filtered.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No hay clientes que coincidan con la búsqueda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


function StatusMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">{text}</div>
}

function ErrorMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{text}</div>
}
