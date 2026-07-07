import { getPayload } from "payload";

import CommentForm from "@/components/blog/CommentForm";
import { CustomRichText } from "@/components/CustomRichText";
import { Category, Comment, PostReaction, Tag } from "@/payload-types";
import config from "@/payload.config";
import Link from "next/link";
import { ResolvingMetadata, Metadata } from "next";
import { ChevronRight } from "lucide-react";
import React from "react";
import PostReactions from "@/components/blog/PostReactions";
import ExpandableComments from "@/components/blog/ExpandableComments";
import { headers as getHeaders } from "next/headers";
import PreviewAlert from "@/components/blog/PreviewAlert";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";

export type BlogPostProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview: string }>;
};

export async function generateMetadata(
  { params, searchParams }: BlogPostProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const { preview } = await searchParams;
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });
  const slug = (await params).slug;

  // fetch post information
  const { docs: posts } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
  });
  const post = posts[0];
  if (post) {
    const createdAt = new Date(post.createdAt);
    const plaintext = convertLexicalToPlaintext({
      data: post.content as SerializedEditorState,
    }).replaceAll("&nbsp;", " ");

    return {
      title: `${preview ? "PREVIEW: " : ""}${
        post.title
          ? `${post.title} - ${blogInfo.name}`
          : `${createdAt.toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })} - ${createdAt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${blogInfo.name}`
      }`,
      description:
        plaintext.length > 160 ? `${plaintext.slice(0, 154)} (...)` : plaintext,
    };
  }
  return {};
}
export default async function BlogPost({
  params,
  searchParams,
}: BlogPostProps) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { slug } = await params;

  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });
  const { preview } = await searchParams;

  const { docs } = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
      _status: { equals: user && Boolean(preview) ? "draft" : "published" },
    },
    depth: 1,
    draft: user && Boolean(preview) ? true : false,
  });
  const post = docs[0];

  if (!post)
    return (
      <div className="my-8">
        <p>
          Publicação não encontrada.
          <br />
          <Link href="/" className="font-medium hover:underline">
            Voltar pra casa.
          </Link>
        </p>
      </div>
    );
  let comments: Comment[] | false = false;
  const { docs: commentDocs } = await payload.find({
    collection: "comments",
    where: { post: { equals: post.id }, isApproved: { equals: true } },
    sort: "createdAt",
  });
  comments = commentDocs;
  const createdAt = new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);
  return (
    <>
      <RefreshRouteOnSave />
      {preview ? <PreviewAlert /> : null}
      <div className="mt-4 flex w-max max-w-full items-center gap-1 rounded border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium tracking-wide [&_svg]:size-3 [&_svg]:text-stone-400">
        <Link href="/" className="text-orange-800 hover:underline">
          Blog
        </Link>
        {post.categories && post.categories.length > 0 ? (
          <>
            <ChevronRight />
            {post.categories.map((c, i) => {
              const cat = c as Category;
              return (
                <React.Fragment key={`postCat_${post.id}_${cat.id}`}>
                  {i > 0 ? "|" : null}
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-orange-800 hover:underline"
                  >
                    {cat.name}
                  </Link>
                </React.Fragment>
              );
            })}
          </>
        ) : null}
        <ChevronRight style={{ width: "16px", height: "16px" }} />
        <p className="">
          {post.title
            ? post.title
            : `${createdAt.toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} - ${createdAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
        </p>
      </div>
      <div className="mt-16">
        <p className="mb-4 text-xs tracking-widest text-stone-400 uppercase">
          {createdAt.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          -{" "}
          {createdAt.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {post.commentCount! > 0 ? (
            <Link href="#comments">
              {" "}
              - {post.commentCount}{" "}
              {post.commentCount === 1 ? "comentário" : "comentários"}
            </Link>
          ) : null}
        </p>
        {post.title ? (
          <h1 className="mb-8 text-4xl leading-none font-bold text-pretty lg:text-5xl">
            {post.title}
          </h1>
        ) : null}
      </div>
      <div className="">
        <CustomRichText
          data={post.content}
          className="prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl lg:prose-h1:text-5xl lg:prose-h2:text-4xl lg:prose-h3:text-3xl lg:prose-h4:text-2xl prose prose-lg lg:prose-2xl prose-a:underline prose-a:decoration-[#FFF7B1] prose-a:[text-decoration-skip-ink:none] prose-a:underline-offset-[-0.25em] prose-a:hover:underline prose-a:decoration-[0.5em] prose-a:hover:decoration-[#FFEE50] text-pretty selection:bg-orange-200 selection:text-orange-900"
        />
      </div>
      {post.updatedAt !== post.createdAt ? (
        <p className="my-2 text-xs tracking-wide text-stone-400">
          Última atualização em:{" "}
          {`${updatedAt.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} - ${updatedAt.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </p>
      ) : null}
      <div className="flex flex-col gap-3">
        {post.categories && post.categories.length > 0 ? (
          <p className="text-sm text-stone-600">
            Em{" "}
            {post.categories?.map((c, index) => {
              const cat = c as Category;
              return (
                <span key={"page" + cat.id + index + post.id}>
                  {index > 0
                    ? index === post.categories!.length - 1
                      ? " e "
                      : ", "
                    : null}
                  <Link
                    className="text-orange-800 hover:underline"
                    href={`/categoria/${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                </span>
              );
            })}
          </p>
        ) : null}
        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((c, index) => {
              const tag = c as Tag;
              return (
                <Link
                  key={"page" + tag.id + index + post.id}
                  className="flex h-5 items-center justify-center rounded bg-stone-200 px-2 text-[10px] tracking-widest uppercase duration-75 hover:bg-stone-800 hover:text-white"
                  href={`/tag/${tag.slug}`}
                >
                  <span className="pr-0.5 opacity-33">#</span>
                  {tag.name}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="mt-4">
        <PostReactions post={post} />
      </div>
      {comments && comments.length > 0 ? (
        <ExpandableComments comments={comments} />
      ) : null}
      <CommentForm postId={post.id} />
    </>
  );
}
