import type { CollectionConfig } from "payload";
import AddSubscriberAfterComment from "./hooks/AddSubscriberAfterComment";

export const Comments: CollectionConfig = {
  admin: {
    useAsTitle: "content",
  },
  labels: { singular: "Comentário", plural: "Comentários" },
  slug: "comments",
  fields: [
    {
      name: "author",
      type: "group",
      label: "Autor(a)",
      fields: [
        { name: "name", label: "Nome", type: "text", required: true },
        { name: "email", label: "E-mail", type: "email", required: true },
      ],
    },
    {
      name: "content",
      type: "textarea",
      label: "Comentário",
      maxLength: 2048,
      admin: { description: "Limite de caracteres: 2048." },
      required: true,
    },
    {
      name: "post",
      type: "relationship",
      label: "Publicação",
      relationTo: "posts",
      required: true,
    },
    {
      name: "isApproved",
      type: "checkbox",
      label: "Aprovar comentário",
      defaultValue: false,
    },
    {
      name: "acceptsEmail",
      type: "checkbox",
      label: "Usuário quer receber newsletter?",
      defaultValue: true,
    },
  ],
  hooks: {
    afterChange: [AddSubscriberAfterComment],
  },
};
