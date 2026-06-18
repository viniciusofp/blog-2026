"use client";

import Link from "next/link";

type DynamicContentLinkProps = {
  slug: string;
  collection: string;
  children: React.ReactNode | undefined;
  href?: string | null;
  className?: string;
  onClick?: any;
  target?: any;
  suffix?: string;
};

export const collectionMap: any = {
  posts: "",
  pages: "",
};

export function DynamicContentLink(props: DynamicContentLinkProps) {
  const { slug, collection, children, href, suffix = "" } = props;

  return (
    <Link
      {...props}
      href={`${
        href ||
        `${collectionMap[collection]}/${slug}` ||
        `/${collection}/${slug}`
      }${suffix}`}
    >
      {children}
    </Link>
  );
}
