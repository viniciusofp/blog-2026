import { headers as getHeaders } from "next/headers";

import { getPayload } from "payload";
import config from "@/payload.config";

import PostItem from "@/components/blog/PostItem";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Post } from "@/payload-types";
import { Metadata } from "next";

export type BlogPageProps = {
  searchParams: Promise<{ page: string; preview: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });

  return {
    title: `${blogInfo.name}`,
    description: `${blogInfo.description}`,
  };
}
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  const { page, preview } = await searchParams;
  const { docs, totalPages, nextPage, prevPage } = await payload.find({
    collection: "posts",
    limit: 12,
    page: page ? parseInt(page) : 1,
    pagination: true,
    sort: "-createdAt",
    depth: 2,
    draft: user && Boolean(preview) ? true : false,
  });

  return (
    <>
      <div className="flex flex-col divide-y divide-stone-200">
        {docs.map((doc) => {
          return <PostItem key={doc.id} doc={doc as Post} />;
        })}
      </div>
      <div className="footer my-8 grid grid-cols-3 items-center text-sm tracking-wide">
        <div>
          {prevPage ? (
            <Link
              href={`/?page=${prevPage}`}
              className="flex items-center justify-start gap-1 text-orange-800 opacity-80 duration-200 hover:opacity-100"
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
              href={`/?page=${nextPage}`}
              className="flex items-center justify-end gap-1 text-orange-800 opacity-80 duration-200 hover:opacity-100"
            >
              Mais antigos <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
