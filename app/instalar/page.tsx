import Link from "next/link"
import { Chrome, ExternalLink, Home, Share, Smartphone } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { InstallStatus } from "@/components/install-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    title: "Android",
    icon: Chrome,
    items: [
      "Abrí esta página con Chrome.",
      "Tocá el menú de tres puntos.",
      "Elegí Instalar app o Agregar a pantalla principal.",
      "Confirmá la instalación.",
    ],
  },
  {
    title: "iPhone",
    icon: Share,
    items: [
      "Abrí esta página con Safari.",
      "Tocá el botón Compartir.",
      "Elegí Agregar a pantalla de inicio.",
      "Confirmá el nombre y tocá Agregar.",
    ],
  },
]

export default function InstallPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Instalar en el celular</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Agregá Gestión de Reparto a la pantalla principal para entrar al sistema como una app.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Abrir sistema
            </Link>
          </Button>
        </div>

        <InstallStatus />

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((section) => {
            const Icon = section.icon

            return (
              <Card key={section.title} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {section.items.map((item, index) => (
                      <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
            <div>
              <p className="font-semibold text-foreground">Después de instalar</p>
              <p className="text-sm text-muted-foreground">Buscá el ícono Reparto en la pantalla principal y abrilo desde ahí.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir sistema
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
