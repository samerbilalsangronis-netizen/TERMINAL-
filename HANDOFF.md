# 🌍 TERMINAL BLOOMBERG - ANÁLISIS GEOPOLÍTICO & CADENAS DE SUMINISTRO

## 📊 VISIÓN DEL PROYECTO

**Terminal Bloomberg de Análisis Geopolítico y Dependencias Económicas Globales**

Una plataforma interactiva que mapea conexiones entre empresas, países, sectores y recursos críticos para entender vulnerabilidades en cadenas de suministro global, puntos críticos geopolíticos y dependencias económicas.

**Ejemplo Real:**
- Usuario selecciona **EEUU** en el mapa
- Ve todas las empresas tech clave (Apple, Nvidia, Intel, Tesla, etc.)
- Hace click en **Nvidia**
- Aparecen líneas visuales hacia **TSMC** (Taiwán) → **ASML** (Holanda)
- Muestra: "Nvidia depende de TSMC para chips, TSMC depende de ASML para máquinas de litografía"
- Si busca "IMANES" aparecen empresas que los fabrican, importan, exportan

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### 1. **Mapa Interactivo (Bloomberg Style)**
- Mapa mundial con océanos azul oscuro, continentes negros
- **Bordes de países en NARANJA** (no azul)
- Click en país → Panel contextual con información
- Zoom y panorámica fluida
- Gridlines sutiles

### 2. **Panel de País**
Al seleccionar un país (ej: Canadá):
```
┌─────────────────────────────────────┐
│ CANADÁ                              │
├─────────────────────────────────────┤
│ EMPRESAS CLAVE (Top 20)             │
│ - Shopify (Tech/E-commerce)         │
│ - Bombardier (Manufactura)          │
│ - Potash Corp (Minerales)           │
│                                     │
│ EXPORTACIONES CRÍTICAS              │
│ - Aluminio → EEUU (70%)             │
│ - Uranio → Francia (40%)            │
│ - Potasa → China (30%)              │
│                                     │
│ IMPORTACIONES CRÍTICAS              │
│ - Componentes Tech → China (50%)    │
│ - Petróleo → OPEC (20%)             │
└─────────────────────────────────────┘
```

### 3. **Panel de Empresa**
Al seleccionar empresa (ej: Nvidia):
```
┌─────────────────────────────────────┐
│ NVIDIA (EEUU)                       │
├─────────────────────────────────────┤
│ SECTOR: Semiconductores             │
│ CAP. MERCADO: $1.2T                 │
│                                     │
│ RESUMEN TRIMESTRAL (Q3 2024)        │
│ - Ingresos: $18.1B (+93% YoY)       │
│ - Beneficio Neto: $9.2B             │
│ - Márgenes: 50.8%                   │
│                                     │
│ PROVEEDORES CRÍTICOS (Dependencias) │
│ ↓ TSMC (Taiwan) - Manufactura       │
│ ↓ ASML (Holanda) - Equipamiento     │
│ ↓ SK Hynix (Korea) - Memoria        │
│                                     │
│ CLIENTES PRINCIPALES (Dependientes) │
│ → Meta (30% ingresos)               │
│ → Microsoft (25% ingresos)          │
│ → Google (20% ingresos)             │
│                                     │
│ RECURSOS CRÍTICOS DEPENDIDOS        │
│ - Silicio (EEUU, China)             │
│ - Litio (Chile, China, Argentina)   │
│ - Cobre (Chile, Perú)               │
└─────────────────────────────────────┘
```

### 4. **Buscador Global**
Búsqueda: "IMANES"
```
RESULTADOS:
┌─ EMPRESAS QUE FABRICAN IMANES
│  - Hitachi Metals (Japón)
│  - Shin-Etsu (Japón)
│  - Molycorp (EEUU)
│
├─ EMPRESAS QUE IMPORTAN IMANES
│  - Tesla (EEUU) - 10,000 ton/año
│  - Apple (EEUU) - 5,000 ton/año
│  - BMW (Alemania) - 8,000 ton/año
│
├─ CADENAS DE SUMINISTRO
│  China → (fabricación) → Japón → (procesamiento)
│  → EEUU (importación)
│
└─ RECURSOS CRÍTICOS
   Tierra Rara (Lantanoides) 
   - China: 85% producción global
   - Myanmar: 10% producción
```

### 5. **Análisis de Vulnerabilidad Geopolítica**
**Modo: "CONFLICTO IRAN/EEUU"**
```
┌─────────────────────────────────────┐
│ 🔴 CUELLOS DE BOTELLA CRÍTICOS      │
├─────────────────────────────────────┤
│                                     │
│ ESTRECHO DE ORMUZ (RIESGO: ALTO)   │
│ ↑ 35% del petróleo global pasa aquí
│ ↑ Interrución = +$100/barril        │
│ ↑ Empresas afectadas: Exxon, BP,   │
│   Saudi Aramco, Shell              │
│                                     │
│ TAIWÁN (RIESGO: MUY ALTO)          │
│ ↑ 92% de semiconductores de 5nm    │
│ ↑ Interrución = paraliza Tech Global
│ ↑ Empresas afectadas: Apple, Nvidia,
│   AMD, Intel, TSMC                 │
│                                     │
│ HOLANDA - MAQUINARIA (RIESGO: ALTO)
│ ↑ 60% de máquinas de litografía (ASML)
│ ↑ Interrución = paraliza fab de chips
│ ↑ Empresas afectadas: TSMC, Samsung
│                                     │
└─────────────────────────────────────┘
```

---

## 📈 ARQUITECTURA DE DATOS

### **Tablas Principales (JSON por ahora, Supabase luego)**

```
paises/
├── id: string
├── nombre: string
├── region: string
├── gdp: number
├── industrias_clave: array
└── embargo_status: "none" | "partial" | "complete"

empresas/
├── id: string
├── nombre: string
├── ticker: string
├── pais_id: string
├── sector: string (Tech, Manufactura, Energía, etc.)
├── subsector: string
├── cap_mercado: number
├── ubicacion_hq: {lat, lon}
├── resumen_trimestral: {...}
└── estado_geopolitico: "normal" | "riesgo" | "critico"

dependencias/
├── id: string
├── empresa_a: string (que depende)
├── empresa_b: string (proveedor)
├── tipo: "proveedor" | "cliente" | "complementaria"
├── porcentaje_suministro: number (% que A depende de B)
├── es_critica: boolean
└── alternativas: array

recursos_criticos/
├── id: string
├── nombre: string (Litio, Cobre, Tierra Rara, Petróleo, etc.)
├── principales_productores: array
├── dependencia_global: percentage
├── precio_actual: number
└── volatilidad: "baja" | "media" | "alta"

comercio_internacional/
├── id: string
├── pais_exportador: string
├── pais_importador: string
├── recurso: string
├── volumen_anual: number
├── valor: number
├── empresa_exportadora: string (opcional)
└── empresa_importadora: string (opcional)

cuellos_botella/
├── id: string
├── nombre: string
├── ubicacion: {lat, lon}
├── tipo: "geografico" | "logistico" | "politico"
├── porcentaje_comercio_global: number
├── riesgo_nivel: "bajo" | "medio" | "alto" | "critico"
├── empresas_afectadas: array
└── conflictos_asociados: array
```

---

## 🔍 FLUJO DE USUARIO

### **Escenario 1: Exploración por País**
1. Usuario abre app → ve mapa mundo
2. Hace hover sobre país → muestra nombre
3. Click en **EEUU** → aparece panel lateral derecho con:
   - Top 20 empresas tech/manufactura
   - Exportaciones principales
   - Importaciones principales
   - Recursos críticos que produce
4. Hacer click en empresa → abre panel empresa completo

### **Escenario 2: Búsqueda Global**
1. Usuario escribe en buscador: "IMANES"
2. Sistema busca en: nombres de empresas, productos, recursos
3. Muestra resultados:
   - Empresas que fabrican
   - Empresas que compran
   - Empresas que transportan
   - Cadenas de suministro completas
4. Al seleccionar una empresa, ve dependencias

### **Escenario 3: Análisis de Conflicto**
1. Usuario activa modo "Iran/EEUU Conflict"
2. Mapa resalta en **rojo** cuellos de botella críticos:
   - Estrecho de Ormuz
   - Taiwán
   - Holanda (ASML)
3. Líneas rojas conectan conflicto con empresas afectadas
4. Panel muestra impacto económico estimado

---

## 🛠️ STACK TECNOLÓGICO

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Leaflet.js (mapa base)
- D3.js o Cytoscape.js (grafos de dependencias)
- Zustand (state management)

**Backend:**
- Next.js API Routes (funciones serverless)
- Datos JSON mock (en `/public/data`) inicialmente
- Luego: Supabase PostgreSQL

**Deploy:**
- Vercel (connected to GitHub)

**Database (Fase 2):**
- Supabase PostgreSQL

---

## 📂 ESTRUCTURA DEL PROYECTO

```
TERMINAL/
├── public/
│   └── data/
│       ├── paises.json
│       ├── empresas.json
│       ├── dependencias.json
│       ├── recursos_criticos.json
│       ├── comercio_internacional.json
│       └── cuellos_botella.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── empresas/[id].ts
│   │       ├── paises/[id].ts
│   │       ├── search.ts
│   │       └── dependencias.ts
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx
│   │   │   ├── MapControls.tsx
│   │   │   └── CountryPopup.tsx
│   │   ├── Panels/
│   │   │   ├── CountryPanel.tsx
│   │   │   ├── CompanyPanel.tsx
│   │   │   └── SearchPanel.tsx
│   │   ├── Graph/
│   │   │   ├── DependencyGraph.tsx
│   │   │   └── ConnectionLine.tsx
│   │   └── Header/
│   │       └── TerminalHeader.tsx
│   ├── hooks/
│   ├── utils/
│   └── types/
│       └── index.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 FASES DE DESARROLLO

### **FASE 1: MVP (Esta Semana)**
- [ ] Estructura Next.js básica
- [ ] Mapa Bloomberg (naranja en bordes)
- [ ] Datos JSON mock (500 empresas)
- [ ] Panel de país funcional
- [ ] Búsqueda básica

### **FASE 2: Dependencias (Semana 2)**
- [ ] Panel de empresa con datos trimestrales
- [ ] Visualización de dependencias (D3.js)
- [ ] Líneas de conexión entre países/empresas
- [ ] API endpoints para dependencias

### **FASE 3: Análisis Avanzado (Semana 3)**
- [ ] Búsqueda inteligente (imanes, recursos, etc.)
- [ ] Modo conflicto geopolítico
- [ ] Resalte de cuellos de botella
- [ ] Análisis de cadenas de suministro

### **FASE 4: Integración Supabase (Semana 4)**
- [ ] Migrar datos JSON a Supabase
- [ ] APIs dinámicas
- [ ] Usuarios y autenticación

### **FASE 5: Deploy (Semana 5)**
- [ ] Deploy en Vercel
- [ ] Optimizaciones de performance
- [ ] Analytics

---

## 🎨 DISEÑO VISUAL

**Colores (Bloomberg Terminal Style):**
- Fondo: `#0a0a0a` (Negro)
- Océanos: `#001a33` (Azul marino oscuro)
- Continentes: `#0a0a0a` (Negro)
- Bordes países: `#ff8c42` (Naranja) ← CAMBIO RESPECTO A AZUL
- Accent: `#00d4ff` (Cian)
- Cuellos de botella: `#ff3333` (Rojo)
- Header: Naranja `#ff8c42` con rojo `#d32f2f`

---

## 📝 NOTAS IMPORTANTES

1. **Datos Iniciales:** Comenzamos con JSON mock, fácil de migrar a Supabase
2. **Supabase:** Cuando pagues cuenta nueva, solo conectamos las APIs
3. **Rendimiento:** Con 500 empresas + dependencias, necesitamos lazy loading
4. **Búsqueda:** Full-text search importante para "IMANES", "Semiconductores", etc.
5. **Actualizaciones:** Resúmenes trimestrales de empresas deben ser actualizables

---

## 🔗 REFERENCIAS

- Bloomberg Terminal (estética)
- Network graph visualization (D3.js / Cytoscape)
- Global supply chain data sources (futura investigación)

---

**Última actualización:** 2025-08-22
**Estado:** En desarrollo - Fase 1 iniciando
