import { AppLayout } from "@/components/app-layout"
import { BidonesModule } from "@/components/bidones-module"
import { listFillings } from "@/lib/actions/fillings"
import { listStockItems } from "@/lib/actions/stock"
import { listOwnClients } from "@/lib/actions/deliveries"

export default async function BidonesPage() {
  const [fillings, stockItems, ownClients] = await Promise.all([listFillings(), listStockItems(), listOwnClients()])
  return (
    <AppLayout>
      <BidonesModule fillings={fillings} stockItems={stockItems} ownClients={ownClients} />
    </AppLayout>
  )
}
