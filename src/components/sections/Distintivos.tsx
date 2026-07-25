import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import CrestIcon from "@/components/icons/CrestIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";

export interface DistintivosProps {
  flowerIcon?: { src: string; alt: string };
  tagline?: string;
  galleryLabel?: string;
  galleryHref?: string;
  title?: string;
  description?: string;
  locationNote?: string;
}

const defaultProps: Required<DistintivosProps> = {
  flowerIcon: { src: "/images/distintivos/flower.svg", alt: "" },
  tagline: "El verdadero lujo no se anuncia,\nse habita",
  galleryLabel: "Ver la galería",
  galleryHref: "#galeria",
  title: "Lo que nos distingue",
  description:
    "San Francisco nace de una idea simple: el verdadero lujo no se anuncia, se habita. Cada espacio fue diseñado para que la vida fluya con la misma serenidad con la que un ave surca el cielo — sin prisa, sin ruido, con total dominio del entorno.\n\nNo construimos solo departamentos. Creamos un ecosistema de bienestar donde la arquitectura, la naturaleza y el diseño conviven en equilibrio. Cada detalle responde a una pregunta: ¿esto suma a la calma de quien vive aquí?",
  locationNote:
    "Ubicación privilegiada, pensada para la conectividad sin perder privacidad",
};

export default function Distintivos(props: DistintivosProps) {
  const merged = { ...defaultProps, ...props };
  return (
    <section id="nosotros" data-section="distintivos" className="relative w-full">
      <DistintivosDesktop {...merged} />
      <DistintivosMobile {...merged} />
    </section>
  );
}

type DistintivosVariantProps = Required<DistintivosProps>;

/**
 * Layout fiel al frame de Figma (node-id 1:39 "acerca-sec", canvas de
 * 1920px), visible a partir del breakpoint `xl:` (1366px). Mismo
 * patrón de escalado fluido que Hero.tsx (clamp() proporcional a 1920px,
 * ver regla 1 de CLAUDE.md). El panel izquierdo (degradado) ocupa
 * exactamente 943/1920 = 49.1146% del ancho de referencia — el ave queda
 * centrada sobre esa misma línea (943/1920) tanto en la columna capada
 * como si la ventana crece más allá de 1920px, porque el ancho es un
 * porcentaje del contenedor centrado (`max-w-[120rem]`), no un valor fijo.
 */
function DistintivosDesktop({
  flowerIcon,
  tagline,
  galleryLabel,
  galleryHref,
  title,
  description,
  locationNote,
}: DistintivosVariantProps) {
  const taglineLines = tagline.split("\n");
  const paragraphs = description.split("\n\n");

  return (
    <div className="relative hidden w-full overflow-hidden bg-panel xl:block">
      <div className="relative mx-auto min-h-[clamp(41.487rem,48.594vw,58.3125rem)] max-w-[120rem]">
        {/* Panel izquierdo: degradado sage → sand → gold, 943/1920 del ancho */}
        <div className="absolute inset-y-0 left-0 w-[49.1146%] bg-gradient-to-b from-sage via-sand via-[50.962%] to-gold" />

        <AnimatedSection className="absolute left-0 top-[clamp(3.424rem,4.01vw,4.8125rem)] w-[49.1146%]">
          <div className="relative mx-auto size-[clamp(3.6908rem,4.323vw,5.1875rem)]">
            <Image src={flowerIcon.src} alt={flowerIcon.alt} fill sizes="83px" unoptimized />
          </div>
        </AnimatedSection>

        <AnimatedSection
          delay={0.1}
          className="absolute left-0 top-[clamp(10.628rem,12.448vw,14.9375rem)] w-[49.1146%]"
        >
          <p className="mx-auto w-[clamp(31.927rem,37.396vw,44.875rem)] text-center font-salty-ages uppercase leading-none text-forest text-[clamp(5.0504rem,5.9151vw,7.0981rem)]">
            {taglineLines.map((line, i) => (
              <span key={line} className="block leading-none">
                {line}
                {i < taglineLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.2}
          className="absolute left-0 top-[clamp(34.952rem,40.936vw,49.123rem)] w-[49.1146%]"
        >
          <a
            href={galleryHref}
            className="mx-auto flex w-fit items-center gap-[clamp(0.534rem,0.625vw,0.75rem)] rounded-[clamp(0.445rem,0.521vw,0.625rem)] bg-forest px-[clamp(1.067rem,1.25vw,1.5rem)] py-[clamp(0.623rem,0.729vw,0.875rem)] transition-colors duration-200 hover:bg-forest/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <span className="whitespace-nowrap font-balimo font-medium text-white text-[clamp(0.712rem,0.833vw,1rem)] leading-[clamp(1.067rem,1.25vw,1.5rem)]">
              {galleryLabel}
            </span>
            <ArrowIcon className="size-[clamp(0.8rem,0.938vw,1.125rem)] shrink-0 text-white" />
          </a>
        </AnimatedSection>

        {/* Ave: centrada exactamente sobre la línea divisoria (943/1920 =
            49.1146%, mismo porcentaje que el ancho del panel izquierdo) */}
        <AnimatedSection
          delay={0.1}
          className="absolute left-[49.1146%] top-[clamp(14.185rem,16.615vw,19.9375rem)] w-[clamp(6.4033rem,7.5vw,9rem)] -translate-x-1/2"
        >
          <CrestIcon className="h-[clamp(10.539rem,12.344vw,14.8125rem)] w-full text-forest" />
        </AnimatedSection>

        <AnimatedSection
          className="absolute left-[75.625%] top-[clamp(7.1594rem,8.385vw,10.0625rem)] w-[clamp(31.927rem,37.396vw,44.875rem)] -translate-x-1/2"
        >
          <h2 className="text-center font-salty-ages uppercase leading-none text-forest text-[clamp(5.0504rem,5.9151vw,7.0981rem)]">
            {title}
          </h2>
        </AnimatedSection>

        <AnimatedSection
          delay={0.15}
          className="absolute left-[75.625%] top-[clamp(21.211rem,24.844vw,29.8125rem)] w-[clamp(33.973rem,39.792vw,47.75rem)] -translate-x-1/2"
        >
          {paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 24)}
              className={`text-center font-balimo text-forest text-[clamp(0.8rem,0.938vw,1.125rem)] leading-[clamp(1.209rem,1.417vw,1.7rem)] ${
                i < paragraphs.length - 1 ? "mb-[clamp(1.209rem,1.417vw,1.7rem)]" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </AnimatedSection>

        <div
          aria-hidden
          className="absolute left-[75.625%] top-[clamp(33.75rem,39.531vw,47.4375rem)] w-[clamp(10.205rem,11.953vw,14.34375rem)] -translate-x-1/2 border-t-2 border-forest"
        />

        <AnimatedSection
          delay={0.3}
          className="absolute left-[75.625%] top-[clamp(36.196rem,42.396vw,50.875rem)] w-[clamp(24.9rem,29.167vw,35rem)] -translate-x-1/2"
        >
          <p className="text-center font-salty-ages uppercase text-forest text-[clamp(1.0672rem,1.25vw,1.5rem)] leading-[1.25]">
            {locationNote}
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}

/**
 * Layout propio para mobile y tablet (< 1366px): no hay mockup de Figma
 * para estos anchos. Las dos columnas del desktop pasan a apilarse
 * verticalmente (degradado arriba, panel claro abajo) y el ave se
 * mantiene como elemento que "cose" ambos bloques, ahora centrada sobre
 * la costura horizontal entre ellos en vez de una línea vertical.
 */
function DistintivosMobile({
  flowerIcon,
  tagline,
  galleryLabel,
  galleryHref,
  title,
  description,
  locationNote,
}: DistintivosVariantProps) {
  const taglineLines = tagline.split("\n");
  const paragraphs = description.split("\n\n");

  return (
    <div className="relative flex w-full flex-col xl:hidden">
      <div className="relative flex flex-col items-center gap-6 bg-gradient-to-b from-sage via-sand via-[51%] to-gold px-6 pb-16 pt-14 text-center sm:gap-8 sm:px-12 sm:pb-20 sm:pt-16 md:px-16">
        <AnimatedSection>
          <div className="relative size-12 sm:size-16">
            <Image src={flowerIcon.src} alt={flowerIcon.alt} fill sizes="64px" unoptimized />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="font-salty-ages text-3xl uppercase leading-tight text-forest sm:text-4xl md:text-5xl">
            {taglineLines.map((line, i) => (
              <span key={line} className="block leading-tight">
                {line}
                {i < taglineLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <a
            href={galleryHref}
            className="flex items-center gap-3 rounded-[10px] bg-forest px-6 py-3.5 transition-colors duration-200 hover:bg-forest/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <span className="whitespace-nowrap font-balimo font-medium text-sm text-white">
              {galleryLabel}
            </span>
            <ArrowIcon className="size-[18px] shrink-0 text-white" />
          </a>
        </AnimatedSection>
      </div>

      {/* El ave se sienta exactamente sobre la costura entre los dos
          bloques (márgenes negativos simétricos = ±mitad de su alto),
          sin importar la altura real de cada bloque (contenido variable
          vía CMS). */}
      <div className="relative z-10 flex justify-center">
        <CrestIcon className="-mt-8 -mb-8 h-16 w-auto text-forest" />
      </div>

      <div className="flex flex-col items-center gap-6 bg-panel px-6 pb-16 pt-14 text-center sm:gap-8 sm:px-12 sm:pb-20 sm:pt-16 md:px-16">
        <AnimatedSection>
          <h2 className="font-salty-ages text-3xl uppercase leading-none text-forest sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="flex flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-balimo text-sm leading-relaxed text-forest sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </AnimatedSection>

        <div aria-hidden className="w-40 border-t-2 border-forest" />

        <AnimatedSection delay={0.3}>
          <p className="font-salty-ages text-lg uppercase leading-snug text-forest sm:text-xl">
            {locationNote}
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
