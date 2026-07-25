import type { SVGProps } from "react";

// Flecha diagonal (↗) — mismo vector exacto reusado en los botones "Ver la
// galería" (Distintivos) y "Enviar" (Contacto), node-id 1:44 / 1:198.
// `currentColor` porque cada botón la usa sobre un fondo distinto.
export default function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.25 5.25H12.75V12.75"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 12.75L12.75 5.25"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
