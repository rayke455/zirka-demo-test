import ConsentedVideo from "./ConsentedVideo";

/**
 * Plays a video from a YouTube/Vimeo link or an uploaded file.
 * YouTube uses the no-cookie domain so a visitor isn't tracked before they press play.
 */
export type VideoSource = { url?: string | null; file?: string | null; poster?: string | null };

const youTubeId = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m?.[1] ?? null;
};

const vimeoId = (url: string) => url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null;

export const hasVideo = (v: VideoSource | null | undefined) => Boolean(v && (v.url || v.file));

export default function VideoEmbed({
  video,
  title = "Video",
}: {
  video: VideoSource;
  title?: string;
}) {
  const url = video.url?.trim();

  if (url) {
    const yt = youTubeId(url);
    const vimeo = vimeoId(url);
    if (yt || vimeo) {
      const src = yt
        ? `https://www.youtube-nocookie.com/embed/${yt}?rel=0`
        : `https://player.vimeo.com/video/${vimeo}`;
      return (
        <div className="video-frame">
          <ConsentedVideo src={src} title={title} poster={video.poster} />
        </div>
      );
    }
  }

  const file = video.file || url;
  if (!file) return null;

  return (
    <div className="video-frame">
      <video controls preload="metadata" playsInline poster={video.poster ?? undefined}>
        <source src={file} />
        Your browser can&rsquo;t play this video.
      </video>
    </div>
  );
}
