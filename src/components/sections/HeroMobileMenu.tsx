"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import CrestIcon from "@/components/icons/CrestIcon";
import type { HeroNavLink } from "./Hero";

export interface HeroMobileMenuProps {
  logo: { src: string; alt: string };
  navLinks: HeroNavLink[];
  contactLabel: string;
  contactHref: string;
}

/**
 * Header mobile (logo + hamburguesa) fijo arriba del viewport, con el menú
 * full-screen que dispara. Autocontenido y reutilizable: cuando agreguemos
 * las demás secciones con scroll, este componente se queda fijo en la
 * parte de arriba sin depender de dónde se monte (`fixed`, no `sticky`
 * relativo a un ancestro). No hay mockup de Figma para este menú (ver
 * regla 1 de CLAUDE.md) — el ícono de hamburguesa/cerrar es un SVG propio;
 * el crest sí es el vector real del logo, aislado en `CrestIcon`.
 */
export default function HeroMobileMenu({
  logo,
  navLinks,
  contactLabel,
  contactHref,
}: HeroMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-5 md:px-12 xl:hidden">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={357}
          height={53}
          unoptimized
          className="h-6 w-auto shrink-0 sm:h-8 md:h-9"
        />
        <button
          ref={triggerRef}
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(true)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white-15 focus-visible:bg-white-15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="size-6"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center bg-cream px-6 pt-24 pb-10 xl:hidden"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Cerrar menú"
              onClick={close}
              className="absolute right-6 top-6 flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-md transition-colors duration-200 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="size-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="flex flex-1 flex-col items-center justify-center gap-10">
              <CrestIcon className="h-16 w-auto text-ink" />

              <nav aria-label="Principal" className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={close}
                    className="font-balimo text-xl text-ink transition-opacity duration-200 hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <a
              href={contactHref}
              onClick={close}
              className="w-full max-w-xs rounded-[10px] bg-gold px-6 py-4 text-center font-balimo font-medium text-ink transition-colors duration-200 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {contactLabel}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
