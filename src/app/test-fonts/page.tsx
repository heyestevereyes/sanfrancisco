export const metadata = {
  title: "Test Fonts | San Francisco",
};

const sample = "Un Desarrollo con Altura";

export default function TestFontsPage() {
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
