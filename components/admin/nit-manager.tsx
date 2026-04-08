"use client";

import { useMemo } from "react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { useAdminCategories } from "@/components/admin/use-admin-categories";

export function NitManager() {
  const categories = useAdminCategories();
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.nameHi || category.name,
        value: category.id
      })),
    [categories]
  );

  return (
    <ResourceManager
      endpoint="/nit"
      title="NIT Management"
      subtitle="NIT desk ke trend items, policy watch notes aur editorial summaries yahin handle honge."
      actionLabel="नया NIT जोड़ें"
      searchPlaceholder="NIT खोजें..."
      defaultValues={{
        title: "",
        titleHi: "",
        summary: "",
        summaryHi: "",
        region: "",
        tag: "",
        sentiment: "NEUTRAL",
        priority: "MEDIUM",
        source: "",
        isActive: true,
        categoryId: ""
      }}
      searchKeys={["title", "titleHi", "tag", "region", "source"]}
      normalizePayload={(payload) => ({
        ...payload,
        categoryId: payload.categoryId ? Number(payload.categoryId) : null
      })}
      stats={[
        { label: "Total NIT", accent: "bg-[#e8eff9]", value: (items) => items.length },
        {
          label: "High Priority",
          accent: "bg-[#edf8f5]",
          value: (items) => items.filter((item) => item.priority === "HIGH").length
        },
        {
          label: "Active",
          accent: "bg-[#f4ecfb]",
          value: (items) => items.filter((item) => item.isActive).length
        },
        {
          label: "Regional Tags",
          accent: "bg-[#fdf1e4]",
          value: (items) => items.filter((item) => item.region).length
        }
      ]}
      fields={[
        { name: "title", label: "Title English", required: true },
        { name: "titleHi", label: "Title Hindi" },
        { name: "summary", label: "Summary English", type: "textarea", required: true },
        { name: "summaryHi", label: "Summary Hindi", type: "textarea" },
        { name: "region", label: "Region" },
        { name: "tag", label: "Tag" },
        { name: "source", label: "Source" },
        {
          name: "sentiment",
          label: "Sentiment",
          type: "select",
          options: [
            { label: "Positive", value: "POSITIVE" },
            { label: "Neutral", value: "NEUTRAL" },
            { label: "Negative", value: "NEGATIVE" }
          ]
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          options: [
            { label: "High", value: "HIGH" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Low", value: "LOW" }
          ]
        },
        {
          name: "categoryId",
          label: "Category",
          type: "select",
          options: categoryOptions
        },
        { name: "isActive", label: "Active", type: "checkbox" }
      ]}
      columns={[
        {
          key: "title",
          label: "NIT Item",
          render: (item) => (
            <div>
              <p className="font-semibold text-[#17344a]">{item.titleHi || item.title}</p>
              <p className="mt-1 text-sm text-[#6f6154]">{item.title}</p>
            </div>
          )
        },
        {
          key: "meta",
          label: "Meta",
          render: (item) => (
            <div className="space-y-1 text-sm text-[#4f5b66]">
              <p>{item.region || "राष्ट्रीय"}</p>
              <p>{item.tag || "General"}</p>
            </div>
          )
        },
        {
          key: "priority",
          label: "Priority",
          render: (item) => (
            <span className="rounded-full bg-[#fff0e3] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#b2553c]">
              {item.priority}
            </span>
          )
        },
        {
          key: "status",
          label: "Status",
          render: (item) => <span className="text-[#4f5b66]">{item.isActive ? "Active" : "Paused"}</span>
        }
      ]}
    />
  );
}
