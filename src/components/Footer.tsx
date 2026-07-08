import Link from "next/link";

import { getPayload } from "payload";
import config from "@/payload.config";
import { CustomRichText } from "./CustomRichText";

export type FooterProps = {};

export default async function Footer(props: FooterProps) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const blogInfo = await payload.findGlobal({ slug: "blogInfo" });
  return (
    <div>
      <CustomRichText
        className="mx-auto my-4 max-w-prose text-center text-lg text-pretty text-stone-800 [&_a]:font-medium [&_a]:text-red-600 [&_a]:hover:underline"
        data={blogInfo.footerMessage}
      />

      <p className="text-center text-sm text-stone-600">
        <br />
        Vinícius Pereira. 2026.
        <br />
        <Link
          href="https://www.viniciusofp.com.br"
          className="font-medium text-stone-800 hover:underline"
        >
          www.viniciusofp.com.br
        </Link>
      </p>
    </div>
  );
}
