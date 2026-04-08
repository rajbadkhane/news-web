import { notFound, redirect } from "next/navigation";
import { buildNewsSlug, fetchNewsRecordById } from "@/lib/remote-news";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { record } = await fetchNewsRecordById(params.id, "both");

  if (!record) {
    notFound();
  }

  redirect(`/news/${record.id}/${buildNewsSlug(record)}`);
}
