"use client";

import { ResourceManager } from "@/components/admin/resource-manager";

export function CategoriesManager() {
  return (
    <ResourceManager
      endpoint="/categories"
      title="कैटेगरी मैनेजमेंट"
      subtitle="Frontend aur admin dono ke liye category taxonomy yahin se control hogi."
      actionLabel="नई कैटेगरी जोड़ें"
      searchPlaceholder="कैटेगरी खोजें..."
      defaultValues={{ name: "", nameHi: "", slug: "" }}
      searchKeys={["name", "nameHi", "slug"]}
      stats={[
        {
          label: "Total Categories",
          accent: "bg-[#e8eff9]",
          value: (items) => items.length
        },
        {
          label: "Hindi Ready",
          accent: "bg-[#edf8f5]",
          value: (items) => items.filter((item) => item.nameHi).length
        },
        {
          label: "With Slug",
          accent: "bg-[#f4ecfb]",
          value: (items) => items.filter((item) => item.slug).length
        },
        {
          label: "Editable Sets",
          accent: "bg-[#fdf1e4]",
          value: (items) => items.length
        }
      ]}
      fields={[
        { name: "name", label: "Category Name", required: true, placeholder: "World" },
        { name: "nameHi", label: "Category Name Hindi", placeholder: "दुनिया" },
        { name: "slug", label: "Slug", required: true, placeholder: "world" }
      ]}
      columns={[
        {
          key: "name",
          label: "Category",
          render: (item) => (
            <div>
              <p className="font-semibold text-[#17344a]">{item.nameHi || item.name}</p>
              <p className="mt-1 text-sm text-[#6f6154]">{item.name}</p>
            </div>
          )
        },
        {
          key: "slug",
          label: "Slug",
          render: (item) => <span className="text-[#4f5b66]">{item.slug}</span>
        },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => (
            <span className="text-[#4f5b66]">
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-IN") : "-"}
            </span>
          )
        }
      ]}
    />
  );
}
