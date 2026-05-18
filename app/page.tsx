import { AppLayout } from "@/components/app-layout"
import { Dashboard } from "@/components/dashboard"
import { getDashboardData } from "@/lib/actions/dashboard"

export default async function HomePage() {
  const dashboard = await getDashboardData()
  return (
    <AppLayout>
      <Dashboard dashboard={dashboard} />
    </AppLayout>
  )
}
