import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Your Name — Personal Site",
  description: "Personal site — projects, photos, awards, and the things I like.",
};

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
