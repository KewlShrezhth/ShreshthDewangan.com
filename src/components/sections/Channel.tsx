import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ChannelRow from "@/components/ChannelRow";
import { getChannel, CHANNEL_URL, SUBSCRIBE_URL } from "@/lib/youtube";

const DESCRIPTION =
  "A YouTube channel I run: explainer videos on health and AI that I research, script and edit myself.";
const linkClass =
  "group/link inline-flex items-center gap-1.5 text-ink underline decoration-line hover:decoration-accent underline-offset-4 transition-colors hover:text-accent";

export default async function Channel() {
  const channel = await getChannel();
  const videos = channel?.videos ?? [];
  const live = channel !== null && videos.length > 0;

  return (
    <section className="pt-14 md:pt-20 pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Informator" note={DESCRIPTION} />
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
          {live && <ChannelRow videos={videos} />}
        </Reveal>
      </div>
    </section>
  );
}
