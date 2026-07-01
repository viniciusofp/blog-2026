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
    await payload.update({
      collection: "subscribers",
      id: subscriberId,
      data: { emailConfirmation: true },
    });
    return Response.json({
      msg: `Seu e-mail foi confirmado.`,
    });
  } else {
    return Response.json({
      msg: `Não encontramos o cadastro. Pode ser que seu e-mail já tenha sido excluído da nossa lista de e-mails. Se increva novamente!`,
    });
  }
}
