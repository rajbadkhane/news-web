"use client";

import { useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Globe, Share2 } from "lucide-react";
import { FloatingContactActions } from "@/components/home/floating-contact-actions";
import { NewsImage } from "@/components/shared/news-image";
import { buildNewsSlug, getCategoryLabel, stripMarkup, type RemoteNewsRecord } from "@/lib/remote-news";

type Language = "hindi" | "english";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "hindi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function getLocalized(record: RemoteNewsRecord, language: Language) {
  return language === "hindi" ? record.hindi : record.english;
}

function splitParagraphs(value: string) {
  return value
    .split("\n")
    .map((item) => stripMarkup(item).trim())
    .filter(Boolean);
}

function locationText(record: RemoteNewsRecord, language: Language) {
  const categoryLabel = getCategoryLabel(record.news.category, language);
  return language === "hindi" ? `${categoryLabel} | विशेष रिपोर्ट` : `${categoryLabel} | Special Report`;
}

function buildFilenameBase(record: RemoteNewsRecord) {
  return record.publication.slug?.trim() || buildNewsSlug(record);
}

function ArticleSheet({
  record,
  language,
  className
}: {
  record: RemoteNewsRecord;
  language: Language;
  className?: string;
}) {
  const localized = getLocalized(record, language);
  const paragraphs = splitParagraphs(localized.long_description);
  const topSummary = localized.top_summary.map((item) => stripMarkup(item)).filter(Boolean);

  return (
    <article className={className}>
      <div className="border border-[#616161] bg-[#efefef] p-3 shadow-[0_8px_22px_rgba(0,0,0,0.08)] md:p-4">
        <h1 className="font-serif text-[28px] font-bold leading-[1.28] text-[#ff1200] md:text-[42px]">
          {localized.headline}
        </h1>

        <div className="mt-4 overflow-hidden border border-[#d9d9d9] bg-[#d9e0e4]">
          <NewsImage
            src={record.news.image_link}
            alt={localized.headline}
            className="block h-[280px] w-full object-cover md:h-[520px]"
          />
        </div>

        <div className="mt-3">
          <p className="text-[16px] font-bold text-[#3a3a3a] md:text-[18px]">
            {"जीत अपडेट / "} {locationText(record, language)}
          </p>
          <div className="mt-3 border-t-2 border-dashed border-[#8b8b8b]" />
        </div>

        <div className="mt-4 space-y-4">
          {topSummary.length > 0 && (
            <p className="text-[18px] font-bold leading-9 text-[#3f3f3f] md:text-[20px]">
              {topSummary[0]}
            </p>
          )}

          {paragraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 18)}`}
              className="text-[17px] font-semibold leading-9 text-[#4a4a4a] md:text-[18px]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-5 border-t-2 border-dashed border-[#8b8b8b] pt-4">
          <div className="flex items-center gap-4">
            <div className="h-[92px] w-[92px] overflow-hidden border border-[#bdbdbd] bg-[#f2f2f2]">
              <Image
                src="/images/logo.png"
                alt="Jeet Update Logo"
                width={92}
                height={92}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-[26px] font-bold leading-none text-[#1f1f1f]">
                {language === "hindi" ? "जीत अपडेट डेस्क" : "Jeet Update Desk"}
              </h2>
              <p className="mt-2 text-[15px] font-semibold text-[#4e4e4e]">
                {language === "hindi" ? "संपादक: जितेंद्र आर्य" : "Editor: Jitendra Arya"}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#4e4e4e]">
                {language === "hindi" ? "मध्य प्रदेश" : "Madhya Pradesh"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-5 text-[14px] font-semibold text-[#303030]">
                <span>{formatDate(record.created_at, language)}</span>
                <span>{language === "hindi" ? "संपर्क: 9098959811" : "Contact: 9098959811"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsArticlePage({ record }: { record: RemoteNewsRecord }) {
  const [language, setLanguage] = useState<Language>("hindi");
  const [isSharing, setIsSharing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const localized = useMemo(() => getLocalized(record, language), [language, record]);

  async function renderArticleCanvas() {
    if (!exportRef.current) {
      return null;
    }

    return html2canvas(exportRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: exportRef.current.scrollWidth
    });
  }

  async function buildPdfBlob(canvas: HTMLCanvasElement) {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageData = canvas.toDataURL("image/jpeg", 0.98);
    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    let imgWidth = maxWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > maxHeight) {
      const overflowScale = maxHeight / imgHeight;
      imgWidth *= overflowScale;
      imgHeight = maxHeight;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imageData, "JPEG", x, y, imgWidth, imgHeight);
    return pdf.output("blob");
  }

  async function handleShareArticle() {
    if (isSharing) return;

    setIsSharing(true);

    try {
      const canvas = await renderArticleCanvas();

      if (!canvas) {
        return;
      }

      const filenameBase = buildFilenameBase(record);
      const pdfBlob = await buildPdfBlob(canvas);
      const pdfFile = new File([pdfBlob], `${filenameBase}.pdf`, { type: "application/pdf" });
      const pdfShareData = {
        files: [pdfFile]
      };

      if (navigator.canShare?.(pdfShareData)) {
        await navigator.share(pdfShareData);
        return;
      }

      const imageBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.98);
      });

      if (imageBlob) {
        const imageFile = new File([imageBlob], `${filenameBase}.jpg`, { type: "image/jpeg" });
        const imageShareData = {
          files: [imageFile]
        };

        if (navigator.canShare?.(imageShareData)) {
          await navigator.share(imageShareData);
          return;
        }
      }

      if (navigator.share) {
        await navigator.share({
          url: window.location.href
        });
        return;
      }

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filenameBase}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#e5e5e5] p-0">
      <div ref={exportRef} className="fixed -left-[9999px] top-0 z-[-1] w-[1400px] bg-[#efefef] p-2">
        <ArticleSheet record={record} language={language} />
      </div>

      <div className="mx-auto w-full max-w-[1180px]">
        <header className="flex flex-col gap-4 rounded-none bg-[linear-gradient(90deg,#17344a_0%,#1d6670_45%,#8d4f2e_100%)] px-5 py-5 text-white md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={"/" as Route}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <ArrowLeft size={16} />
              {language === "hindi" ? "होम पर वापस" : "Back to Home"}
            </Link>
            <p className="text-sm uppercase tracking-[0.22em] text-[#ffd5a8]">
              {getCategoryLabel(record.news.category, language)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0b2534] p-1 text-white">
              <span className="px-2 text-[#efc58e]">
                <Globe size={16} />
              </span>
              <button
                onClick={() => setLanguage("hindi")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  language === "hindi" ? "bg-[#157a78] text-white" : "text-white/70"
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage("english")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  language === "english" ? "bg-[#b2553c] text-white" : "text-white/70"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handleShareArticle}
              disabled={isSharing}
              className="inline-flex items-center gap-2 bg-[#b2553c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c5654c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Share2 size={15} />
              {isSharing ? "Preparing..." : "Share Now"}
            </button>
          </div>
        </header>

        <ArticleSheet record={record} language={language} className="w-full pb-24" />
      </div>

      <FloatingContactActions />
    </main>
  );
}
