import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Categories"
        subtitle="Frontend aur backend taxonomy ko aligned rakhne ke liye categories ko yahin se control करें।"
      />
      <CategoriesManager />
    </div>
  );
}
