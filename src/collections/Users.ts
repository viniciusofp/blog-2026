import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuário", plural: "Usuários" },
  admin: {
    useAsTitle: "email",
  },
  auth: {
    tokenExpiration: 60 * 60 * 36, // 36 hours
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 60 * 36, // 36 hours
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: "name",
      type: "text",
      maxLength: 64,
      admin: { description: "Limite de caracteres: 64" },
      required: true,
    },
    {
      name: "username",
      type: "text",
      maxLength: 24,
      admin: { description: "Limite de caracteres: 24" },
      required: true,
    },
    // {
    //   name: "role",
    //   label: "Papel",
    //   type: "select",
    //   options: [
    //     { value: "admin", label: "Administrador" },
    //     { value: "user", label: "Usuário" },
    //   ],
    //   required: true,
    //   defaultValue: "user",
    // },
  ],
};
