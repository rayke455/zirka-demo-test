import VideoEmbed, { hasVideo } from "./VideoEmbed";
import { getFeatures, getSettings } from "@/lib/cms";

export default async function VideoSection() {
  const [features, settings] = await Promise.all([getFeatures(), getSettings()]);
  if (!features.showVideo || !hasVideo(settings.video)) return null;

  return (
    <section className="section--flow" id="video">
      <div className="wrap video-section">
        <div className="video-section__text">
          <span className="eyebrow">Watch</span>
          {settings.video.heading && <h2>{settings.video.heading}</h2>}
          {settings.video.intro && <p>{settings.video.intro}</p>}
        </div>
        <VideoEmbed video={settings.video} title={settings.video.heading || "Zirka video"} />
      </div>
    </section>
  );
}
