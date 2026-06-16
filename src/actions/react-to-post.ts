"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { revalidatePath } from "next/cache";

export const reactToPost = async (id: string, reacts: any) => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  await payload.update({
    collection: "posts",
    id,
    data: {
      reactions: reacts,
    },
  });
  revalidatePath("/");
  revalidatePath("/[slug]");
  revalidatePath("/tag/[slug]");
  revalidatePath("/categoria/[slug]");
};
