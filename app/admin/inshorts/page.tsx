import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { InshortsManager } from "@/components/admin/inshorts-manager";

export default function AdminInshortsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Inshorts"
        subtitle="Mobile-first short format ke liye crisp content creation aur publish flow yahin available है।"
      />
      <InshortsManager />
    </div>
  );
}
