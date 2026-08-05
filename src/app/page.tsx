import {
  Hero,
  Distintivos,
  Galeria,
  ModelosDepartamentos,
  Recorrido360,
  Contacto,
  Footer,
} from "@/components/sections";
import {
  getContacto,
  getDistintivos,
  getFooter,
  getGaleria,
  getHero,
  getRecorrido360,
} from "@/lib/sanity";

/**
 * Server Component: el contenido de cada sección viene de Sanity.
 *
 * Cada `get*()` devuelve un objeto **parcial** de props, ya filtrado de
 * claves vacías, y se hace spread sobre el componente. Si Sanity no
 * responde, o el documento todavía no existe, o un campo está en blanco,
 * esa clave simplemente no llega y el valor por defecto del componente
 * toma su lugar — por eso el sitio se ve igual antes y después de migrar
 * el contenido. Ver `definedOnly` en src/lib/sanity/queries.ts.
 *
 * Las seis queries van en paralelo: son independientes entre sí y
 * encadenarlas sumaría seis round-trips a Sanity en serie.
 */
export default async function Home() {
  const [hero, distintivos, galeria, recorrido360, contacto, footer] = await Promise.all([
    getHero(),
    getDistintivos(),
    getGaleria(),
    getRecorrido360(),
    getContacto(),
    getFooter(),
  ]);

  return (
    <main className="flex-1">
      <Hero {...hero} />
      <Distintivos {...distintivos} />
      <Galeria {...galeria} />
      <ModelosDepartamentos />
      <Recorrido360 {...recorrido360} />
      <Contacto {...contacto} />
      <Footer {...footer} />
    </main>
  );
}
