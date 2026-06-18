"use client";

import { cn } from "@/lib/utils";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { useField, useFormFields } from "@payloadcms/ui";

export type CharCounterProps = { path: any };

export default function CharCounter({ path }: CharCounterProps) {
  const { value: content } = useField({ path: "content" });
  const { value: title } = useField({ path: "title" });

  const plaintext = convertLexicalToPlaintext({
    data: content as SerializedEditorState,
  });
  return (
    <div style={{ marginBottom: "2rem" }}>
      <p
        style={{
          fontWeight: 600,
        }}
      >
        <span
          style={{
            color:
              plaintext.length > 512 && !((title as string)?.length > 0)
                ? "#cb0e2d"
                : "#7cb63e",
          }}
        >
          {plaintext.length}
        </span>{" "}
        <span style={{ opacity: 0.6 }}>
          {!((title as string)?.length > 0) ? `/ 512` : ""}
        </span>
      </p>
      {plaintext.length > 512 && !((title as string)?.length > 0) ? (
        <p style={{ fontWeight: 600 }}>
          ⚠️ Textos com mais de 512 caracteres precisam de um título.
        </p>
      ) : null}
      {plaintext.length <= 512 && (title as string)?.length > 0 ? (
        <p style={{ opacity: 0.8 }}>
          ℹ️ Textos com 512 caracteres ou menos não precisam de um título.
        </p>
      ) : null}
    </div>
  );
}
