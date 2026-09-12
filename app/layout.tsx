import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosmic Explorer — Astronomy & Space Platform",
  description:
    "Explore the universe through live NASA data — daily astronomy pictures, the ISS, asteroids, Mars and the latest space news.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${jakarta.variable} ${space.variable} dark`}>
      <body className="min-h-screen font-sans antialiased starfield selection:bg-sky-500/30 selection:text-white">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
