import { defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `DistintivosProps`
 * (src/components/sections/Distintivos.tsx).
 *
 * `flowerIcon` no es editable: es el asterisco decorativo del panel
 * izquierdo, un SVG versionado en el repo con `alt=""` (decorativo).
 * `galleryHref` tampoco: es el ancla interna #galeria.
 */
export const distintivos = defineType({
  name: "distintivos",
  title: "Distintivos",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Título izquierdo",
      description:
        'El titular grande sobre el degradado. Usa saltos de línea para controlar dónde corta. Ej: "El verdadero lujo no se anuncia,\\nse habita"',
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "galleryLabel",
      title: 'Texto del botón "Ver la galería"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título derecho",
      description: 'Ej: "Lo que nos distingue"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Párrafo derecho",
      description: "Separa los párrafos con una línea en blanco entre ellos.",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationNote",
      title: "Línea de ubicación",
      description: "La línea en versalitas debajo del separador.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "title" },
    prepare: ({ subtitle }) => ({ title: "Distintivos", subtitle }),
  },
});
