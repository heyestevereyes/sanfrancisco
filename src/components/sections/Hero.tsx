import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import HeroMobileMenu from "./HeroMobileMenu";

export interface HeroNavLink {
  label: string;
  href: string;
}

export interface HeroProps {
  logo?: { src: string; alt: string };
  navLinks?: HeroNavLink[];
  contactLabel?: string;
  contactHref?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: { src: string; alt: string };
}

const defaultNavLinks: HeroNavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Departamentos", href: "#departamentos" },
  { label: "Galería", href: "#galeria" },
];

export default function Hero({
  logo = { src: "/images/hero/logo.svg", alt: "Logotipo San Francisco" },
  navLinks = defaultNavLinks,
  contactLabel = "Contacto",
  contactHref = "#contacto",
  titlePrefix = "Un Desarrollo con ",
  titleHighlight = "Altura",
  description = "San Francisco es un desarrollo pensado para quienes han elegido un nuevo estándar de vida: privacidad, elegancia y la tranquilidad de saber que llegaste a casa.",
  ctaLabel = "Ver Recorrido",
  ctaHref = "#recorrido",
  backgroundImage = {
    src: "/images/hero/background.png",
    alt: "Edificio San Francisco al atardecer",
  },
}: HeroProps) {
  return (
    <section data-section="hero" className="relative w-full">
      <HeroDesktop
        logo={logo}
        navLinks={navLinks}
        contactLabel={contactLabel}
        contactHref={contactHref}
        titlePrefix={titlePrefix}
        titleHighlight={titleHighlight}
        description={description}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        backgroundImage={backgroundImage}
      />
      <HeroMobile
        logo={logo}
        navLinks={navLinks}
        contactLabel={contactLabel}
        contactHref={contactHref}
        titlePrefix={titlePrefix}
        titleHighlight={titleHighlight}
        description={description}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        backgroundImage={backgroundImage}
      />
    </section>
  );
}

type HeroVariantProps = Required<HeroProps>;

/**
 * Layout fiel al frame de Figma (node-id 1:3, canvas de 1920px), visible a
 * partir del breakpoint `desktop` (1366px). Todos los tamaños/espaciados
 * que en el Figma son un valor fijo se expresan como
 * clamp(valor-en-1366px, valor-px/1920*100vw, valor-en-1920px) — ver regla
 * de escalado fluido en CLAUDE.md. Por eso el diseño coincide exactamente
 * con el Figma solo a 1920px de ancho de ventana, y escala proporcionalmente
 * por debajo (hasta 1366px) y se estabiliza por arriba (2560px+). La altura
 * es 100dvh (viewport completo) en vez de aspect-ratio, por pedido explícito.
 */
function HeroDesktop({
  logo,
  navLinks,
  contactLabel,
  contactHref,
  titlePrefix,
  titleHighlight,
  description,
  ctaLabel,
  ctaHref,
  backgroundImage,
}: HeroVariantProps) {
  return (
    <div className="relative hidden w-full overflow-hidden desktop:block desktop:h-dvh">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-overlay" />
      </div>

      {/* Columna de contenido: centrada y con tope en 120rem (=1920px) para
          que no se estire infinitamente en monitores ultra anchos (ese es
          el "centrado horizontal" del conjunto). Dentro de esa columna
          centrada, el copy va alineado a la izquierda (items-start) con el
          mismo padding-left que el nav, para que quede a la misma altura
          que el logo. El nav va `absolute` así que queda fuera del flujo
          del flex y no se ve afectado. */}
      <div className="absolute inset-y-0 left-1/2 flex w-full max-w-[120rem] -translate-x-1/2 flex-col items-start justify-center">
        <div className="content-stretch flex items-end justify-between absolute top-[clamp(1.423rem,1.667vw,2rem)] left-0 right-0 px-[clamp(3.491rem,4.089vw,4.906rem)]">
          <div className="overflow-clip relative shrink-0 h-[clamp(2.624rem,3.073vw,3.688rem)] w-[clamp(15.874rem,18.594vw,22.313rem)]">
            <div className="absolute inset-[0_0_11.63%_0]">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="360px"
                unoptimized
                className="object-fill"
              />
            </div>
          </div>

          <div className="content-stretch flex items-center relative shrink-0 gap-[clamp(1.556rem,1.823vw,2.188rem)]">
            <nav
              aria-label="Principal"
              className="[word-break:break-word] content-stretch flex font-balimo font-normal items-center justify-center not-italic relative shrink-0 text-white-80 whitespace-nowrap gap-[clamp(2.09rem,2.448vw,2.938rem)] text-[clamp(0.738rem,0.865vw,1.038rem)] leading-[clamp(1.245rem,1.458vw,1.75rem)]"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative shrink-0 rounded-sm transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href={contactHref}
              className="bg-cream content-stretch flex items-center relative rounded-[clamp(0.445rem,0.521vw,0.625rem)] shrink-0 px-[clamp(1.067rem,1.25vw,1.5rem)] py-[clamp(0.623rem,0.729vw,0.875rem)] transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <span className="[word-break:break-word] font-balimo font-normal not-italic relative shrink-0 text-ink whitespace-nowrap text-[clamp(0.667rem,0.781vw,0.938rem)] leading-[clamp(1.067rem,1.25vw,1.5rem)]">
                {contactLabel}
              </span>
            </a>
          </div>
        </div>

        <div
          className="content-stretch flex flex-col items-start
            w-[clamp(35.573rem,41.667vw,50rem)]
            ml-[clamp(3.491rem,4.089vw,4.906rem)]
            gap-[clamp(1.245rem,1.458vw,1.75rem)]"
        >
          <AnimatedSection
            className="[word-break:break-word] leading-[0] min-w-full not-italic relative shrink-0 w-[min-content]"
          >
            <h1 className="m-0 font-salty-ages text-white text-[clamp(6.028rem,7.059vw,8.471rem)]">
              <span className="leading-none">{titlePrefix}</span>
              <span className="leading-none text-gold">{titleHighlight}</span>
            </h1>
          </AnimatedSection>

          <div className="content-stretch flex flex-col items-start relative shrink-0 gap-[clamp(1.067rem,1.25vw,1.5rem)]">
            <AnimatedSection
              delay={0.15}
              className="[word-break:break-word] font-balimo font-medium not-italic relative shrink-0 text-white-80 w-[clamp(33.037rem,38.698vw,46.438rem)] text-[clamp(0.8rem,0.938vw,1.125rem)] leading-[clamp(1.209rem,1.417vw,1.7rem)]"
            >
              {description}
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="shrink-0">
              <a
                href={ctaHref}
                className="border border-white-40 border-solid content-stretch flex items-center relative rounded-[clamp(0.445rem,0.521vw,0.625rem)] shrink-0 gap-[clamp(0.534rem,0.625vw,0.75rem)] px-[clamp(1.112rem,1.302vw,1.563rem)] py-[clamp(0.667rem,0.781vw,0.938rem)] transition-colors duration-200 hover:bg-white-15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="bg-white-15 relative rounded-full shrink-0 size-[clamp(1.245rem,1.458vw,1.75rem)]">
                  <span className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex items-center justify-center relative size-full">
                    <span className="relative shrink-0 size-[clamp(0.534rem,0.625vw,0.75rem)]">
                      <Image
                        src="/images/hero/play-icon.svg"
                        alt=""
                        fill
                        sizes="28px"
                        unoptimized
                        className="object-fill"
                      />
                    </span>
                  </span>
                </span>
                <span className="[word-break:break-word] font-balimo font-medium not-italic relative shrink-0 text-center text-white whitespace-nowrap text-[clamp(0.712rem,0.833vw,1rem)] leading-[clamp(1.067rem,1.25vw,1.5rem)]">
                  {ctaLabel}
                </span>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Layout propio para mobile y tablet (< 1366px): no hay mockup de Figma
 * para estos anchos, así que la composición (nav colapsada, stack vertical)
 * se resolvió con criterio de UX propio en vez de escalar el layout de
 * desktop.
 */
function HeroMobile({
  logo,
  navLinks,
  contactLabel,
  contactHref,
  titlePrefix,
  titleHighlight,
  description,
  ctaLabel,
  ctaHref,
  backgroundImage,
}: HeroVariantProps) {
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden desktop:hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-overlay" />
      </div>

      {/* Header fijo (logo + hamburguesa) y overlay del menú: ver
          HeroMobileMenu, autocontenido y pensado para reutilizarse tal
          cual cuando existan más secciones debajo con scroll. */}
      <HeroMobileMenu
        logo={logo}
        navLinks={navLinks}
        contactLabel={contactLabel}
        contactHref={contactHref}
      />

      <div className="relative z-10 mt-auto flex flex-col items-start gap-5 px-6 pb-10 pt-8 sm:px-8 md:max-w-2xl md:gap-6 md:px-12 md:pb-16">
        <AnimatedSection className="leading-[1.05]">
          <h1 className="m-0 font-salty-ages text-4xl text-white sm:text-5xl md:text-6xl">
            <span>{titlePrefix}</span>
            <span className="text-gold">{titleHighlight}</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection
          delay={0.15}
          className="font-balimo font-medium text-sm leading-relaxed text-white-80 sm:text-base"
        >
          {description}
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="shrink-0">
          <a
            href={ctaHref}
            className="flex shrink-0 items-center gap-3 rounded-[10px] border border-white-40 px-5 py-3 transition-colors duration-200 hover:bg-white-15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-white-15">
              <span className="relative size-3 shrink-0">
                <Image
                  src="/images/hero/play-icon.svg"
                  alt=""
                  fill
                  sizes="12px"
                  unoptimized
                  className="object-fill"
                />
              </span>
            </span>
            <span className="whitespace-nowrap font-balimo font-medium text-sm text-white">
              {ctaLabel}
            </span>
          </a>
        </AnimatedSection>
      </div>
    </div>
  );
}
