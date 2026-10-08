import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Awards from "@/components/sections/Awards";
import Music from "@/components/sections/Music";
import Movies from "@/components/sections/Movies";
import Links from "@/components/sections/Links";
import { getSiteSettings } from "@/lib/content";

export const instant = false;

export default async function Home() {
  const site = await getSiteSettings();

  return (
    <>
      <Nav siteName={site.name} />
      <main>
        <About />
        <Projects />
        <Photos />
        <Awards />
        <Music />
        <Movies />
        <Links />
      </main>
      <Footer siteName={site.name} />
    </>
  );
}
