import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata } from "next-sanity/studio";

import config from "../../../../sanity.config";

/**
 * Studio de Sanity embebido. La ruta es catch-all opcional
 * (`[[...tool]]`) porque el Studio maneja su propio routing interno
 * (/studio, /studio/structure, /studio/vision, ...) del lado del cliente.
 *
 * `force-static` deja el shell del Studio prerenderizado: todo lo demás
 * lo resuelve el bundle de cliente contra la API de Sanity.
 */
export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

// El `metadata` de next-sanity solo trae `referrer` y `robots: noindex`
// (que es lo importante: el Studio no debe indexarse). Se le suma un
// título propio para que la pestaña no herede el del sitio público.
export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio | San Francisco",
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
