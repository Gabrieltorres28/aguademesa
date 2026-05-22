"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Edit, MapPin, Plus, Search, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteSubmitButton } from "@/components/delete-submit-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/data"
import { ExportCsvButton } from "@/components/shared/export-csv-button"
import { datedFilename, formatMoney } from "@/lib/client/format"
import { clientSectors, clientTypeLabel, habitualDayLabel, habitualDayOptions } from "@/lib/client/client-segments"
import type { CsvColumn } from "@/lib/client/csv"
import { deactivateOwnClientAction, deleteOwnClientAction, reactivateOwnClientAction } from "@/lib/actions/deliveries"
import type { OwnClient } from "@/lib/types"

const clientColumns: CsvColumn<OwnClient>[] = [
  { header: "Nombre", value: (client) => client.name },
  { header: "Teléfono", value: (client) => client.phone || "" },
  { header: "Dirección", value: (client) => client.address || "" },
  { header: "Sector", value: (client) => client.sector || "Otros" },
  { header: "Grupo", value: (client) => client.delivery_group || "" },
  { header: "Días habituales", value: (client) => (client.habitual_days || []).map(habitualDayLabel).join(", ") },
  { header: "Tipo", value: (client) => clientTypeLabel(client.client_type) },
  { header: "Estado", value: (client) => (client.is_active !== false ? "Activo" : "Inactivo") },
  { header: "Bidones en calle", value: (client) => client.bottles_in_street || 0 },
  { header: "Saldo pendiente", value: (client) => formatMoney(client.balance) },
  { header: "Notas", value: (client) => client.notes || "" },
]

export function ClientsList({ clients = [], status, error }: { clients?: OwnClient[]; status?: string; error?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sector, setSector] = useState("todos")
  const [day, setDay] = useState("todos")
  const [group, setGroup] = useState("todos")
  const [quickFilter, setQuickFilter] = useState("todos")
  const query = searchTerm.trim().toLowerCase()
  const groups = Array.from(new Set(clients.map((client) => client.delivery_group).filter(Boolean))).sort() as string[]
  const filtered = clients.filter((client) => {
    const matchesSearch = !query || [client.name, client.phone, client.address, client.sector, client.delivery_group].some((value) => value?.toLowerCase().includes(query))
    const matchesSector = sector === "todos" || (client.sector || "Otros") === sector
    const matchesDay = day === "todos" || (client.habitual_days || []).includes(day as never)
    const matchesGroup = group === "todos" || client.delivery_group === group
    const matchesQuickFilter = quickFilter === "todos"
      || (quickFilter === "deuda" && Number(client.balance) > 0)
      || (quickFilter === "activos" && client.is_active !== false)
      || (quickFilter === "ocasionales" && client.client_type === "ocasional")
    return matchesSearch && matchesSector && matchesDay && matchesGroup && matchesQuickFilter
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

      <div className="flex justify-end">
        <ExportCsvButton filename={datedFilename("dos-hermanas-clientes")} columns={clientColumns} rows={filtered} />
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre, teléfono o dirección..."
            className="pl-10"
          />
        </div>
        <div className="grid gap-2 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Sector" value={sector} onChange={setSector}>
            <option value="todos">Todos los sectores</option>
            {clientSectors.map((option) => <option key={option} value={option}>{option}</option>)}
          </FilterSelect>
          <FilterSelect label="Día habitual" value={day} onChange={setDay}>
            <option value="todos">Todos los días</option>
            {habitualDayOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </FilterSelect>
          <FilterSelect label="Grupo" value={group} onChange={setGroup}>
            <option value="todos">Todos los grupos</option>
            {groups.map((option) => <option key={option} value={option}>{option}</option>)}
          </FilterSelect>
          <FilterSelect label="Ver" value={quickFilter} onChange={setQuickFilter}>
            <option value="todos">Todos</option>
            <option value="deuda">Con deuda</option>
            <option value="activos">Activos</option>
            <option value="ocasionales">Ocasionales</option>
          </FilterSelect>
        </div>
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
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{client.sector || "Otros"}</Badge>
                      {client.delivery_group && <Badge variant="secondary" className="text-[10px]">Grupo: {client.delivery_group}</Badge>}
                      <Badge variant="outline" className="text-[10px]">{clientTypeLabel(client.client_type)}</Badge>
                      {(client.habitual_days || []).map((habitualDay) => <Badge key={habitualDay} variant="outline" className="text-[10px]">{habitualDayLabel(habitualDay)}</Badge>)}
                    </div>
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


function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="space-y-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground">
        {children}
      </select>
    </label>
  )
}

function StatusMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">{text}</div>
}

function ErrorMessage({ text }: { text: string }) {
  return <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{text}</div>
}
