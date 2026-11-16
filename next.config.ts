import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents 는 끈다 — 쿠키를 읽는 페이지가 자동으로 동적 렌더된다 (문서 결정 ⑤)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
