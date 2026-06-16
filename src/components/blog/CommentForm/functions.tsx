"use server"; // Marks this function as a Server Action

import { getPayload } from "payload";
import config from "@/payload.config";

import { validateTurnstileToken } from "next-turnstile";
import { v4 } from "uuid";

export async function createItem(formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const token = formData.get("cf-turnstile-response") as string;
  const validationResponse = await validateTurnstileToken({
    token,
    secretKey: process.env.TURNSTILE_SECRET_KEY!,
    // Optional: Add an idempotency key to prevent token reuse
    idempotencyKey: v4(),
  });
  if (!validationResponse.success) {
    return false;
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  const acceptsEmail = formData.get("acceptsEmail");

  if (name && email && content && postId) {
    const data: any = {
      author: { name, email },
      content: content,
      post: postId,
      acceptsEmail: Boolean(acceptsEmail),
      isApproved: false,
    };
    try {
      await payload.create({
        collection: "comments",
        data,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
