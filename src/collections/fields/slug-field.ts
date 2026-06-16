import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { Field } from "payload";
import slugify from "slugify";

export const slugField: Field = {
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
        if (siblingData.name) {
          return slugify(siblingData.name, {
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
} as Field;
