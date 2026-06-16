"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

export type ExpandableCommentsProps = {
  comments: {
    createdAt: string;
    author: { name: string };
    id: string;
    content: string;
  }[];
};

export default function ExpandableComments({
  comments,
}: ExpandableCommentsProps) {
  return (
    <div id="comments" className="mt-8">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button className="group w-full text-xs tracking-widest uppercase">
            <span className="group-data-[state=open]:hidden">
              Exibir comentários ({comments.length})
            </span>
            <span className="hidden group-data-[state=open]:inline">
              Ocultar comentários ({comments.length})
            </span>
            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>{" "}
        <CollapsibleContent>
          <div className="flex flex-col divide-y divide-stone-200">
            {comments.map((comment) => {
              const createdAtComment = new Date(comment.createdAt);
              return (
                <blockquote key={comment.id} className="py-8">
                  <cite className="text-sm">{comment.author.name}</cite>
                  <p className="mt-1 text-xs tracking-widest text-stone-400 uppercase">
                    {createdAtComment.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {createdAtComment.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-3 lg:text-lg">{comment.content}</p>
                </blockquote>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
