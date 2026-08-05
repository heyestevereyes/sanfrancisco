/**
 * Variables de entorno de Sanity, resueltas en un solo lugar.
 *
 * `projectId` y `dataset` son públicas a propósito (`NEXT_PUBLIC_`): las
 * necesita tanto el servidor (queries) como el bundle del Studio en
 * /studio. El token de escritura NO vive aquí — ver src/lib/sanity/client.ts.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-05";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Falta NEXT_PUBLIC_SANITY_DATASET (ver .env.example)"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Falta NEXT_PUBLIC_SANITY_PROJECT_ID (ver .env.example)"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
