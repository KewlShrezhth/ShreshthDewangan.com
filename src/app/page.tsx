import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Photos from "@/components/sections/Photos";
import Awards from "@/components/sections/Awards";
import Music from "@/components/sections/Music";
import Movies from "@/components/sections/Movies";
import Links from "@/components/sections/Links";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <About />
        <Projects />
        <Photos />
        <Awards />
        <Music />
        <Movies />
        <Links />
      </main>
      <Footer />
    </>
  );
}
