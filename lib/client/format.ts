export function formatDateDisplay(value?: string | Date | null) {
  if (!value) return ""
  if (value instanceof Date) {
    return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(value)
  }
  const [year, month, day] = value.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return value
  return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function formatMoney(value: number | string | null | undefined) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0)).replace("ARS", "$")
}

export function todayIso() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function datedFilename(prefix: string) {
  return `${prefix}-${todayIso()}.csv`
}
