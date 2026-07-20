export interface Recorrido360Props {
  title?: string;
  description?: string;
  /** URL del tour virtual de Realsee. Placeholder hasta contar con el enlace real. */
  tourSrc?: string;
}

// TODO: implementar con los tokens definidos en globals.css y las dimensiones
// exactas (width/height/aspect-ratio) que devuelva el MCP de Figma para esta
// sección. No aproximar estilos ni tamaños.
export default function Recorrido360({
  title,
  description,
  tourSrc = "about:blank",
}: Recorrido360Props) {
  return (
    <section data-section="recorrido-360">
      {title ? <h2>{title}</h2> : null}
      {description ? <p>{description}</p> : null}
      {/* Placeholder del tour Realsee — reemplazar src y dimensiones reales al implementar */}
      <iframe
        title="Recorrido virtual 360°"
        src={tourSrc}
        loading="lazy"
        allow="fullscreen; xr-spatial-tracking"
        style={{ border: 0, width: "100%", aspectRatio: "16 / 9" }}
      />
    </section>
  );
}
