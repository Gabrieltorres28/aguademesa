import Link from "next/link"
import { BarChart3, Factory, Package, Settings } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"

const items = [
  {
    href: "/marcas",
    title: "Marcas / Revendedores",
    description: "Clientes de llenado y su historial.",
    icon: Factory,
  },
  {
    href: "/stock",
    title: "Stock",
    description: "Bidones propios, insumos y alertas.",
    icon: Package,
  },
  {
    href: "/reportes",
    title: "Reportes",
    description: "Repartos, llenados, caja y stock.",
    icon: BarChart3,
  },
  {
    href: "/configuracion",
    title: "Configuración",
    description: "Tema, cuenta y contraseña.",
    icon: Settings,
  },
]

export default function MasPage() {
  return (
    <AppLayout>
      <div className="space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Más</h1>
          <p className="text-sm text-muted-foreground">Herramientas de administración y consulta.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
