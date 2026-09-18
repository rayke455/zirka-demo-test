import { getMaintenance } from "@/lib/cms";

/**
 * Whether maintenance mode is on — read by the proxy on each page request.
 *
 * Cached at the edge for a few seconds so that check stays fast; saving the
 * Features switchboard clears the cache, so a change applies immediately.
 */
export const revalidate = 15;

export async function GET() {
  const { on } = await getMaintenance();
  return Response.json({ maintenance: on });
}
