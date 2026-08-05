"use client";

/**
 * Configuración del Studio embebido en /studio (ver
 * src/app/studio/[[...tool]]/page.tsx).
 *
 * Las 6 secciones son **singletons**: hay exactamente un documento por
 * tipo y su `_id` es igual al nombre del tipo ("hero", "footer", ...).
 * Por eso la estructura de abajo lleva a cada documento directo, sin
 * lista intermedia, y se les quitan las acciones de crear/duplicar/
 * borrar — si existieran dos documentos del mismo tipo, el `[0]` de las
 * queries GROQ elegiría uno arbitrariamente.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

const SINGLETON_TYPES = new Set([
  "hero",
  "distintivos",
  "galeria",
  "recorrido360",
  "contacto",
  "footer",
]);

// Orden en el que aparecen en el Studio: el mismo que en la página.
const SINGLETON_ORDER = [
  { type: "hero", title: "Hero" },
  { type: "distintivos", title: "Distintivos" },
  { type: "galeria", title: "Galería" },
  { type: "recorrido360", title: "Recorrido 360" },
  { type: "contacto", title: "Contacto" },
  { type: "footer", title: "Footer" },
];

export default defineConfig({
  name: "san-francisco",
  title: "San Francisco",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items(
            SINGLETON_ORDER.map(({ type, title }) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(S.document().schemaType(type).documentId(type).title(title))
            )
          ),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Un singleton no se crea, ni se duplica, ni se borra: solo se edita.
    actions: (input, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? input.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? "")
          )
        : input,
  },
});
