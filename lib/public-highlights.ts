import { RuntimeCache } from "@/lib/runtime-cache";

export type PublicHighlight = {
  id: number | string;
  titleEn: string;
  titleHi?: string;
  summaryEn?: string;
  summaryHi?: string;
  imageUrl?: string;
  caption?: string;
  priority?: string;
  showInGallery?: boolean;
  isActive?: boolean;
  updatedAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

const highlightsCache = new RuntimeCache<{ highlights: PublicHighlight[]; error: string }>(
  1000 * 60 * 10
);

export async function fetchPublicHighlights() {
  const cacheKey = "public-highlights";
  const cached = highlightsCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    if (!API_BASE) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    }

    const response = await fetch(`${API_BASE}/highlights?sortBy=priority`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Highlights API failed with ${response.status}`);
    }

    const payload = (await response.json()) as { ok: true; data: PublicHighlight[] };
    const highlights = (payload.data || [])
      .filter((item) => item.showInGallery !== false && item.isActive !== false)
      .slice(0, 6);

    const result = {
      highlights,
      error: ""
    };
    highlightsCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback = {
      highlights: [] as PublicHighlight[],
      error: error instanceof Error ? error.message : "Unable to fetch highlights"
    };
    highlightsCache.set(cacheKey, fallback, 1000 * 30);
    return fallback;
  }
}
