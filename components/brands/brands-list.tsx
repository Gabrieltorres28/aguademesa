"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Edit, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Brand } from "@/lib/types"

export function BrandsList({ brands = [] }: { brands?: Brand[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const filtered = brands.filter(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const activeCount = brands.filter(brand => brand.is_active).length

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Marcas</h1>
          <p className="text-sm text-muted-foreground">Revendedores y clientes de llenado</p>
        </div>
        <Link href="/marcas/nueva">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden min-[380px]:inline">Nueva marca</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Marcas activas</p>
            <p className="text-xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total marcas</p>
            <p className="text-xl font-bold">{brands.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar marca..."
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((brand) => (
          <Card key={brand.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="font-semibold break-words">{brand.name}</p>
                    <Badge variant={brand.is_active ? "default" : "secondary"} className="text-[10px]">
                      {brand.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{brand.phone || "Sin teléfono"}</p>
                  {brand.notes && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{brand.notes}</p>}
                </div>
                <Link href={`/marcas/${brand.id}/editar`}>
                  <Button variant="ghost" size="icon" aria-label={`Editar ${brand.name}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No hay marcas para mostrar.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
