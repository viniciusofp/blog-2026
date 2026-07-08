"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";

export type PreviewAlertProps = {};

export default function PreviewAlert(props: PreviewAlertProps) {
  const [open, setOpen] = useState(true);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          exit={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-3 left-1/2 z-10 grid w-xs -translate-x-1/2 gap-2 rounded bg-red-600 px-3 py-2 text-center text-sm text-red-100"
        >
          <p>
            <strong>Isso é uma pré-visualização.</strong> Publique o post para
            colocar essa versão no ar.
          </p>
          <Button size={"xs"} onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
