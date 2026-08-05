import { defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `Recorrido360Props`
 * (src/components/sections/Recorrido360.tsx).
 *
 * `tourTitle` (el `title` del iframe, para lectores de pantalla) y
 * `placeholderMessage` se quedan como defaults del componente: son copy
 * técnico de accesibilidad/estado vacío, no contenido de marketing.
 */
export const recorrido360 = defineType({
  name: "recorrido360",
  title: "Recorrido 360",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      description: 'Ej: "Haz un recorrido"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tourEmbedUrl",
      title: "URL del embed de Realsee",
      description:
        "URL del tour virtual. Si se deja vacío, la sección muestra el mensaje de “próximamente” en vez del iframe.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
  ],
  preview: {
    select: { subtitle: "title" },
    prepare: ({ subtitle }) => ({ title: "Recorrido 360", subtitle }),
  },
});
