import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import { ScrollSpyProvider } from "@/components/ScrollSpy";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Channel from "@/components/sections/Channel";
import Awards from "@/components/sections/Awards";
import Music from "@/components/sections/Music";
import Thoughts from "@/components/sections/Thoughts";
import Movies from "@/components/sections/Movies";
import {
  getSiteSettings,
  getAbout,
  getProjects,
  getAwards,
  getPhotos,
  getMusic,
  getMovies,
  getThoughts,
} from "@/lib/content";

export const instant = false;

export default async function Home() {
  const [site, about, projects, awards, photos, music, movies, thoughts] =
    await Promise.all([
      getSiteSettings(),
      getAbout(),
      getProjects(),
      getAwards(),
      getPhotos(),
      getMusic(),
      getMovies(),
      getThoughts(),
    ]);
  const hasWork = projects.length + awards.length > 0;
  const hasThoughts = thoughts.length > 0;
  const hasLife = photos.length + music.length + movies.length > 0;

  return (
    <ScrollSpyProvider>
      <Nav siteName={site.name} hasWork={hasWork} hasThoughts={hasThoughts} hasLife={hasLife} />
      <Ticker />
      <main>
        <div id="about" className="scroll-mt-16">
          <About />
        </div>
        {hasWork && (
          <div id="work" className="scroll-mt-16">
            <div id="projects" className="scroll-mt-20">
              <Projects />
            </div>
            <div id="channel" className="scroll-mt-20">
              <Channel />
            </div>
            <div id="awards" className="scroll-mt-20">
              <Awards />
            </div>
          </div>
        )}
        {hasThoughts && (
          <div id="thoughts" className="scroll-mt-16">
            <Thoughts />
          </div>
        )}
        {hasLife && (
          <div id="life" className="scroll-mt-16">
            <div id="photos" className="scroll-mt-20">
              <Photos />
            </div>
            <div id="music" className="scroll-mt-20">
              <Music />
            </div>
            <div id="movies" className="scroll-mt-20">
              <Movies />
            </div>
          </div>
        )}
      </main>
      <Footer siteName={site.name} email={about.email} linkedin={about.linkedin} />
    </ScrollSpyProvider>
  );
}
