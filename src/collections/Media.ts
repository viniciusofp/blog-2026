import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  labels: { singular: "Imagem", plural: "Imagens" },
  slug: "media",

  admin: { group: "Arquivos" },
  upload: {
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 320,
        height: 320,
        position: "centre",
      },
      {
        name: "third",
        width: 400,
        position: "centre",
      },
      {
        name: "half",
        width: 640,
        position: "centre",
      },
      {
        name: "full",
        width: 1920,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Legenda (ALT)",
      admin: {
        description: "Coloque o nome da foto e/ou uma descrição curta.",
      },
      required: true,
    },
    {
      name: "author",
      type: "text",
      label: "Créditos",
      admin: {
        description: "Coloque a fonte da imagem.",
      },
    },
  ],
};
