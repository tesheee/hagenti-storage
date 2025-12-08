import type { Metadata } from "next";
import "@/shared/styles/globals.css";
import { Providers } from "@/app/providers";
import { LayoutContent } from "@/shared/components/layout/LayoutContent";

export const metadata: Metadata = {
  title: "hagenti.admin",
  description: "Система администрирования Hagenti",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
