import { MetadataRoute } from "next";
import { REGIONS } from "@/data/regions";
import { BIKE_MODELS } from "@/data/models";
import { getPublishedArticles } from "@/data/magazine";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr";
  const now = new Date();

  // 기본 정적 페이지
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/price`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/regions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 모든 지역별 & 동별 개별 랜딩페이지 (1,200+ URL)
  const regionRoutes: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${baseUrl}/regions/${region.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: region.priority || 0.8,
  }));

  // 모든 기종별 개별 랜딩페이지 (74 URL)
  const modelRoutes: MetadataRoute.Sitemap = BIKE_MODELS.map((model) => ({
    url: `${baseUrl}/models/${model.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 일일 자동 발행 매거진 칼럼 페이지
  const publishedArticles = getPublishedArticles();
  const magazineRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${baseUrl}/magazine/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...routes, ...regionRoutes, ...modelRoutes, ...magazineRoutes];
}
