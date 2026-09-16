import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.xn--b60bj1s89e3pf91mzkd.com/sitemap.xml",
  };
}
