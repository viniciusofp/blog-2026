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
    <div className="mb-8 flex items-center gap-4">
      <div className="">
        <img src={logo.src} alt={blogInfo.name} className="mb-2 h-6" />
        <CustomRichText
          className="max-w-lg text-xs leading-snug text-balance text-stone-600 [&_a]:underline"
          data={blogInfo.description}
        />
      </div>
    </div>
  );
}
