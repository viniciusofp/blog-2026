import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { CustomRichText } from "@/components/CustomRichText";
import logo from "@/public/logo.svg";
import Image from "next/image";

export type BlogHeaderProps = {};

export default async function BlogHeader(props: BlogHeaderProps) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });

  return (
    <div className="mb-8 grid items-center justify-center">
      <Link href="/" className="relative mx-auto mb-3 h-8 w-fit">
        <div className="relative z-4 flex h-full w-fit items-center justify-center rounded-t-lg border-2 border-stone-900 bg-white px-3 text-sm leading-0 font-medium tracking-widest">
          {blogInfo.name}
        </div>
        <div className="absolute top-0 left-3 z-3 h-full w-full rounded-t-lg border-2 border-stone-900 bg-green-100"></div>
        <div className="absolute top-0 left-6 z-2 h-full w-full rounded-t-lg border-2 border-stone-900 bg-yellow-200"></div>
        <div className="absolute top-0 left-9 z-1 h-full w-full rounded-t-lg border-2 border-stone-900 bg-red-400"></div>
      </Link>
      <CustomRichText
        className="max-w-lg text-center text-xs leading-snug text-balance text-stone-600 [&_a]:underline"
        data={blogInfo.description}
      />
    </div>
  );
}
