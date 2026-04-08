"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Download,
  ImagePlus,
  RefreshCcw,
  Share2,
  Trash2,
  Upload,
  X
} from "lucide-react";
import {
  createRecord,
  deleteRecord,
  getList,
  updateRecord,
  type AdminRecord
} from "@/lib/admin-api";

type Category = {
  id: number;
  name: string;
  nameHi?: string;
};

type HighlightItem = AdminRecord & {
  id: number;
  titleEn: string;
  titleHi?: string;
  caption?: string;
  imageUrl?: string;
  priority?: string;
  categoryId?: number | null;
  location?: string;
  tags?: string;
  source?: string;
  altText?: string;
  views?: number;
  downloads?: number;
  shares?: number;
  showInGallery?: boolean;
  allowDownloads?: boolean;
  allowSharing?: boolean;
  addWatermark?: boolean;
};

const defaultForm = {
  titleEn: "",
  titleHi: "",
  caption: "",
  imageUrl: "",
  categoryId: "",
  priority: "NORMAL",
  priorityWeight: 1,
  location: "",
  tags: "",
  source: "",
  altText: "",
  showInGallery: true,
  allowDownloads: true,
  allowSharing: true,
  addWatermark: true,
  views: 0,
  downloads: 0,
  shares: 0,
  summaryEn: "",
  summaryHi: ""
};

export function HighlightsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HighlightItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(defaultForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [categoryData, highlightData] = await Promise.all([
        getList<Category>("/categories"),
        getList<HighlightItem>("/highlights")
      ]);
      setCategories(categoryData);
      setItems(highlightData);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "हाइलाइट्स लोड नहीं हो सके");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredItems = useMemo(() => {
    let data = [...items];
    const needle = search.trim().toLowerCase();

    if (needle) {
      data = data.filter((item) =>
        [item.titleEn, item.titleHi, item.caption, item.tags, item.location]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      );
    }

    if (categoryFilter) {
      data = data.filter((item) => String(item.categoryId || "") === categoryFilter);
    }

    if (priorityFilter) {
      data = data.filter((item) => item.priority === priorityFilter);
    }

    if (sortBy === "views") {
      data.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "downloads") {
      data.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else {
      data.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    }

    return data;
  }, [items, search, categoryFilter, priorityFilter, sortBy]);

  const totals = useMemo(
    () => ({
      totalHighlights: items.length,
      totalViews: items.reduce((sum, item) => sum + Number(item.views || 0), 0),
      downloads: items.reduce((sum, item) => sum + Number(item.downloads || 0), 0),
      shares: items.reduce((sum, item) => sum + Number(item.shares || 0), 0)
    }),
    [items]
  );

  function openNewModal() {
    setEditingItem(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  }

  function openEditModal(item: HighlightItem) {
    setEditingItem(item);
    setFormData({
      ...defaultForm,
      ...item,
      categoryId: item.categoryId ?? ""
    });
    setIsModalOpen(true);
  }

  async function handleFileSelect(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, imageUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...formData,
        titleEn: formData.titleEn || formData.titleHi || "Untitled Highlight",
        titleHi: formData.titleHi || formData.titleEn || "अनाम हाइलाइट",
        summaryEn: formData.summaryEn || formData.caption || "",
        summaryHi: formData.summaryHi || formData.caption || "",
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        priorityWeight:
          formData.priority === "HIGH" ? 3 : formData.priority === "MEDIUM" ? 2 : 1
      };

      if (editingItem?.id) {
        await updateRecord("/highlights", editingItem.id, payload);
      } else {
        await createRecord("/highlights", payload);
      }

      setIsModalOpen(false);
      setFormData(defaultForm);
      setEditingItem(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "हाइलाइट सेव नहीं हो सका");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: HighlightItem) {
    try {
      await deleteRecord("/highlights", item.id);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "डिलीट नहीं हो सका");
    }
  }

  function updateField(name: string, value: any) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Highlights", value: totals.totalHighlights, bg: "bg-[#e8eff9]" },
          { label: "Total Views", value: totals.totalViews, bg: "bg-[#edf8f5]" },
          { label: "Downloads", value: totals.downloads, bg: "bg-[#f4ecfb]" },
          { label: "Shares", value: totals.shares, bg: "bg-[#fdf1e4]" }
        ].map((item) => (
          <article
            key={item.label}
            className={`rounded-[26px] border border-white/40 p-5 shadow-[0_12px_28px_rgba(80,54,29,0.08)] ${item.bg}`}
          >
            <p className="text-sm font-semibold text-[#54616a]">{item.label}</p>
            <h3 className="mt-3 text-4xl font-black text-[#17344a]">{item.value}</h3>
          </article>
        ))}
      </div>

      <section className="rounded-[28px] border border-[#dcc6a4] bg-[#fff9f0] shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
        <div className="border-b border-[#ecd9bf] p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h3 className="font-serif text-[34px] font-bold text-[#17344a]">
                Highlights Management
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-[#605143]">
                Manage your image highlights with analytics, gallery controls, and branded workflow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openNewModal}
                className="rounded-2xl bg-[#ff7b19] px-5 py-3 text-sm font-semibold text-white"
              >
                Upload Highlight
              </button>
              <button
                onClick={() => void loadData()}
                className="rounded-2xl bg-[#3f4a5d] px-5 py-3 text-sm font-semibold text-white"
              >
                Refresh
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-[#17344a] px-5 py-3 text-sm font-semibold text-white">
                <BarChart3 size={16} />
                Analytics
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17344a]">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search highlights..."
                className="w-full rounded-2xl border border-[#d4c0a5] bg-white px-4 py-3 outline-none focus:border-[#177977]"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17344a]">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-2xl border border-[#d4c0a5] bg-white px-4 py-3 outline-none focus:border-[#177977]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameHi || category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17344a]">Priority</span>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full rounded-2xl border border-[#d4c0a5] bg-white px-4 py-3 outline-none focus:border-[#177977]"
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="NORMAL">Normal</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17344a]">Sort By</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-2xl border border-[#d4c0a5] bg-white px-4 py-3 outline-none focus:border-[#177977]"
              >
                <option value="latest">Latest First</option>
                <option value="views">Most Views</option>
                <option value="downloads">Most Downloads</option>
              </select>
            </label>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-[#6c5b4d]">डेटा लोड हो रहा है...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[24px] border border-[#ead9bf] bg-white shadow-[0_14px_28px_rgba(88,60,32,0.08)]"
                >
                  <div className="relative h-64 bg-[linear-gradient(135deg,#17344a_0%,#7e94ad_45%,#edd7b7_100%)]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.altText || item.titleHi || item.titleEn}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#17344a]">
                        <ImagePlus />
                      </div>
                    )}
                    <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
                      <span className="rounded-full bg-[#ff7b19] px-3 py-1 text-xs font-bold text-white">
                        {item.priority || "NORMAL"}
                      </span>
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-full bg-[#17344acc] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(9,19,28,0.9))] p-4 text-white">
                      <h4 className="font-serif text-2xl font-bold leading-tight">
                        {item.titleHi || item.titleEn}
                      </h4>
                      <p className="mt-2 text-sm text-white/80">{item.caption}</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#48505a] px-3 py-3 text-white">
                      <span className="flex items-center gap-2 text-sm">
                        <BarChart3 size={14} />
                        {item.views || 0}
                      </span>
                      <span className="flex items-center gap-2 text-sm">
                        <Download size={14} />
                        {item.downloads || 0}
                      </span>
                      <span className="flex items-center gap-2 text-sm">
                        <Share2 size={14} />
                        {item.shares || 0}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-[#605143]">
                      <p>{item.location || "स्थान नहीं दिया गया"}</p>
                      <p>{item.source || "Source unavailable"}</p>
                      <p>{item.tags || "No tags"}</p>
                    </div>

                    <button
                      onClick={() => void handleDelete(item)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#b2553c] px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1420bf] p-4">
          <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl font-bold text-[#17344a]">
                  {editingItem ? "Update Highlight" : "Upload New Highlight"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-[#f4e7d4] p-3 text-[#17344a]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#17344a]">Image Upload</span>
                <label className="flex min-h-[128px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d7c2a6] bg-[#fff9f0] text-center">
                  <Upload className="mb-3 text-[#177977]" />
                  <span className="text-lg font-semibold text-[#17344a]">
                    Drop your image here or click to browse
                  </span>
                  <span className="mt-1 text-sm text-[#7a6a5b]">Supports JPG, PNG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => void handleFileSelect(event.target.files?.[0])}
                  />
                </label>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Title (Optional)</span>
                  <input
                    value={formData.titleHi}
                    onChange={(event) => updateField("titleHi", event.target.value)}
                    placeholder="Enter highlight title"
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Category</span>
                  <select
                    value={formData.categoryId}
                    onChange={(event) => updateField("categoryId", event.target.value)}
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameHi || category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#17344a]">Caption</span>
                <textarea
                  value={formData.caption}
                  onChange={(event) => updateField("caption", event.target.value)}
                  rows={3}
                  placeholder="Enter detailed caption for the highlight"
                  className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Priority</span>
                  <select
                    value={formData.priority}
                    onChange={(event) => updateField("priority", event.target.value)}
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Location</span>
                  <input
                    value={formData.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="e.g., New Delhi, India"
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Tags</span>
                  <input
                    value={formData.tags}
                    onChange={(event) => updateField("tags", event.target.value)}
                    placeholder="breaking, politics, government"
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-[#17344a]">Source</span>
                  <input
                    value={formData.source}
                    onChange={(event) => updateField("source", event.target.value)}
                    placeholder="e.g., ANI, PTI, Original"
                    className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#17344a]">Alt Text</span>
                <input
                  value={formData.altText}
                  onChange={(event) => updateField("altText", event.target.value)}
                  placeholder="Image description for accessibility"
                  className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none focus:border-[#177977]"
                />
              </label>

              <div className="grid gap-4 border-t border-[#ead9bf] pt-5 md:grid-cols-2">
                {[
                  ["showInGallery", "Show in public gallery"],
                  ["allowDownloads", "Allow downloads"],
                  ["allowSharing", "Allow social sharing"],
                  ["addWatermark", "Add watermark on download"]
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 rounded-2xl bg-[#f8efdf] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={Boolean(formData[key])}
                      onChange={(event) => updateField(key, event.target.checked)}
                    />
                    <span className="text-sm font-medium text-[#17344a]">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-[#ead9bf] pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl bg-[#465164] px-5 py-3 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#ff7b19] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Highlight"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
