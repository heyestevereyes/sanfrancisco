import type { SVGProps } from "react";

// Chevron derecho, vector exacto del botón "Next" de gallery-sec (node-id
// 22:232). Para "prev" se usa el mismo componente reflejado (scale-x-[-1]).
export default function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3.75 9H14.25"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3.75L14.25 9L9 14.25"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
