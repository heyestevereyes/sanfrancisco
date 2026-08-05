import type { SchemaTypeDefinition } from "sanity";

import { contacto } from "./contacto";
import { distintivos } from "./distintivos";
import { footer } from "./footer";
import { galeria } from "./galeria";
import { hero } from "./hero";
import { recorrido360 } from "./recorrido360";

/**
 * Las 6 secciones editables. Todas son singletons: existe un único
 * documento por tipo, y la estructura del Studio (sanity.config.ts) las
 * presenta como una entrada fija cada una en vez de una lista con botón
 * de "crear nuevo".
 *
 * `ModelosDepartamentos` todavía no está aquí porque la sección sigue
 * siendo un stub sin implementar — ver "Pendientes del cliente" en
 * CLAUDE.md. Cuando se implemente, agregar su schema a esta lista y a
 * `SINGLETON_TYPES` en sanity.config.ts.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  hero,
  distintivos,
  galeria,
  recorrido360,
  contacto,
  footer,
];
