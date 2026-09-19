import { getSolutionCategories, hasPosts } from "@/lib/cms";
import HeaderNav from "./HeaderNav";

/**
 * Reads the solution categories on the server so the Services menu always
 * matches what is in the admin, then hands them to the interactive header.
 */
export default async function Header() {
  const [categories, showBlog] = await Promise.all([getSolutionCategories(), hasPosts()]);
  return (
    <HeaderNav
      categories={categories.map((c) => ({ name: c.name, slug: c.slug, description: c.description }))}
      showBlog={showBlog}
    />
  );
}
