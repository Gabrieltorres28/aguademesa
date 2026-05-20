export function normalizePhoneForWhatsApp(phone?: string | null) {
  return (phone || "").replace(/\D/g, "")
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const normalized = normalizePhoneForWhatsApp(phone)
  if (!normalized) return ""
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
