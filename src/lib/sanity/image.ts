// En @sanity/image-url v2 los tipos salen de la raíz del paquete (la ruta
// vieja "@sanity/image-url/lib/types/types" ya no existe) y el default
// export está deprecado en favor de `createImageUrlBuilder`.
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Imagen tal como la devuelven las queries: el asset + su alt. */
export interface SanityImageWithAlt {
  asset?: { _ref?: string } | null;
  alt?: string | null;
}

/**
 * Convierte una imagen de Sanity al `{ src, alt }` que ya esperan los
 * componentes.
 *
 * `maxWidth` acota el ancho que pedimos al CDN de Sanity. Sin él,
 * `next/image` descargaría el original completo (que puede ser de varios
 * MB) solo para reescalarlo, pagando ancho de banda dos veces.
 *
 * Devuelve `undefined` si no hay imagen o le falta el alt, para que el
 * valor por defecto del componente tome su lugar: es preferible eso a
 * publicar una imagen sin texto alternativo.
 */
export function resolveImage(
  image: SanityImageWithAlt | null | undefined,
  maxWidth: number
): { src: string; alt: string } | undefined {
  if (!image?.asset?._ref) return undefined;

  const alt = image.alt?.trim();
  if (!alt) return undefined;

  const src = builder
    .image(image as SanityImageSource)
    .width(maxWidth)
    .auto("format")
    .url();

  return { src, alt };
}
