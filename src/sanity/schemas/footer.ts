import { defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `FooterProps` (src/components/sections/Footer.tsx).
 *
 * `logo` y `ctaHref` no son editables (mismo motivo que en el Hero: asset
 * versionado y ancla interna). `ctaLabel` e `instagramLabel` se quedan
 * como defaults del componente.
 */
export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      description: 'La línea en versalitas bajo el logo. Ej: "Vivir en calma es vivir en altura"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      description:
        "El correo que se muestra al público. No es el destino del formulario de contacto — ese va en CONTACT_EMAIL_TO.",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "Horario",
      description: 'Ej: "Lun–Vie, 9–18 h"',
      type: "string",
    }),
    defineField({
      name: "instagramHref",
      title: "Link de Instagram",
      description: "URL completa del perfil, con https://",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "copyrightName",
      title: "Texto de copyright",
      description: 'Solo el nombre. El año y el "All rights reserved" los pone el componente.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "tagline" },
    prepare: ({ subtitle }) => ({ title: "Footer", subtitle }),
  },
});
