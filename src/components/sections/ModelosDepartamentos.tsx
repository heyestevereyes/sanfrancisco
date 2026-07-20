export interface ModeloDepartamento {
  name: string;
  description?: string;
  surface?: string;
  bedrooms?: number;
  bathrooms?: number;
  image?: { src: string; alt: string };
}

export interface ModelosDepartamentosProps {
  title?: string;
  subtitle?: string;
  modelos?: ModeloDepartamento[];
}

// TODO: implementar con los tokens definidos en globals.css y los valores
// exactos que devuelve el MCP de Figma para esta sección. No aproximar estilos.
export default function ModelosDepartamentos(_props: ModelosDepartamentosProps) {
  return <section data-section="modelos-departamentos" />;
}
