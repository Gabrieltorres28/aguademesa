export type Role = "ADMIN" | "OPERATOR"
export type PaymentStatus = "PAGADO" | "PENDIENTE" | "PARCIAL"
export type CashMovementType = "INGRESO" | "EGRESO"
export type ClientSector = "Barrio Sur" | "Barrio Norte" | "Centro" | "Facultad" | "Otros"
export type ClientType = "fijo" | "ocasional" | "whatsapp" | "institucion_grupo"
export type HabitualDay = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo"
export type OrderStatus = "PENDIENTE" | "ENTREGADO" | "CANCELADO"

export interface Profile {
  id: string
  full_name: string | null
  role: Role
  created_at: string
}

export interface Brand {
  id: string
  name: string
  phone: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface Filling {
  id: string
  brand_id: string
  filling_date: string
  received_qty: number
  filled_qty: number
  withdrawn_qty: number
  unit_price: number
  total_amount: number
  paid_amount: number
  payment_status: PaymentStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  brands?: Pick<Brand, "id" | "name" | "phone">
}

export interface OwnClient {
  id: string
  name: string
  phone: string | null
  address: string | null
  sector: ClientSector
  delivery_group: string | null
  habitual_days: HabitualDay[]
  client_type: ClientType
  bottles_in_street: number
  balance: number
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface Delivery {
  id: string
  client_id: string
  delivery_date: string
  product: string
  delivered_qty: number
  returned_empty_qty: number
  unit_price: number
  total_amount: number
  paid_amount: number
  payment_status: PaymentStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  own_clients?: Pick<OwnClient, "id" | "name" | "phone" | "address">
}

export interface ClientOrder {
  id: string
  client_id: string
  order_date: string
  product: string
  quantity: number
  status: OrderStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  own_clients?: Pick<OwnClient, "id" | "name" | "phone" | "address" | "sector" | "delivery_group" | "habitual_days" | "client_type">
}

export interface StockItem {
  id: string
  name: string
  category: string
  current_stock: number
  min_stock: number
  unit: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CashMovement {
  id: string
  movement_date: string
  type: CashMovementType
  category: string
  description: string
  amount: number
  related_brand_id: string | null
  related_client_id: string | null
  created_by: string | null
  created_at: string
  brands?: Pick<Brand, "id" | "name" | "phone"> | null
  own_clients?: Pick<OwnClient, "id" | "name" | "phone" | "address"> | null
}

export interface AppSettings {
  id: string
  business_name: string
  default_filling_price: number
  default_delivery_price: number
  created_at: string
}

export interface ActionResult {
  ok: boolean
  message: string
}
