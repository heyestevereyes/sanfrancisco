import localFont from "next/font/local";

export const balimo = localFont({
  src: [
    { path: "../fonts/balimo-regular-webfont.woff2", weight: "400", style: "normal" },
    { path: "../fonts/balimo-regular-webfont.woff", weight: "400", style: "normal" },
    { path: "../fonts/balimo-medium-webfont.woff2", weight: "500", style: "normal" },
    { path: "../fonts/balimo-medium-webfont.woff", weight: "500", style: "normal" },
  ],
  variable: "--font-balimo",
  display: "swap",
});

export const saltyAges = localFont({
  src: [
    { path: "../fonts/salty_ages-webfont.woff2", weight: "400", style: "normal" },
    { path: "../fonts/salty_ages-webfont.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-salty-ages",
  display: "swap",
});
