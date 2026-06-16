"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { revalidatePath } from "next/cache";

export const subscribeToNewsletter = async (formData: FormData) => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const email = formData.get("email") as string;
  try {
    const { docs: subscribers } = await payload.find({
      collection: "subscribers",
      where: { email: { equals: email } },
    });
    if (!(subscribers?.length > 0)) {
      const newSubscriber = await payload.create({
        collection: "subscribers",
        data: { email },
      });
      console.log("A new subscriber was registered.");
      return "Obrigado pela inscrição!";
    } else {
      console.log("This email is already subscribed.");
      return "E-mail já registrado.";
    }
  } catch (error) {
    return "Ocorreu um erro.";
  }
};
