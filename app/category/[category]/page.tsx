import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryNewsPage } from "@/components/home/category-news-page";
import {
  fetchCategoryNews,
  getCategoryLabel,
  type RemoteNewsGroup
} from "@/lib/remote-news";

function resolveCategory(params: { category: string }) {
  return decodeURIComponent(params.category);
}

export async function generateMetadata({
  params
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = resolveCategory(params);
  const title = `${getCategoryLabel(category, "hindi")} समाचार`;
  const description = `${getCategoryLabel(category, "hindi")} श्रेणी की ताज़ा खबरें पढ़ें।`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${category}`
    },
    openGraph: {
      title,
      description,
      url: `/category/${category}`
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: { category: string };
}) {
  const category = resolveCategory(params);
  const { group, error } = await fetchCategoryNews(category, 20, "both");

  if (!group && !error) {
    notFound();
  }

  return <CategoryNewsPage group={group as RemoteNewsGroup | undefined} error={error} />;
}
