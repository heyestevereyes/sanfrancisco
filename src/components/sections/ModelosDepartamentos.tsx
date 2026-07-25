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
//
// El `id="departamentos"` es el destino del link "Departamentos" del nav del
// Hero (`defaultNavLinks` en Hero.tsx). Mientras esta sección siga siendo un
// stub de altura 0, ese link salta al límite entre Galería y Recorrido 360 en
// vez de a contenido propio — se resuelve solo al implementar la sección.
export default function ModelosDepartamentos(_props: ModelosDepartamentosProps) {
  return <section id="departamentos" data-section="modelos-departamentos" />;
}
