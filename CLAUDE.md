@AGENTS.md

# San Francisco — Landing Page

Landing page de un desarrollo inmobiliario llamado "San Francisco". Next.js
(App Router) + TypeScript + Tailwind CSS.

## Reglas del proyecto

1. **El diseño viene de Figma vía MCP y debe replicarse EXACTAMENTE.**
   Colores, tipografías, tamaños y espaciados se toman tal cual los
   devuelve el MCP de Figma (`get_design_context`, `get_variable_defs`,
   `get_metadata`). Nunca aproximar ni inventar estilos — si un valor no
   viene del MCP, hay que pedirlo o volver a consultarlo, no adivinarlo.

2. **Tipografías del proyecto:** Balimo (Regular y Medium) y Salty Ages
   (Regular). Se cargan como fuentes locales con `next/font/local` desde
   `src/lib/fonts.ts` (archivos en `src/fonts/`).
   - Balimo Regular (400) y Balimo Medium (500) están declarados como dos
     pesos reales de la misma familia `balimo`; usar `font-normal` /
     `font-medium` de Tailwind para alternar entre ellos.
   - Salty Ages Regular se usa como tipografía de despliegue (títulos
     grandes tipo hero).

3. **Antes de implementar una sección, definir sus design tokens** (colores
   y tipografías) en la configuración de Tailwind (`src/app/globals.css`,
   bloques `@theme` / `@theme inline` — Tailwind v4, no hay
   `tailwind.config.ts`). Los tokens base del hero ya están definidos:
   `cream`, `ink`, `gold`, `overlay`, `white-80`, `white-40`, `white-15` y
   las familias `font-balimo` / `font-salty-ages`. Agregar los tokens de
   cada sección nueva ahí antes de escribir su JSX.

4. **Estructura de componentes por sección** en
   `src/components/sections/`, una por archivo, exportadas desde
   `src/components/sections/index.ts` y compuestas en orden en
   `src/app/page.tsx`:
   - `Hero`
   - `Distintivos`
   - `ModelosDepartamentos`
   - `Recorrido360`
   - `Contacto`
   - `Footer`

   Los seis existen como stubs tipados (`data-section="..."` + `// TODO`)
   pendientes de implementación con los valores exactos del MCP.

5. **`Recorrido360`** aloja un `<iframe>` con el tour virtual de Realsee.
   Por ahora es un placeholder (`tourSrc` con default `about:blank`).
   Al implementar la sección, fijar las dimensiones exactas (o
   `aspect-ratio`) que indique el MCP de Figma para ese frame — no usar
   valores inventados.

6. **Los componentes reciben texto e imágenes por props desde el inicio**
   (ver las interfaces `*Props` en cada archivo de sección), pensando en
   la futura integración de **Sanity** como CMS headless. Ningún texto o
   imagen de contenido debe quedar hardcodeado dentro del componente;
   los valores por defecto de las props (si existen) son solo para
   desarrollo/preview.

## Estructura relevante

```
src/
  app/
    layout.tsx        # fuentes (balimo, saltyAges) aplicadas como CSS vars
    page.tsx           # composición de las 6 secciones
    globals.css         # @theme: tokens de color y tipografía (Tailwind v4)
  components/
    sections/           # Hero, Distintivos, ModelosDepartamentos,
                         # Recorrido360, Contacto, Footer
  fonts/                 # balimo-regular-webfont.*, salty_ages-webfont.*
  lib/
    fonts.ts             # next/font/local
```
