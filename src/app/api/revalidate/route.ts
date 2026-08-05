import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { SECTION_TAGS, type SectionTag } from "@/lib/sanity";

const PENDING_PREFIX = "PENDIENTE_";

/**
 * Webhook de Sanity: invalida la caché de la sección que se acaba de
 * publicar.
 *
 * En Sanity: Manage → API → Webhooks. Apuntarlo a
 * `https://<dominio>/api/revalidate`, método POST, dataset `production`,
 * trigger on create/update/delete, y el mismo secreto que
 * `SANITY_REVALIDATE_SECRET`.
 *
 * Notas de Next 16 (cambió respecto a versiones anteriores):
 * - `revalidateTag` toma **dos** argumentos; la forma de un solo argumento
 *   está deprecada.
 * - Para webhooks de terceros los docs piden `{ expire: 0 }` en vez de
 *   `"max"`: el sistema externo necesita que el dato caduque ya, no
 *   stale-while-revalidate.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || secret.startsWith(PENDING_PREFIX)) {
    // TODO(cliente): generar el secreto y configurarlo en el webhook de
    // Sanity — ver "Pendientes del cliente" en CLAUDE.md.
    console.warn(
      "⚠️ Falta configurar SANITY_REVALIDATE_SECRET — el webhook de Sanity no puede revalidar. El contenido se seguirá actualizando en el próximo build."
    );
    return NextResponse.json(
      { error: "La revalidación por webhook todavía no está configurada." },
      { status: 503 }
    );
  }

  let body: { _type?: string } | null;
  // `null` = no se pudo verificar (falta la cabecera de firma). Se trata
  // igual que una firma inválida: solo pasa el `true` explícito.
  let isValidSignature: boolean | null;
  try {
    ({ body, isValidSignature } = await parseBody<{ _type?: string }>(request, secret));
  } catch (error) {
    console.error("Revalidate: no se pudo leer el cuerpo del webhook:", error);
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Nunca revalidar por una petición sin firmar: /api/revalidate es
  // pública, y sin esta comprobación cualquiera podría tirar la caché.
  if (isValidSignature !== true) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  const type = body?._type;
  if (!type || !(type in SECTION_TAGS)) {
    // No es un error: Sanity manda todos los cambios del dataset, y hay
    // tipos (assets, borradores) que no mapean a ninguna sección.
    return NextResponse.json({ revalidated: false, reason: `Tipo ignorado: ${type ?? "—"}` });
  }

  const tag = SECTION_TAGS[type as SectionTag];
  revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
