/**
 * Renders a schema.org record for search engines. Nothing is shown to visitors.
 *
 * The content comes out of the CMS, so a stray "</script>" in an answer would
 * otherwise end the tag early and spill the rest onto the page — escaping the
 * angle bracket keeps the payload inside the script where it belongs.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
