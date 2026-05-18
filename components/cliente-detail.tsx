"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Truck, ArrowDownCircle, DollarSign, Plus, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { clientes, historialCliente, formatCurrency } from "@/lib/data"

interface ClienteDetailProps {
  clienteId: string
}

export function ClienteDetail({ clienteId }: ClienteDetailProps) {
  const cliente = clientes.find(c => c.id === clienteId)
  const historial = historialCliente[clienteId] || []
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  if (!cliente) {
    return (
      <div className="p-4 md:p-6">
        <p>Cliente no encontrado</p>
      </div>
    )
  }
  
  // Calcular totales del historial
  const totalEntregado = historial.filter(h => h.tipo === 'entrega').reduce((acc, h) => acc + (h.cantidad || 0), 0)
  const totalDevuelto = historial.filter(h => h.tipo === 'devolucion').reduce((acc, h) => acc + (h.cantidad || 0), 0)
  const totalPagado = historial.filter(h => h.tipo === 'pago').reduce((acc, h) => acc + (h.monto || 0), 0)
  
  const handlePayment = async () => {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 500))
    setPaymentSuccess(true)
    setTimeout(() => {
      setShowPaymentDialog(false)
      setPaymentSuccess(false)
      setPaymentAmount("")
    }, 1500)
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{cliente.nombre}</h1>
            {cliente.stockPropio && (
              <Badge variant="outline">Stock propio</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {cliente.tipo === 'marca' ? 'Marca' : 'Cliente particular'}
          </p>
        </div>
      </div>
      
      {/* Estado de cuenta */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Estado de cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Saldo pendiente</p>
              <p className={`text-2xl font-bold ${cliente.saldoPendiente > 0 ? 'text-warning' : 'text-success'}`}>
                {formatCurrency(cliente.saldoPendiente)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Bidones en calle</p>
              <p className="text-2xl font-bold">
                {cliente.bidonesEnCalle || cliente.bidonesActivos}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Entregados</p>
              <p className="font-semibold">{totalEntregado}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Devueltos</p>
              <p className="font-semibold">{totalDevuelto}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pagado</p>
              <p className="font-semibold">{formatCurrency(totalPagado)}</p>
            </div>
          </div>
          
          {/* Botón registrar pago */}
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4" disabled={cliente.saldoPendiente === 0}>
                <DollarSign className="h-4 w-4 mr-2" />
                Registrar pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar pago</DialogTitle>
                <DialogDescription>
                  Ingresá el monto del pago recibido de {cliente.nombre}
                </DialogDescription>
              </DialogHeader>
              
              {paymentSuccess ? (
                <div className="py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-success" />
                  </div>
                  <p className="font-medium">Pago registrado</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Monto a cobrar</Label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Saldo pendiente: {formatCurrency(cliente.saldoPendiente)}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handlePayment} disabled={!paymentAmount}>
                      Confirmar pago
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      {/* Historial de entregas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historial reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {historial.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin movimientos registrados
            </p>
          ) : (
            <div className="space-y-3">
              {historial.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.tipo === 'entrega' ? 'bg-primary/10' :
                    item.tipo === 'devolucion' ? 'bg-accent/10' : 'bg-success/10'
                  }`}>
                    {item.tipo === 'entrega' && <Truck className="h-4 w-4 text-primary" />}
                    {item.tipo === 'devolucion' && <ArrowDownCircle className="h-4 w-4 text-accent" />}
                    {item.tipo === 'pago' && <DollarSign className="h-4 w-4 text-success" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.descripcion}</p>
                    <p className="text-xs text-muted-foreground">{item.fecha}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {item.cantidad && (
                      <p className="font-semibold">{item.cantidad} uds</p>
                    )}
                    {item.monto && (
                      <p className="font-semibold text-success">{formatCurrency(item.monto)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Información adicional */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Última entrega</span>
            <span className="font-medium">{cliente.ultimaEntrega}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado</span>
            <Badge variant={cliente.estado === 'activo' ? 'default' : 'secondary'}>
              {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
