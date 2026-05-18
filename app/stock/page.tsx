import { AppLayout } from "@/components/app-layout"
import { StockList } from "@/components/stock-list"
import { listStockItems } from "@/lib/actions/stock"

export default async function StockPage() {
  const stockItems = await listStockItems()
  return (
    <AppLayout>
      <StockList stockItems={stockItems} />
    </AppLayout>
  )
}
