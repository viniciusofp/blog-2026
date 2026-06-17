import { reactions } from "@/lib/reactions";
import type { CollectionConfig, Field } from "payload";

export const PostReactions: CollectionConfig = {
  slug: "post-reactions",
  admin: {
    useAsTitle: "id",
    hidden: true,
  },
  labels: { singular: "Reações ao Post", plural: "Reações aos Posts" },

  fields: [
    {
      name: "post",
      label: "Post",
      type: "relationship",
      relationTo: "posts",
    },
    {
      name: "votes",
      label: "Votos",
      type: "group",
      fields: [
        {
          name: "up",
          label: "⬆",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { step: 1 },
        },
        {
          name: "down",
          label: "⬇",
          type: "number",
          max: 0,
          defaultValue: 0,
          admin: { step: 1 },
        },
      ],
      admin: { readOnly: true, hidden: true },
      hidden: true,
    },
    {
      name: "reactions",
      label: "Reações",
      type: "group",
      fields: reactions as Field[],
      admin: { readOnly: false },
      hidden: false,
    },
  ],
};
