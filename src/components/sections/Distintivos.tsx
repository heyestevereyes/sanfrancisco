export interface Distintivo {
  icon?: { src: string; alt: string };
  title: string;
  description: string;
}

export interface DistintivosProps {
  title?: string;
  subtitle?: string;
  items?: Distintivo[];
}

// TODO: implementar con los tokens definidos en globals.css y los valores
// exactos que devuelve el MCP de Figma para esta sección. No aproximar estilos.
export default function Distintivos(_props: DistintivosProps) {
  return <section data-section="distintivos" />;
}
