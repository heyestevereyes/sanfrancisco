import {
  Hero,
  Distintivos,
  ModelosDepartamentos,
  Recorrido360,
  Contacto,
  Footer,
} from "@/components/sections";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Distintivos />
      <ModelosDepartamentos />
      <Recorrido360 />
      <Contacto />
      <Footer />
    </main>
  );
}
