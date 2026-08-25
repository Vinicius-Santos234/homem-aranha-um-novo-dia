"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/art";

/** O site inteiro é escuro agora — o nav não precisa mais virar de cor no meio */
export default function Nav() {
  const { scrollY } = useScroll();
  const [encostou, setEncostou] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const heroi = document.getElementById("hero");
    const limite = heroi ? heroi.offsetTop + heroi.offsetHeight - 84 : 400;
    const passou = y > limite;
    setEncostou((atual) => (atual === passou ? atual : passou));
  });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[84px]">
      <div
        className={`pointer-events-auto flex h-full items-center justify-between px-6 text-bone transition-colors duration-500 lg:px-10 ${
          encostou ? "bg-void/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <a href="#topo" aria-label="Um Novo Dia — início">
          <Logo />
        </a>

        <nav className="flex items-center gap-7">
          <a
            href="#personagens"
            className="eyebrow hidden text-bone/70 transition-colors hover:text-bone sm:block"
          >
            Personagens
          </a>
          <Link
            href="/lugares"
            className="eyebrow shrink-0 whitespace-nowrap rounded-full border border-bone/25 px-4 py-3 text-bone-dim transition-colors hover:border-bone/60 hover:text-bone sm:px-5"
          >
            <span className="hidden sm:inline">Os </span>lugares
          </Link>
        </nav>
      </div>
    </header>
  );
}
