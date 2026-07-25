"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export interface VideoLightboxProps {
  videoSrc: string;
  title: string;
  onClose: () => void;
  triggerElement: HTMLElement | null;
}

/**
 * Lightbox full-screen para video (mismo patrón de overlay/animación/
 * focus-trap que GaleriaLightbox, pero sin prev/next: un solo video).
 * El <video> nativo trae su propia barra de controles (play/pausa,
 * volumen, fullscreen) — no hace falta reimplementarlos: el usuario
 * activa el audio manualmente desde ahí mismo.
 */
export default function VideoLightbox({ videoSrc, title, onClose, triggerElement }: VideoLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    // El atributo `autoPlay` por sí solo no es confiable en todos los
    // navegadores/contextos de embebido — se llama `.play()` de forma
    // explícita (con el video ya `muted` para cumplir la política de
    // autoplay). Si el navegador igual lo bloquea, el usuario lo arranca
    // manualmente desde los controles nativos.
    videoRef.current?.play().catch(() => {});

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, video, [href], [tabindex]:not([tabindex="-1"])'
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
    const videoEl = videoRef.current;

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      videoEl?.pause();
      triggerElement?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
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

      <div className="w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          autoPlay
          muted
          playsInline
          preload="none"
          className="max-h-[85vh] w-full rounded-lg"
        >
          <track kind="captions" />
        </video>
      </div>
    </motion.div>
  );
}
