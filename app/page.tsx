import type { Metadata } from "next";
import { NewsPortal } from "@/components/home/news-portal";
import { fetchGroupedNews } from "@/lib/remote-news";
import { fetchPublicHighlights } from "@/lib/public-highlights";

export const metadata: Metadata = {
  title: "होम",
  description:
    "ताज़ा हिंदी खबरें पढ़ें। दुनिया, भारत, राजनीति, व्यापार, खेल, मनोरंजन और बाकी सभी श्रेणियों की खबरें जीत अपडेट न्यूज़ पर एक ही पेज में देखें।",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "जीत अपडेट न्यूज़",
    description:
      "ताज़ा हिंदी खबरें पढ़ें। दुनिया, भारत, राजनीति, व्यापार, खेल, मनोरंजन और बाकी सभी श्रेणियों की खबरें जीत अपडेट न्यूज़ पर एक ही पेज में देखें।",
    url: "/"
  }
};

export default async function HomePage() {
  const { groups, error } = await fetchGroupedNews(50, "both");
  const { highlights } = await fetchPublicHighlights();

  return <NewsPortal initialGroups={groups} initialError={error} initialHighlights={highlights} />;
}
