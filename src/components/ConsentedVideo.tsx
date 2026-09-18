"use client";

import { useState } from "react";

/**
 * A YouTube or Vimeo player loads code from that provider, which can set
 * cookies, so the player is never loaded until the visitor presses play. That
 * press is the permission — which is why the site needs no consent banner for
 * it. Until then this is just an image and a button.
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
  const [allowed, setAllowed] = useState(false);

  if (allowed) {
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
