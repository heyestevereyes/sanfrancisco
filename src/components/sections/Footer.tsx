import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import ArrowIcon from "@/components/icons/ArrowIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { footerDefaults } from "@/content/defaults";

export interface FooterProps {
  logo?: { src: string; alt: string };
  tagline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  address?: string;
  email?: string;
  phone?: string;
  hours?: string;
  instagramLabel?: string;
  instagramHref?: string;
  copyrightName?: string;
}

const defaultProps: Required<FooterProps> = {
  // Mismo lockup que Hero.tsx pero en la variante forest (#1d221c, node-id
  // 1:207) en vez de cream — el archivo de Hero está coloreado para su
  // fondo oscuro y sería casi invisible sobre el degradado claro del footer.
  logo: { src: "/images/footer/logo-forest.svg", alt: "Logotipo San Francisco" },
  ctaLabel: "Cotizar mi Departamento",
  ctaHref: "#contacto",
  instagramLabel: "Instagram",
  // El resto sale de src/content/defaults.ts, compartido con `npm run seed`.
  // Ojo: `instagramHref` sigue siendo el placeholder PENDIENTE_ y
  // email/phone/hours vienen del mockup, no están confirmados por el
  // cliente — ver "Pendientes del cliente" en CLAUDE.md.
  ...footerDefaults,
};

/**
 * footer-sec (node-id 1:204). El scroll suave del CTA hacia #contacto
 * viene gratis de `scroll-smooth` en <html> (layout.tsx) — no hace falta
 * JS. Patrón Desktop/Mobile (regla 1 de CLAUDE.md): sin estado que
 * perder al cruzar `xl:`, así que se duplica el árbol como en
 * Hero/Distintivos en vez de un único árbol responsivo.
 */
export default function Footer(props: FooterProps) {
  const merged = { ...defaultProps, ...props };
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="relative w-full">
      <FooterDesktop {...merged} year={year} />
      <FooterMobile {...merged} year={year} />
    </footer>
  );
}

type FooterVariantProps = Required<FooterProps> & { year: number };

function FooterDesktop({
  logo,
  tagline,
  ctaLabel,
  ctaHref,
  address,
  email,
  phone,
  hours,
  instagramLabel,
  instagramHref,
  copyrightName,
  year,
}: FooterVariantProps) {
  return (
    <div className="relative hidden w-full overflow-hidden bg-gradient-to-b from-sage via-sand via-[50.962%] to-gold xl:block">
      <div className="relative mx-auto flex flex-col items-start xl:max-w-[clamp(62.253rem,72.917vw,87.5rem)] xl:px-[clamp(1.779rem,2.083vw,2.5rem)] xl:py-[clamp(5.692rem,6.667vw,8rem)]">
        <AnimatedSection className="xl:w-[clamp(44.955rem,52.656vw,63.188rem)]">
          <div className="relative xl:h-[clamp(6.641rem,7.778vw,9.334rem)] xl:w-full">
            <Image src={logo.src} alt={logo.alt} fill sizes="1011px" unoptimized className="object-contain object-left" />
          </div>
          <p className="text-center font-balimo uppercase text-forest xl:mt-[clamp(0.356rem,0.417vw,0.5rem)] xl:text-[clamp(0.489rem,0.573vw,0.688rem)] xl:leading-[clamp(0.734rem,0.859vw,1.031rem)] xl:tracking-[clamp(0.088rem,0.103vw,0.124rem)]">
            {tagline}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="xl:mt-[clamp(1.957rem,2.292vw,2.75rem)]">
          <a
            href={ctaHref}
            className="flex items-center gap-3 rounded-[10px] bg-forest px-6 py-3.5 transition-colors duration-200 hover:bg-forest/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold xl:gap-[clamp(0.534rem,0.625vw,0.75rem)] xl:rounded-[clamp(0.445rem,0.521vw,0.625rem)] xl:px-[clamp(1.245rem,1.458vw,1.75rem)] xl:py-[clamp(0.712rem,0.833vw,1rem)]"
          >
            <span className="whitespace-nowrap font-balimo font-medium text-gold text-sm xl:text-[clamp(0.712rem,0.833vw,1rem)] xl:leading-[clamp(1.067rem,1.25vw,1.5rem)]">
              {ctaLabel}
            </span>
            <ArrowIcon className="size-[18px] shrink-0 text-gold xl:size-[clamp(0.8rem,0.938vw,1.125rem)]" />
          </a>
        </AnimatedSection>

        <div
          aria-hidden
          className="w-full border-t border-forest xl:mt-[clamp(1.645rem,1.927vw,2.313rem)]"
        />

        <AnimatedSection
          delay={0.15}
          className="grid w-full grid-cols-4 xl:mt-[clamp(2.134rem,2.5vw,3rem)] xl:gap-x-[clamp(1.779rem,2.083vw,2.5rem)]"
        >
          <FooterColumn label="/ UBICACIÓN">
            <p>{address}</p>
          </FooterColumn>
          <FooterColumn label="/ EMAIL">
            <p>{email}</p>
          </FooterColumn>
          <FooterColumn label="/ PHONE">
            <p>{phone}</p>
            <p>{hours}</p>
          </FooterColumn>
          <FooterColumn label="/ SOCIAL">
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-forest transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              <InstagramIcon className="size-[14px] shrink-0" />
              {instagramLabel}
            </a>
          </FooterColumn>
        </AnimatedSection>

        <div
          aria-hidden
          className="w-full border-t border-forest xl:mt-[clamp(3.557rem,4.167vw,5rem)]"
        />

        <p className="w-full text-center font-balimo text-forest xl:mt-[clamp(1.067rem,1.25vw,1.5rem)] xl:text-[clamp(0.534rem,0.625vw,0.75rem)] xl:leading-[clamp(0.8rem,0.938vw,1.125rem)]">
          © {year} {copyrightName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start">
      <p className="font-balimo text-forest xl:text-[clamp(0.489rem,0.573vw,0.688rem)] xl:leading-[clamp(0.734rem,0.859vw,1.031rem)] xl:tracking-[clamp(0.088rem,0.103vw,0.124rem)]">
        {label}
      </p>
      <div className="font-balimo text-forest xl:mt-[clamp(0.712rem,0.833vw,1rem)] xl:text-[clamp(0.623rem,0.729vw,0.875rem)] xl:leading-[clamp(1.027rem,1.203vw,1.444rem)]">
        {children}
      </div>
    </div>
  );
}

/**
 * Layout propio para mobile y tablet (< 1366px): stack centrado, sin
 * mockup de Figma para estos anchos. Las 4 columnas pasan a una grilla
 * 2x2 centrada a partir de `sm:`.
 */
function FooterMobile({
  logo,
  tagline,
  ctaLabel,
  ctaHref,
  address,
  email,
  phone,
  hours,
  instagramLabel,
  instagramHref,
  copyrightName,
  year,
}: FooterVariantProps) {
  return (
    <div className="relative flex w-full flex-col items-center gap-8 bg-gradient-to-b from-sage via-sand via-[51%] to-gold px-6 py-14 text-center sm:gap-10 sm:px-12 sm:py-16 md:px-16 xl:hidden">
      <AnimatedSection className="flex flex-col items-center">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={357}
          height={52}
          unoptimized
          className="h-10 w-auto sm:h-12 md:h-14"
        />
        <p className="mt-2 font-balimo text-[10px] uppercase tracking-[0.14em] text-forest sm:text-xs">
          {tagline}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <a
          href={ctaHref}
          className="flex items-center gap-3 rounded-[10px] bg-forest px-6 py-3.5 transition-colors duration-200 hover:bg-forest/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="whitespace-nowrap font-balimo font-medium text-gold text-sm">
            {ctaLabel}
          </span>
          <ArrowIcon className="size-[18px] shrink-0 text-gold" />
        </a>
      </AnimatedSection>

      <div aria-hidden className="w-full border-t border-forest" />

      <AnimatedSection
        delay={0.15}
        className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-12"
      >
        <FooterColumnMobile label="/ UBICACIÓN">
          <p>{address}</p>
        </FooterColumnMobile>
        <FooterColumnMobile label="/ EMAIL">
          <p>{email}</p>
        </FooterColumnMobile>
        <FooterColumnMobile label="/ PHONE">
          <p>{phone}</p>
          <p>{hours}</p>
        </FooterColumnMobile>
        <FooterColumnMobile label="/ SOCIAL">
          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-forest transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <InstagramIcon className="size-[14px] shrink-0" />
            {instagramLabel}
          </a>
        </FooterColumnMobile>
      </AnimatedSection>

      <div aria-hidden className="w-full border-t border-forest" />

      <p className="font-balimo text-forest text-xs">
        © {year} {copyrightName}. All rights reserved.
      </p>
    </div>
  );
}

function FooterColumnMobile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-balimo text-[10px] uppercase tracking-[0.14em] text-forest">{label}</p>
      <div className="font-balimo text-forest text-sm leading-relaxed">{children}</div>
    </div>
  );
}
