import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Cliente de solo lectura para el contenido publicado.
 *
 * `useCdn: true` sirve desde el CDN de Sanity (contenido publicado,
 * cacheado). No se le pasa token a propósito: todo lo que renderiza esta
 * landing es público, y un token aquí solo sería superficie de ataque.
 * El token de escritura vive únicamente en el webhook de revalidación.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Tag de caché por sección. Es lo que invalida /api/revalidate. */
export const SECTION_TAGS = {
  hero: "hero",
  distintivos: "distintivos",
  galeria: "galeria",
  recorrido360: "recorrido360",
  contacto: "contacto",
  footer: "footer",
} as const;

export type SectionTag = (typeof SECTION_TAGS)[keyof typeof SECTION_TAGS];

/**
 * Envuelve `client.fetch` con el caching de Next 16.
 *
 * Dos cosas importantes de esta versión de Next:
 *
 * 1. `fetch` **no** cachea por defecto (cambió en 15), así que hay que
 *    pedir `cache: "force-cache"` explícitamente o cada request pegaría
 *    a Sanity de nuevo.
 * 2. La entrada se marca con un tag por sección, que es lo que
 *    `revalidateTag` invalida desde el webhook.
 *
 * Si la query falla —proyecto mal configurado, dataset inexistente, red
 * caída, contenido todavía sin migrar— devuelve `null` en vez de
 * propagar el error. Eso es deliberado: el sitio tiene que seguir
 * renderizando con los valores por defecto de cada componente en lugar
 * de tirar el build o la página entera.
 */
export async function sanityFetch<T>(query: string, tag: SectionTag): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(
      query,
      {},
      { cache: "force-cache", next: { tags: [tag] } }
    );
  } catch (error) {
    console.warn(
      `⚠️ Sanity: falló la query de "${tag}" — se usan los valores por defecto del componente.`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
