"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeControls() {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const Icon = option.icon
        const active = theme === option.value
        return (
          <Button
            key={option.value}
            type="button"
            variant={active ? "default" : "outline"}
            className="gap-2"
            onClick={() => setTheme(option.value)}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden min-[380px]:inline">{option.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
