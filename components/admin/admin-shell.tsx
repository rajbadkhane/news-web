"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BellRing,
  BookText,
  FileImage,
  FolderKanban,
  Gauge,
  LogOut,
  Newspaper,
  RadioTower,
  Sparkles
} from "lucide-react";

const navItems = [
  { label: "डैशबोर्ड", href: "/admin", icon: Gauge },
  { label: "न्यूज़", href: "/admin/news", icon: Newspaper },
  { label: "कैटेगरी", href: "/admin/categories", icon: FolderKanban },
  { label: "ई-पेपर", href: "/admin/epapers", icon: FileImage, disabled: true },
  { label: "हाइलाइट्स", href: "/admin/highlights", icon: Sparkles },
  { label: "NIT", href: "/admin/nit", icon: RadioTower },
  { label: "नोटिफिकेशन", href: "/admin/notifications", icon: BellRing },
  { label: "इनशॉर्ट्स", href: "/admin/inshorts", icon: BookText },
  { label: "लॉगआउट", href: "/admin/logout", icon: LogOut }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071923_0%,#0e2e43_18%,#d19142_18%,#ecd5b0_58%,#f4e7d1_100%)] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between bg-[linear-gradient(180deg,#102f45_0%,#18364c_60%,#1d2b36_100%)] px-5 py-6 text-white shadow-[8px_0_30px_rgba(0,0,0,0.14)]">
          <div>
            <div className="mb-8 flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#f1b261] bg-[#f8ead5] p-2">
                <Image
                  src="/images/logo.png"
                  alt="जीत अपडेट लोगो"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#f1b261]">जीत अपडेट</p>
                <h1 className="text-lg font-bold">एडमिन कंट्रोल</h1>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/45"
                    >
                      <Icon size={18} />
                      {item.label}
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase">
                        जल्द
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[linear-gradient(135deg,#1d7b79_0%,#b45c39_100%)] text-white shadow-[0_10px_22px_rgba(11,28,40,0.28)]"
                        : "text-white/78 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(29,123,121,0.28),rgba(178,85,60,0.26))] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#ffd59d]">न्यूज़रूम सिंक</p>
            <p className="mt-2 text-sm leading-6 text-[#f8eddf]">
              हाइलाइट्स, न्यूज़, इनशॉर्ट्स और नोटिफिकेशन को एक ही कंसोल से मैनेज करें।
            </p>
          </div>
        </aside>

        <section className="px-4 py-4 md:px-8 md:py-6">{children}</section>
      </div>
    </main>
  );
}
