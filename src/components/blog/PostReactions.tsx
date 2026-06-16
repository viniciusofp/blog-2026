"use client";
import useLocalStorage from "use-local-storage";

import { reactToPost } from "@/actions/react-to-post";
import { reactions } from "@/lib/reactions";
import { Post } from "@/payload-types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SmilePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type PostReactionsProps = { post: Post; postReactions: any };

export default function PostReactions({
  post,
  postReactions,
}: PostReactionsProps) {
  const [hasReacted, setHasReacted] = useLocalStorage("hasReacted", {});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);
  const handleReact = (reaction: any) => {
    let reacts = {
      ...post.reactions,
    };
    if ((hasReacted as any)[post.id]) {
      reacts[(hasReacted as any)[post.id] as "angry"] =
        (reacts[(hasReacted as any)[post.id] as "angry"] as number) - 1;
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
    reactToPost(post.id, reacts);
  };
  return (
    <div className="flex items-center gap-2">
      {/* {JSON.stringify(postReactions)} */}
      <div className="flex items-center gap-1">
        {reactions
          .filter((r) => (post.reactions as any)[r.name] > 0)
          .map((reaction) => (
            <div
              key={`${post.id}_${reaction.name}`}
              className={cn(
                "flex h-6 items-center gap-1 rounded-full border border-stone-100 px-1.5 text-sm text-stone-600",
                loaded && (hasReacted as any)[post.id] === reaction.name
                  ? "border-stone-200 bg-white shadow-sm"
                  : "cursor-pointer hover:bg-stone-200",
              )}
              onClick={() => {
                handleReact(reaction);
              }}
            >
              {reaction.label}
              <span className="text-xs">
                {post.reactions![reaction.name as "angry"]}
              </span>
            </div>
          ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-stone-100 duration-75 hover:bg-stone-200">
            <SmilePlus className="size-3" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-fit rounded-full px-1.5 py-0.5 ring-stone-200">
          <div className="flex items-center gap-1">
            {reactions.map((reaction) => (
              <div
                key={`${post.id}_${reaction.name}`}
                className={cn(
                  "flex size-7 cursor-pointer items-center justify-center gap-1.5 rounded-full text-lg leading-0 text-stone-600 hover:bg-stone-200",
                )}
                onClick={() => {
                  handleReact(reaction);
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
