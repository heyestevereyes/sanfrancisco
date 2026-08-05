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

   - **Estrategia responsive (desktop fluido):** el Figma solo tiene
     mockup para el frame de 1920px, pero el sitio debe verse bien y
     escalar de forma continua en cualquier ancho de escritorio (1366px,
     1536px, 1920px, 2560px...), no solo lucir "pixel perfect" a 1920px
     con saltos bruscos en otros anchos. Por eso: **todo tamaño o
     espaciado que en el Figma sea un valor fijo (tipografía, gaps,
     posiciones, padding, border-radius) debe convertirse a
     `clamp(mínimo, preferido, máximo)` proporcional al ancho de 1920px
     como referencia — nunca usar valores px fijos para texto, gaps o
     posiciones salvo casos justificados (p. ej. grosor de borde).**
     Fórmula usada en el proyecto (ver `Hero.tsx` para el patrón):
     - `preferido = (valor-px / 1920) * 100vw`
     - `máximo = valor-px convertido a rem` (así nunca crece más allá del
       valor exacto de Figma a 1920px o más ancho — el contenido no debe
       estirarse infinitamente en monitores ultra anchos)
     - `mínimo = (valor-px * 1366 / 1920)` convertido a rem (el valor que
       tomaría exactamente en el borde inferior del rango fluido, 1366px)
     - Este layout fiel a Figma vive detrás del breakpoint `xl:`
       (redefinido a 1366px en `globals.css` vía `--breakpoint-xl`), y
       el contenedor de contenido usa `max-w-[120rem]` (= 1920px)
       centrado para no estirarse en ultra-wide.
     - **Por qué `xl:` y no un breakpoint con nombre custom** (p. ej.
       `desktop:`): Tailwind v4 agrupa los breakpoints con nombre
       arbitrario aparte de la escala default (sm/md/lg/xl/2xl) y los
       emite *antes* que esta en el CSS generado, sin importar su valor
       en px — eso rompe la cascada en cualquier vista que combine ese
       breakpoint custom con `md:`/`lg:` en la misma propiedad (el que
       aparece después en el CSS generado gana, no el de mayor
       min-width). Redefinir el valor de `--breakpoint-xl` evita el
       problema por completo porque Tailwind sí ordena la escala
       default correctamente. No reintroducir un breakpoint con nombre
       custom para esto.
     - **Regla derivada — cuidado incluso con `xl:` ya arreglado:** en
       cualquier componente de **un solo árbol** (sin el patrón
       Desktop/Mobile de abajo — ver Galeria y Contacto) que mezcle
       `sm:`/`md:` con `xl:` en la **misma propiedad CSS**, NO usar
       `sm:`/`md:` a secas — Tailwind tampoco garantiza que esos
       quedan *antes* que `xl:` en el CSS generado (lo mismo que
       rompía `desktop:` puede pasar aunque ahora se llame `xl:`, la
       causa raíz es mezclar 3 tiers en una propiedad, no el nombre).
       Usar rangos acotados: `sm:max-xl:` / `md:max-xl:` en vez de
       `sm:`/`md:` sueltos, así son mutuamente excluyentes con `xl:` y
       no dependen del orden de emisión del CSS. Verificar siempre con
       `getComputedStyle` en el navegador real a cada breakpoint, no
       solo mirando las clases — ya pasó dos veces (Galeria, Contacto).
   - **Mobile y tablet (< 1366px)** no tienen mockup de Figma: se
     resuelven con criterio de UX propio (layout apilado, nav
     colapsada, etc.), no como una versión escalada del layout de
     desktop. Ver el patrón `HeroDesktop` / `HeroMobile` dentro de
     `Hero.tsx`.
   - **Verificación visual:** el proyecto tiene Playwright como
     devDependency para capturar screenshots en varios anchos (375,
     768, 1366, 1920, 2560px) y confirmar que no haya saltos de layout
     al redimensionar. Usarlo al implementar o tocar el layout fluido
     de cualquier sección.

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
   - `Galeria`
   - `ModelosDepartamentos`
   - `Recorrido360`
   - `Contacto`
   - `Footer`

   Las que faltan existen como stubs tipados (`data-section="..."` +
   `// TODO`) pendientes de implementación con los valores exactos del
   MCP. `Galeria` es la excepción a la separación Desktop/Mobile de la
   regla 1: al ser un carrusel interactivo (embla-carousel), usa un
   único árbol de componentes con clases responsivas (`xl:` para
   los valores exactos de Figma, breakpoints normales para mobile/
   tablet) en vez de dos DOM duplicados — duplicar el carrusel rompería
   las mediciones de embla en la instancia oculta vía `display:none`.

5. **`Recorrido360`** aloja un `<iframe>` con el tour virtual de Realsee.
   Por ahora es un placeholder (`tourSrc` con default `about:blank`).
   Al implementar la sección, fijar las dimensiones exactas (o
   `aspect-ratio`) que indique el MCP de Figma para ese frame — no usar
   valores inventados.

6. **Los componentes reciben texto e imágenes por props desde el inicio**
   (ver las interfaces `*Props` en cada archivo de sección). **Sanity ya
   está integrado** — ver la sección "Sanity (CMS)" más abajo. Ningún
   texto o imagen de contenido debe quedar hardcodeado dentro del
   componente; los valores por defecto de las props siguen existiendo,
   pero ahora cumplen un rol concreto: son el **fallback** cuando Sanity
   no devuelve ese campo.

7. **Animaciones de entrada al viewport: usar `AnimatedSection`**
   (`src/components/AnimatedSection.tsx`) — es el patrón estándar para
   cuando implementemos las 5 secciones restantes (`Distintivos`,
   `ModelosDepartamentos`, `Recorrido360`, `Contacto`, `Footer`). No
   crear animaciones de scroll-reveal ad-hoc con Framer Motion en cada
   componente; envolver los bloques (título, párrafo, imagen, card,
   etc.) con `<AnimatedSection>` en vez de reimplementar `motion.div` +
   `whileInView` sueltos.
   - Fade in + `translateY` sutil (~24px), dispara con `whileInView` y
     `viewport={{ once: true, amount: 0.2 }}` (una sola vez, al 20%
     visible), transición ~0.6s `ease-out`.
   - Respeta `prefers-reduced-motion` automáticamente vía
     `useReducedMotion` de Framer Motion — no hay que pasarle nada.
   - Acepta `delay` (en segundos) para escalonar (stagger) varios
     bloques dentro de una misma sección — ver el patrón en `Hero.tsx`
     (título → párrafo → CTA con `delay` 0 / 0.15 / 0.3).
   - `AnimatedSection` renderiza un `motion.div`: para envolver un
     elemento que debe conservar su propia semántica/funcionalidad
     (p. ej. un `<a>` con `href`), envolver el elemento *dentro* de
     `<AnimatedSection>` en vez de reemplazarlo — no convertir links o
     botones reales en `div`s.

## Estándares de desarrollo

Estos estándares aplican a **toda sección o componente que se implemente
de aquí en adelante**, sin que haya que pedirlos explícitamente cada vez.
Cuando se implemente o se toque `Distintivos`, `ModelosDepartamentos`,
`Recorrido360`, `Contacto` o `Footer`, revisar esta lista antes de dar
la sección por terminada.

**Responsive**
- Mobile-first con `clamp()` para el escalado fluido en desktop (patrón
  ya establecido en el Hero — ver regla 1).
- Cada sección debe verse bien en mobile (375px), tablet (768px) y
  desktop (1920px+), aunque no exista mockup de Figma para esos tamaños
  — usar buen criterio de UX manteniendo la jerarquía visual y la
  paleta de la sección.

**Animación**
- Todas las secciones usan `AnimatedSection` (regla 7) para el fade-in
  + movimiento al entrar al viewport.
- Micro-interacciones en elementos interactivos: todo botón, link o
  campo de formulario debe tener estados de `hover` y `focus` visibles,
  con transición suave (`transition-colors`/`transition-opacity` etc.,
  nunca un cambio instantáneo).

**Accesibilidad**
- HTML semántico: `header`, `nav`, `main`, `section`, `footer` — no
  `div` genérico para todo.
- Un solo `<h1>` en la página (el título del Hero); jerarquía lógica
  de `h2`/`h3` por sección a partir de ahí.
- `alt` descriptivo en toda imagen de contenido; `alt=""` solo en
  imágenes puramente decorativas (icono junto a texto visible, etc.).
- `aria-label` en botones que solo llevan ícono (hamburguesa, cerrar,
  flechas de carrusel...), más `aria-expanded`/`aria-controls` cuando
  el botón abre/cierra algo.
- Navegable por teclado: focus visible en todo elemento interactivo
  (no quitar el outline sin reemplazarlo), orden de tab lógico.
- Contraste de color mínimo AA entre texto y fondo.

**Rendimiento**
- Toda imagen va con `next/image` (`Image` de `next/image`), con
  `sizes` correcto y `priority` **solo** en la imagen above-the-fold
  (el fondo del Hero). El resto, lazy loading por default (no forzar
  `priority` en imágenes debajo del fold).
  - Excepción: los SVG propios de UI (`logo.svg`, `play-icon.svg`) se
    sirven con `Image` + `unoptimized` en vez de habilitar
    `dangerouslyAllowSVG` en `next.config.ts` — son vectores locales
    triviales, no vale la pena asumir el riesgo de optimizar SVGs vía
    el image optimizer por ellos.
- Ancho/alto explícitos (o `fill` dentro de un contenedor con tamaño
  fijo) en toda imagen, para evitar layout shift — nunca una imagen
  sin dimensiones reservadas.

**SEO**
- Metadata de Next.js (`title`, `description`, Open Graph) configurada
  por página vía el export `metadata` (ver `src/app/layout.tsx`).
- Textos descriptivos, nunca genéricos: "Ver Recorrido" sí, "Click
  aquí" no.

**Formularios**
- Validación inline con mensajes de error claros por campo — y nunca
  confiar solo en la validación del cliente: si un formulario pega a
  una API route propia, esa route debe validar de nuevo con las
  mismas reglas (ver `src/lib/contactValidation.ts`, compartido entre
  `ContactoForm.tsx` y `src/app/api/contact/route.ts`).
- Confirmación visible de envío exitoso o de error.
- `Contacto` envía por correo vía Resend (`src/app/api/contact/route.ts`
  → `POST` con `{ nombre, email, telefono }`), no a WhatsApp ni a un
  backend propio distinto. Ver "Pendientes del cliente" abajo para las
  variables de entorno que faltan.

## Pendientes del cliente

Cosas que dependen de información que todavía no nos ha dado el
cliente. Buscar este encabezado antes de dar una sección por
"lista para producción".

- **`RESEND_API_KEY` y `CONTACT_EMAIL_TO` de `Contacto`**: la API route
  `src/app/api/contact/route.ts` envía el correo del formulario de
  contacto vía Resend usando estas dos variables de entorno. Mientras
  no tengamos los valores reales, `.env.local` trae los placeholders
  deliberadamente inválidos `RESEND_API_KEY=PENDIENTE_RESEND_API_KEY` y
  `CONTACT_EMAIL_TO=PENDIENTE_CORREO_CLIENTE` — la API route detecta el
  prefijo `PENDIENTE_` y responde con un error claro (en vez de
  intentar enviar) más un `console.warn` en el servidor. **Para
  resolverlo**: reemplazar ambos valores en `.env.local` por la API key
  real de Resend y el correo real de destino (`.env.example` documenta
  las claves sin valores, para referencia — nunca poner la key real
  ahí, ese archivo sí se commitea).

- **`instagramHref` de `Footer`**: el cliente todavía no nos da la cuenta
  real de Instagram. El valor por defecto en `Footer.tsx`
  (`https://www.instagram.com/PENDIENTE_USUARIO_INSTAGRAM/`) es un
  placeholder deliberadamente reconocible (prefijo `PENDIENTE_`), no una
  URL real — a diferencia del correo/Resend, esto no bloquea ninguna
  funcionalidad server-side, así que no lleva `console.warn`. **Para
  resolverlo**: pasar el `instagramHref` real como prop cuando exista
  (o reemplazar el default una vez conectado a Sanity).

- **`NEXT_PUBLIC_SITE_URL` (dominio de producción)**: `src/app/layout.tsx`
  resuelve `metadataBase` desde esta variable para que las URLs absolutas
  de Open Graph apunten al dominio real. Mientras no exista, la variable
  se deja vacía y `metadataBase` queda `undefined` **a propósito**: el
  build de Next.js emite `metadataBase property is not set...` y ese
  warning es el recordatorio. No ponerle un fallback a `localhost` —
  silenciaría el aviso y publicaría URLs de OG rotas sin que nadie se
  entere. **Para resolverlo**: poner el dominio real (con protocolo, sin
  barra final) en `NEXT_PUBLIC_SITE_URL` en el entorno de producción.

- **`SANITY_REVALIDATE_SECRET`**: secreto compartido entre el webhook de
  Sanity y `src/app/api/revalidate/route.ts`, que lo verifica antes de
  invalidar caché. Mientras no exista, `.env.local` trae el placeholder
  deliberadamente inválido `SANITY_REVALIDATE_SECRET=PENDIENTE_SANITY_REVALIDATE_SECRET`
  — la route detecta el prefijo `PENDIENTE_` y responde 503 con un
  `console.warn`, igual que el de Resend. **Para resolverlo**: generar un
  string aleatorio, ponerlo en `.env.local` (y en el entorno de
  producción) y el mismo valor en el webhook de Sanity Manage → API →
  Webhooks. Sin esto el sitio funciona igual, solo que el contenido
  publicado no aparece hasta el siguiente build.
  **No hace falta `SANITY_API_TOKEN`**: el dataset `production` es
  legible sin autenticar y el sitio solo lee, nunca escribe. Si en algún
  momento se pone el dataset en privado o se añade draft mode, ahí sí
  habría que agregar un token de lectura.

- **Orígenes CORS de Sanity**: hay que registrar `http://localhost:3000`
  y el dominio de producción en Sanity Manage → API → CORS origins, o el
  Studio de `/studio` muestra "Connect this Studio to your project" en
  vez del editor. Es configuración en el panel de Sanity, no código.

- **Datos reales del cliente en Sanity**: el contenido ya está migrado
  (`npm run seed`), pero lo que se subió son los valores del mockup, no
  datos confirmados. Siguen pendientes de corregir **en el Studio**: el
  `email`, `phone` y `hours` del Footer (teléfono de Chicago y horario en
  inglés — ver más abajo) y el `instagramHref`, que se migró con el
  placeholder `PENDIENTE_USUARIO_INSTAGRAM`. También faltan más fotos de
  galería: el cliente solo dio 6.

- **Contenido de `ModelosDepartamentos`**: la sección sigue siendo un stub
  de altura 0 (`src/components/sections/ModelosDepartamentos.tsx`) — falta
  que el cliente nos pase los modelos/plantas y que saquemos los valores
  exactos del MCP de Figma. Ojo: el link **"Departamentos"** del nav del
  Hero apunta a su `id="departamentos"`, así que hasta que la sección
  tenga contenido ese link salta al límite entre Galería y Recorrido 360.
  Se arregla solo al implementarla.

- **Datos de contacto del `Footer`**: `email` (`Info@sanfrancisco.com`),
  `phone` (`+1 (312) 555 0140`) y `hours` (`Mon–Fri, 9–6 CT`) son los
  valores que venían en el mockup de Figma, no datos confirmados por el
  cliente — el teléfono es de área de Chicago y el horario está en inglés
  y en hora del centro de EE.UU., lo cual no cuadra con un desarrollo en
  San Juan del Río, Qro. **Para resolverlo**: confirmar los tres con el
  cliente y pasarlos como props (o vía Sanity).

## Sanity (CMS)

El contenido de las 6 secciones implementadas se edita en un **Studio
embebido en la ruta `/studio`** del mismo repo. Proyecto `o9u4v7pb`,
dataset `production`.

**Archivos**

```
sanity.config.ts             # raíz — basePath /studio, singletons, structure
src/sanity/
  env.ts                     # projectId / dataset / apiVersion
  schemas/                   # un archivo por sección + index.ts
src/lib/sanity/
  client.ts                  # createClient + sanityFetch() con tags
  image.ts                   # resolveImage(): imagen de Sanity -> {src, alt}
  queries.ts                 # getHero(), getFooter(), ... (GROQ)
src/app/studio/[[...tool]]/page.tsx
src/app/api/revalidate/route.ts
```

**Las 6 secciones son singletons.** Un documento por tipo, con `_id`
igual al `_type` (`"hero"`, `"footer"`, ...). Por eso las queries usan
`*[_type == "hero" && _id == "hero"][0]` y la config le quita al Studio
las acciones de crear/duplicar/borrar: si existieran dos documentos del
mismo tipo, el `[0]` elegiría uno arbitrariamente.

**El fallback es lo que mantiene el sitio en pie.** Cada `get*()`
devuelve un objeto **parcial** de props del que ya se filtraron las
claves vacías (`definedOnly` en `queries.ts`), y `page.tsx` lo hace
spread sobre el componente. Si Sanity no responde, o el documento no
existe, o un campo está en blanco, esa clave no llega y el default del
componente toma su lugar. Dos detalles que **no** hay que romper:

- `sanityFetch` **atrapa los errores y devuelve `null`** en vez de
  propagarlos. Si dejara reventar la excepción, un dataset caído tiraría
  el build entero en vez de degradar a los defaults.
- `definedOnly` no es cosmético. Cuatro secciones (Distintivos,
  Recorrido360, Contacto, Footer) resuelven sus defaults con
  `{ ...defaultProps, ...props }`: pasarles `{ title: undefined }`
  pisaría el default con `undefined` y dejaría la sección vacía. Hay que
  borrar la clave, no ponerla en `undefined`.

**Qué NO es editable desde el CMS, a propósito**

- `logo` y `flowerIcon`: assets vectoriales versionados en el repo y
  sincronizados con Figma.
- `navLinks`, `galleryHref`, `ctaHref`: son anclas internas acopladas a
  los `id` de las secciones; moverlas desde el CMS rompería el nav.
- `tourTitle`, `placeholderMessage`, `submitLabel`, `successMessage`,
  `mapEmbedUrl`, `mapTitle`, `instagramLabel`: copy técnico de
  accesibilidad y de estado, no contenido de marketing.
- **El correo de destino del formulario.** Sigue en `CONTACT_EMAIL_TO`
  (variable de entorno, solo servidor). El dataset es legible sin token,
  así que moverlo a Sanity lo volvería público y dejaría que cualquiera
  con acceso al Studio redirija los leads.

**Caching y revalidación (ojo, Next 16 cambió esto)**

- `fetch` **no** cachea por defecto desde Next 15, así que `sanityFetch`
  pide `cache: "force-cache"` explícitamente. Sin eso, cada request
  pegaría a Sanity de nuevo.
- Cada query se marca con un tag por sección (`SECTION_TAGS`).
- `revalidateTag` ahora toma **dos** argumentos; la forma de un solo
  argumento está deprecada. Para webhooks de terceros los docs piden
  `{ expire: 0 }` (caducar ya) en vez de `"max"`
  (stale-while-revalidate).
- `/api/revalidate` verifica la firma del webhook antes de invalidar
  nada: la ruta es pública y sin esa comprobación cualquiera podría
  tirar la caché a voluntad.

**Migración del contenido — `npm run seed`**

`scripts/seed-sanity.ts` sube a Sanity el contenido que vive en
`src/content/defaults.ts`, junto con los assets reales de `public/images/`
(fondo del Hero, video de 1080p y las 6 fotos de la galería).

```
npm run seed              # crea lo que falte; no pisa lo existente
npm run seed -- --force   # sobrescribe los documentos que ya existan
npm run seed -- --dry-run # muestra el plan sin escribir nada
```

- Usa un cliente de **escritura** propio (`SANITY_API_TOKEN`, `useCdn:
  false`), distinto del cliente público de solo lectura del sitio.
- Es seguro correrlo varias veces: los 6 documentos son singletons con
  `_id` fijo, así que `createOrReplace` nunca duplica; y sin `--force`
  ni siquiera toca los que ya existen, para no pisar ediciones hechas en
  el Studio. Los assets los deduplica Sanity por hash de contenido.
- **La galería se sube con las 6 fotos reales, sin duplicar.** La
  duplicación a 12 slides sigue existiendo pero solo como *fallback* del
  componente (ver `defaultImages` en `Galeria.tsx`), para cuando Sanity
  no devuelve imágenes.

`src/content/defaults.ts` es la **única fuente de verdad** del contenido
migrable, y por eso es TypeScript plano sin React ni imports de Next: lo
consumen tanto los componentes (como fallback) como el script (que corre
en Node con `tsx`). Si los defaults vivieran dentro de los componentes
—como defaults de desestructuración— el script no podría leerlos y
habría que transcribirlos a mano.

> **Ojo al probar en local:** después de correr el seed, un `npm run
> build` a secas **puede seguir mostrando el contenido viejo**. Las
> entradas de `fetch` con `force-cache` persisten en `.next/cache` entre
> builds, así que el build reutiliza la respuesta cacheada de cuando el
> dataset estaba vacío. Borrar `.next` y reconstruir. En producción esto
> no aplica: de eso se encarga el webhook con `revalidateTag`.

**Configuración externa pendiente (no es código)**

1. **Orígenes CORS** en Sanity Manage → API → CORS origins: hay que
   añadir `http://localhost:3000` (dev) y el dominio de producción. Sin
   esto el Studio carga pero muestra "Connect this Studio to your
   project" en vez del editor.
2. **Webhook** en Sanity Manage → API → Webhooks, apuntando a
   `https://<dominio>/api/revalidate`, POST, dataset `production`, con
   el mismo secreto que `SANITY_REVALIDATE_SECRET`.

## Video del Hero

El CTA "Ver Recorrido" del Hero abre un `VideoLightbox` con el video del
departamento. Hay **dos archivos** y solo uno va al repo:

- `public/images/Videos/sfvideo-1080p.mp4` (~9.8 MB) — **el que se
  sirve**, y el default de `videoSrc` en `Hero.tsx`. 1080p, H.264,
  ~766 kbps, con `+faststart` para que empiece a reproducir sin
  descargar el archivo completo. Sí se commitea.
- `public/images/Videos/sfvideo.mp4` (98 MB) — master 4K original del
  cliente. **Gitignoreado a propósito**: 98 MB rozan el límite duro de
  100 MB por archivo de GitHub y quedarían en el historial para siempre.
  Guardarlo aparte (Drive del cliente), no en el repo.

El video no tiene pista de audio y el `<video>` va `muted`, así que los
reencodes usan `-an`. Para regenerar la versión web desde el master:

```
ffmpeg -i sfvideo.mp4 -vf scale=-2:1080 -c:v libx264 -b:v 750k \
  -preset slower -pix_fmt yuv420p -pass 1 -an -f null /dev/null
ffmpeg -i sfvideo.mp4 -vf scale=-2:1080 -c:v libx264 -b:v 750k \
  -preset slower -pix_fmt yuv420p -pass 2 -movflags +faststart -an \
  sfvideo-1080p.mp4
```

## Estructura relevante

```
sanity.config.ts           # config del Studio embebido (raíz, la pide Sanity)
src/
  app/
    layout.tsx        # fuentes (balimo, saltyAges) + scroll-smooth
    page.tsx           # Server Component: fetch a Sanity + composición
    globals.css         # @theme: tokens de color y tipografía (Tailwind v4)
    api/
      contact/route.ts    # POST del formulario -> Resend
      revalidate/route.ts # webhook de Sanity -> revalidateTag
    studio/[[...tool]]/   # Studio de Sanity en /studio
  components/
    AnimatedSection.tsx  # fade in + translateY al entrar al viewport (Framer Motion)
    icons/               # CrestIcon, ChevronIcon, ArrowIcon, InstagramIcon:
                         # SVG inline reutilizables (currentColor)
    sections/           # Hero, Distintivos, Galeria, ModelosDepartamentos,
                         # Recorrido360, Contacto, Footer
  fonts/                 # balimo-regular-webfont.*, salty_ages-webfont.*
  lib/
    fonts.ts             # next/font/local
    contactValidation.ts # reglas compartidas cliente/servidor del form
    sanity/              # client.ts, image.ts, queries.ts (GROQ tipadas)
  sanity/
    env.ts               # projectId / dataset / apiVersion
    schemas/             # un schema por sección + index.ts
```
