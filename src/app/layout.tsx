import type { Metadata } from "next";
import { balimo, saltyAges } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "San Francisco | Desarrollo Residencial",
  description:
    "San Francisco es un desarrollo pensado para quienes han elegido un nuevo estándar de vida: privacidad, elegancia y la tranquilidad de saber que llegaste a casa.",
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
