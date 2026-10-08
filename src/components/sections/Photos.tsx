import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import PhotoGallery from "./PhotoGallery";
import { photos } from "@/data/photos";

export default function Photos() {
  return (
    <section id="photos" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="02" title="Photos" note="Moments worth keeping." />
        </Reveal>

        <Reveal delay={100}>
          {photos.length > 0 ? (
            <PhotoGallery photos={photos} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Placeholder
                  key={i}
                  label="Photo"
                  className={`shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift rounded-sm ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}`}
                />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
