import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TabsProvider, TabPanel } from "@/components/Tabs";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Awards from "@/components/sections/Awards";
import Music from "@/components/sections/Music";
import Movies from "@/components/sections/Movies";
import Links from "@/components/sections/Links";
import { getSiteSettings } from "@/lib/content";

export const instant = false;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [site, { tab }] = await Promise.all([getSiteSettings(), searchParams]);

  return (
    <TabsProvider initial={tab}>
      <Nav siteName={site.name} />
      <main>
        <TabPanel id="about">
          <About />
        </TabPanel>
        <TabPanel id="projects">
          <Projects />
        </TabPanel>
        <TabPanel id="photos">
          <Photos />
        </TabPanel>
        <TabPanel id="awards">
          <Awards />
        </TabPanel>
        <TabPanel id="music">
          <Music />
        </TabPanel>
        <TabPanel id="movies">
          <Movies />
        </TabPanel>
        <TabPanel id="links">
          <Links />
        </TabPanel>
      </main>
      <Footer siteName={site.name} />
    </TabsProvider>
  );
}
