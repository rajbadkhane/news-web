import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LogoutPanel } from "@/components/admin/logout-panel";

export default function AdminLogoutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Logout"
        subtitle="Session control aur safe exit flow yahan se handle hoga."
      />
      <LogoutPanel />
    </div>
  );
}
