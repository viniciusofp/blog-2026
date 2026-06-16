"use client";

import { Category, Post, Tag } from "@/payload-types";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CustomRichText } from "@/components/CustomRichText";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import PostReactions from "./PostReactions";
import FadeIn from "../FadeIn";

export type PostItemProps = { doc: Post };

export default function PostItem({ doc }: PostItemProps) {
  const plaintext = convertLexicalToPlaintext({
    data: doc.content as SerializedEditorState,
  });
  const createdAt = new Date(doc.createdAt);
  const permalink = `/${doc.slug}`;
  return (
    <FadeIn>
      <div className="py-8">
        <div className="mt-8 -mb-2 flex flex-col gap-3">
          <Link href={permalink} title="Permalink">
            <p className="text-xs tracking-widest text-stone-400 uppercase duration-75 hover:text-stone-600 hover:underline">
              {createdAt.toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {createdAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              {doc.commentCount! > 0
                ? ` - ${doc.commentCount} ${doc.commentCount === 1 ? "comentário" : "comentários"}`
                : null}
            </p>
          </Link>
        </div>

        {doc.title ? (
          <div className="mb-6 lg:mb-8">
            <Link href={permalink}>
              <h2 className="mt-6 mb-6 text-2xl font-bold text-pretty hover:underline lg:mt-8 lg:text-3xl">
                {doc.title}
              </h2>
            </Link>
            <p className="line-clamp-3 text-lg leading-relaxed text-pretty text-stone-600">
              {plaintext}
            </p>
            <Link
              href={permalink}
              title="Permalink"
              className="mt-4 flex items-center gap-1 font-medium tracking-wide text-teal-800 opacity-80 duration-200 hover:gap-2 hover:underline hover:opacity-100 lg:mt-6"
            >
              Leia mais <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="prose prose-stone prose-xl lg:prose-2xl prose-a:text-teal-800/80 prose-a:hover:text-teal-800 prose-a:decoration-teal-800 prose-a:hover:underline prose-a:decoration-1 prose-a:underline-offset-2 prose-a:hover:decoration-2 text-pretty">
            <CustomRichText data={doc.content as SerializedEditorState} />
          </div>
        )}
        {(doc.categories && doc.categories.length > 0) ||
        (doc.tags && doc.tags.length > 0) ? (
          <div className="my-8 flex flex-col gap-3">
            {doc.categories && doc.categories.length > 0 ? (
              <p className="text-sm text-stone-600">
                Em{" "}
                {doc.categories?.map((c, index) => {
                  const cat = c as Category;
                  return (
                    <span key={cat.id + index + doc.id}>
                      {index > 0
                        ? index === doc.categories!.length - 1
                          ? " e "
                          : ", "
                        : null}
                      <Link
                        className="text-teal-800 hover:underline"
                        href={`/categoria/${cat.slug}`}
                      >
                        {cat.name}
                      </Link>
                    </span>
                  );
                })}
                .
              </p>
            ) : null}
            {doc.tags && doc.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {doc.tags?.map((c, index) => {
                  const tag = c as Tag;
                  return (
                    <Link
                      key={tag.id + index + doc.id}
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
        ) : null}
        {doc.reactions ? (
          <div className="-mt-4 mb-4">
            <PostReactions post={doc} postReactions={doc.reactions} />
          </div>
        ) : null}
      </div>
    </FadeIn>
  );
}
