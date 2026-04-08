"use client";

import { ResourceManager } from "@/components/admin/resource-manager";

export function NotificationsManager() {
  return (
    <ResourceManager
      endpoint="/notifications"
      title="नोटिफिकेशन मैनेजमेंट"
      subtitle="Breaking alerts, scheduled pushes aur audience-based notification flow ko yahin manage karein."
      actionLabel="नया नोटिफिकेशन"
      searchPlaceholder="नोटिफिकेशन खोजें..."
      defaultValues={{
        title: "",
        body: "",
        audience: "",
        type: "EDITORIAL",
        sentAt: "",
        isScheduled: false,
        scheduledFor: ""
      }}
      searchKeys={["title", "body", "audience", "type"]}
      stats={[
        { label: "Total Notifications", accent: "bg-[#e8eff9]", value: (items) => items.length },
        {
          label: "Scheduled",
          accent: "bg-[#edf8f5]",
          value: (items) => items.filter((item) => item.isScheduled).length
        },
        {
          label: "Breaking",
          accent: "bg-[#f4ecfb]",
          value: (items) => items.filter((item) => item.type === "BREAKING").length
        },
        {
          label: "Sent",
          accent: "bg-[#fdf1e4]",
          value: (items) => items.filter((item) => item.sentAt).length
        }
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "audience", label: "Audience", placeholder: "all-users" },
        { name: "body", label: "Body", type: "textarea", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Breaking", value: "BREAKING" },
            { label: "Editorial", value: "EDITORIAL" },
            { label: "Highlight", value: "HIGHLIGHT" },
            { label: "Epaper", value: "EPAPER" }
          ]
        },
        { name: "isScheduled", label: "Schedule this notification", type: "checkbox" },
        { name: "scheduledFor", label: "Scheduled For", type: "datetime-local" }
      ]}
      columns={[
        {
          key: "title",
          label: "Notification",
          render: (item) => (
            <div>
              <p className="font-semibold text-[#17344a]">{item.title}</p>
              <p className="mt-1 text-sm text-[#6f6154]">{item.body}</p>
            </div>
          )
        },
        {
          key: "audience",
          label: "Audience",
          render: (item) => <span className="text-[#4f5b66]">{item.audience || "General"}</span>
        },
        {
          key: "type",
          label: "Type",
          render: (item) => (
            <span className="rounded-full bg-[#e9f8f4] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#1d7b79]">
              {item.type}
            </span>
          )
        },
        {
          key: "scheduledFor",
          label: "Schedule",
          render: (item) => (
            <span className="text-[#4f5b66]">
              {item.scheduledFor ? new Date(item.scheduledFor).toLocaleString("en-IN") : "Instant"}
            </span>
          )
        }
      ]}
    />
  );
}
