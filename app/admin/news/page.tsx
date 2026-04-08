import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewsManager } from "@/components/admin/news-manager";

export default function AdminNewsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="News"
        subtitle="सभी long-form articles, bilingual copy aur publishing lifecycle को एक जगह से manage करें।"
      />
      <NewsManager />
    </div>
  );
}
