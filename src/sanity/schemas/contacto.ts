import { defineField, defineType } from "sanity";

/**
 * Singleton. Espeja `ContactoProps` (src/components/sections/Contacto.tsx),
 * pero solo el título.
 *
 * IMPORTANTE — el correo de destino del formulario NO va aquí. Sigue
 * viviendo en la variable de entorno `CONTACT_EMAIL_TO`, que solo lee la
 * API route del servidor (src/app/api/contact/route.ts). Moverlo a Sanity
 * lo volvería contenido público (el dataset es legible sin token) y
 * dejaría que cualquiera con acceso al Studio redirija los leads.
 *
 * `submitLabel`, `successMessage`, `mapEmbedUrl` y `mapTitle` se quedan
 * como defaults del componente.
 */
export const contacto = defineType({
  name: "contacto",
  title: "Contacto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      description: 'Ej: "Hablemos de tu nuevo hogar"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "title" },
    prepare: ({ subtitle }) => ({ title: "Contacto", subtitle }),
  },
});
