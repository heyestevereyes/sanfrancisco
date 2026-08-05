import AnimatedSection from "@/components/AnimatedSection";
import CrestIcon from "@/components/icons/CrestIcon";
import { contactoDefaults } from "@/content/defaults";
import ContactoForm from "./ContactoForm";

export interface ContactoProps {
  title?: string;
  submitLabel?: string;
  successMessage?: string;
  mapEmbedUrl?: string;
  mapTitle?: string;
}

const defaultProps: Required<ContactoProps> = {
  // Solo `title` es editable desde el CMS (src/content/defaults.ts,
  // compartido con `npm run seed`). El resto es copy de formulario y la
  // URL del mapa, que no se administran como contenido.
  ...contactoDefaults,
  submitLabel: "Enviar",
  successMessage: "¡Gracias! Nos pondremos en contacto pronto.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1869.6920382641997!2d-99.972603!3d20.408270000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d30b003086cdc7%3A0x997ed5cf241657fa!2sFraccionamiento%20San%20Francisco!5e0!3m2!1ses!2smx!4v1784741456619!5m2!1ses!2smx",
  mapTitle: "Ubicación de Fraccionamiento San Francisco en Google Maps",
};

/**
 * contacto-sec (node-id 1:181, formulario) + Frame 38 (node-id 1:202,
 * mapa). Un único árbol de componentes (no el patrón Desktop/Mobile de
 * Hero/Distintivos): el formulario tiene estado real de usuario
 * (valores tecleados), así que duplicarlo en dos DOM separados
 * perdería lo que la persona ya escribió al cruzar el breakpoint `xl:`
 * al redimensionar. Mobile/tablet (sin mockup) usa tamaños propios;
 * `xl:` mete los valores exactos de Figma vía clamp().
 */
export default function Contacto(props: ContactoProps) {
  const { title, submitLabel, successMessage, mapEmbedUrl, mapTitle } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section id="contacto" data-section="contacto" className="relative w-full">
      <div className="flex flex-col xl:flex-row xl:items-stretch">
        {/* Columna formulario */}
        <div className="relative w-full bg-forest px-6 pb-14 pt-14 sm:max-xl:px-8 sm:max-xl:pb-16 sm:max-xl:pt-16 md:max-xl:px-12 xl:w-1/2 xl:px-0 xl:pb-[clamp(2.891rem,3.385vw,4.0625rem)] xl:pt-[clamp(3.6908rem,4.323vw,5.1875rem)]">
          <div className="xl:pl-[clamp(4.002rem,4.6875vw,5.625rem)]">
            <AnimatedSection>
              <h2 className="max-w-md pr-20 font-salty-ages uppercase leading-none text-cream text-3xl sm:max-xl:pr-24 sm:max-xl:text-4xl md:max-xl:text-5xl xl:max-w-none xl:w-[clamp(40.864rem,47.865vw,57.4375rem)] xl:pr-0 xl:text-[clamp(4.072rem,4.769vw,5.7231rem)]">
                {title}
              </h2>
            </AnimatedSection>

            <div className="mt-8 xl:mt-[clamp(1.601rem,1.875vw,2.25rem)]">
              <AnimatedSection delay={0.15}>
                <ContactoForm submitLabel={submitLabel} successMessage={successMessage} />
              </AnimatedSection>
            </div>
          </div>

          {/* Isotipo del ave, arriba a la derecha del título */}
          <AnimatedSection
            delay={0.3}
            className="absolute right-6 top-8 flex size-16 items-center justify-center sm:max-xl:right-8 sm:max-xl:top-10 md:max-xl:right-12 xl:right-[clamp(2.634rem,3.086vw,3.7031rem)] xl:top-[clamp(4.2214rem,4.9443vw,5.9331rem)] xl:size-[clamp(5.0856rem,5.9565vw,7.1478rem)]"
          >
            <CrestIcon className="h-12 w-auto rotate-[18.3deg] text-cream xl:h-[clamp(5.7086rem,6.6859vw,8.0231rem)]" />
          </AnimatedSection>
        </div>

        {/* Columna mapa: fluida, sin tamaño fijo — aspect-ratio apilado en
            mobile/tablet, height:100% (por stretch del flex) en desktop. */}
        <div className="relative aspect-video w-full bg-steel xl:aspect-auto xl:w-1/2">
          <iframe
            src={mapEmbedUrl}
            title={mapTitle}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
