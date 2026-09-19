import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PostCard from "@/components/PostCard";
import CtaBand from "@/components/CtaBand";
import { getPosts } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description:
    "Practical advice on advertising, SEO, social media, branding and automation from the strategists at Zirka Digital Solutions.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  // The blog has no page of its own until there is something on it.
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Marketing advice you can use."
        lede="Practical guides on getting found, winning more leads and turning clicks into customers, written by the Zirka team."
      />
      <section>
        <div className="wrap">
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard post={post} key={post.slug} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
