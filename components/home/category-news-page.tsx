"use client";

import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { NewsImage } from "@/components/shared/news-image";
import {
  getCategoryLabel,
  getNewsHref,
  stripMarkup,
  type RemoteNewsGroup,
  type RemoteNewsRecord
} from "@/lib/remote-news";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function getHindiContent(record: RemoteNewsRecord) {
  return record.hindi;
}

export function CategoryNewsPage({
  group,
  error
}: {
  group?: RemoteNewsGroup;
  error?: string;
}) {
  const leadStory = group?.records[0];
  const restStories = group?.records.slice(1) || [];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07151d_0%,#113549_22%,#efd5ab_22%,#f7ead4_100%)] text-[#162534]">
      <div className="mx-auto w-full max-w-[1480px] px-3 py-5 md:px-5 lg:px-7">
        <header className="rounded-[28px] bg-[linear-gradient(135deg,rgba(7,25,35,0.96)_0%,rgba(14,76,88,0.94)_54%,rgba(147,87,52,0.92)_100%)] px-4 py-5 text-white shadow-[0_24px_60px_rgba(8,18,28,0.28)] md:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#a45e1f] bg-[#faecd5] shadow-[0_12px_24px_rgba(0,0,0,0.18)] md:h-24 md:w-24">
                <Image
                  src="/images/logo.png"
                  alt="Jeet Update Logo"
                  width={74}
                  height={74}
                  className="h-[74%] w-[74%] object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#efb35c] md:text-sm">
                  {"\u0936\u094d\u0930\u0947\u0923\u0940 \u092a\u0947\u091c"}
                </p>
                <h1 className="mt-1 font-sans text-[32px] font-black tracking-tight text-[#fff4e5] md:text-[46px]">
                  {group ? getCategoryLabel(group.category, "hindi") : "\u0915\u0948\u091f\u0947\u0917\u0930\u0940"}
                </h1>
                <p className="mt-2 max-w-[720px] text-sm leading-7 text-[#f8ead7]/90 md:text-[15px]">
                  {"\u0907\u0938 \u0936\u094d\u0930\u0947\u0923\u0940 \u0915\u0940 \u0938\u092d\u0940 \u0916\u092c\u0930\u0947\u0902 \u090f\u0915 \u091c\u0917\u0939, \u0924\u093e\u0915\u093f \u092f\u0942\u091c\u093c\u0930 \u0938\u0940\u0927\u0947 \u0907\u0938\u0940 \u092a\u0947\u091c \u092a\u0930 \u092a\u0942\u0930\u0940 \u0915\u0935\u0930\u0947\u091c \u0926\u0947\u0916 \u0938\u0915\u0947\u0964"}
                </p>
              </div>
            </div>

            <Link
              href={"/" as Route}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <ArrowLeft size={16} />
              {"\u0939\u094b\u092e \u092a\u0947\u091c \u092a\u0930 \u0935\u093e\u092a\u0938"}
            </Link>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[28px] bg-[#f6ead2] shadow-[0_24px_56px_rgba(33,28,22,0.14)]">
          {error ? (
            <div className="px-5 py-12 text-center md:px-8">
              <h2 className="font-serif text-3xl font-bold text-[#17344a]">
                {"\u0915\u0948\u091f\u0947\u0917\u0930\u0940 \u0932\u094b\u0921 \u0928\u0939\u0940\u0902 \u0939\u094b \u0938\u0915\u0940"}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-[#5b4b3f]">{error}</p>
            </div>
          ) : !group ? (
            <div className="px-5 py-12 text-center md:px-8">
              <h2 className="font-serif text-3xl font-bold text-[#17344a]">
                {"\u0915\u0948\u091f\u0947\u0917\u0930\u0940 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u0940"}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-[#5b4b3f]">
                {"\u092f\u0939 \u0936\u094d\u0930\u0947\u0923\u0940 \u0905\u092d\u0940 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964"}
              </p>
            </div>
          ) : (
            <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8">
              {leadStory ? (
                <section className="mb-8 grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
                  <Link
                    href={getNewsHref(leadStory) as Route}
                    className="overflow-hidden rounded-[26px] bg-[#fff6ea] shadow-[0_16px_36px_rgba(68,49,27,0.12)]"
                  >
                    <div className="relative min-h-[280px] md:min-h-[420px]">
                      <NewsImage
                        src={leadStory.news.image_link}
                        alt={getHindiContent(leadStory).headline}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,24,0.08)_0%,rgba(8,16,24,0.2)_38%,rgba(0,0,0,0.82)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f7d7ad]">
                          {getCategoryLabel(leadStory.news.category, "hindi")}
                        </p>
                        <h2 className="mt-3 font-serif text-[30px] font-bold leading-tight md:text-[48px]">
                          {getHindiContent(leadStory).headline}
                        </h2>
                        <p className="mt-4 max-w-[880px] text-[15px] leading-7 text-white/88 md:text-[17px]">
                          {getHindiContent(leadStory).short_description}
                        </p>
                        <p className="mt-4 text-[13px] text-[#f6d8b8]">{formatDate(leadStory.created_at)}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="rounded-[24px] bg-[#fff8ef] p-5 shadow-[0_14px_32px_rgba(68,49,27,0.08)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#176f6b]">
                      {"\u0915\u0941\u0932 \u0915\u0935\u0930\u0947\u091c"}
                    </p>
                    <h3 className="mt-3 font-serif text-[34px] font-bold text-[#17344a]">
                      {group.records.length} {"\u0916\u092c\u0930\u0947\u0902"}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-[#5b4b3f]">
                      {"\u0907\u0938 \u0936\u094d\u0930\u0947\u0923\u0940 \u0915\u0940 \u0938\u092d\u0940 \u0905\u092a\u0921\u0947\u091f \u0928\u0940\u091a\u0947 \u0917\u094d\u0930\u093f\u0921 \u092e\u0947\u0902 \u0926\u0940 \u0917\u0908 \u0939\u0948\u0902\u0964 \u0915\u093f\u0938\u0940 \u092d\u0940 \u0915\u093e\u0930\u094d\u0921 \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0915\u0947 \u092a\u0942\u0930\u0940 \u0916\u092c\u0930 \u0916\u0941\u0932 \u091c\u093e\u090f\u0917\u0940\u0964"}
                    </p>
                  </div>
                </section>
              ) : null}

              <section>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-serif text-[30px] text-[#17344a] md:text-[40px]">
                    {"\u0938\u092d\u0940 \u0916\u092c\u0930\u0947\u0902"}
                  </h2>
                  <div className="h-px flex-1 bg-[#c89d67]" />
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.records.map((record) => (
                    <Link
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
                        <h3 className="mt-2 font-serif text-[24px] font-bold leading-[1.16] text-[#17344a]">
                          {getHindiContent(record).headline}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-[#4f4237]">
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

              {!!restStories.length && (
                <p className="mt-6 text-center text-sm text-[#6c5946]">
                  {"\u0928\u0908 \u0916\u092c\u0930\u0947\u0902 \u0906\u0924\u0947 \u0939\u0940 \u0907\u0938 \u0936\u094d\u0930\u0947\u0923\u0940 \u092a\u0947\u091c \u092a\u0930 \u0905\u092a\u0928\u0947 \u0906\u092a \u0926\u093f\u0916\u0947\u0902\u0917\u0940\u0964"}
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
