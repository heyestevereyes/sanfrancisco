import "server-only";

import groq from "groq";

import type { ContactoProps } from "@/components/sections/Contacto";
import type { DistintivosProps } from "@/components/sections/Distintivos";
import type { FooterProps } from "@/components/sections/Footer";
import type { GaleriaImage, GaleriaProps } from "@/components/sections/Galeria";
import type { HeroProps } from "@/components/sections/Hero";
import type { Recorrido360Props } from "@/components/sections/Recorrido360";

import { SECTION_TAGS, sanityFetch } from "./client";
import { resolveImage, type SanityImageWithAlt } from "./image";

/**
 * Quita las claves con valor `undefined`/`null` del objeto de props.
 *
 * No es cosmético, es lo que hace que el fallback funcione. Cuatro de las
 * secciones (Distintivos, Recorrido360, Contacto, Footer) resuelven sus
 * defaults con `{ ...defaultProps, ...props }`: si les pasáramos
 * `{ title: undefined }`, el spread pisaría el default con `undefined` y
 * la sección quedaría vacía. Borrando la clave, el default sobrevive.
 * Las otras dos (Hero, Galeria) usan defaults de desestructuración, que
 * sí toleran `undefined`, pero se normalizan igual por consistencia.
 */
function definedOnly<T extends object>(props: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
}

/** Los singletons tienen `_id` igual a su `_type`. */
const singleton = (type: string) => `*[_type == "${type}" && _id == "${type}"][0]`;

// ---------------------------------------------------------------- Hero

interface HeroResult {
  titlePrefix?: string | null;
  titleHighlight?: string | null;
  description?: string | null;
  ctaLabel?: string | null;
  backgroundImage?: SanityImageWithAlt | null;
  videoUrl?: string | null;
}

const heroQuery = groq`${singleton("hero")}{
  titlePrefix,
  titleHighlight,
  description,
  ctaLabel,
  backgroundImage{asset, alt},
  "videoUrl": video.asset->url
}`;

export async function getHero(): Promise<Partial<HeroProps>> {
  const data = await sanityFetch<HeroResult>(heroQuery, SECTION_TAGS.hero);
  if (!data) return {};

  return definedOnly<HeroProps>({
    titlePrefix: data.titlePrefix ?? undefined,
    titleHighlight: data.titleHighlight ?? undefined,
    description: data.description ?? undefined,
    ctaLabel: data.ctaLabel ?? undefined,
    // El fondo del Hero es la única imagen above-the-fold: se pide grande.
    backgroundImage: resolveImage(data.backgroundImage, 2560),
    videoSrc: data.videoUrl ?? undefined,
  });
}

// --------------------------------------------------------- Distintivos

interface DistintivosResult {
  tagline?: string | null;
  galleryLabel?: string | null;
  title?: string | null;
  description?: string | null;
  locationNote?: string | null;
}

const distintivosQuery = groq`${singleton("distintivos")}{
  tagline,
  galleryLabel,
  title,
  description,
  locationNote
}`;

export async function getDistintivos(): Promise<Partial<DistintivosProps>> {
  const data = await sanityFetch<DistintivosResult>(distintivosQuery, SECTION_TAGS.distintivos);
  if (!data) return {};

  return definedOnly<DistintivosProps>({
    tagline: data.tagline ?? undefined,
    galleryLabel: data.galleryLabel ?? undefined,
    title: data.title ?? undefined,
    description: data.description ?? undefined,
    locationNote: data.locationNote ?? undefined,
  });
}

// ------------------------------------------------------------- Galería

interface GaleriaResult {
  title?: string | null;
  images?: (SanityImageWithAlt & { _key?: string })[] | null;
}

const galeriaQuery = groq`${singleton("galeria")}{
  title,
  images[]{_key, asset, alt}
}`;

export async function getGaleria(): Promise<Partial<GaleriaProps>> {
  const data = await sanityFetch<GaleriaResult>(galeriaQuery, SECTION_TAGS.galeria);
  if (!data) return {};

  // El `_key` de Sanity ya es único por miembro del array: sirve tal cual
  // como `id` para las keys de React y el carrusel.
  const images: GaleriaImage[] = (data.images ?? []).flatMap((image, index) => {
    const resolved = resolveImage(image, 1600);
    if (!resolved) return [];
    return [{ id: image._key ?? `galeria-${index}`, ...resolved }];
  });

  return definedOnly<GaleriaProps>({
    title: data.title ?? undefined,
    // Un array vacío rompería el carrusel; mejor caer al set por defecto.
    images: images.length > 0 ? images : undefined,
  });
}

// -------------------------------------------------------- Recorrido 360

interface Recorrido360Result {
  title?: string | null;
  description?: string | null;
  tourEmbedUrl?: string | null;
}

const recorrido360Query = groq`${singleton("recorrido360")}{
  title,
  description,
  tourEmbedUrl
}`;

export async function getRecorrido360(): Promise<Partial<Recorrido360Props>> {
  const data = await sanityFetch<Recorrido360Result>(
    recorrido360Query,
    SECTION_TAGS.recorrido360
  );
  if (!data) return {};

  return definedOnly<Recorrido360Props>({
    title: data.title ?? undefined,
    description: data.description ?? undefined,
    tourEmbedUrl: data.tourEmbedUrl ?? undefined,
  });
}

// ------------------------------------------------------------ Contacto

interface ContactoResult {
  title?: string | null;
}

// Solo el título: el correo de destino del formulario se queda en
// CONTACT_EMAIL_TO (variable de entorno), nunca en contenido público.
const contactoQuery = groq`${singleton("contacto")}{ title }`;

export async function getContacto(): Promise<Partial<ContactoProps>> {
  const data = await sanityFetch<ContactoResult>(contactoQuery, SECTION_TAGS.contacto);
  if (!data) return {};

  return definedOnly<ContactoProps>({ title: data.title ?? undefined });
}

// -------------------------------------------------------------- Footer

interface FooterResult {
  tagline?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  hours?: string | null;
  instagramHref?: string | null;
  copyrightName?: string | null;
}

const footerQuery = groq`${singleton("footer")}{
  tagline,
  address,
  email,
  phone,
  hours,
  instagramHref,
  copyrightName
}`;

export async function getFooter(): Promise<Partial<FooterProps>> {
  const data = await sanityFetch<FooterResult>(footerQuery, SECTION_TAGS.footer);
  if (!data) return {};

  return definedOnly<FooterProps>({
    tagline: data.tagline ?? undefined,
    address: data.address ?? undefined,
    email: data.email ?? undefined,
    phone: data.phone ?? undefined,
    hours: data.hours ?? undefined,
    instagramHref: data.instagramHref ?? undefined,
    copyrightName: data.copyrightName ?? undefined,
  });
}
