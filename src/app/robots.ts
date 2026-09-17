import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
    ],
    sitemap: "https://www.xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr/sitemap.xml",
  };
}
