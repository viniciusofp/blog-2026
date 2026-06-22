"use client";
import ReactPlayer from "react-player";
import { cn } from "@/lib/utils";

import type {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import React, { useEffect, useState } from "react";
import { collectionMap } from "./DynamicContentLink";
import { Media } from "@/payload-types";
import ImageGallery from "./blocks/ImageGallery";

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!;
  console.log(value);
  if (typeof value !== "object") {
    throw new Error(`Expected value to be an object: ${JSON.stringify(value)}`);
  }

  if (collectionMap[relationTo] !== undefined) {
    return `${collectionMap[relationTo]}/${value.slug}`;
  } else {
    return `/${relationTo}/${value.slug}`;
  }
};

const CustomVideoEmbedComponent: React.FC<{
  node: SerializedUploadNode;
}> = ({ node }) => {
  return (
    <div className="my-8 aspect-video w-full md:my-12 md:ml-[-4ch] md:w-[73ch] lg:ml-[-10ch] lg:w-[85ch] xl:my-16">
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        src={node.fields.url || node.fields.image}
      />
    </div>
  );
};

const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode;
}> = ({ node }) => {
  const [uploadDoc, setUploadDoc] = useState<any>();

  useEffect(() => {
    if (node.relationTo === "media") {
      if (typeof node.value !== "object") {
        fetchDoc();
      } else {
        setUploadDoc(node.value);
      }
    }
  }, [node]);

  const fetchDoc = async () => {
    await fetch(`/api/media/${node.value}`)
      .then((res) => res.json())
      .then((res) => setUploadDoc(res));
  };
  if (!uploadDoc) return null;

  return (
    <figure className="">
      <img
        alt={uploadDoc.alt}
        height={uploadDoc.height}
        src={
          uploadDoc?.sizes?.half?.url
            ? uploadDoc?.sizes?.half?.url
            : uploadDoc.url
        }
        width={uploadDoc.width}
        className="rounded-xs"
      />
      {uploadDoc.alt || uploadDoc.author ? (
        <figcaption className="not-prose mt-1 text-sm text-stone-400">
          {uploadDoc.alt}{" "}
          {uploadDoc.author ? <>(📸 {uploadDoc.author})</> : null}
        </figcaption>
      ) : null}
    </figure>
  );
};

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Override the default upload converter
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />;
  },
  blocks: {
    videoEmbed: ({ node }: any) => <CustomVideoEmbedComponent node={node} />,
    code: ({ node }: any) => {
      return (
        <div
          className="my-8"
          dangerouslySetInnerHTML={{ __html: node.fields.code }}
        ></div>
      );
    },
    imageGallery: ({ node }: any) => <ImageGallery node={node} />,
  },
});

export const CustomRichText: React.FC<{
  data: SerializedEditorState;
  className?: string;
}> = ({ data: lexicalData, className }) => {
  return (
    <>
      <RichText
        converters={jsxConverters}
        data={lexicalData}
        className={cn(className)}
      />
    </>
  );
};
