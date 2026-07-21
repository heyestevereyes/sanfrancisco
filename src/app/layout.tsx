import type { Metadata } from "next";
import { balimo, saltyAges } from "@/lib/fonts";
import "./globals.css";

const title = "San Francisco | Desarrollo Residencial";
const description =
  "San Francisco es un desarrollo pensado para quienes han elegido un nuevo estándar de vida: privacidad, elegancia y la tranquilidad de saber que llegaste a casa.";

// TODO: definir `metadataBase` con el dominio real de producción cuando
// exista, para que las URLs absolutas de Open Graph se resuelvan bien.
export const metadata: Metadata = {
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
      className={`${balimo.variable} ${saltyAges.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
