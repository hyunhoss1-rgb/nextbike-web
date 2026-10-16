import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // AI 스크래퍼, 실시간 LLM 브라우징 봇, 학습용 크롤러 및 경쟁사 분석 스파이 봇 전면 차단 목록
  const aiAndScraperBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "GoogleOther",
    "GoogleOther-Image",
    "GoogleOther-Video",
    "Google-CloudVertexBot",
    "Applebot-Extended",
    "Bytespider",
    "CCBot",
    "Diffbot",
    "FacebookBot",
    "Meta-ExternalAgent",
    "Meta-ExternalFetcher",
    "cohere-ai",
    "cohere-training-data-crawler",
    "Amazonbot",
    "Scrapy",
    "YouBot",
    "Omgilibot",
    "Omgili",
    "AI2Bot",
    "Ai2Bot-Dolma",
    "DuckAssistBot",
    "Timpibot",
    "Webzio-Extended",
    "ImagesiftBot",
    "Kangaroo Bot",
    "PetalBot",
    "PanguBot",
    "Sentibot",
    "TurnitinBot",
    "img2dataset",
    "AhrefsBot",
    "SemrushBot",
    "MJ12bot",
    "DotBot",
    "BLEXBot",
    "DataForSeoBot",
  ];

  // 메인페이지뿐만 아니라 모든 세부페이지 경로까지 명시적 완전 차단
  const blockedSubPaths = [
    "/",
    "/*",
    "/regions",
    "/regions/",
    "/regions/*",
    "/models",
    "/models/",
    "/models/*",
    "/magazine",
    "/magazine/",
    "/magazine/*",
    "/price",
    "/cases",
    "/reviews",
    "/privacy",
    "/terms",
    "/sitemap.xml",
    "/api/",
  ];

  const allowedSearchPaths = [
    "/",
    "/regions/",
    "/models/",
    "/magazine/",
    "/price",
    "/cases",
    "/reviews",
  ];

  return {
    rules: [
      {
        userAgent: "Yeti", // 네이버 검색 로봇 메인·세부페이지 100% 정상 허용
        allow: allowedSearchPaths,
        disallow: ["/api/"],
      },
      {
        userAgent: "NaverBot", // 네이버 보조 로봇 정상 허용
        allow: allowedSearchPaths,
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot", // 구글 검색 로봇 메인·세부페이지 100% 정상 허용
        allow: allowedSearchPaths,
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot-Image", // 구글 이미지 검색 로봇 정상 허용
        allow: ["/"],
        disallow: ["/api/"],
      },
      {
        userAgent: "Daumoa", // 다음(카카오) 검색 로봇 정상 허용
        allow: allowedSearchPaths,
        disallow: ["/api/"],
      },
      {
        userAgent: "bingbot", // Bing 검색 로봇 정상 허용
        allow: allowedSearchPaths,
        disallow: ["/api/"],
      },
      // AI 크롤러 및 데이터 수집 봇: 메인페이지 및 전 세부페이지 진입 원천 차단
      ...aiAndScraperBots.map((bot) => ({
        userAgent: bot,
        disallow: blockedSubPaths,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/sitemap.xml",
  };
}
