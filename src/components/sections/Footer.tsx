export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logo?: { src: string; alt: string };
  links?: FooterLink[];
  socialLinks?: FooterLink[];
  legalText?: string;
}

// TODO: implementar con los tokens definidos en globals.css y los valores
// exactos que devuelve el MCP de Figma para esta sección. No aproximar estilos.
export default function Footer(_props: FooterProps) {
  return <footer data-section="footer" />;
}
