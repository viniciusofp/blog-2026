import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import config from "@/payload.config";

import PostItem from "@/components/blog/PostItem";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Post, Tag } from "@/payload-types";
import { ResolvingMetadata, Metadata } from "next";

export type TagPageProps = {
  searchParams: Promise<{ page: string; preview: string }>;
  params: Promise<{ slug: string }>;
};
export async function generateMetadata(
  { params, searchParams }: TagPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });
  const slug = (await params).slug;

  // fetch post information
  const { docs: tags } = await payload.find({
    collection: "tags",
    where: { slug: { equals: slug } },
  });
  if (tags[0]) {
    return {
      title: `${tags[0].name} (Tag) - ${blogInfo.name}`,
    };
  }
  return {};
}

export default async function TagPage({ searchParams, params }: TagPageProps) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { page, preview } = await searchParams;
  const { slug } = await params;
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });
  const { docs, totalPages, nextPage, prevPage } = await payload.find({
    collection: "posts",
    limit: 12,
    page: page ? parseInt(page) : 1,
    where: {
      and: [
        {
          or: [
            {
              _status: {
                equals: user && Boolean(preview) ? "draft" : "published",
              },
            },
            {
              _status: {
                equals: user && Boolean(preview) ? "published" : "published",
              },
            },
          ],
        },
        { "tags.slug": { equals: slug } },
      ],
    },
    pagination: true,
    sort: "-createdAt",
    depth: 2,
    draft: user && Boolean(preview) ? true : false,
  });

  const tag = docs[0].tags?.filter((t) => (t as Tag).slug === slug)[0];
  return (
    <>
      <div className="mt-4 flex w-max max-w-full items-center gap-1 rounded border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium tracking-wide [&_svg]:size-3 [&_svg]:text-stone-400">
        <Link href="/blog" className="text-red-600 hover:underline">
          Blog
        </Link>
        <ChevronRight style={{ width: "16px", height: "16px" }} />
        <p className="">{(tag as Tag).name} (Tag)</p>
      </div>
      <div className="flex flex-col divide-y divide-stone-200">
        {docs.map((doc) => {
          return <PostItem key={doc.id} doc={doc as Post} />;
        })}
      </div>
      <div className="footer my-8 grid grid-cols-3 items-center text-sm tracking-wide">
        <div>
          {prevPage ? (
            <Link
              href={`/blog?page=${prevPage}`}
              className="flex items-center justify-start gap-1 text-red-600 opacity-80 duration-200 hover:opacity-100"
            >
              <ArrowLeft className="size-4" />
              Mais novos
            </Link>
          ) : null}
        </div>
        <div className="flex items-center justify-center text-stone-400 uppercase">
          {page ? page : 1}/{totalPages}
        </div>
        <div>
          {nextPage ? (
            <Link
              href={`/blog?page=${nextPage}`}
              className="flex items-center justify-end gap-1 text-red-600 opacity-80 duration-200 hover:opacity-100"
            >
              Mais antigos <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
