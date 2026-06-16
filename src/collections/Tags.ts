import { CollectionConfig } from "payload";
import { slugField } from "./fields/slug-field";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
  },
  labels: { singular: "Tag", plural: "Tags" },
  fields: [{ name: "name", type: "text", required: true }, slugField],
};
