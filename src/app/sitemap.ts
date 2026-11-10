import { MetadataRoute } from "next";
import { REGIONS } from "@/data/regions";
import { BIKE_MODELS } from "@/data/models";
import { getPublishedArticles } from "@/data/magazine";

// A crawler must receive the current publication set, independent of metadata
// route caching. The XML is inexpensive to generate and has stable article dates.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr";
  const now = new Date();

  // 기본 정적 페이지
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/magazine`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/price`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/regions`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/models`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cases`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reviews`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 모든 지역별 & 동별 개별 랜딩페이지 (1,200+ URL)
  const regionRoutes: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${baseUrl}/regions/${region.slug}`,
    changeFrequency: "weekly",
    priority: region.isMetropolitan ? 0.85 : (region.priority || 0.8),
  }));

  // All current model landing pages.
  const modelRoutes: MetadataRoute.Sitemap = BIKE_MODELS.map((model) => ({
    url: `${baseUrl}/models/${model.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 일일 자동 발행 매거진 칼럼 페이지
  const publishedArticles = getPublishedArticles(now);
  const magazineRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${baseUrl}/magazine/${article.slug}`,
    lastModified: new Date(article.publishDate + "T00:00:00+09:00"),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...routes, ...regionRoutes, ...modelRoutes, ...magazineRoutes];
}
