"use client";
import useLocalStorage from "use-local-storage";

import { reactToPost } from "@/actions/react-to-post";
import { reactions } from "@/lib/reactions";
import { Post, PostReaction } from "@/payload-types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SmilePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PostReactionsProps = { post: Post };

export default function PostReactions({ post }: PostReactionsProps) {
  let defaultReactions: any = {};
  reactions.forEach((reaction) => {
    defaultReactions[reaction.name] = 0;
  });
  const postReactions =
    post.reactions?.docs && post.reactions?.docs[0]
      ? {
          ...((post.reactions?.docs[0] as PostReaction).reactions as any),
        }
      : defaultReactions;
  const [open, setOpen] = useState(false);
  const [hasReacted, setHasReacted] = useLocalStorage("hasReacted", {});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setLoaded(true), []);
  const handleReact = async (reaction: any) => {
    setOpen(false);
    setLoading(true);
    let reacts = {
      ...postReactions,
    };
    if ((hasReacted as any)[post.id]) {
      reacts[(hasReacted as any)[post.id] as "angry"] = Math.max(
        (reacts[(hasReacted as any)[post.id] as "angry"] as number) - 1,
        0,
      );
      if ((hasReacted as any)[post.id] === reaction.name) {
        setHasReacted((prev) => {
          delete (prev as any)[post.id];
          return prev;
        });
      } else {
        reacts[reaction.name as "angry"] =
          (reacts[reaction.name as "angry"] as number) + 1;
        setHasReacted({
          ...hasReacted,
          [post.id]: reaction.name,
        });
      }
    } else {
      reacts[reaction.name as "angry"] =
        (reacts[reaction.name as "angry"] as number) + 1;
      setHasReacted({
        ...hasReacted,
        [post.id]: reaction.name,
      });
    }
    await reactToPost(post.id, reacts);
    setLoading(false);
  };
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        loading && "pointer-events-none animate-pulse",
      )}
    >
      {/* {JSON.stringify(postReactions)} */}
      {reactions.filter((r) => (postReactions as any)[r.name] > 0).length >
      0 ? (
        <div className="flex items-center gap-1">
          {reactions
            .filter((r) => (postReactions as any)[r.name] > 0)
            .map((reaction) => (
              <div
                key={`${post.id}_${reaction.name}`}
                className={cn(
                  "flex h-6 cursor-pointer items-center gap-1 rounded-full border border-stone-100 px-1.5 text-sm text-stone-600",
                  loaded && (hasReacted as any)[post.id] === reaction.name
                    ? "border-stone-200 bg-white shadow-sm"
                    : "hover:bg-stone-200",
                )}
                onClick={() => {
                  {
                    if (!loading) handleReact(reaction);
                  }
                }}
              >
                {reaction.label}
                <span className="text-xs">
                  {postReactions![reaction.name as "angry"]}
                </span>
              </div>
            ))}
        </div>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <div className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-stone-100 duration-75 hover:bg-stone-200">
                <SmilePlus className="size-3" />
              </div>
            </TooltipTrigger>
          </PopoverTrigger>{" "}
          <TooltipContent className="bg-stone-800">Reagir</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-fit rounded-full px-1.5 py-0.5 ring-stone-200">
          <div className="flex items-center gap-1">
            {reactions.map((reaction) => (
              <div
                key={`${post.id}_${reaction.name}`}
                className={cn(
                  "flex size-7 cursor-pointer items-center justify-center gap-1.5 rounded-full text-lg leading-0 text-stone-600 hover:bg-stone-200",
                )}
                onClick={() => {
                  {
                    if (
                      (hasReacted as any)[post.id] !== reaction.name &&
                      !loading
                    ) {
                      handleReact(reaction);
                    }
                  }
                }}
              >
                <span className="pt-px">{reaction.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
