"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  BellRing,
  BookText,
  FileImage,
  FilePlus2,
  FolderKanban,
  Gauge,
  LogOut,
  Newspaper,
  RadioTower,
  Send,
  Sparkles,
  Zap
} from "lucide-react";
import { adminStats } from "@/lib/mock-data";
import { ArticleTable } from "@/components/admin/article-table";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "News", icon: Newspaper },
  { label: "Categories", icon: FolderKanban },
  { label: "E-Papers", icon: FileImage },
  { label: "Highlights", icon: Sparkles },
  { label: "NIT", icon: RadioTower },
  { label: "Notifications", icon: BellRing },
  { label: "Inshorts", icon: BookText },
  { label: "Logout", icon: LogOut }
];

const quickActions = [
  {
    label: "Create Article",
    color: "bg-admin-action-article",
    icon: FilePlus2
  },
  {
    label: "Upload E-Paper",
    color: "bg-admin-action-epaper",
    icon: FileImage
  },
  {
    label: "Add Highlight",
    color: "bg-admin-action-highlight",
    icon: Sparkles
  },
  {
    label: "Send Notification",
    color: "bg-admin-action-notification text-slate-900",
    icon: Send
  }
];

export function DashboardShell() {
  const statsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "power3.out"
        }
      );
    }

    if (navRef.current) {
      gsap.fromTo(
        navRef.current.children,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.42,
          ease: "power2.out"
        }
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-admin-bg bg-admin-glow text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between bg-admin-sidebar px-5 py-6 text-white">
          <div>
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-slate-800/70 px-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
                <Image
                  src="/images/logo.png"
                  alt="The Cliff News logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                  The Cliff News
                </p>
                <h1 className="text-lg font-bold">Admin CMS</h1>
              </div>
            </div>

            <nav ref={navRef} className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === 0;
                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-admin-sidebar"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="rounded-3xl bg-slate-800/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Newsroom Sync
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Coordinate editors, e-paper desk, and alerts from one unified control room.
            </p>
          </div>
        </aside>

        <section className="px-4 py-4 md:px-8 md:py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Dashboard
                </p>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  Editorial command center
                </h2>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-600">
                <Zap size={16} className="text-admin-logo" />
                18 live categories monitored across bilingual feeds
              </div>
            </header>

            <div
              ref={statsRef}
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {adminStats.map((item, index) => {
                const icons = [Newspaper, FileImage, Sparkles, FolderKanban];
                const Icon = icons[index];
                return (
                  <article
                    key={item.label}
                    className="rounded-[28px] bg-white p-5 shadow-soft"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                          {item.label}
                        </p>
                        <h3 className="mt-3 text-4xl font-black text-slate-900">
                          {item.value}
                        </h3>
                      </div>
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.accent}`}
                      >
                        <Icon size={24} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <section className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Quick Actions
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  Publish faster across every format
                </h3>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className={`flex w-full items-center justify-between rounded-[24px] ${action.color} px-6 py-5 text-left text-white transition hover:scale-[1.01]`}
                    >
                      <span className="text-lg font-bold">{action.label}</span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                        <Icon size={22} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <ArticleTable />
          </div>
        </section>
      </div>
    </main>
  );
}
