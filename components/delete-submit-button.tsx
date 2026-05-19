"use client"

import { useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type DeleteSubmitButtonProps = {
  label?: string
  title?: string
  description?: string
  confirmLabel?: string
  pendingLabel?: string
  className?: string
}

export function DeleteSubmitButton({
  label = "Eliminar",
  title = "Confirmar eliminación",
  description = "Esta acción no se puede deshacer.",
  confirmLabel = "Eliminar",
  pendingLabel = "Procesando...",
  className,
}: DeleteSubmitButtonProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      formRef.current = triggerRef.current?.form ?? null
    }
    setOpen(nextOpen)
  }

  function handleConfirm() {
    const form = formRef.current
    if (!form) return

    setIsSubmitting(true)
    form.requestSubmit()
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          size="sm"
          className={className ?? "gap-2 text-destructive hover:text-destructive"}
        >
          <Trash2 className="h-4 w-4" />
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? pendingLabel : confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
