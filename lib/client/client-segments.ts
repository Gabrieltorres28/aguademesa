import type { ClientSector, ClientType, HabitualDay } from "@/lib/types"

export const clientSectors: ClientSector[] = ["Barrio Sur", "Barrio Norte", "Centro", "Facultad", "Otros"]

export const clientTypeOptions: { value: ClientType; label: string }[] = [
  { value: "fijo", label: "Fijo" },
  { value: "ocasional", label: "Ocasional" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "institucion_grupo", label: "Institución / grupo" },
]

export const habitualDayOptions: { value: HabitualDay; label: string }[] = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
]

const dayByIndex = habitualDayOptions.map((day) => day.value)

export function todayHabitualDay(date = new Date()) {
  return dayByIndex[(date.getDay() + 6) % 7]
}

export function clientTypeLabel(type?: ClientType | null) {
  return clientTypeOptions.find((option) => option.value === type)?.label || "Fijo"
}

export function habitualDayLabel(day: HabitualDay) {
  return habitualDayOptions.find((option) => option.value === day)?.label || day
}

export function sectorBroadcastMessage(sector: ClientSector) {
  if (sector === "Facultad") return "Hoy paso por Facultad. ¿Quién necesita bidones?"
  return `Hoy reparto en ${sector}. Tomo pedidos hasta las 10:30.`
}
