import type { Metadata } from "next";
import { balimo, saltyAges } from "@/lib/fonts";
import "./globals.css";

const title = "San Francisco | Desarrollo Residencial";
const description =
  "San Francisco es un desarrollo pensado para quienes han elegido un nuevo estándar de vida: privacidad, elegancia y la tranquilidad de saber que llegaste a casa.";

// Dominio de producción para resolver las URLs absolutas de Open Graph.
// Se toma de NEXT_PUBLIC_SITE_URL (ver .env.example) — todavía no lo tenemos,
// ver "Pendientes del cliente" en CLAUDE.md.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  // Sin NEXT_PUBLIC_SITE_URL queda `undefined` a propósito: Next.js emite el
  // warning "metadataBase property is not set" en el build, que es justo el
  // recordatorio que queremos mientras no exista el dominio real. No poner un
  // fallback a localhost — silenciaría el warning y publicaría URLs de OG
  // rotas sin que nadie se entere.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    siteName: "San Francisco",
    images: [
      {
        url: "/images/hero/background.png",
        alt: "Edificio San Francisco al atardecer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${balimo.variable} ${saltyAges.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
