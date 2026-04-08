import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NitManager } from "@/components/admin/nit-manager";

export default function AdminNitPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="NIT"
        subtitle="Trending policy watch, newsroom intelligence aur quick editorial signals ke liye NIT desk."
      />
      <NitManager />
    </div>
  );
}
