"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { createItem } from "./functions";
import { AlertCircle, MailIcon, UserIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Turnstile } from "next-turnstile";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type CommentFormProps = { postId: string };

export default function CommentForm({ postId }: CommentFormProps) {
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<string>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formRef.current) {
      setIsLoading(false);
      return;
    }

    if (turnstileStatus !== "success") {
      setError("Please verify you are not a robot");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);

    try {
      const response = await createItem(formData);

      if (response) {
        setIsSent(true);
      } else {
        setError(
          "Ocorreu um erro. Por favor, tente novamente ou envie um email para viniciusofp@gmail.com.",
        );
      }
    } catch (err) {
      setError(
        "Ocorreu um erro. Por favor, tente novamente ou envie um email para viniciusofp@gmail.com.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded border border-stone-200 bg-white p-5">
      <h2 className="mb-4 text-xl font-bold">Deixe o seu comentário</h2>
      {isSent ? (
        <p className="text-sm text-balance text-stone-600">
          Muito obrigado pela contribuição! Seu comentário será exibido aqui
          após aprovação manual.
        </p>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={cn("grid gap-4")}
        >
          <Field className="w-full">
            <FieldLabel htmlFor="content">Comentário</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id="content"
                name="content"
                minLength={5}
                required
                rows={5}
              ></InputGroupTextarea>
            </InputGroup>
          </Field>
          <Field className="w-full">
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="name"
                type="text"
                name="name"
                required
                minLength={3}
              />
              <InputGroupAddon align="inline-start">
                <UserIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="w-full">
            <FieldLabel htmlFor="email">
              <span className="shrink-0">E-mail</span>
              <span className="shrink text-xs text-stone-400">
                (Não se preocupe, seu e-mail não vai ser publicado.)
              </span>
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                type="text"
                name="email"
                required
                minLength={8}
              />
              <InputGroupAddon align="inline-start">
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <input
            type="text"
            name="postId"
            value={postId}
            className="hidden"
            readOnly
          />
          <FieldLabel className="border-stone-200">
            <Field orientation="horizontal">
              <Checkbox id="acceptsEmail" name="acceptsEmail" defaultChecked />
              <FieldContent>
                <FieldTitle>Assinar a newsletter</FieldTitle>
                <FieldDescription>
                  Prometo não te incomodar. Se rolar newsletter uma vez por mês,
                  é muito.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            retry="auto"
            refreshExpired="auto"
            onError={() => {
              setTurnstileStatus("error");
              setError("Security check failed. Please try again.");
            }}
            onExpire={() => {
              setTurnstileStatus("expired");
              setError("Security check expired. Please verify again.");
            }}
            onLoad={() => {
              setTurnstileStatus("required");
              setError(null);
            }}
            onVerify={(token) => {
              setTurnstileStatus("success");
              setError(null);
            }}
          />
          <p className="text-sm text-stone-600">
            Os comentários precisam ser aprovados antes de aparecerem
            publicamente nesta página.
          </p>
          {error && (
            <div
              className="mb-2 flex items-center gap-2 text-sm text-red-500"
              aria-live="polite"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
