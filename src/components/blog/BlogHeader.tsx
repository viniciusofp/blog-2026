import Link from "next/link";
import { getPayload } from "payload";

import config from "@/payload.config";
import { CustomRichText } from "@/components/CustomRichText";
const payloadConfig = await config;
const payload = await getPayload({ config: payloadConfig });

export type BlogHeaderProps = {};

export default async function BlogHeader(props: BlogHeaderProps) {
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });

  return (
    <div className="border-b border-stone-200 py-8 text-center">
      <Link href="/blog">
        <h1 className="mb-1.5 text-3xl font-bold text-stone-800 md:text-4xl">
          {blogInfo.name}
        </h1>
      </Link>
      <CustomRichText
        className="text-sm font-light text-balance text-stone-600 md:text-base"
        data={blogInfo.description}
      />
    </div>
  );
}
