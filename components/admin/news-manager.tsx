"use client";

import { useMemo } from "react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { useAdminCategories } from "@/components/admin/use-admin-categories";

export function NewsManager() {
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
      endpoint="/articles"
      title="न्यूज़ मैनेजमेंट"
      subtitle="लेख, bilingual copy, author info aur publish status sab yahin se manage karein."
      actionLabel="नई खबर जोड़ें"
      searchPlaceholder="न्यूज़ खोजें..."
      defaultValues={{
        slug: "",
        titleEn: "",
        titleHi: "",
        excerptEn: "",
        excerptHi: "",
        contentEn: "",
        contentHi: "",
        authorName: "",
        heroImage: "",
        videoUrl: "",
        languagePrimary: "Hindi",
        status: "DRAFT",
        categoryId: ""
      }}
      searchKeys={["titleEn", "titleHi", "authorName", "slug"]}
      normalizePayload={(payload) => ({
        ...payload,
        categoryId: Number(payload.categoryId)
      })}
      stats={[
        { label: "Total News", accent: "bg-[#e8eff9]", value: (items) => items.length },
        {
          label: "Published",
          accent: "bg-[#edf8f5]",
          value: (items) => items.filter((item) => item.status === "PUBLISHED").length
        },
        {
          label: "Draft",
          accent: "bg-[#f4ecfb]",
          value: (items) => items.filter((item) => item.status === "DRAFT").length
        },
        {
          label: "Hindi Titles",
          accent: "bg-[#fdf1e4]",
          value: (items) => items.filter((item) => item.titleHi).length
        }
      ]}
      fields={[
        { name: "slug", label: "Slug", required: true, placeholder: "breaking-story-slug" },
        { name: "authorName", label: "Author", required: true, placeholder: "Editor Name" },
        { name: "titleEn", label: "Title English", required: true, placeholder: "Article title" },
        { name: "titleHi", label: "Title Hindi", placeholder: "हिंदी शीर्षक" },
        { name: "excerptEn", label: "Excerpt English", type: "textarea" },
        { name: "excerptHi", label: "Excerpt Hindi", type: "textarea" },
        { name: "contentEn", label: "Content English", type: "textarea", required: true },
        { name: "contentHi", label: "Content Hindi", type: "textarea" },
        { name: "heroImage", label: "Hero Image URL", placeholder: "/images/story.jpg" },
        { name: "videoUrl", label: "Video URL", placeholder: "https://..." },
        {
          name: "languagePrimary",
          label: "Primary Language",
          type: "select",
          options: [
            { label: "Hindi", value: "Hindi" },
            { label: "English", value: "English" }
          ]
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Draft", value: "DRAFT" },
            { label: "Review", value: "REVIEW" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Archived", value: "ARCHIVED" }
          ]
        },
        {
          name: "categoryId",
          label: "Category",
          type: "select",
          required: true,
          options: categoryOptions
        }
      ]}
      columns={[
        {
          key: "titleEn",
          label: "Title",
          render: (item) => (
            <div>
              <p className="font-semibold text-[#17344a]">{item.titleHi || item.titleEn}</p>
              <p className="mt-1 text-sm text-[#6f6154]">{item.titleEn}</p>
            </div>
          )
        },
        {
          key: "authorName",
          label: "Author",
          render: (item) => <span className="text-[#4f5b66]">{item.authorName}</span>
        },
        {
          key: "status",
          label: "Status",
          render: (item) => (
            <span className="rounded-full bg-[#e9f8f4] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#1d7b79]">
              {item.status}
            </span>
          )
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
