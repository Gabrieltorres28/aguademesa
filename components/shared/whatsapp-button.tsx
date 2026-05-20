"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildWhatsAppUrl } from "@/lib/client/whatsapp"

export function WhatsAppButton({ phone, message, label = "Enviar WhatsApp" }: { phone?: string | null; message: string; label?: string }) {
  const href = phone ? buildWhatsAppUrl(phone, message) : ""
  if (!href) return null

  return (
    <Button asChild type="button" variant="outline" size="sm" className="gap-2 text-success hover:text-success">
      <a href={href} target="_blank" rel="noreferrer">
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    </Button>
  )
}
