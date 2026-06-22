import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import type { CollectionConfig, Field } from "payload";
import slugify from "slugify";
import urlField from "./fields/url-field";
import { reactions } from "@/lib/reactions";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "content",
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/payload/ui/BeforeControls#VisitContent",
        ],
      },
    },
    livePreview: {
      url: ({ data, collectionConfig, req }) =>
        `${req.protocol}//${req.host}/${data.slug}?preview=true`,
    },
  },
  defaultPopulate: { comments: true, slug: true },
  labels: { singular: "Post", plural: "Posts" },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      name: "title",
      label: "Título",
      type: "textarea",
    },
    {
      name: "content",
      label: "Conteúdo",
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
          BlocksFeature({
            blocks: [
              {
                slug: "videoEmbed",
                labels: { singular: "Vídeo", plural: "Vídeos" },
                fields: [urlField],
              },
              {
                slug: "code",
                labels: {
                  singular: "Código (Embed)",
                  plural: "Códigos (Embed)",
                },
                fields: [{ name: "code", type: "code", label: "Código" }],
              },
              {
                slug: "imageGallery",
                labels: {
                  singular: "Galeria de Imagem",
                  plural: "Galerias de Imagem",
                },
                fields: [
                  {
                    name: "images",
                    type: "upload",
                    label: "Imagem",
                    relationTo: "media",
                    hasMany: true,
                  },
                ],
              },
            ],
          }),
        ],
      }),

      validate: (value, { siblingData }) => {
        const plaintext = convertLexicalToPlaintext({
          data: value as SerializedEditorState,
        });
        if (
          plaintext.length > 512 &&
          !((siblingData as any)?.title?.length > 0)
        ) {
          return `Textos com mais de 512 caracteres precisam de um título, seu texto está com ${plaintext.length} caracteres.`;
        }
        return true;
      },
    },
    {
      name: "charCounter", // required
      type: "ui", // required
      admin: {
        components: {
          Field: "@/components/payload/ui/CharCounter",
        },
      },
    },
    {
      name: "slug",
      type: "text",
      admin: { position: "sidebar", style: { opacity: 0.5 } },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (value) {
              return value;
            }
            if (siblingData.title) {
              return slugify(siblingData.title, {
                lower: true,
                strict: true,
                locale: "pt-BR",
              });
            }
            if (siblingData.content) {
              const plaintext = convertLexicalToPlaintext({
                data: siblingData.content,
              });
              return slugify(plaintext.slice(0, 80), {
                lower: true,
                strict: true,
                locale: "pt-BR",
              });
            }
            return undefined;
          },
        ],
      },
      required: true,
      unique: true,
    },

    {
      name: "comments",
      type: "join",
      collection: "comments",
      on: "post",
      defaultLimit: 0,
      where: {
        isApproved: { equals: true },
      },
      admin: { hidden: true },
    },
    {
      name: "commentCount",
      type: "number",
      virtual: true,
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            return siblingData.comments?.docs?.length || 0;
          },
        ],
      },
      admin: { hidden: true },
    },
    {
      type: "group",
      label: "Taxonomia",
      fields: [
        {
          name: "categories",
          type: "relationship",
          label: { single: "Categoria", plural: "Categorias" },
          relationTo: "categories",
          hasMany: true,
        },
        {
          name: "tags",
          type: "relationship",
          label: { single: "Tag", plural: "Tags" },
          relationTo: "tags",
          hasMany: true,
        },
      ],
    },
    {
      name: "reactions",
      label: "Reações",
      type: "join",
      collection: "post-reactions",
      on: "post",
    },
  ],
};
