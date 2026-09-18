import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // The dev-only route indicator defaults to the bottom-left, where it sits on
  // top of the admin sidebar's log out button. Errors still surface either way.
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    // The site and the admin each have their own root layout, so unmatched URLs
    // need a standalone 404 page rather than one composed from a shared layout.
    globalNotFound: true,
  },
};

export default withPayload(nextConfig);
