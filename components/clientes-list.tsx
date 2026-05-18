"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Users, Building2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clientes, formatCurrency } from "@/lib/data"

export function ClientesList() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const marcas = clientes.filter(c => c.tipo === 'marca')
  const particulares = clientes.filter(c => c.tipo === 'particular')
  
  const totalPendiente = clientes.reduce((acc, c) => acc + c.saldoPendiente, 0)
  const totalBidones = clientes.reduce((acc, c) => acc + c.bidonesEnCalle, 0)
  
  const filterClientes = (lista: typeof clientes) => {
    return lista.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">Gestión de marcas y clientes</p>
      </div>
      
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total pendiente</p>
            <p className="text-xl font-bold text-warning">{formatCurrency(totalPendiente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Bidones en calle</p>
            <p className="text-xl font-bold">{totalBidones}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar cliente..."
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
            <ClienteCard key={cliente.id} cliente={cliente} />
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

interface ClienteCardProps {
  cliente: typeof clientes[0]
}

function ClienteCard({ cliente }: ClienteCardProps) {
  return (
    <Link href={`/clientes/${cliente.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{cliente.nombre}</h3>
                {cliente.stockPropio && (
                  <Badge variant="outline" className="text-[10px]">Stock propio</Badge>
                )}
                {cliente.saldoPendiente > 50000 && (
                  <Badge variant="destructive" className="text-[10px]">Deuda alta</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendiente:</span>
                  <span className={`font-medium ${cliente.saldoPendiente > 0 ? 'text-warning' : 'text-success'}`}>
                    {formatCurrency(cliente.saldoPendiente)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">En calle:</span>
                  <span className="font-medium">
                    {cliente.bidonesEnCalle || cliente.bidonesActivos} bidones
                  </span>
                </div>
                <div className="col-span-2 flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Última entrega:</span>
                  <span>{cliente.ultimaEntrega}</span>
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
