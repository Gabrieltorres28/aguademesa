import { AppLayout } from "@/components/app-layout"
import { ReportesModule } from "@/components/reportes-module"
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
      <ReportesModule
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
