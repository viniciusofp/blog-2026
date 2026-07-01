"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { revalidatePath } from "next/cache";
import { render } from "react-email";
import SubscriptionConfirmation from "@/components/email/SubscriptionConfirmation";

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
        const blogInfo = await payload.findGlobal({ slug: "blogInfo" });

      const emailHtml = await render(
        <SubscriptionConfirmation
          url={`${process.env.NEXT_PUBLIC_SERVER_URL}/newsletter/confirm/${newSubscriber.id}`}
          blogInfo={blogInfo}
        />,
      );

      if (newSubscriber) {
        await payload.sendEmail({
          to: email,
          subject: "Confirme sua inscrição na newsletter",
          html: emailHtml,
        });
      }
      return "Obrigado pela inscrição!";
    } else {
      console.log("This email is already subscribed.");
      return "E-mail já registrado.";
    }
  } catch (error) {
    return "Ocorreu um erro.";
  }
};
