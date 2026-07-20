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

// TODO: implementar con los tokens definidos en globals.css y los valores
// exactos (colores, tipografías, tamaños, espaciados) que devuelve el MCP
// de Figma para el frame hero-section (node-id 1:3). No aproximar estilos.
export default function Hero(_props: HeroProps) {
  return <section data-section="hero" />;
}
