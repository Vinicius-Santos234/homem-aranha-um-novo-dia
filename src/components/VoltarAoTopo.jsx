"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { SetaTeia } from "@/components/art";

/** Botão de voltar ao topo. */
export default function VoltarAoTopo() {
  const { scrollY } = useScroll();
  const [visivel, setVisivel] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisivel(y > 800);
  });

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visivel ? 1 : 0, y: visivel ? 0 : 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blood-800 text-bone shadow-xl shadow-black/50 ring-1 ring-bone/20 transition-colors hover:bg-blood-700 ${
        visivel ? "" : "pointer-events-none"
      }`}
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel}
      aria-label="Voltar ao topo"
    >
      <SetaTeia className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}
