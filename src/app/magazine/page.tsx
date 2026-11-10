import MagazineIndexClient from "@/components/MagazineIndexClient";
import { getPublishedArticles, getKstTodayString, MAGAZINE_CATEGORIES } from "@/data/magazine";

export const revalidate = 60;

export default function MagazineIndexPage() {
  const now = new Date();
  const articles = getPublishedArticles(now).map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    publishDate: article.publishDate,
    readingTime: article.readingTime,
    tags: article.tags,
    featured: article.featured,
  }));

  return <MagazineIndexClient articles={articles} todayStr={getKstTodayString(now)} categories={MAGAZINE_CATEGORIES} />;
}
