import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import type { Plugin } from "payload";

/**
 * On Vercel the filesystem is read-only and wiped between requests, so uploads
 * go to Vercel Blob instead. Locally (no token) uploads stay in public/uploads.
 */
export const storage: Plugin[] = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        collections: { media: true },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  : [];
