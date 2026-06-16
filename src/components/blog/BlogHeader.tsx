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
    <div className="mb-8 flex items-center gap-4">
      <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-white">
        <img
          src="https://media.licdn.com/dms/image/v2/D4D03AQFZElajahjxsA/profile-displayphoto-crop_800_800/B4DZg9PsAIHYAM-/0/1753374185609?e=1782950400&v=beta&t=JP98wa2L4adDSYUfIMFr9xDJ9ESyyBLKW2eKrlh8xNk"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="">
        <Link href="/blog">
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
