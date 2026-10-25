import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VinylPlayer from "@/components/VinylPlayer";
import { getMusic } from "@/lib/content";
import { findTrack } from "@/lib/itunes";

export default async function Music() {
  const music = await getMusic();
  if (music.length === 0) return null;
  const lookups = await Promise.all(music.map((m) => findTrack(m.title, m.artist)));

  const tracks = music.map((m, i) => ({
    id: m.id,
    title: m.title,
    artist: m.artist,
    note: m.note,
    cover: m.artwork ?? lookups[i]?.cover ?? null,
    preview: lookups[i]?.preview ?? null,
    link: m.link ?? lookups[i]?.url ?? null,
  }));

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Music" note="On repeat lately." />
        </Reveal>

        {tracks.length > 0 && (
          <Reveal delay={100}>
            <VinylPlayer tracks={tracks} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
