/**
 * Migra a Sanity el contenido que hoy vive como valores por defecto en el
 * código. Se corre con `npm run seed`.
 *
 *   npm run seed              # crea lo que falte; respeta lo ya existente
 *   npm run seed -- --force   # sobrescribe los documentos que ya existan
 *   npm run seed -- --dry-run # muestra el plan sin tocar Sanity
 *
 * De dónde sale el contenido
 * --------------------------
 * De `src/content/defaults.ts`, que es exactamente el mismo módulo que
 * usan los componentes como fallback. No hay transcripción a mano: si
 * cambias un texto ahí, cambia en el sitio y en lo que sube este script.
 *
 * Seguridad para correrlo varias veces
 * ------------------------------------
 * Los 6 documentos son singletons con `_id` fijo (igual a su `_type`), así
 * que nunca se duplican: o se crean, o se actualizan. Sin `--force` el
 * script **no pisa** documentos existentes (por si ya se editaron en el
 * Studio); pregunta si hay terminal interactiva, y si no la hay te dice
 * qué flag usar. Los assets los deduplica Sanity por hash de contenido:
 * subir la misma imagen dos veces devuelve el mismo asset.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";

import { createClient } from "@sanity/client";

import {
  contactoDefaults,
  distintivosDefaults,
  footerDefaults,
  galeriaDefaults,
  galeriaPhotos,
  heroDefaults,
  recorrido360Defaults,
} from "../src/content/defaults";

// --------------------------------------------------------------- setup

// tsx no carga .env.local por su cuenta (eso lo hace Next). Node 21+ trae
// loadEnvFile, así que no hace falta sumar dotenv como dependencia.
try {
  process.loadEnvFile(".env.local");
} catch {
  console.warn("No se pudo leer .env.local — se usarán las variables del entorno.");
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error("Faltan NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET.");
  process.exit(1);
}
if (!token || token.startsWith("PENDIENTE_")) {
  console.error(
    "Falta SANITY_API_TOKEN (token de escritura, permiso Editor).\n" +
      "Se saca de Sanity Manage → API → Tokens y va en .env.local."
  );
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");

/**
 * Cliente de **escritura**, distinto del de solo lectura que usa el sitio
 * (src/lib/sanity/client.ts). `useCdn: false` porque el CDN sirve
 * contenido cacheado y aquí necesitamos leer el estado real antes de
 * decidir si crear o actualizar.
 */
const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-05",
  token,
  useCdn: false,
});

const PUBLIC_DIR = path.join(process.cwd(), "public");
const SECTIONS = ["hero", "distintivos", "galeria", "recorrido360", "contacto", "footer"] as const;

// ------------------------------------------------------------- helpers

function log(step: string, detail = "") {
  console.log(`  ${step}${detail ? ` ${detail}` : ""}`);
}

/** Sube un asset desde public/ y devuelve su _id. */
async function uploadAsset(kind: "image" | "file", publicPath: string): Promise<string> {
  const absolute = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
  const buffer = await readFile(absolute);
  const filename = path.basename(absolute);
  const sha = createHash("sha1").update(buffer).digest("hex").slice(0, 8);

  if (dryRun) {
    log("· [dry-run] subiría", `${publicPath} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
    return `dry-run-${kind}-${sha}`;
  }

  const asset = await client.assets.upload(kind, buffer, { filename });
  log("· asset", `${publicPath} → ${asset._id}`);
  return asset._id;
}

const imageRef = (assetId: string, alt: string) => ({
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
  alt,
});

const fileRef = (assetId: string) => ({
  _type: "file",
  asset: { _type: "reference", _ref: assetId },
});

// ---------------------------------------------------------------- main

async function main() {
  console.log(`\nSeed de Sanity → proyecto ${projectId}, dataset ${dataset}`);
  if (dryRun) console.log("Modo --dry-run: no se escribe nada.\n");

  // 1. ¿Qué ya existe?
  const existing: string[] = await client.fetch(
    `*[_type in $types && _id in $types]._id`,
    { types: [...SECTIONS] }
  );

  if (existing.length > 0) {
    console.log(`\nYa existen ${existing.length} documento(s): ${existing.join(", ")}`);
    if (!force && !dryRun) {
      const interactive = process.stdin.isTTY && process.stdout.isTTY;
      if (!interactive) {
        console.log(
          "\nSe crearán solo los que falten y se dejarán intactos los existentes.\n" +
            "Para sobrescribirlos: npm run seed -- --force"
        );
      } else {
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        const answer = (
          await rl.question("¿Sobrescribir los existentes? (se pierden ediciones del Studio) [s/N] ")
        )
          .trim()
          .toLowerCase();
        rl.close();
        if (answer === "s" || answer === "si" || answer === "sí" || answer === "y") {
          console.log("Se sobrescribirán.");
          return run(new Set<string>());
        }
      }
    }
  }

  // Sin --force, los existentes se saltan.
  await run(force || dryRun ? new Set<string>() : new Set(existing));
}

async function run(skip: Set<string>) {
  const created: string[] = [];
  const skipped: string[] = [];

  // ------------------------------------------------------------- hero
  if (skip.has("hero")) {
    skipped.push("hero");
  } else {
    console.log("\nhero");
    const bg = await uploadAsset("image", heroDefaults.backgroundImage.src);
    const video = await uploadAsset("file", heroDefaults.videoSrc);
    await write({
      _id: "hero",
      _type: "hero",
      titlePrefix: heroDefaults.titlePrefix,
      titleHighlight: heroDefaults.titleHighlight,
      description: heroDefaults.description,
      ctaLabel: heroDefaults.ctaLabel,
      backgroundImage: imageRef(bg, heroDefaults.backgroundImage.alt),
      video: fileRef(video),
    });
    created.push("hero");
  }

  // ------------------------------------------------------ distintivos
  if (skip.has("distintivos")) {
    skipped.push("distintivos");
  } else {
    console.log("\ndistintivos");
    await write({ _id: "distintivos", _type: "distintivos", ...distintivosDefaults });
    created.push("distintivos");
  }

  // ---------------------------------------------------------- galeria
  if (skip.has("galeria")) {
    skipped.push("galeria");
  } else {
    console.log("\ngaleria");
    // Las 6 fotos reales, **sin** la duplicación a 12 slides que usa el
    // fallback del componente: eso era un parche para que el carrusel
    // infinito no se sintiera repetitivo, no contenido de verdad.
    const images = [];
    for (const [i, photo] of galeriaPhotos.entries()) {
      const assetId = await uploadAsset("image", photo.src);
      images.push({ _key: `foto-${i + 1}`, ...imageRef(assetId, photo.alt) });
    }
    await write({
      _id: "galeria",
      _type: "galeria",
      title: galeriaDefaults.title,
      images,
    });
    created.push("galeria");
  }

  // ---------------------------------------------------- recorrido360
  if (skip.has("recorrido360")) {
    skipped.push("recorrido360");
  } else {
    console.log("\nrecorrido360");
    await write({ _id: "recorrido360", _type: "recorrido360", ...recorrido360Defaults });
    created.push("recorrido360");
  }

  // -------------------------------------------------------- contacto
  if (skip.has("contacto")) {
    skipped.push("contacto");
  } else {
    console.log("\ncontacto");
    await write({ _id: "contacto", _type: "contacto", ...contactoDefaults });
    created.push("contacto");
  }

  // ---------------------------------------------------------- footer
  if (skip.has("footer")) {
    skipped.push("footer");
  } else {
    console.log("\nfooter");
    await write({ _id: "footer", _type: "footer", ...footerDefaults });
    created.push("footer");
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`Escritos:  ${created.length ? created.join(", ") : "—"}`);
  console.log(`Saltados:  ${skipped.length ? `${skipped.join(", ")} (usa --force)` : "—"}`);
  if (dryRun) console.log("\n(dry-run: no se escribió nada en Sanity)");
}

async function write(doc: Record<string, unknown> & { _id: string; _type: string }) {
  if (dryRun) {
    log("· [dry-run] createOrReplace", doc._id);
    return;
  }
  // createOrReplace sobre un _id fijo: nunca duplica, siempre deja el
  // documento en el estado que describe este script.
  await client.createOrReplace(doc as never);
  log("· documento", doc._id);
}

main().catch((error) => {
  console.error("\nEl seed falló:", error instanceof Error ? error.message : error);
  process.exit(1);
});
