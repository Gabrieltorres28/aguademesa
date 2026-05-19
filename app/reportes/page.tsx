import { AppLayout } from "@/components/app-layout"
import { ReportesRealModule } from "@/components/reportes-real-module"
import { listBrands } from "@/lib/actions/brands"
import { listCashMovements } from "@/lib/actions/cash"
import { listDeliveries, listOwnClients } from "@/lib/actions/deliveries"
import { listFillings } from "@/lib/actions/fillings"
import { listStockItems } from "@/lib/actions/stock"

export default async function ReportesPage() {
  const [brands, fillings, deliveries, cashMovements, stockItems, ownClients] = await Promise.all([
    listBrands(),
    listFillings(),
    listDeliveries(),
    listCashMovements(),
    listStockItems(),
    listOwnClients(),
  ])

  return (
    <AppLayout>
      <ReportesRealModule
        brands={brands}
        fillings={fillings}
        deliveries={deliveries}
        cashMovements={cashMovements}
        stockItems={stockItems}
        ownClients={ownClients}
      />
    </AppLayout>
  )
}
