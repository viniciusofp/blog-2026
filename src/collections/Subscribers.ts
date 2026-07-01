import { CollectionConfig } from "payload";
import { slugField } from "./fields/slug-field";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: {
    useAsTitle: "email",
  },
  labels: { singular: "Inscrito", plural: "Inscritos" },
  fields: [
    { name: "name", label: "Nome", type: "text" },
    { name: "email", label: "E-mail", type: "email", required: true },
    {
      name: "emailConfirmation",
      label: "Confirmação de e-mail",
      type: "checkbox",
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },
  ],
};
