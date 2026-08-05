"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { galeriaDefaults, galeriaPhotos } from "@/content/defaults";
import GaleriaLightbox from "./GaleriaLightbox";

export interface GaleriaImage {
  id: string;
  src: string;
  alt: string;
}

export interface GaleriaProps {
  title?: string;
  images?: GaleriaImage[];
}

// El cliente solo nos dio 6 fotos (galeriaPhotos en src/content/defaults.ts,
// el mismo set que sube `npm run seed` a Sanity **sin duplicar**). Para el
// **fallback** las duplicamos a 12 slides, para que el carrusel infinito no
// se sienta repetitivo tan rápido: la segunda pasada va en otro orden (no es
// un espejo del primero) para que la misma foto no reaparezca pegada a donde
// ya se vio. Los ids son únicos por instancia aunque el src se repita, para
// no romper las keys de React; el alt no cambia.
//
// Este parche solo aplica cuando Sanity no devuelve imágenes. Con la galería
// ya cargada en el CMS mandan sus imágenes tal cual, sin duplicación — y ahí
// la solución de fondo es que el cliente mande más fotos.
const secondPassOrder = [2, 4, 6, 1, 3, 5]; // 1-indexado sobre galeriaPhotos
const defaultImages: GaleriaImage[] = [
  ...galeriaPhotos.map((photo, i) => ({ id: `sf-${i + 1}-a`, ...photo })),
  ...secondPassOrder.map((n, i) => ({ id: `sf-${n}-b-${i + 1}`, ...galeriaPhotos[n - 1] })),
];

/**
 * gallery-sec (node-id 22:225). El header (título + flechas) y el área del
 * slider comparten un único fondo continuo bg-forest — incluyendo los gaps
 * entre tarjetas, sin salto de color entre ambos bloques. Cada tarjeta
 * lleva su propio bg-panel como respaldo mientras carga la imagen (así
 * nunca se ve el fondo oscuro "a través" de una imagen que aún no cargó),
 * pero el contenedor del carrusel en sí no tiene fondo propio: hereda el
 * bg-forest de la sección. Es un único componente "use client" (no el
 * patrón Desktop/Mobile de Hero/Distintivos) porque el carrusel es un solo
 * embla-carousel interactivo: duplicarlo en dos árboles CSS-toggled
 * (uno oculto vía display:none) rompería las mediciones de embla en la
 * instancia oculta. El breakpoint `xl:` sigue marcando dónde entran
 * los valores exactos de Figma vía clamp(); mobile/tablet usan tamaños
 * propios (criterio de UX, sin mockup) en las mismas clases responsivas.
 */
export default function Galeria({
  title = galeriaDefaults.title,
  images = defaultImages,
}: GaleriaProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxTrigger, setLightboxTrigger] = useState<HTMLElement | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const openLightbox = (index: number, trigger: HTMLElement) => {
    setLightboxIndex(index);
    setLightboxTrigger(trigger);
  };

  const closeLightbox = () => {
    if (lightboxIndex !== null) emblaApi?.scrollTo(lightboxIndex);
    setLightboxIndex(null);
  };

  return (
    <section id="galeria" data-section="galeria" className="relative w-full bg-forest">
      <div className="w-full">
        <div className="mx-auto flex max-w-[120rem] items-center justify-between gap-4 px-6 py-10 sm:max-xl:px-8 md:max-xl:px-12 xl:h-[clamp(12.2975rem,14.375vw,17.25rem)] xl:py-0 xl:pl-[clamp(0.8893rem,1.0417vw,1.25rem)] xl:pr-[clamp(3.068rem,3.594vw,4.3125rem)]">
          <AnimatedSection>
            <h2 className="font-salty-ages uppercase leading-none text-cream text-3xl sm:max-xl:text-4xl md:max-xl:text-5xl xl:text-[clamp(5.0504rem,5.9151vw,7.0981rem)]">
              {title}
            </h2>
          </AnimatedSection>

          <AnimatedSection
            delay={0.1}
            className="flex shrink-0 items-center gap-3 xl:gap-[clamp(0.534rem,0.625vw,0.75rem)]"
          >
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={scrollPrev}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white-25 bg-gold text-forest transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:max-xl:size-11 xl:size-[clamp(2.1345rem,2.5vw,3rem)]"
            >
              <ChevronIcon className="size-[clamp(0.8rem,0.938vw,1.125rem)] scale-x-[-1]" />
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={scrollNext}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white-25 bg-gold text-forest transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:max-xl:size-11 xl:size-[clamp(2.1345rem,2.5vw,3rem)]"
            >
              <ChevronIcon className="size-[clamp(0.8rem,0.938vw,1.125rem)]" />
            </button>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection className="w-full overflow-hidden">
        <div
          ref={emblaRef}
          className="overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
        >
          <div className="flex gap-4 xl:gap-[clamp(0.7115rem,0.8333vw,1rem)]">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Ver ${image.alt}`}
                onClick={(event) => openLightbox(index, event.currentTarget)}
                className="relative aspect-[504/612] shrink-0 basis-[86.9565%] overflow-hidden bg-panel focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold md:max-xl:basis-[44.4444%] xl:basis-[23.5294%]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 767px) 87vw, (max-width: 1365px) 45vw, 24vw"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GaleriaLightbox
            images={images}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={setLightboxIndex}
            triggerElement={lightboxTrigger}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
