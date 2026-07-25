"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ChevronIcon from "@/components/icons/ChevronIcon";
import type { GaleriaImage } from "./Galeria";

export interface GaleriaLightboxProps {
  images: GaleriaImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  triggerElement: HTMLElement | null;
}

/**
 * Lightbox full-screen con fade (AnimatePresence, mismo patrón que
 * HeroMobileMenu): scroll lock, focus trap real (Tab/Shift+Tab no se
 * escapa del diálogo), foco vuelve al trigger al cerrar, Escape y
 * click fuera de la imagen cierran.
 */
export default function GaleriaLightbox({
  images,
  index,
  onClose,
  onNavigate,
  triggerElement,
}: GaleriaLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  const goPrev = () => onNavigate((index - 1 + images.length) % images.length);
  const goNext = () => onNavigate((index + 1) % images.length);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        goNext();
        return;
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      triggerElement?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ${index + 1} de ${images.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-md transition-colors duration-200 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
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

      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={goPrev}
        className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-forest transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6 sm:size-12"
      >
        <ChevronIcon className="size-4 scale-x-[-1]" />
      </button>

      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={goNext}
        className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-forest transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:size-12"
      >
        <ChevronIcon className="size-4" />
      </button>

      <div className="relative h-full max-h-[80vh] w-full max-w-4xl">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}
