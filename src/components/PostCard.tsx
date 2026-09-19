import Image from "next/image";
import Link from "next/link";
import type { PostView } from "@/lib/cms";

export const formatPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function PostCard({ post }: { post: PostView }) {
  return (
    <Link className="post-card" href={`/blog/${post.slug}`}>
      {post.image && (
        <div className="post-card__media">
          <Image src={post.image} alt={post.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw" />
        </div>
      )}
      <div className="post-card__body">
        <span className="post-card__meta">
          {post.topic && <span className="post-card__topic">{post.topic}</span>}
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        </span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </div>
    </Link>
  );
}
