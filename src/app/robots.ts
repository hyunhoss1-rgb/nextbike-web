import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // AI 스크래퍼 및 학습용 크롤러 차단 목록
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Bytespider",
    "CCBot",
    "Diffbot",
    "FacebookBot",
    "Meta-ExternalAgent",
    "Google-Extended",
    "Applebot-Extended",
    "cohere-ai",
    "Amazonbot",
    "Scrapy",
    "YouBot",
    "Omgilibot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Yeti", // 네이버 검색 로봇 정상 허용
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot", // 구글 검색 로봇 정상 허용
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Daumoa", // 다음 검색 로봇 정상 허용
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "bingbot", // Bing 검색 로봇 정상 허용
        allow: "/",
        disallow: ["/api/"],
      },
      // AI 크롤러 및 데이터 수집 봇 전면 차단
      ...aiBots.map((bot) => ({
        userAgent: bot,
        disallow: ["/"],
      })),
    ],
    sitemap: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/sitemap.xml",
  };
}

