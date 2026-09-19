import type { Field } from "payload";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** A unique page address filled in from `from` (e.g. the title) unless typed by hand. */
export const slugField = (from: string, description: string): Field => ({
  name: "slug",
  type: "text",
  unique: true,
  index: true,
  admin: { position: "sidebar", description },
  hooks: {
    beforeValidate: [
      // A partial update may not include the source field, so fall back to the saved document.
      // Never store "": an empty string would collide with every other empty slug.
      ({ value, data, originalDoc }) => {
        if (value) return slugify(String(value));
        const source = data?.[from] ?? originalDoc?.[from];
        return source ? slugify(String(source)) : undefined;
      },
    ],
  },
});
