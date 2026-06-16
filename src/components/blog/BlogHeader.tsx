import Link from "next/link";
import { getPayload } from "payload";

import config from "@/payload.config";
import { CustomRichText } from "@/components/CustomRichText";
import me from "@/public/me.jpg";

const payloadConfig = await config;
const payload = await getPayload({ config: payloadConfig });

export type BlogHeaderProps = {};

export default async function BlogHeader(props: BlogHeaderProps) {
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });

  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-white">
        <img
          src={me.src}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="">
        <Link href="/">
          <h1 className="font-bold text-stone-800">{blogInfo.name}</h1>
        </Link>
        <CustomRichText
          className="text-xs font-light text-balance text-stone-600"
          data={blogInfo.description}
        />
      </div>
    </div>
  );
}
