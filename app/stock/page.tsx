import { AppLayout } from "@/components/app-layout"
import { StockList } from "@/components/stock-list"
import { listStockItems } from "@/lib/actions/stock"

export const dynamic = "force-dynamic"

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string; error?: string }>
}) {
  const [stockItems, query] = await Promise.all([listStockItems(), searchParams])
  return (
    <AppLayout>
      <StockList
        stockItems={stockItems}
        status={query.deleted ? "Item de stock eliminado correctamente." : query.updated ? "Item de stock actualizado correctamente." : query.created ? "Item de stock creado correctamente." : undefined}
        error={query.error ? decodeURIComponent(query.error) : undefined}
      />
    </AppLayout>
  )
}
