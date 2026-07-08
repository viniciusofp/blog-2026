"use client";

import { DynamicContentLink } from "@/components/DynamicContentLink";
import { Button } from "@/components/ui/button";
import { useDocumentInfo, useField } from "@payloadcms/ui";
import { ExternalLink, EyeIcon } from "lucide-react";
import type { BeforeDocumentControlsClientProps } from "payload";

const buttonClasses =
  "flex h-9 items-center gap-2 rounded bg-red-100 px-3 text-xs font-medium tracking-wider text-red-600 uppercase no-underline duration-75 hover:bg-red-600 hover:text-white";

export function VisitContent(props: BeforeDocumentControlsClientProps) {
  const { value: slug } = useField({ path: "slug" });
  const { value: status } = useField({ path: "_status" });
  const { collectionSlug } = useDocumentInfo();
  return (
    <div className="flex items-center gap-1">
      {status === "draft" && (
        <DynamicContentLink
          slug={slug as string}
          collection={collectionSlug as string}
          target="_blank"
          suffix="?preview=true"
          className={buttonClasses}
        >
          Preview <EyeIcon className="size-4" />
        </DynamicContentLink>
      )}

      {status === "published" && (
        <DynamicContentLink
          slug={slug as string}
          collection={collectionSlug as string}
          target="_blank"
          className={buttonClasses}
        >
          Visitar <ExternalLink className="size-4" />
        </DynamicContentLink>
      )}
    </div>
  );
}
