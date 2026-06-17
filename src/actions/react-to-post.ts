"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { revalidatePath } from "next/cache";

export const reactToPost = async (id: string, reacts: any) => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const reactionDoc = await payload.find({
    collection: "post-reactions",
    where: { post: { equals: id } },
  });
  console.log(reacts);
  if (reactionDoc.docs[0]) {
    await payload.update({
      collection: "post-reactions",
      id: reactionDoc.docs[0].id,
      data: { reactions: reacts },
    });
  } else {
    await payload.create({
      collection: "post-reactions",
      data: { post: id, reactions: reacts },
    });
  }

  revalidatePath("/");
  revalidatePath("/[slug]");
  revalidatePath("/tag/[slug]");
  revalidatePath("/categoria/[slug]");
};
