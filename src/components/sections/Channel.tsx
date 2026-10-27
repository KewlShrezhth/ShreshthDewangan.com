import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ChannelRow from "@/components/ChannelRow";
import { getChannel, CHANNEL_URL, SUBSCRIBE_URL } from "@/lib/youtube";

const DESCRIPTION =
  "A YouTube channel I started in October 2026: explainer videos on AI and health that I research, script and edit myself. 20 videos and 1,000+ views in the first two weeks.";
const linkClass =
  "group/link inline-flex items-center gap-1.5 text-ink underline decoration-line hover:decoration-accent underline-offset-4 transition-colors hover:text-accent";

export default async function Channel() {
  const channel = await getChannel();
  const live = channel !== null;

  return (
    <section className="pt-14 md:pt-20 pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Informator" titleSize="text-4xl sm:text-5xl md:text-7xl" note={DESCRIPTION} />
          <div className="-mt-4 mb-8 flex items-center gap-4 text-sm">
            {live && channel.avatar && (
              <Image
                src={channel.avatar}
                alt=""
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-full"
              />
            )}
            <a
              href={live ? SUBSCRIBE_URL : CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              {live ? "Subscribe on YouTube" : "Visit channel"}
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </a>
          </div>
          {live && <ChannelRow long={channel.long} short={channel.short} />}
          {live && (
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className={`${linkClass} mt-8 text-sm`}
            >
              Watch more on YouTube
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
