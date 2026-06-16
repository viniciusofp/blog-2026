import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug-field";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  labels: { singular: "Categoria", plural: "Categorias" },
  fields: [{ name: "name", type: "text", required: true }, slugField],
};
