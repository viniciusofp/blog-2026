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
      admin: { readOnly: true },
    },
    {
      name: "content",
      type: "textarea",
      label: "Comentário",
      maxLength: 2048,
      admin: { description: "Limite de caracteres: 2048.", readOnly: true },
      required: true,
    },
    {
      name: "post",
      type: "relationship",
      label: "Publicação",
      relationTo: "posts",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "isApproved",
      type: "checkbox",
      label: "Aprovar comentário",
      defaultValue: false,
      admin: { readOnly: true },
    },
    {
      name: "acceptsEmail",
      type: "checkbox",
      label: "Usuário quer receber newsletter?",
      defaultValue: true,
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [AddSubscriberAfterComment],
  },
};
