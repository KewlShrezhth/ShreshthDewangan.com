import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TabsProvider, TabPanel } from "@/components/Tabs";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Awards from "@/components/sections/Awards";
import Music from "@/components/sections/Music";
import Movies from "@/components/sections/Movies";
import {
  getSiteSettings,
  getAbout,
  getProjects,
  getAwards,
  getPhotos,
  getMusic,
  getMovies,
} from "@/lib/content";

export const instant = false;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [site, about, projects, awards, photos, music, movies, { tab }] =
    await Promise.all([
      getSiteSettings(),
      getAbout(),
      getProjects(),
      getAwards(),
      getPhotos(),
      getMusic(),
      getMovies(),
      searchParams,
    ]);
  const soon = (
    <p className="px-6 py-20 text-center text-ink-faint">Coming soon.</p>
  );

  return (
    <TabsProvider initial={tab}>
      <Nav siteName={site.name} />
      <main>
        <TabPanel id="about">
          <About />
        </TabPanel>
        <TabPanel id="work">
          <h1 className="sr-only">Work</h1>
          {projects.length + awards.length === 0 && soon}
          <div id="projects" className="scroll-mt-20">
            <Projects />
          </div>
          <div id="awards" className="scroll-mt-20">
            <Awards />
          </div>
        </TabPanel>
        <TabPanel id="life">
          <h1 className="sr-only">Life</h1>
          {photos.length + music.length + movies.length === 0 && soon}
          <div id="photos" className="scroll-mt-20">
            <Photos />
          </div>
          <div id="music" className="scroll-mt-20">
            <Music />
          </div>
          <div id="movies" className="scroll-mt-20">
            <Movies />
          </div>
        </TabPanel>
      </main>
      <Footer siteName={site.name} email={about.email} linkedin={about.linkedin} />
    </TabsProvider>
  );
}
