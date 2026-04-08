"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  BellRing,
  BookText,
  FolderKanban,
  Newspaper,
  RadioTower,
  Sparkles
} from "lucide-react";
import { getDashboard } from "@/lib/admin-api";

const quickLinks = [
  { label: "न्यूज़ मैनेज करें", href: "/admin/news", color: "bg-[#b2553c]", icon: Newspaper },
  { label: "हाइलाइट्स खोलें", href: "/admin/highlights", color: "bg-[#ff7b19]", icon: Sparkles },
  { label: "कैटेगरी अपडेट", href: "/admin/categories", color: "bg-[#1d7b79]", icon: FolderKanban },
  { label: "NIT डेस्क", href: "/admin/nit", color: "bg-[#17344a]", icon: RadioTower },
  { label: "नोटिफिकेशन", href: "/admin/notifications", color: "bg-[#355f84]", icon: BellRing },
  { label: "इनशॉर्ट्स", href: "/admin/inshorts", color: "bg-[#7a5b35]", icon: BookText }
];

export function DashboardOverview() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard();
        setStats(data.stats);
        setRecentArticles(data.recentArticles);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const statCards = [
    { label: "कुल न्यूज़", value: stats.totalNews ?? 0, bg: "bg-[#e8eff9]" },
    { label: "हाइलाइट्स", value: stats.highlights ?? 0, bg: "bg-[#edf8f5]" },
    { label: "NIT आइटम", value: stats.nits ?? 0, bg: "bg-[#f4ecfb]" },
    { label: "नोटिफिकेशन", value: stats.notifications ?? 0, bg: "bg-[#fdf1e4]" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <article
            key={item.label}
            className={`rounded-[26px] border border-white/50 p-5 shadow-[0_12px_28px_rgba(80,54,29,0.08)] ${item.bg}`}
          >
            <p className="text-sm font-semibold text-[#5f6b76]">{item.label}</p>
            <h3 className="mt-3 text-4xl font-black text-[#17344a]">{loading ? "..." : item.value}</h3>
          </article>
        ))}
      </div>

      <section className="rounded-[28px] border border-[#dcc6a4] bg-[#fff9f0] p-6 shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-3xl font-bold text-[#17344a]">फास्ट एक्शन</h3>
          <p className="text-[15px] leading-7 text-[#605143]">
            हर section अब अलग page से manage होगा ताकि workflow साफ और scalable रहे।
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={`flex items-center justify-between rounded-[24px] px-6 py-5 text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition hover:translate-y-[-2px] ${item.color}`}
              >
                <span className="text-lg font-bold">{item.label}</span>
                <span className="rounded-2xl bg-white/15 p-3">
                  <Icon size={22} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#dcc6a4] bg-[#fff9f0] p-6 shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
        <div className="mb-5">
          <h3 className="font-serif text-3xl font-bold text-[#17344a]">हाल की न्यूज़ गतिविधि</h3>
          <p className="mt-2 text-[15px] leading-7 text-[#605143]">
            हाल में अपडेट हुई खबरें यहाँ दिख रही हैं, ताकि newsroom flow पर तुरंत नजर रहे।
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-[#8d6c4d]">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((item) => (
                <tr key={item.id} className="bg-[#fff4e4]">
                  <td className="rounded-l-2xl px-4 py-4">
                    <p className="font-semibold text-[#17344a]">{item.titleHi || item.titleEn}</p>
                    <p className="mt-1 text-sm text-[#6f6154]">{item.titleEn}</p>
                  </td>
                  <td className="px-4 py-4 text-[#4f5b66]">{item.authorName}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#e9f8f4] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#1d7b79]">
                      {item.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4 text-[#4f5b66]">
                    {new Date(item.updatedAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
