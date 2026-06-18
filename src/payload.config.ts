import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { en } from "@payloadcms/translations/languages/en";
import { pt } from "@payloadcms/translations/languages/pt";

import { Comments } from "./collections/Comments";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { Categories } from "./collections/Categories";
import { BlogInfo } from "./collections/BlogInfo";
import { Subscribers } from "./collections/Subscribers";
import { PostReactions } from "./collections/PostReactions";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoRefresh: true,
    autoLogin:
      process.env.NODE_ENV === "development"
        ? {
            email: process.env.DEV_EMAIL || "",
            password: process.env.DEV_PASS || "",
            prefillOnly: true,
          }
        : false,
    timezones: { defaultTimezone: "America/Sao_Paulo" },
    livePreview: {
      breakpoints: [
        {
          name: "mobile",
          height: 667,
          label: "Mobile",
          width: 375,
        },
      ],
    },
  },
  globals: [BlogInfo],
  collections: [
    Posts,
    Categories,
    Tags,
    PostReactions,
    Comments,
    Subscribers,
    Users,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  plugins: [],
  i18n: {
    fallbackLanguage: "pt", // default
    supportedLanguages: { en, pt },
  },
});
