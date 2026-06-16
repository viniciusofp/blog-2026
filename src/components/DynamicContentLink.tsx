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
};

export const collectionMap: any = {
  posts: "/",
  pages: "",
};

export function DynamicContentLink(props: DynamicContentLinkProps) {
  const { slug, collection, children, href } = props;

  return (
    <Link
      {...props}
      href={
        href ||
        `${collectionMap[collection]}/${slug}` ||
        `/${collection}/${slug}`
      }
    >
      {children}
    </Link>
  );
}
