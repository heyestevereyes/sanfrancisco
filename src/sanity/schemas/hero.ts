import { defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `HeroProps` (src/components/sections/Hero.tsx).
 *
 * `logo` y `navLinks` NO son editables a propósito: el logo viene del
 * lockup vectorial versionado en el repo (public/images/hero/logo.svg,
 * sincronizado con Figma) y el nav son anclas internas acopladas a los
 * `id` de las secciones — moverlos desde el CMS rompería la navegación.
 */
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "titlePrefix",
      title: "Título",
      description: 'Primera parte del título, en blanco. Ej: "Un Desarrollo con "',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleHighlight",
      title: "Palabra destacada",
      description:
        'Se pinta en dorado al final del título. Campo aparte justamente para conservar ese color. Ej: "Altura"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Párrafo",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: 'Texto del botón "Ver Recorrido"',
      description: "Descriptivo, no genérico: “Ver Recorrido”, nunca “Click aquí”.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Imagen de fondo",
      description: "Se sirve above-the-fold con priority — usa la versión de mayor calidad.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          description: "Describe la imagen para lectores de pantalla.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "video",
      title: "Video del lightbox",
      description:
        'Se abre al pulsar "Ver Recorrido". Sube la versión web comprimida (~10 MB, 1080p), no el master 4K.',
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  preview: {
    select: { title: "titlePrefix", subtitle: "titleHighlight", media: "backgroundImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: "Hero",
      subtitle: [title, subtitle].filter(Boolean).join(""),
      media,
    }),
  },
});
