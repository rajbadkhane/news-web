"use client";

import { useEffect, useMemo, useState } from "react";

type ImageMode = "proxy" | "direct" | "fallback";

function buildPlaceholder(title: string) {
  const safeTitle = title.trim() || "Jeet Update Visual";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17344a" />
          <stop offset="55%" stop-color="#1d6670" />
          <stop offset="100%" stop-color="#8d4f2e" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#bg)" />
      <circle cx="970" cy="120" r="120" fill="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="580" r="160" fill="rgba(255,255,255,0.06)" />
      <text x="80" y="140" fill="white" font-size="34" font-family="Segoe UI, Nirmala UI, sans-serif" opacity="0.82">Jeet Update News</text>
      <text x="80" y="250" fill="#ffe7c2" font-size="58" font-weight="700" font-family="Segoe UI, Nirmala UI, sans-serif">छवि उपलब्ध नहीं</text>
      <text x="80" y="350" fill="#ffe7c2" font-size="28" font-family="Segoe UI, Nirmala UI, sans-serif">${safeTitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getInitialMode(src?: string): ImageMode {
  if (!src) {
    return "fallback";
  }

  const trimmed = src.trim();

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("file:")
  ) {
    return "direct";
  }

  return "proxy";
}

function buildProxyUrl(src: string) {
  return `/api/image?url=${encodeURIComponent(src)}&v=5`;
}

export function NewsImage({
  src,
  alt,
  className
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [mode, setMode] = useState<ImageMode>(() => getInitialMode(src));

  useEffect(() => {
    setMode(getInitialMode(src));
  }, [src]);

  const resolvedSrc = useMemo(() => {
    if (!src || mode === "fallback") {
      return buildPlaceholder(alt);
    }

    return mode === "proxy" ? buildProxyUrl(src) : src;
  }, [alt, mode, src]);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => {
        if (mode === "proxy") {
          setMode("direct");
          return;
        }

        if (mode !== "fallback") {
          setMode("fallback");
        }
      }}
    />
  );
}
