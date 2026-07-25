import { notFound } from "next/navigation";

export const metadata = {
  title: "Test Fonts | San Francisco",
  // Página interna de desarrollo: nunca debe indexarse.
  robots: { index: false, follow: false },
};

const sample = "Un Desarrollo con Altura";

export default function TestFontsPage() {
  // Es una herramienta de desarrollo para comparar los tres cortes de fuente,
  // no contenido del sitio. Sigue disponible en `next dev`, pero en el build
  // de producción responde 404 en vez de quedar como página pública del
  // cliente. Borrar el directorio entero cuando ya no se ocupe.
  if (process.env.NODE_ENV === "production") notFound();


  return (
    <main className="flex flex-col gap-16 p-16">
      <section>
        <p className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Balimo Regular (400)
        </p>
        <p className="font-balimo font-normal text-6xl">{sample}</p>
      </section>

      <section>
        <p className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Balimo Medium (500)
        </p>
        <p className="font-balimo font-medium text-6xl">{sample}</p>
      </section>

      <section>
        <p className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Salty Ages Regular
        </p>
        <p className="font-salty-ages text-6xl">{sample}</p>
      </section>
    </main>
  );
}
