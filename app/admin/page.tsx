import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DashboardOverview } from "@/components/admin/dashboard-overview";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Dashboard"
        subtitle="यह central command center है जहाँ से आप पूरे newsroom flow पर नजर रख सकते हैं।"
      />
      <DashboardOverview />
    </div>
  );
}
