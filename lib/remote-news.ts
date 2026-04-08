import { RuntimeCache } from "@/lib/runtime-cache";
import {
  getManualNewsRecordById,
  mergeManualNewsIntoCategory,
  mergeManualNewsIntoGroups
} from "@/lib/manual-news";

export type RemoteLocalizedContent = {
  headline: string;
  top_summary: string[];
  short_description: string;
  long_description: string;
  what_to_watch_next: string;
};

export type RemoteNewsRecord = {
  id: string;
  source_url: string;
  source_title: string;
  source_excerpt: string;
  english: RemoteLocalizedContent;
  hindi: RemoteLocalizedContent;
  publication: {
    status: string;
    published_at: string | null;
    published_by: string | null;
    slug: string | null;
  };
  created_at: string;
  updated_at: string;
  news: {
    id: string;
    category: string;
    title: string;
    source_url: string;
    image_link: string;
    image_source: string;
    fetched_at: string;
    feed_source: string;
    feed_url: string;
  };
};

export type RemoteNewsGroup = {
  category: string;
  count: number;
  records: RemoteNewsRecord[];
};

type ProviderArticle = {
  id: number | string;
  slug?: string | null;
  category: string;
  publication_status?: string;
  published_at?: string | null;
  updated_at?: string | null;
  news_id?: number | string;
  language?: "english" | "hindi" | "both";
  source?: {
    title?: string | null;
    url?: string | null;
    feed_source?: string | null;
    feed_url?: string | null;
    fetched_at?: string | null;
  };
  media?: {
    image_link?: string | null;
    image_source?: string | null;
  };
  article?:
    | Partial<RemoteLocalizedContent>
    | {
        english?: Partial<RemoteLocalizedContent> | null;
        hindi?: Partial<RemoteLocalizedContent> | null;
      }
    | null;
};

type ProviderGroupedArticle = {
  category: string;
  count: number;
  records: ProviderArticle[];
};

type ProviderSuccessResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    version?: string;
    timestamp?: string;
    count?: number;
    category?: string | null;
    language?: string;
    limit?: number;
  };
};

type RemoteNewsLanguage = "english" | "hindi" | "both";

const groupedNewsCache = new RuntimeCache<{ groups: RemoteNewsGroup[]; error: string }>(
  1000 * 60 * 10
);

const groupedNewsStaleCache = new RuntimeCache<{ groups: RemoteNewsGroup[]; error: string }>(
  1000 * 60 * 60 * 24
);

const categoryNewsCache = new RuntimeCache<{ group?: RemoteNewsGroup; error: string }>(1000 * 60 * 10);
const articleNewsCache = new RuntimeCache<{ record?: RemoteNewsRecord; error: string }>(1000 * 60 * 10);

const API_BASE = (process.env.NEWS_PROVIDER_API_BASE_URL || "https://news-provider-1.onrender.com").replace(
  /\/$/,
  ""
);
const API_KEY = process.env.NEWS_PROVIDER_API_KEY || "";

export const categoryLabels: Record<string, { hi: string; en: string }> = {
  top_stories: { hi: "\u091f\u0949\u092a \u0938\u094d\u091f\u094b\u0930\u0940\u091c", en: "Top Stories" },
  india: { hi: "\u092d\u093e\u0930\u0924", en: "India" },
  world: { hi: "\u0926\u0941\u0928\u093f\u092f\u093e", en: "World" },
  states: { hi: "\u0930\u093e\u091c\u094d\u092f", en: "States" },
  asia: { hi: "\u090f\u0936\u093f\u092f\u093e", en: "Asia" },
  business: { hi: "\u0935\u094d\u092f\u093e\u092a\u093e\u0930", en: "Business" },
  sports: { hi: "\u0916\u0947\u0932", en: "Sports" },
  science_environment: {
    hi: "\u0935\u093f\u091c\u094d\u091e\u093e\u0928 \u0914\u0930 \u092a\u0930\u094d\u092f\u093e\u0935\u0930\u0923",
    en: "Science & Environment"
  },
  entertainment: { hi: "\u092e\u0928\u094b\u0930\u0902\u091c\u0928", en: "Entertainment" },
  health: { hi: "\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f", en: "Health" },
  blogs: { hi: "\u092c\u094d\u0932\u0949\u0917\u094d\u0938", en: "Blogs" },
  technology: { hi: "\u091f\u0947\u0915\u094d\u0928\u094b\u0932\u0949\u091c\u0940", en: "Technology" },
  education: { hi: "\u0936\u093f\u0915\u094d\u0937\u093e", en: "Education" }
};

function normalizeNewsError(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("401") || message.includes("unauthorized") || message.includes("api key")) {
      return "\u0928\u094d\u092f\u0942\u091c \u0938\u0947\u0935\u093e \u0915\u0940 API key \u092e\u093e\u0928\u094d\u092f \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e API key \u091a\u0947\u0915 \u0915\u0930\u0947\u0902\u0964";
    }

    if (
      message.includes("terminated") ||
      message.includes("fetch failed") ||
      message.includes("network") ||
      message.includes("timeout")
    ) {
      return "\u0938\u092e\u093e\u091a\u093e\u0930 \u0938\u0947\u0935\u093e \u0905\u092d\u0940 \u0905\u0938\u094d\u0925\u093e\u092f\u0940 \u0930\u0942\u092a \u0938\u0947 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e \u0925\u094b\u095c\u0940 \u0926\u0947\u0930 \u092c\u093e\u0926 \u092b\u093f\u0930 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964";
    }
  }

  return "\u0938\u092e\u093e\u091a\u093e\u0930 \u0905\u092d\u0940 \u0932\u094b\u0921 \u0928\u0939\u0940\u0902 \u0939\u094b \u0938\u0915\u0947\u0964 \u0915\u0943\u092a\u092f\u093e \u0925\u094b\u095c\u0940 \u0926\u0947\u0930 \u092c\u093e\u0926 \u092b\u093f\u0930 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964";
}

function emptyLocalizedContent(): RemoteLocalizedContent {
  return {
    headline: "",
    top_summary: [],
    short_description: "",
    long_description: "",
    what_to_watch_next: ""
  };
}

function normalizeLocalizedContent(content?: Partial<RemoteLocalizedContent> | null): RemoteLocalizedContent {
  return {
    headline: content?.headline || "",
    top_summary: Array.isArray(content?.top_summary) ? content.top_summary.filter(Boolean) : [],
    short_description: content?.short_description || "",
    long_description: content?.long_description || "",
    what_to_watch_next: content?.what_to_watch_next || ""
  };
}

function isMultiLanguageArticle(
  article: ProviderArticle["article"]
): article is {
  english?: Partial<RemoteLocalizedContent> | null;
  hindi?: Partial<RemoteLocalizedContent> | null;
} {
  return !!article && typeof article === "object" && ("english" in article || "hindi" in article);
}

function normalizeArticlePayload(article: ProviderArticle["article"], language?: ProviderArticle["language"]) {
  if (!article) {
    return {
      english: emptyLocalizedContent(),
      hindi: emptyLocalizedContent()
    };
  }

  if (!isMultiLanguageArticle(article)) {
    const localized = normalizeLocalizedContent(article);

    if (language === "hindi") {
      return {
        english: emptyLocalizedContent(),
        hindi: localized
      };
    }

    if (language === "english") {
      return {
        english: localized,
        hindi: emptyLocalizedContent()
      };
    }

    return {
      english: localized,
      hindi: localized
    };
  }

  return {
    english: normalizeLocalizedContent(article.english),
    hindi: normalizeLocalizedContent(article.hindi)
  };
}

function normalizeNewsRecord(record: ProviderArticle): RemoteNewsRecord {
  const localized = normalizeArticlePayload(record.article, record.language);
  const sourceUrl = record.source?.url || "";
  const createdAt =
    record.published_at || record.updated_at || record.source?.fetched_at || new Date().toISOString();

  return {
    id: String(record.id),
    source_url: sourceUrl,
    source_title: record.source?.title || "",
    source_excerpt:
      localized.hindi.short_description || localized.english.short_description || record.source?.title || "",
    english: localized.english,
    hindi: localized.hindi,
    publication: {
      status: record.publication_status || "published",
      published_at: record.published_at || null,
      published_by: null,
      slug: record.slug || null
    },
    created_at: createdAt,
    updated_at: record.updated_at || createdAt,
    news: {
      id: String(record.news_id || record.id),
      category: record.category,
      title:
        localized.english.headline || localized.hindi.headline || record.source?.title || `news-${record.id}`,
      source_url: sourceUrl,
      image_link: record.media?.image_link || "",
      image_source: record.media?.image_source || "",
      fetched_at: record.source?.fetched_at || createdAt,
      feed_source: record.source?.feed_source || "",
      feed_url: record.source?.feed_url || ""
    }
  };
}

function normalizeGroupedNews(groups: ProviderGroupedArticle[] = []) {
  return groups.map((group) => ({
    category: group.category,
    count: group.count,
    records: (group.records || []).map(normalizeNewsRecord)
  }));
}

function getRequestHeaders() {
  if (!API_KEY) {
    throw new Error("NEWS_PROVIDER_API_KEY is not configured");
  }

  return {
    "x-api-key": API_KEY,
    Authorization: `Bearer ${API_KEY}`
  };
}

async function requestProviderData<T>(url: string) {
  const response = await fetch(url, {
    headers: getRequestHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`News API failed with ${response.status}`);
  }

  return (await response.json()) as ProviderSuccessResponse<T>;
}

export async function fetchGroupedNews(limit = 50, language: RemoteNewsLanguage = "both") {
  const url = `${API_BASE}/api/v1/delivery/news/grouped?language=${language}&limit=${limit}`;
  const cacheKey = `grouped:${language}:${limit}`;
  const staleCacheKey = `grouped-stale:${language}:${limit}`;
  const cached = groupedNewsCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    let payload: ProviderSuccessResponse<ProviderGroupedArticle[]>;

    try {
      payload = await requestProviderData<ProviderGroupedArticle[]>(url);
    } catch {
      payload = await requestProviderData<ProviderGroupedArticle[]>(url);
    }

    const result = {
      groups: mergeManualNewsIntoGroups(normalizeGroupedNews(payload.data || [])),
      error: ""
    };

    groupedNewsCache.set(cacheKey, result);
    groupedNewsStaleCache.set(staleCacheKey, result);
    return result;
  } catch (error) {
    const stale = groupedNewsStaleCache.get(staleCacheKey);

    if (stale?.groups?.length) {
      return {
        groups: mergeManualNewsIntoGroups(stale.groups),
        error: ""
      };
    }

    const fallback = {
      groups: [] as RemoteNewsGroup[],
      error: normalizeNewsError(error)
    };

    groupedNewsCache.set(cacheKey, fallback, 1000 * 30);
    return fallback;
  }
}

export async function fetchCategoryNews(
  category: string,
  limit = 20,
  language: RemoteNewsLanguage = "both"
) {
  const cacheKey = `category:${category}:${language}:${limit}`;
  const cached = categoryNewsCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = `${API_BASE}/api/v1/delivery/news?category=${encodeURIComponent(category)}&language=${language}&limit=${limit}`;
    const payload = await requestProviderData<ProviderArticle[]>(url);
    const records = (payload.data || []).map(normalizeNewsRecord);
    const result = {
      group: mergeManualNewsIntoCategory(category, {
        category,
        count: records.length,
        records
      }),
      error: ""
    };

    categoryNewsCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback = {
      group: undefined,
      error: normalizeNewsError(error)
    };

    categoryNewsCache.set(cacheKey, fallback, 1000 * 30);
    return fallback;
  }
}

export function flattenGroupedNews(groups: RemoteNewsGroup[]) {
  return groups.flatMap((group) => group.records);
}

export async function fetchNewsRecordById(idOrSlug: string, language: RemoteNewsLanguage = "both") {
  const manualRecord = getManualNewsRecordById(idOrSlug);

  if (manualRecord) {
    return {
      record: manualRecord,
      error: ""
    };
  }

  const cacheKey = `article:${idOrSlug}:${language}`;
  const cached = articleNewsCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = `${API_BASE}/api/v1/delivery/news/${encodeURIComponent(idOrSlug)}?language=${language}`;
    const payload = await requestProviderData<ProviderArticle>(url);
    const result = {
      record: payload.data ? normalizeNewsRecord(payload.data) : undefined,
      error: ""
    };

    articleNewsCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback = {
      record: undefined,
      error: normalizeNewsError(error)
    };

    articleNewsCache.set(cacheKey, fallback, 1000 * 30);
    return fallback;
  }
}

export function getCategoryLabel(category: string, language: "hindi" | "english") {
  const entry = categoryLabels[category];
  if (entry) {
    return language === "hindi" ? entry.hi : entry.en;
  }

  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function buildNewsSlug(record: RemoteNewsRecord) {
  const base =
    record.publication.slug ||
    record.hindi.headline ||
    record.english.headline ||
    record.news.title ||
    record.source_title ||
    `news-${record.id}`;

  const normalized = stripMarkup(base)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

  return normalized || `news-${record.id}`;
}

export function getNewsHref(record: RemoteNewsRecord) {
  return `/news/${record.id}/${buildNewsSlug(record)}`;
}

export function getCategoryHref(category: string) {
  return `/category/${category}`;
}

export function getCategoryGroup(groups: RemoteNewsGroup[], category: string) {
  return groups.find((group) => group.category === category);
}
