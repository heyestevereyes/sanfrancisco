import AnimatedSection from "@/components/AnimatedSection";
import { recorrido360Defaults } from "@/content/defaults";

export interface Recorrido360Props {
  title?: string;
  description?: string;
  /**
   * URL del embed del tour virtual de Realsee. Si no se pasa, se muestra
   * `placeholderMessage` en su lugar — así este componente no hay que
   * tocarlo de nuevo cuando conectemos Realsee, solo pasar la prop.
   */
  tourEmbedUrl?: string;
  /** `title` del iframe para lectores de pantalla — describe el tour en sí,
   * independiente del `title` (h2) de la sección. */
  tourTitle?: string;
  placeholderMessage?: string;
}

const defaultProps: Required<Recorrido360Props> = {
  // Copy técnico (título del iframe para lectores de pantalla y estado
  // vacío): no se edita desde el CMS.
  tourTitle: "Tour virtual 360° del departamento San Francisco",
  placeholderMessage: "Tour virtual próximamente",
  // El resto sale de src/content/defaults.ts, compartido con `npm run seed`.
  ...recorrido360Defaults,
};

// recorrido-sec (node-id 1:52). El contenedor del embed (758px de alto a
// 1920px de referencia) escala vía clamp() como el resto de la sección
// fiel a Figma; en mobile/tablet (sin mockup) usa una altura propia
// dentro de ~500-600px antes de entrar al rango fluido de escritorio.
export default function Recorrido360(props: Recorrido360Props) {
  const merged = { ...defaultProps, ...props };
  return (
    <section data-section="recorrido-360" className="relative w-full bg-panel">
      <Recorrido360Desktop {...merged} />
      <Recorrido360Mobile {...merged} />
    </section>
  );
}

type Recorrido360VariantProps = Required<Recorrido360Props>;

function TourEmbed({
  tourEmbedUrl,
  placeholderMessage,
  tourTitle,
}: {
  tourEmbedUrl: string;
  placeholderMessage: string;
  tourTitle: string;
}) {
  if (tourEmbedUrl) {
    return (
      <iframe
        src={tourEmbedUrl}
        title={tourTitle}
        loading="lazy"
        allow="fullscreen"
        allowFullScreen
        frameBorder="0"
        scrolling="no"
        className="size-full border-0"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-steel px-6 text-center">
      <p className="font-balimo text-sm text-forest sm:text-base">{placeholderMessage}</p>
    </div>
  );
}

/**
 * Layout fiel al frame de Figma (node-id 1:52, canvas de 1920px), visible
 * a partir del breakpoint `xl:` (1366px). Ver regla de escalado fluido en
 * CLAUDE.md.
 */
function Recorrido360Desktop({
  title,
  description,
  tourEmbedUrl,
  tourTitle,
  placeholderMessage,
}: Recorrido360VariantProps) {
  return (
    <div className="relative hidden w-full xl:block">
      <div className="mx-auto max-w-[120rem] px-[clamp(4.313rem,5.052vw,6.0625rem)] pt-[clamp(5.291rem,6.198vw,7.4375rem)] pb-[clamp(2.668rem,3.125vw,3.75rem)]">
        <div className="flex items-center gap-[clamp(1.956rem,2.292vw,2.75rem)]">
          <AnimatedSection>
            <h2 className="whitespace-nowrap font-salty-ages uppercase leading-none text-forest text-[clamp(5.0504rem,5.9151vw,7.0981rem)]">
              {title}
            </h2>
          </AnimatedSection>

          <div
            aria-hidden
            className="w-[2px] shrink-0 bg-forest h-[clamp(4.714rem,5.521vw,6.625rem)]"
          />

          <AnimatedSection delay={0.15}>
            <p className="font-balimo text-forest text-[clamp(0.8rem,0.938vw,1.125rem)] leading-[clamp(1.209rem,1.417vw,1.7rem)] w-[clamp(31.259rem,36.615vw,43.9375rem)]">
              {description}
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection
          delay={0.3}
          className="mt-[clamp(2.668rem,3.125vw,3.75rem)] block w-full overflow-hidden rounded-[clamp(0.978rem,1.146vw,1.375rem)] h-[clamp(33.706rem,39.479vw,47.375rem)]"
        >
          <TourEmbed
            tourEmbedUrl={tourEmbedUrl}
            placeholderMessage={placeholderMessage}
            tourTitle={tourTitle}
          />
        </AnimatedSection>
      </div>
    </div>
  );
}

/**
 * Layout propio para mobile y tablet (< 1366px): no hay mockup de Figma
 * para estos anchos. El título y la descripción se apilan (el divisor
 * vertical no tiene sentido en una columna); la altura del contenedor del
 * embed usa valores propios de UX en vez del clamp fiel a Figma.
 */
function Recorrido360Mobile({
  title,
  description,
  tourEmbedUrl,
  tourTitle,
  placeholderMessage,
}: Recorrido360VariantProps) {
  return (
    <div className="relative flex w-full flex-col gap-6 px-6 pb-10 pt-14 sm:gap-8 sm:px-8 sm:pb-12 sm:pt-16 md:px-12 xl:hidden">
      <AnimatedSection>
        <h2 className="font-salty-ages uppercase leading-none text-forest text-3xl sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <p className="font-balimo text-sm leading-relaxed text-forest sm:text-base">
          {description}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.3} className="block overflow-hidden rounded-2xl h-64 sm:h-96 md:h-[550px]">
        <TourEmbed
          tourEmbedUrl={tourEmbedUrl}
          placeholderMessage={placeholderMessage}
          tourTitle={tourTitle}
        />
      </AnimatedSection>
    </div>
  );
}
