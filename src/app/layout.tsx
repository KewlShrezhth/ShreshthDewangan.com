import type { Metadata } from "next";
import { Cinzel, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { getSiteName } from "@/lib/content";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const sourceSerif = Source_Serif_4({
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
      className={`${cinzel.variable} ${plexMono.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
