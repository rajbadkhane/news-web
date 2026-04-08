"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Flame, Search } from "lucide-react";
import { FloatingContactActions } from "@/components/home/floating-contact-actions";
import { NewsImage } from "@/components/shared/news-image";
import { SiteFooter } from "@/components/home/site-footer";
import type { PublicHighlight } from "@/lib/public-highlights";
import {
  getCategoryHref,
  getCategoryLabel,
  getNewsHref,
  stripMarkup,
  type RemoteNewsGroup,
  type RemoteNewsRecord
} from "@/lib/remote-news";

gsap.registerPlugin(ScrollTrigger);

function getHindiContent(record: RemoteNewsRecord) {
  return record.hindi;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function buildSearchableText(record: RemoteNewsRecord) {
  return [
    record.hindi.headline,
    record.hindi.short_description,
    record.hindi.long_description,
    record.hindi.what_to_watch_next,
    record.news.title,
    record.source_title,
    record.source_excerpt
  ]
    .join(" ")
    .toLowerCase();
}

export function NewsPortal({
  initialGroups,
  initialError,
  initialHighlights
}: {
  initialGroups: RemoteNewsGroup[];
  initialError?: string;
  initialHighlights: PublicHighlight[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
      const heroCard = rootRef.current?.querySelector<HTMLElement>("[data-hero-card]");

      if (heroCard) {
        gsap.fromTo(
          heroCard,
          { autoAlpha: 0, y: 34, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: heroCard,
              start: "top 88%",
              once: true
            }
          }
        );
      }

      groups.forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>("[data-reveal-card]");

        if (!cards.length) return;

        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      items.forEach((item) => {
        if (item.closest("[data-reveal-group]") || item.hasAttribute("data-hero-card")) {
          return;
        }

        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              once: true
            }
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const searchedGroups = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return initialGroups;

    return initialGroups
      .map((group) => ({
        ...group,
        records: group.records.filter((record) => buildSearchableText(record).includes(needle))
      }))
      .filter((group) => group.records.length > 0);
  }, [initialGroups, searchTerm]);

  const topStories = useMemo(
    () => searchedGroups.flatMap((group) => group.records).slice(0, 4),
    [searchedGroups]
  );

  const leadStory = topStories[0];
  const sideStories = topStories.slice(1, 4);

  return (
    <main
      ref={rootRef}
      className="min-h-screen bg-[linear-gradient(180deg,#06131a_0%,#0a2736_18%,#d39a57_18%,#efd5ab_58%,#f6e8cf_100%)] text-[#162534]"
    >
      <div className="mx-auto w-full max-w-[1560px] px-2 py-3 md:px-5 md:py-5 lg:px-7">
        <header
          data-reveal
          className="rounded-[24px] bg-[linear-gradient(135deg,rgba(7,25,35,0.96)_0%,rgba(14,76,88,0.94)_54%,rgba(147,87,52,0.92)_100%)] px-4 py-4 text-white shadow-[0_24px_60px_rgba(8,18,28,0.28)] md:rounded-[28px] md:px-6 md:py-5 lg:px-8"
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-[#a45e1f] bg-[#faecd5] shadow-[0_10px_22px_rgba(0,0,0,0.18)] sm:h-20 sm:w-20 md:h-24 md:w-24 md:border-4">
                <Image
                  src="/images/logo.png"
                  alt="Jeet Update Logo"
                  width={74}
                  height={74}
                  className="h-[74%] w-[74%] object-contain"
                  priority
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#efb35c] sm:text-xs sm:tracking-[0.35em] md:text-sm">
                  {"\u0939\u093f\u0902\u0926\u0940 \u0928\u094d\u092f\u0942\u091c\u093c \u092a\u094b\u0930\u094d\u091f\u0932"}
                </p>
                <h1 className="mt-1 font-sans text-[24px] font-black leading-none tracking-tight text-[#fff4e5] sm:text-[32px] md:text-[46px]">
                  {"\u091c\u0940\u0924 \u0905\u092a\u0921\u0947\u091f"}
                </h1>
              </div>
            </div>

            <div className="w-full xl:max-w-[680px]">
              <label className="flex w-full items-center gap-2 overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-white backdrop-blur sm:rounded-full sm:px-5 sm:py-3">
                <Search size={16} className="shrink-0 text-[#f6d7a9] sm:h-[18px] sm:w-[18px]" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={"\u0938\u092e\u093e\u091a\u093e\u0930 \u0916\u094b\u091c\u0947\u0902"}
                  className="w-full border-none bg-transparent text-[14px] outline-none placeholder:text-white/70 sm:text-[15px]"
                />
              </label>
            </div>
          </div>
        </header>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-[#f6ead2] shadow-[0_24px_56px_rgba(33,28,22,0.14)]">
          <div className="border-b border-[#dbbe96] bg-[linear-gradient(90deg,#18374e_0%,#255f6d_50%,#6f4b2c_100%)] px-4 py-4 md:px-6 lg:px-8">
            <div className="scrollbar-none flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:gap-3">
              {initialGroups.map((group) => (
                <Link
                  key={group.category}
                  href={getCategoryHref(group.category) as Route}
                  className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {getCategoryLabel(group.category, "hindi")}
                </Link>
              ))}
            </div>
          </div>

          {initialError ? (
            <section className="px-5 py-12 text-center md:px-8">
              <h2 className="font-serif text-3xl font-bold text-[#17344a]">
                {"\u0938\u092e\u093e\u091a\u093e\u0930 \u0932\u094b\u0921 \u0928\u0939\u0940\u0902 \u0939\u094b \u0938\u0915\u0947"}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-[#5b4b3f]">{initialError}</p>
            </section>
          ) : !searchedGroups.length ? (
            <section className="px-5 py-12 text-center md:px-8">
              <h2 className="font-serif text-3xl font-bold text-[#17344a]">
                {"\u0915\u094b\u0908 \u0938\u092e\u093e\u091a\u093e\u0930 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e"}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-[#5b4b3f]">
                {"\u0916\u094b\u091c \u0936\u092c\u094d\u0926 \u092c\u0926\u0932\u0915\u0930 \u0926\u0947\u0916\u0947\u0902 \u092f\u093e \u0916\u094b\u091c \u092c\u0949\u0915\u094d\u0938 \u0916\u093e\u0932\u0940 \u0915\u0930\u0947\u0902\u0964"}
              </p>
            </section>
          ) : (
            <>
              {leadStory && (
                <section className="border-b border-[#e1c59f] px-4 py-5 md:px-6 lg:px-8">
                  <div className="mb-4 flex items-center gap-4 md:mb-5">
                    <div className="h-px flex-1 bg-[#b98a4f]" />
                    <span className="font-serif text-[26px] text-[#17344a] md:text-[34px]">
                      {"\u092c\u095c\u0940 \u0938\u0941\u0930\u094d\u0916\u093f\u092f\u093e\u0901"}
                    </span>
                    <div className="h-px flex-1 bg-[#b98a4f]" />
                  </div>

                  <div
                    data-reveal-group
                    className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]"
                  >
                    <Link
                      data-hero-card
                      href={getNewsHref(leadStory) as Route}
                      className="block overflow-hidden rounded-[26px] bg-[#fff6ea] shadow-[0_16px_36px_rgba(68,49,27,0.12)]"
                    >
                      <div className="relative h-[300px] sm:h-[360px] xl:h-full xl:min-h-[510px]">
                        <NewsImage
                          src={leadStory.news.image_link}
                          alt={getHindiContent(leadStory).headline}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,24,0.08)_0%,rgba(8,16,24,0.18)_35%,rgba(0,0,0,0.84)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f7d7ad] md:text-sm">
                            {getCategoryLabel(leadStory.news.category, "hindi")}
                          </p>
                          <h2 className="mt-2 max-w-[92%] font-serif text-[26px] font-bold leading-tight md:text-[42px]">
                            {getHindiContent(leadStory).headline}
                          </h2>
                          <p className="mt-3 line-clamp-4 max-w-[860px] text-[14px] leading-6 text-white/88 md:text-[16px] md:leading-7">
                            {getHindiContent(leadStory).short_description}
                          </p>
                          <p className="mt-3 text-[12px] text-[#f6d8b8] md:text-[13px]">
                            {formatDate(leadStory.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {!!sideStories.length && (
                      <div className="grid gap-4 lg:gap-5">
                        {sideStories.map((story) => (
                          <Link
                            data-reveal-card
                            key={story.id}
                            href={getNewsHref(story) as Route}
                            className="block overflow-hidden rounded-[22px] bg-[#fff7eb] shadow-[0_14px_32px_rgba(68,49,27,0.1)]"
                          >
                            <div className="grid min-h-full sm:grid-cols-[180px_1fr] xl:grid-cols-[170px_1fr]">
                              <div className="relative h-[180px] overflow-hidden bg-[#efdfc5] sm:h-full">
                                <NewsImage
                                  src={story.news.image_link}
                                  alt={getHindiContent(story).headline}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-4 md:p-5">
                                <h3 className="font-serif text-[21px] font-bold leading-[1.12] text-[#17344a]">
                                  {getHindiContent(story).headline}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-[14px] leading-6 text-[#4f4237]">
                                  {getHindiContent(story).short_description}
                                </p>
                                <p className="mt-3 text-[12px] font-semibold text-[#176f6b]">
                                  {formatDate(story.created_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {!!initialHighlights.length && (
                <section className="border-b border-[#e1c59f] px-4 py-6 md:px-6 lg:px-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Flame className="text-[#bd5f3d]" />
                      <h2 className="font-serif text-[28px] text-[#17344a] md:text-[34px]">
                        {"\u0906\u091c \u0915\u0947 \u0939\u093e\u0907\u0932\u093e\u0907\u091f\u094d\u0938"}
                      </h2>
                    </div>
                    <span className="text-sm font-semibold text-[#8b6138]">
                      {"\u090f\u0921\u092e\u093f\u0928 \u0905\u092a\u0921\u0947\u091f"}
                    </span>
                  </div>

                  <div data-reveal-group className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {initialHighlights.map((item) => (
                      <article
                        data-reveal-card
                        key={String(item.id)}
                        className="overflow-hidden rounded-[22px] bg-[#fff7eb] shadow-[0_14px_32px_rgba(68,49,27,0.08)]"
                      >
                        <div className="relative h-[220px] overflow-hidden bg-[#f2e1c6]">
                          <NewsImage
                            src={item.imageUrl}
                            alt={item.titleHi || item.titleEn || "Highlight"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-[24px] font-bold leading-[1.15] text-[#17344a]">
                            {item.titleHi || item.titleEn}
                          </h3>
                          <p className="mt-3 line-clamp-4 text-[15px] leading-7 text-[#4f4237]">
                            {item.summaryHi || item.summaryEn || item.caption || ""}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section className="px-4 py-6 md:px-6 lg:px-8">
                <div className="space-y-8">
                  {searchedGroups.map((group) => {
                    const featuredStories = group.records.slice(0, 5);

                    if (!featuredStories.length) {
                      return null;
                    }

                    return (
                      <section
                        data-reveal
                        key={group.category}
                        className="rounded-[28px] bg-[linear-gradient(180deg,#f8edda_0%,#f3e0c0_100%)] p-4 shadow-[0_14px_36px_rgba(68,49,27,0.08)] md:p-6"
                      >
                        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <h2 className="font-serif text-[30px] text-[#17344a] md:text-[40px]">
                            {getCategoryLabel(group.category, "hindi")}
                          </h2>

                          <Link
                            href={getCategoryHref(group.category) as Route}
                            className="inline-flex items-center gap-2 self-start rounded-full bg-[#17344a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#22506b]"
                          >
                            {"\u0938\u092d\u0940 \u0916\u092c\u0930\u0947\u0902 \u0926\u0947\u0916\u0947\u0902"}
                            <ArrowRight size={16} />
                          </Link>
                        </div>

                        <div data-reveal-group className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                          {featuredStories.map((record) => (
                            <Link
                              data-reveal-card
                              key={record.id}
                              href={getNewsHref(record) as Route}
                              className="overflow-hidden rounded-[22px] bg-[#fff8ef] shadow-[0_14px_32px_rgba(68,49,27,0.08)]"
                            >
                              <div className="relative h-[220px] overflow-hidden bg-[#efdfc5]">
                                <NewsImage
                                  src={record.news.image_link}
                                  alt={getHindiContent(record).headline}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-5">
                                <p className="text-[12px] font-semibold text-[#176f6b]">
                                  {formatDate(record.created_at)}
                                </p>
                                <h3 className="mt-2 font-serif text-[22px] font-bold leading-[1.16] text-[#17344a]">
                                  {getHindiContent(record).headline}
                                </h3>
                                <p className="mt-3 line-clamp-3 text-[14px] leading-6 text-[#4f4237]">
                                  {stripMarkup(getHindiContent(record).short_description)}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b2553c]">
                                  {"\u092a\u0942\u0930\u0940 \u0916\u092c\u0930 \u092a\u095d\u0947\u0902"}
                                  <ArrowUpRight size={16} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          <SiteFooter />
        </div>
      </div>
      <FloatingContactActions />
    </main>
  );
}
