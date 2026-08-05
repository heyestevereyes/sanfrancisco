/**
 * Contenido por defecto de las secciones — la única fuente de verdad.
 *
 * Este módulo lo consumen **dos** lados:
 *
 * 1. Los componentes de sección, como valor de fallback cuando Sanity no
 *    devuelve un campo (ver src/lib/sanity/queries.ts).
 * 2. `scripts/seed-sanity.ts`, que sube exactamente este contenido a
 *    Sanity en la migración inicial.
 *
 * Por eso es TypeScript plano, sin React ni imports de Next: tiene que
 * poder importarse desde un script de Node con `tsx`. Si vivieran dentro
 * de los componentes (como defaults de desestructuración) el script no
 * tendría forma de leerlos y habría que transcribirlos a mano, que es
 * justo lo que queremos evitar.
 *
 * Solo vive aquí lo que Sanity administra. El copy técnico que **no** es
 * editable desde el CMS (labels de accesibilidad, anclas internas, rutas
 * de assets versionados) se queda inline en cada componente — ver
 * "Sanity (CMS)" en CLAUDE.md.
 */

export const heroDefaults = {
  titlePrefix: "Un Desarrollo con ",
  titleHighlight: "Altura",
  description:
    "San Francisco es un desarrollo pensado para quienes han elegido un nuevo estándar de vida: privacidad, elegancia y la tranquilidad de saber que llegaste a casa.",
  ctaLabel: "Ver Recorrido",
  videoSrc: "/images/Videos/sfvideo-1080p.mp4",
  backgroundImage: {
    src: "/images/hero/background.png",
    alt: "Edificio San Francisco al atardecer",
  },
} as const;

export const distintivosDefaults = {
  tagline: "El verdadero lujo no se anuncia,\nse habita",
  galleryLabel: "Ver la galería",
  title: "Lo que nos distingue",
  description:
    "San Francisco nace de una idea simple: el verdadero lujo no se anuncia, se habita. Cada espacio fue diseñado para que la vida fluya con la misma serenidad con la que un ave surca el cielo — sin prisa, sin ruido, con total dominio del entorno.\n\nNo construimos solo departamentos. Creamos un ecosistema de bienestar donde la arquitectura, la naturaleza y el diseño conviven en equilibrio. Cada detalle responde a una pregunta: ¿esto suma a la calma de quien vive aquí?",
  locationNote:
    "Ubicación privilegiada, pensada para la conectividad sin perder privacidad",
} as const;

export const galeriaDefaults = {
  title: "Conoce tu departamento",
} as const;

/**
 * Las 6 fotos reales del departamento (public/images/SFPhotos), cada una
 * con su alt descriptivo. Este es el set **sin duplicar**: es lo que se
 * sube a Sanity.
 *
 * El fallback del componente sigue duplicándolas a 12 slides para que el
 * carrusel infinito no se sienta repetitivo — ver `buildFallbackImages`
 * en Galeria.tsx. Ese parche solo aplica cuando Sanity no responde;
 * con contenido cargado, mandan las imágenes del CMS.
 */
export const galeriaPhotos = [
  {
    src: "/images/SFPhotos/1sf.png",
    alt: "Sala y comedor con vista al atardecer desde los ventanales, cocina integrada al fondo",
  },
  {
    src: "/images/SFPhotos/2sf.png",
    alt: "Sala con televisión y comedor de cristal frente a ventanales con vista al atardecer",
  },
  {
    src: "/images/SFPhotos/3sf.png",
    alt: "Cocina integral con antecomedor y vista hacia la recámara principal",
  },
  {
    src: "/images/SFPhotos/4sf.png",
    alt: "Sala-comedor con cómoda, televisión y acceso a las recámaras",
  },
  {
    src: "/images/SFPhotos/5sf.png",
    alt: "Recámara principal con cama matrimonial y ventana con vista al atardecer",
  },
  {
    src: "/images/SFPhotos/6sf.png",
    alt: "Recámara secundaria con dos camas individuales y ventana con vista al atardecer",
  },
] as const;

export const recorrido360Defaults = {
  title: "Haz un recorrido",
  description:
    "Desde departamentos compactos ideales para quienes buscan eficiencia y diseño, hasta modelos amplios pensados para familias que valoran el espacio y la comodidad — cada planta fue concebida para maximizar funcionalidad sin perder calidez.",
  tourEmbedUrl: "https://realsee.ai/a9rrxEdY",
} as const;

export const contactoDefaults = {
  title: "Hablemos de tu nuevo hogar",
} as const;

export const footerDefaults = {
  tagline: "Vivir en calma es vivir en altura",
  address: "Miguel Hidalgo 36, Santa Cruz Nieto, 76804 San Juan del Río, Qro",
  // Ojo: email/phone/hours vienen del mockup de Figma, no están
  // confirmados por el cliente — ver "Pendientes del cliente" en
  // CLAUDE.md. Se migran igual para no perder el placeholder, pero hay
  // que corregirlos en el Studio cuando lleguen los datos reales.
  email: "Info@sanfrancisco.com",
  phone: "+1 (312) 555 0140",
  hours: "Mon–Fri, 9–6 CT",
  instagramHref: "https://www.instagram.com/PENDIENTE_USUARIO_INSTAGRAM/",
  copyrightName: "SAN FRANCISCO CONDOMINIO",
} as const;
