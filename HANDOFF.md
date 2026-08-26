# 🌍 TERMINAL BLOOMBERG - ANÁLISIS GEOPOLÍTICO & CADENAS DE SUMINISTRO

## 📊 VISIÓN DEL PROYECTO

Plataforma interactiva tipo Bloomberg Terminal que mapea conexiones entre empresas, países, sectores y recursos críticos para entender vulnerabilidades en cadenas de suministro global y puntos críticos geopolíticos.

**Producción:** `terminal-chi-one.vercel.app` (deploy automático desde `main`)
**Repo:** `samerbilalsangronis-netizen/TERMINAL-`

---

## ✅ ESTADO ACTUAL (última sesión: 2026-08-26)

Todo lo de abajo está en `main` y desplegado en producción.

### Cambio de arquitectura grande: datos en Supabase, no JSON estático

La app ya **no lee `/public/data/*.json` en runtime** (excepto `countries.geojson`, que sigue siendo estático porque es solo geometría de bordes). Todos los `fetch('/data/...')` se reemplazaron por queries a Supabase (`src/lib/supabase.ts`, cliente único). Los JSON en `src/data/` siguen existiendo como **fuente de verdad editable** — de ahí se generan los `INSERT` que se corren en Supabase.

- Proyecto Supabase: `sbuzmkpfxlcvrjusfofm` (cuenta personal del usuario, no vinculada a su GitHub)
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ya configuradas en Vercel y en `.env.local` local)
- Esquema: `supabase/schema.sql` (6 tablas: `paises`, `empresas`, `dependencias`, `recursos_criticos`, `recursos_empresa`, `cuellos_botella`; RLS habilitado con policy de solo lectura para el rol `anon`)
- **Para actualizar datos:** regenerar el JSON correspondiente en `src/data/`, correr `node scripts/generar_seed_sql.js` (produce `supabase/seed/*.sql`), y pegar/correr esos archivos en el SQL Editor de Supabase. El editor de Supabase **tiene un límite de tamaño por query** — por eso el seed sale partido en archivos chicos por tabla, no uno solo gigante.
- Si hay que reemplazar datos existentes (no solo agregar), correr `supabase/00_limpiar.sql` primero. **Importante:** Postgres no deja truncar una tabla individual si hay una FK apuntando a ella, aunque la tabla referenciante esté vacía — hay que truncar todas las tablas relacionadas en una sola sentencia (`truncate table a, b, c cascade;`), no una por una.

### Dataset: 184 empresas **reales** (ya no son inventadas)

El dataset original (Fase 2, sesiones anteriores) generaba nombres de empresa combinando palabras al azar — nunca tuvo NVIDIA, Meta, AMD ni ningún nombre real, pese a que el HANDOFF viejo decía "500 empresas reales". Se reemplazó por completo:

- **184 empresas reales y reconocibles** (NVIDIA, TSMC, ASML, Apple, Samsung, Meta, AMD, Huawei, Toyota, Tesla, BMW, Alibaba, Infosys, Vale, etc.), curadas a mano en `scripts/empresas_reales_data.js`
- Distribución **geográfica realista, no pareja a propósito**: EEUU (40), China (22), Japón (16), Alemania/Taiwán/India (11 c/u)... hasta Nueva Zelanda (2) y Tailandia (3) — forzar 500 parejo habría significado inventar nombres para países que no tienen esa cantidad de empresas globales reales en estos sectores
- **66 dependencias reales y documentadas** (`scripts/dependencias_reales_data.js`): Apple→TSMC, TSMC→ASML, Huawei→SMIC (tras sanciones de EEUU), Tesla→Panasonic, etc. — ya no son 340 combinaciones aleatorias
- **91 relaciones empresa-recurso reales** (`scripts/recursos_empresa_reales_data.js`) — ya no son 2,821 combinaciones aleatorias
- **Las cifras financieras (cap_mercado, ingresos trimestrales) siguen siendo estimaciones ilustrativas** generadas por rango según el tamaño real de cada empresa (mega/large/mid tier) — no hay acceso a datos financieros oficiales en vivo. Esto se le explicó al usuario y lo aceptó conscientemente.
- Scripts viejos (`generar_empresas.js`, `generar_dependencias.js`, `generar_recursos_empresa.js`) se dejaron sin tocar como referencia histórica, ya no se usan. Los nuevos son `generar_empresas_reales.js`, `generar_dependencias_reales.js`, `generar_recursos_empresa_reales.js` — todos resuelven nombre→id contra `empresas_500.json` ya generado, así que **siempre correr `generar_empresas_reales.js` primero**.
- `paises.json` tiene 21 países (se completaron 10 que faltaban en una sesión anterior — antes solo había 11 y la mitad de las empresas mostraba "Desconocido" como país)

### Fase 5 (cuellos de botella geopolíticos): completa, viene de una rama huérfana

En una sesión anterior, otro chat de Claude había completado la Fase 5 (17 cuellos de botella, colores del mapa invertidos, interactividad de países) en una rama (`claude/lee-el-handoff-kzxdwz`) que **nunca se mergeó a `main`**. Esta sesión encontró y mergeó ese trabajo. Lección: si abres un chat nuevo y el sitio en producción se ve "atrasado" respecto a lo que otro chat hizo, probablemente el trabajo quedó en una rama sin mergear — revisar `git branch -a` y comparar con `main` antes de asumir que hay que rehacer algo.

- `src/components/Map/BottleneckLayer.tsx`, `src/components/Panels/BottleneckPanel.tsx`
- Colores del mapa: océano negro puro (filtro CSS `brightness(0)` sobre `.leaflet-tile-pane`, porque el color real viene de las tiles de CartoDB, no del CSS del container), países en gris `#4a4a4a`, bordes naranja `#ff8c42`
- GeoJSON de países servido localmente (`public/data/countries.geojson`), no desde GitHub remoto

### Mapa de red por sector (reemplaza la lista de 10 empresas por país)

Al hacer click en un país, en vez de una lista plana capada a 10 empresas, se ve un **grafo de fuerza D3** (`src/components/Graph/CountrySectorTree.tsx`): el país al centro, ramas de colores por sector (con conteo), cada empresa como un chip clickeable en la punta que abre `CompanyPanel`. Muestra **todas** las empresas del país (no solo 10), y los sectores se arman dinámicamente desde los datos — si se agregan más empresas o sectores nuevos, el árbol los levanta solo. Auto-encuadra el zoom al terminar de acomodarse la simulación de fuerzas.

### Tráfico marítimo en vivo (AISStream)

Botón "🚢 Tráfico Marítimo en Vivo" en el mapa (`src/components/Map/VesselLayer.tsx`). Conecta por WebSocket a `wss://stream.aisstream.io/v0/stream` (API gratuita) y muestra buques en movimiento dentro de cajas delimitadoras alrededor de Ormuz, Malaca, Singapur y Panamá.

- API key en `NEXT_PUBLIC_AISSTREAM_API_KEY` (Vercel + `.env.local`) — pública por diseño (se embebe en el bundle del cliente, como recomienda el propio patrón de esta app), pero **nunca se commitea al repo**. Si no está configurada, cada visitante puede pegar su propia key gratuita desde la UI (se guarda solo en su navegador).
- **Límite real:** AISStream permite máximo 3 conexiones simultáneas por key/cuenta. Con tráfico concurrente alto, los visitantes después del 3° verán error. Para escalar esto haría falta un backend propio (ej. una Edge Function de Supabase) que mantenga una sola conexión y la retransmita a todos los visitantes vía Realtime — no implementado.
- **Bug real encontrado y corregido:** el WebSocket se cerraba y reabría en loop apenas conectaba ("WebSocket is closed before the connection is established"), en cualquier red/navegador. La causa no era la red ni la key: `onStatusChange` se pasaba como función inline en el JSX de `MapContainer.tsx`, se recreaba en cada render, y como el `useEffect` de `VesselLayer` depende de esa función, cada actualización de estado (conectando→conectado) mataba el socket recién abierto. Se arregló memoizando el callback con `useCallback`. Mismo patrón se corrigió en `BottleneckLayer` (reconstruía todas las capas del mapa en cada render).

### Otras correcciones de esta sesión

- **Bug de stacking CSS real:** el `<div id="map">` (Leaflet, `position:relative` sin `z-index` propio) no creaba su propio *stacking context*, así que los panes internos de Leaflet (z-index hasta 9999/10000) se "escapaban" y se pintaban por encima de cualquier modal/overlay de la app. Fix: agregar `isolate` al contenedor del mapa. Si se agregan más overlays/modales sobre el mapa en el futuro y aparecen "detrás" del mapa sin explicación, este es el primer sospechoso.
- Reloj UTC en vivo en el header (reemplaza el texto estático "Custom Map")
- `DependencyGraph.tsx`: los nodos ahora muestran el nombre de la empresa (antes mostraba el ticker crudo), leyenda de colores, tooltip flotante con posicionamiento corregido

---

## 🗂️ ESTRUCTURA ACTUAL

```
TERMINAL/
├── src/
│   ├── app/page.tsx, layout.tsx
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx       (mapa Leaflet + tráfico marítimo + toggle AIS)
│   │   │   ├── BottleneckLayer.tsx    (cuellos de botella geopolíticos)
│   │   │   └── VesselLayer.tsx        (buques en vivo vía AISStream)
│   │   ├── Graph/
│   │   │   ├── DependencyGraph.tsx    (cadena de suministro de una empresa)
│   │   │   └── CountrySectorTree.tsx  (mapa de red: país → sectores → empresas)
│   │   ├── Panels/
│   │   │   ├── CompanyPanel.tsx, CountryPanel.tsx, SearchPanel.tsx
│   │   │   ├── AdvancedSearchPanel.tsx, BottleneckPanel.tsx
│   │   └── Header/TerminalHeader.tsx  (reloj UTC, buscador, tabs Map/Table/News)
│   ├── lib/supabase.ts                (cliente único de Supabase)
│   ├── data/*.json                    (fuente de verdad editable, YA NO se lee en runtime)
│   └── types/index.ts
├── scripts/
│   ├── empresas_reales_data.js, dependencias_reales_data.js,
│   │   recursos_empresa_reales_data.js   (listas curadas, EDITAR ACÁ)
│   ├── generar_empresas_reales.js, generar_dependencias_reales.js,
│   │   generar_recursos_empresa_reales.js (nombre→id, escriben src/data/*.json)
│   ├── generar_seed_sql.js            (src/data/*.json → supabase/seed/*.sql)
│   └── generar_empresas.js, generar_dependencias.js,
│       generar_recursos_empresa.js    (VIEJOS, ya no se usan — dataset inventado)
├── supabase/
│   ├── schema.sql                     (correr una sola vez, crea las tablas)
│   ├── 00_limpiar.sql                 (trunca antes de recargar con datos nuevos)
│   └── seed/*.sql                     (generado, correr en el SQL Editor)
├── .env.local (gitignorado), .env.example (plantilla)
└── HANDOFF.md (este archivo)
```

---

## 🔧 CÓMO CONTINUAR EN EL PRÓXIMO CHAT

```bash
git checkout claude/repo-visual-details-p8zogw   # o main, están sincronizadas
git pull
npm install
npm run dev   # http://localhost:3000
```

**Nota sobre pruebas en sandbox:** el entorno de ejecución de Claude Code (esta sesión) tiene restricciones de red que bloquean fetches del navegador (Chromium/Playwright) hacia hosts externos no permitidos (CartoDB, y a veces Supabase/AISStream desde el navegador, aunque `curl` desde bash sí funciona). Si algo "no carga" al probarlo con Playwright en sandbox pero el código y los datos están verificados por `curl`/API directa, probablemente es la red del sandbox, no un bug real — confirmar interceptando la respuesta con `page.route()` y datos mock antes de asumir que el código está roto.

**Estado de las cuentas externas:**
- Supabase y AISStream son cuentas personales del usuario, no conectadas a su GitHub — cualquier cambio de key/URL hay que pedírselo directamente, no se puede gestionar por integración.
- No hay acceso a la dashboard de Vercel desde el chat — cualquier variable de entorno nueva hay que pedirle al usuario que la agregue manualmente y haga redeploy.

---

## 💡 PENDIENTE / IDEAS SIN DECIDIR

- **Botón "Table" del header:** decorativo, nunca tuvo contenido (viene así desde la Fase 1). Se le sugirió al usuario una tabla comparativa ordenable de las 184 empresas (nombre, país, sector, cap. mercado, estado geopolítico, YoY) con click→CompanyPanel, pero no se decidió ni se implementó. Retomar esa conversación.
- **Botón "News":** también decorativo, sin discutir aún.
- **AISStream a escala:** si el tráfico concurrente crece, migrar a un backend propio (Supabase Edge Function) que centralice la conexión — ver nota arriba.
- **Bug preexistente menor:** 2 de las 500 empresas del dataset viejo compartían ticker por colisión aleatoria del generador — ya no aplica, el dataset nuevo (184 empresas reales) no tiene este problema.

---

## 🎨 DISEÑO VISUAL

- Fondo UI: `#0a0a0a` · Océano (mapa): negro puro · Países (mapa): `#4a4a4a` · Bordes: `#ff8c42` (naranja) · Accent: `#00d4ff` (cian) · Crítico: `#ff3333` (rojo)
- Tipografía: `-apple-system` / mono para cifras
- Paneles laterales: `CompanyPanel`/`AdvancedSearchPanel` 384px, `CountryPanel` 520px (necesita más espacio por el árbol de sectores)

---

**Última actualización:** 2026-08-26
**Rama actual:** `claude/repo-visual-details-p8zogw` (sincronizada con `main`, fast-forward, sin PRs pendientes)
