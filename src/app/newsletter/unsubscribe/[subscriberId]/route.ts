import configPromise from "@payload-config";
import { NextRequest } from "next/server";
import { getPayload } from "payload";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/newsletter/unsubscribe/[subscriberId]">,
) {
  const payloadConfig = await configPromise;
  const payload = await getPayload({ config: payloadConfig });
  const { subscriberId } = await ctx.params;
  const subscriber = await payload.findByID({
    collection: "subscribers",
    id: subscriberId,
  });
  if (subscriber) {
    await payload.delete({ collection: "subscribers", id: subscriberId });
    return Response.json({
      msg: `O e-mail ${subscriber.email} foi excluído da lista, você não receberá mais os nossos e-mails.`,
    });
  } else {
    return Response.json({
      msg: `Não encontramos seu cadastro, parece que você já foi excluído da nossa lista de e-mails.`,
    });
  }
}
