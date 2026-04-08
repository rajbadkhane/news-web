"use client";

import { useMemo } from "react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { useAdminCategories } from "@/components/admin/use-admin-categories";

export function InshortsManager() {
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
      endpoint="/inshorts"
      title="इनशॉर्ट्स मैनेजमेंट"
      subtitle="छोटे, तेज aur mobile-first short updates ke liye dedicated control panel."
      actionLabel="नया इनशॉर्ट"
      searchPlaceholder="इनशॉर्ट्स खोजें..."
      defaultValues={{
        headlineEn: "",
        headlineHi: "",
        bodyEn: "",
        bodyHi: "",
        isPublished: true,
        categoryId: ""
      }}
      searchKeys={["headlineEn", "headlineHi", "bodyEn", "bodyHi"]}
      normalizePayload={(payload) => ({
        ...payload,
        categoryId: payload.categoryId ? Number(payload.categoryId) : null
      })}
      stats={[
        { label: "Total Inshorts", accent: "bg-[#e8eff9]", value: (items) => items.length },
        {
          label: "Published",
          accent: "bg-[#edf8f5]",
          value: (items) => items.filter((item) => item.isPublished).length
        },
        {
          label: "Hindi Headlines",
          accent: "bg-[#f4ecfb]",
          value: (items) => items.filter((item) => item.headlineHi).length
        },
        {
          label: "Category Linked",
          accent: "bg-[#fdf1e4]",
          value: (items) => items.filter((item) => item.categoryId).length
        }
      ]}
      fields={[
        { name: "headlineEn", label: "Headline English", required: true },
        { name: "headlineHi", label: "Headline Hindi" },
        { name: "bodyEn", label: "Body English", type: "textarea", required: true },
        { name: "bodyHi", label: "Body Hindi", type: "textarea" },
        {
          name: "categoryId",
          label: "Category",
          type: "select",
          options: categoryOptions
        },
        { name: "isPublished", label: "Published", type: "checkbox" }
      ]}
      columns={[
        {
          key: "headlineEn",
          label: "Headline",
          render: (item) => (
            <div>
              <p className="font-semibold text-[#17344a]">{item.headlineHi || item.headlineEn}</p>
              <p className="mt-1 text-sm text-[#6f6154]">{item.headlineEn}</p>
            </div>
          )
        },
        {
          key: "bodyEn",
          label: "Summary",
          render: (item) => <p className="max-w-md text-sm text-[#4f5b66]">{item.bodyHi || item.bodyEn}</p>
        },
        {
          key: "isPublished",
          label: "Status",
          render: (item) => (
            <span className="rounded-full bg-[#e9f8f4] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#1d7b79]">
              {item.isPublished ? "PUBLISHED" : "DRAFT"}
            </span>
          )
        }
      ]}
    />
  );
}
