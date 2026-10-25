import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { getSiteName } from "@/lib/content";
import CursorSpotlight from "@/components/CursorSpotlight";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const FALLBACK_NAME = "Shreshth Dewangan";

export async function generateMetadata(): Promise<Metadata> {
  let name = FALLBACK_NAME;
  try {
    const siteName = await getSiteName();
    if (siteName && siteName !== "Your Name") name = siteName;
  } catch {}
  const description = "Shreshth Dewangan — projects, awards and the things I love.";
  return {
    metadataBase: new URL("https://shreshthdewangan.com"),
    title: { default: name, template: "%s | " + name },
    description,
    openGraph: { type: "website", siteName: name, title: name, description, url: "/" },
    twitter: { card: "summary_large_image", title: name, description },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <CursorSpotlight />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
