"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { ArrowRight, AudioLinesIcon, MailIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/actions/subscribe-to-newsletter";
import useLocalStorage from "use-local-storage";
import { useRef, useState } from "react";
import FadeIn from "../FadeIn";

export type SubscribeFooterProps = {};

export default function SubscribeFooter(props: SubscribeFooterProps) {
  const [hasSubscribed, setHasSubscribed] = useLocalStorage(
    "hasSubscribed",
    false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const formRef = useRef(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formRef.current) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);

    try {
      const response = await subscribeToNewsletter(formData);

      if (response) {
        setIsSent(true);
        setFeedback(response);
        setHasSubscribed;
      } else {
        setFeedback("Ocorreu um erro.");
      }
    } catch (err) {
      setFeedback("Ocorreu um erro.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <FadeIn className="my-12 grid items-center gap-2 rounded bg-stone-800 p-6 sm:flex sm:gap-5">
      <h2 className="flex shrink-0 items-center gap-2 font-medium text-stone-100 sm:text-sm lg:text-base">
        <MailIcon className="size-4" />
        Inscreva-se na newsletter
      </h2>
      <div className="hidden h-px w-16 bg-stone-400 sm:block sm:w-8 md:w-8 lg:w-36"></div>
      {isSent ? (
        <p className="text-sm text-stone-400">{feedback}</p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
          <Field className="w-full">
            <InputGroup className="border-stone-600 bg-stone-800 text-sm text-white [&_svg]:text-stone-200">
              <InputGroupInput
                id="email"
                type="text"
                name="email"
                placeholder="Digite aqui o seu e-mail"
                className="text-sm"
                required
                minLength={8}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="xs"
                  type="submit"
                  className="text-stone-200 hover:text-stone-800 hover:[&_svg]:text-stone-800!"
                >
                  Enviar <ArrowRight />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </form>
      )}
    </FadeIn>
  );
}
