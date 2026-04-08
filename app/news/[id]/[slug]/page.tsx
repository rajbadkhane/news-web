import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticlePage } from "@/components/home/news-article-page";
import { fetchNewsRecordById } from "@/lib/remote-news";

export async function generateMetadata({
  params
}: {
  params: { id: string; slug: string };
}): Promise<Metadata> {
  const { record } = await fetchNewsRecordById(params.id, "both");

  if (!record) {
    return {
      title: "समाचार नहीं मिला"
    };
  }

  const title = record.hindi.headline || record.english.headline || record.news.title;
  const description =
    record.hindi.short_description || record.english.short_description || record.source_excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/news/${record.id}/${params.slug}`
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/news/${record.id}/${params.slug}`,
      images: record.news.image_link ? [{ url: record.news.image_link }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: record.news.image_link ? [record.news.image_link] : undefined
    }
  };
}

export default async function ArticleSlugPage({
  params
}: {
  params: { id: string; slug: string };
}) {
  const { record } = await fetchNewsRecordById(params.id, "both");

  if (!record) {
    notFound();
  }

  return <NewsArticlePage record={record} />;
}
