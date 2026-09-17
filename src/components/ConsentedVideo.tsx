"use client";

import { useState } from "react";
import { useConsent } from "./CookieConsent";

/**
 * A YouTube/Vimeo player loads code from that provider, so it waits until the
 * visitor has accepted — or presses play on this placeholder, which is consent
 * for this one video.
 */
export default function ConsentedVideo({
  src,
  title,
  poster,
}: {
  src: string;
  title: string;
  poster?: string | null;
}) {
  const consent = useConsent();
  const [allowed, setAllowed] = useState(false);

  if (consent === "accepted" || allowed) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="video-gate"
      onClick={() => setAllowed(true)}
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      <span className="video-gate__play" aria-hidden="true">
        ▶
      </span>
      <span className="video-gate__text">
        Play video
        <em>Loads from the video provider, which may set cookies.</em>
      </span>
    </button>
  );
}
