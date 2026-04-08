"use client";

import { RefreshCcw } from "lucide-react";
import { articleRows } from "@/lib/mock-data";

export function ArticleTable() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Recent Activity
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            Multilingual article pipeline
          </h3>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Metadata</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {articleRows.map((row) => (
              <tr key={row.titleEn} className="rounded-2xl bg-slate-50">
                <td className="rounded-l-2xl px-4 py-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{row.titleEn}</p>
                    <p className="text-sm text-slate-500">{row.titleHi}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>{row.author}</p>
                    <p>{row.time}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold tracking-[0.2em] text-emerald-700">
                    {row.status}
                  </span>
                </td>
                <td className="rounded-r-2xl px-4 py-4">
                  <a
                    href="#"
                    className="text-sm font-semibold text-sky-700 transition hover:text-sky-800"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
