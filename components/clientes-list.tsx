"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Users, Building2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/data"
import type { Brand, OwnClient } from "@/lib/types"

export function ClientesList({ brands = [], ownClients = [] }: { brands?: Brand[], ownClients?: OwnClient[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const marcas = brands
  const particulares = ownClients
  
  const totalPendiente = particulares.reduce((acc, c) => acc + Number(c.balance || 0), 0)
  
  const filterClientes = <T extends { name: string }>(lista: T[]) => {
    return lista.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marcas y clientes</h1>
        <p className="text-sm text-muted-foreground">Cuentas a cobrar por servicio de llenado y operación propia</p>
      </div>
      
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Pendiente clientes propios</p>
            <p className="text-xl font-bold text-warning">{formatCurrency(totalPendiente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Marcas activas</p>
            <p className="text-xl font-bold">{brands.filter(b => b.is_active).length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar marca o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="marcas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marcas" className="gap-2">
            <Building2 className="h-4 w-4" />
            Marcas ({marcas.length})
          </TabsTrigger>
          <TabsTrigger value="particulares" className="gap-2">
            <Users className="h-4 w-4" />
            Particulares ({particulares.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="marcas" className="mt-4 space-y-3">
          {filterClientes(marcas).map((cliente) => (
            <MarcaCard key={cliente.id} brand={cliente} />
          ))}
        </TabsContent>
        
        <TabsContent value="particulares" className="mt-4 space-y-3">
          {filterClientes(particulares).map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MarcaCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/clientes/${brand.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold break-words">{brand.name}</h3>
                <Badge variant={brand.is_active ? "default" : "secondary"} className="text-[10px]">
                  {brand.is_active ? "Activa" : "Inactiva"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Cliente de llenado. Sus bidones no son stock propio de Dos Hermanas.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ClienteCard({ cliente }: { cliente: OwnClient }) {
  return (
    <Link href={`/clientes/${cliente.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{cliente.name}</h3>
                {Number(cliente.balance) > 0 && (
                  <Badge variant="outline" className="text-[10px]">Pendiente</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm min-[420px]:grid-cols-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendiente:</span>
                  <span className={`font-medium ${Number(cliente.balance) > 0 ? 'text-warning' : 'text-success'}`}>
                    {formatCurrency(Number(cliente.balance))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    En calle:
                  </span>
                  <span className="font-medium">
                    {cliente.bottles_in_street} bidones
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-1 min-[420px]:col-span-2">
                  <span>Dirección:</span>
                  <span>{cliente.address || "Sin dirección"}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
