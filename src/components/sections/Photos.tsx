import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PhotoGallery from "./PhotoGallery";
import { getPhotos } from "@/lib/content";

export default async function Photos() {
  const photos = await getPhotos();
  if (photos.length === 0) return null;

  return (
    <section className="pt-20 md:pt-28 pb-14 md:pb-20 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Photos" note="Moments worth keeping." />
        </Reveal>

        <Reveal delay={100}>
          <PhotoGallery photos={photos.map((p) => ({ ...p, alt: p.alt || p.caption || "" }))} />
        </Reveal>
      </div>
    </section>
  );
}
