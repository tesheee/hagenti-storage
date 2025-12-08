// next.config.ts
import type { NextConfig } from "next";
import nextPWA from "next-pwa";

// Настройка next-pwa
const withPWA = nextPWA({
  dest: "public", // service-worker и manifest будут лежать в public/
  disable: process.env.NODE_ENV === "development", // отключаем в dev-режиме
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /_buildManifest\.js$/],
  fallbacks: {
    // Если страница не найдена в кэше и нет интернета — покажем эту страницу
    document: "/offline.html",
  },
  runtimeCaching: [
    // Кэшируем шрифты Google
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 30 },
      },
    },
    // Изображения
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "images",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    // Страницы (NetworkFirst — сначала сеть, потом кэш)
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [];
  },

  async redirects() {
    return [];
  },

  // Если используешь изображения из внешних доменов — добавь сюда
  // images: {
  //   remotePatterns: [{ hostname: 'example.com' }],
  // },
};

// Оборачиваем конфиг в withPWA только в продакшене
export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withPWA(nextConfig);
