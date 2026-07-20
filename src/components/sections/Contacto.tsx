export interface ContactoProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  image?: { src: string; alt: string };
}

// TODO: implementar con los tokens definidos en globals.css y los valores
// exactos que devuelve el MCP de Figma para esta sección. No aproximar estilos.
export default function Contacto(_props: ContactoProps) {
  return <section data-section="contacto" />;
}
