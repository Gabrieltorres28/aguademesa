import { AppLayout } from "@/components/app-layout"
import { Dashboard } from "@/components/dashboard"
import { getDashboardData, type DashboardPeriod } from "@/lib/actions/dashboard"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: DashboardPeriod; from?: string; to?: string }>
}) {
  const params = await searchParams
  const dashboard = await getDashboardData({ period: params.period, from: params.from, to: params.to })
  return (
    <AppLayout>
      <Dashboard dashboard={dashboard} />
    </AppLayout>
  )
}
