import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";

export const BlogInfo: GlobalConfig = {
  slug: "blogInfo",
  fields: [
    {
      name: "name",
      label: "Título do blog",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature({
            applyToFocusedEditor: false, // Apply to focused editor
            customGroups: {
              format: {
                // Custom configuration for format group
              },
            },
          }),
        ],
      }),
    },
  ],
};
