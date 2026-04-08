"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCcw, Trash2, X } from "lucide-react";
import {
  createRecord,
  deleteRecord,
  getList,
  type AdminRecord,
  updateRecord
} from "@/lib/admin-api";

type FieldOption = {
  label: string;
  value: string | number;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "checkbox" | "number" | "datetime-local";
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
};

type ColumnConfig<T extends AdminRecord> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
};

type StatConfig<T extends AdminRecord> = {
  label: string;
  accent: string;
  value: (items: T[]) => React.ReactNode;
};

export function ResourceManager<T extends AdminRecord>({
  endpoint,
  title,
  subtitle,
  actionLabel,
  searchPlaceholder,
  fields,
  columns,
  stats,
  defaultValues,
  searchKeys,
  normalizePayload
}: {
  endpoint: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  searchPlaceholder: string;
  fields: FieldConfig[];
  columns: ColumnConfig<T>[];
  stats: StatConfig<T>[];
  defaultValues: Record<string, any>;
  searchKeys: string[];
  normalizePayload?: (payload: Record<string, any>) => Record<string, any>;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(defaultValues);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const data = await getList<T>(endpoint);
      setItems(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "डेटा लोड नहीं हो सका");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [endpoint]);

  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return items;

    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] || "").toLowerCase().includes(needle))
    );
  }, [items, search, searchKeys]);

  function openCreateModal() {
    setEditingItem(null);
    setFormData(defaultValues);
    setIsModalOpen(true);
  }

  function openEditModal(item: T) {
    const normalizedFields = fields.reduce<Record<string, any>>((acc, field) => {
      const rawValue = item[field.name];
      if (field.type === "datetime-local" && rawValue) {
        const date = new Date(rawValue);
        acc[field.name] = Number.isNaN(date.getTime())
          ? ""
          : new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
        return acc;
      }

      acc[field.name] = rawValue;
      return acc;
    }, {});

    setEditingItem(item);
    setFormData({ ...defaultValues, ...normalizedFields });
    setIsModalOpen(true);
  }

  function updateField(name: string, value: any) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = normalizePayload ? normalizePayload(formData) : formData;

      if (editingItem?.id) {
        await updateRecord(endpoint, editingItem.id, payload);
      } else {
        await createRecord(endpoint, payload);
      }

      setIsModalOpen(false);
      setFormData(defaultValues);
      setEditingItem(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "सेव नहीं हो सका");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: T) {
    try {
      setError("");
      await deleteRecord(endpoint, item.id);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "डिलीट नहीं हो सका");
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`rounded-[26px] border border-white/40 p-5 shadow-[0_12px_28px_rgba(80,54,29,0.08)] ${stat.accent}`}
          >
            <p className="text-sm font-semibold text-[#54616a]">{stat.label}</p>
            <h3 className="mt-3 text-4xl font-black text-[#17344a]">{stat.value(items)}</h3>
          </article>
        ))}
      </div>

      <section className="rounded-[28px] border border-[#dcc6a4] bg-[#fff9f0] shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
        <div className="border-b border-[#ecd9bf] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="font-serif text-[34px] font-bold text-[#17344a]">{title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#605143]">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void loadData()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#3f4a5d] px-5 py-3 text-sm font-semibold text-white"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#ff7b19] px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                {actionLabel}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#17344a]">Search</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="mt-2 w-full rounded-2xl border border-[#d4c0a5] bg-white px-4 py-3 outline-none transition focus:border-[#177977]"
            />
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
        </div>

        <div className="overflow-x-auto p-6">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-[#8d6c4d]">
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-2">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-[#6c5b4d]">
                    डेटा लोड हो रहा है...
                  </td>
                </tr>
              ) : filteredItems.length ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="rounded-2xl bg-[#fff4e4]">
                    {columns.map((column, index) => (
                      <td
                        key={column.key}
                        className={`px-4 py-4 ${index === 0 ? "rounded-l-2xl" : ""}`}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#17344a] px-4 py-2 text-sm font-semibold text-white"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => void handleDelete(item)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#b2553c] px-4 py-2 text-sm font-semibold text-white"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-[#6c5b4d]">
                    कोई रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09131ccc] p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl font-bold text-[#17344a]">
                  {editingItem ? "रिकॉर्ड अपडेट करें" : actionLabel}
                </h3>
                <p className="mt-2 text-[#6c5b4d]">
                  सभी जरूरी fields भरें ताकि section सही तरीके से live data से चले।
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-[#f3e3cb] p-3 text-[#17344a]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              {fields.map((field) => {
                const value = formData[field.name];
                const type = field.type || "text";

                if (type === "textarea") {
                  return (
                    <label key={field.name} className="md:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-[#17344a]">
                        {field.label}
                      </span>
                      <textarea
                        required={field.required}
                        value={value || ""}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none transition focus:border-[#177977]"
                      />
                    </label>
                  );
                }

                if (type === "select") {
                  return (
                    <label key={field.name}>
                      <span className="mb-2 block text-sm font-semibold text-[#17344a]">
                        {field.label}
                      </span>
                      <select
                        required={field.required}
                        value={value ?? ""}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none transition focus:border-[#177977]"
                      >
                        <option value="">Select</option>
                        {(field.options || []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                if (type === "checkbox") {
                  return (
                    <label key={field.name} className="flex items-center gap-3 rounded-2xl bg-[#f9f0e2] px-4 py-4">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => updateField(field.name, event.target.checked)}
                      />
                      <span className="text-sm font-semibold text-[#17344a]">{field.label}</span>
                    </label>
                  );
                }

                return (
                  <label key={field.name}>
                    <span className="mb-2 block text-sm font-semibold text-[#17344a]">
                      {field.label}
                    </span>
                    <input
                      type={type}
                      required={field.required}
                      value={value ?? ""}
                      onChange={(event) =>
                        updateField(
                          field.name,
                          type === "number" ? Number(event.target.value) : event.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-[#d4c0a5] px-4 py-3 outline-none transition focus:border-[#177977]"
                    />
                  </label>
                );
              })}

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
