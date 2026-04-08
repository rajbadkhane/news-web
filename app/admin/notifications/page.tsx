import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NotificationsManager } from "@/components/admin/notifications-manager";

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Notifications"
        subtitle="Breaking pushes, scheduled alerts aur audience messaging के लिए यह पूरा control panel है।"
      />
      <NotificationsManager />
    </div>
  );
}
