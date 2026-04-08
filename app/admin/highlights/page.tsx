import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HighlightsManager } from "@/components/admin/highlights-manager";

export default function AdminHighlightsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Highlights"
        subtitle="Image highlights, gallery controls, downloads, shares aur analytics ke liye dedicated management page."
      />
      <HighlightsManager />
    </div>
  );
}
