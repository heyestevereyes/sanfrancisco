import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `GaleriaProps` (src/components/sections/Galeria.tsx).
 *
 * El `id` de cada `GaleriaImage` no se edita: se deriva del `_key` que
 * Sanity ya asigna a cada miembro del array, que es justo lo que necesitan
 * las keys de React y el carrusel de embla.
 */
export const galeria = defineType({
  name: "galeria",
  title: "Galería",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      description: 'Ej: "Conoce tu departamento"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      description:
        "El carrusel es infinito. Con menos de ~8 fotos la repetición se nota rápido; ideal 8 o más.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              description:
                "Descriptivo y específico: qué espacio se ve y qué hay en él. Lo leen los lectores de pantalla y también se usa en el lightbox.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "alt", media: "asset" },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", images: "images" },
    prepare: ({ title, images }) => ({
      title: "Galería",
      subtitle: `${title ?? ""} — ${images?.length ?? 0} imagen(es)`,
      media: images?.[0],
    }),
  },
});
