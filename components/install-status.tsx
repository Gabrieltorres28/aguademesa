"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true
  )
}

export function InstallStatus() {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)")
    const fullscreenQuery = window.matchMedia("(display-mode: fullscreen)")

    const updateStatus = () => setIsStandalone(isStandaloneDisplay())

    updateStatus()
    standaloneQuery.addEventListener("change", updateStatus)
    fullscreenQuery.addEventListener("change", updateStatus)

    return () => {
      standaloneQuery.removeEventListener("change", updateStatus)
      fullscreenQuery.removeEventListener("change", updateStatus)
    }
  }, [])

  if (isStandalone) {
    return (
      <Card className="border-success/30 bg-success/10">
        <CardContent className="flex items-start gap-3 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div>
            <p className="font-semibold text-foreground">La app ya está instalada</p>
            <p className="text-sm text-muted-foreground">Estás usando Gestión de Reparto desde la pantalla principal.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-start gap-3 p-4">
        <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Instalá la app en tu celular</p>
          <p className="text-sm text-muted-foreground">Seguí los pasos de tu navegador para abrir el sistema desde un ícono propio.</p>
        </div>
      </CardContent>
    </Card>
  )
}
