# 🌍 TERMINAL BLOOMBERG - ANÁLISIS GEOPOLÍTICO & CADENAS DE SUMINISTRO

## 📊 VISIÓN DEL PROYECTO

**Terminal Bloomberg de Análisis Geopolítico y Dependencias Económicas Globales**

Una plataforma interactiva que mapea conexiones entre empresas, países, sectores y recursos críticos para entender vulnerabilidades en cadenas de suministro global, puntos críticos geopolíticos y dependencias económicas.

---

## ✅ ESTADO ACTUAL DEL PROYECTO

### **FASE 1: ✅ COMPLETADA** - Estructura Base
- ✅ Next.js 14 con TypeScript
- ✅ Mapa Bloomberg (Leaflet.js) con bordes **NARANJA**
- ✅ Header, Componentes, Styling
- ✅ 11 países iniciales

**Archivos creados:**
- `src/app/layout.tsx`, `page.tsx`
- `src/components/Header/TerminalHeader.tsx`
- `src/components/Map/MapContainer.tsx`
- `src/styles/globals.css`, `tailwind.config.js`

---

### **FASE 2: ✅ COMPLETADA** - Dataset Masivo + Dependencias
- ✅ **500 empresas reales** (20 países, 10 sectores)
- ✅ **340 dependencias** entre empresas (30.6% críticas)
- ✅ Datos trimestrales realistas
- ✅ CompanyPanel con detalles completos

**Archivos creados:**
- `src/data/empresas_500.json` (500 empresas)
- `src/data/dependencias.json` (340 relaciones)
- `src/components/Panels/CompanyPanel.tsx`
- `scripts/generar_empresas.js`
- `scripts/generar_dependencias.js`

**Datos:**
```
📦 500 EMPRESAS:
  - NVIDIA, TSMC, ASML, Apple, Microsoft, etc.
  - 10 sectores: Semiconductores, Software, Automotriz, etc.
  - Estados: normal, riesgo, crítico

🔗 340 DEPENDENCIAS:
  - Nvidia → TSMC → ASML (cadena crítica)
  - Samsung → múltiples proveedores
  - 104 clasificadas como CRÍTICAS
```

---

### **FASE 3: ✅ COMPLETADA** - Búsqueda Avanzada de Recursos
- ✅ **15 recursos críticos** (IMANES, LITIO, COBALTO, SEMICONDUCTORES, etc.)
- ✅ **2,821 relaciones empresa-recurso**
- ✅ Panel de búsqueda inteligente
- ✅ Resultados agrupados por tipo de relación

**Archivos creados:**
- `src/data/recursos_criticos.json` (15 recursos)
- `src/data/recursos_empresa.json` (2,821 relaciones)
- `src/components/Panels/AdvancedSearchPanel.tsx`
- `scripts/generar_recursos_empresa.js`

**Búsqueda en acción:**
```
Usuario busca: "IMANES"
↓
Sistema encuentra: 15 recursos críticos

Panel muestra:
✏️ FABRICAN (7 empresas) - Hitachi, Shin-Etsu, etc.
📥 IMPORTAN (12 empresas) - Apple, Tesla, BMW
📤 EXPORTAN (25 empresas) - Ingresos $500M/año
🔗 DEPENDEN (18 empresas) - Criticidad: 45-78%
```

---

## 🚀 PRÓXIMAS FASES

### **FASE 4: Visualización D3.js (PENDIENTE)**
**Objetivo:** Grafo interactivo de dependencias

Componentes a crear:
- `DependencyGraph.tsx` - Visualización D3.js
- `ConnectionLine.tsx` - Líneas entre nodos
- Interactividad: hover, zoom, click

Características:
- Nodos = empresas (tamaño por cap. mercado)
- Líneas = dependencias (grosor por % suministro)
- Colores = estado geopolítico
- Click en empresa → resalta proveedores/clientes

---

### **FASE 5: Análisis Geopolítico (PENDIENTE)**
**Objetivo:** Resaltar cuellos de botella críticos

Datos necesarios:
- `cuellos_botella.json` (ya parcialmente definido)
- Modo "Conflicto Iran/EEUU"
- Líneas rojas para puntos críticos

Puntos clave a mapear:
- 🔴 **Taiwán**: 92% chips 5nm (TSMC monopolio)
- 🔴 **Holanda**: ASML (única máquina de litografía)
- 🔴 **Estrecho de Ormuz**: 35% petróleo global
- 🔴 **China**: 85% tierras raras, 65% aluminio

---

## 📂 ESTRUCTURA DEL PROYECTO

```
TERMINAL/
├── public/
│   └── data/ (generado automáticamente)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Map/
│   │   │   └── MapContainer.tsx
│   │   ├── Panels/
│   │   │   ├── CountryPanel.tsx
│   │   │   ├── CompanyPanel.tsx
│   │   │   ├── SearchPanel.tsx
│   │   │   └── AdvancedSearchPanel.tsx ⭐ NUEVO
│   │   └── Header/
│   │       └── TerminalHeader.tsx
│   ├── data/
│   │   ├── paises.json
│   │   ├── empresas_500.json ⭐ GENERADO
│   │   ├── dependencias.json ⭐ GENERADO
│   │   ├── recursos_criticos.json ⭐ NUEVO
│   │   └── recursos_empresa.json ⭐ GENERADO
│   ├── types/
│   ├── styles/
│   └── hooks/
├── scripts/
│   ├── generar_empresas.js
│   ├── generar_dependencias.js
│   └── generar_recursos_empresa.js ⭐ NUEVO
├── HANDOFF.md (este archivo)
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

---

## 🎯 FLUJO DE USUARIO ACTUAL

### **1. Exploración por País**
```
Mapa → Click País (ej: EEUU)
  ↓
Panel muestra:
  - Top 25 empresas del país
  - Sectores clave
  - Exportaciones/Importaciones
  ↓
Click en Empresa → CompanyPanel completo
```

### **2. Búsqueda Global**
```
Buscador → "IMANES"
  ↓
AdvancedSearchPanel muestra:
  - Info del recurso (precio, volatilidad, productores)
  - 7 fabricantes
  - 12 importadores
  - 25 exportadores
  - 18 dependientes
  ↓
Click en empresa → CompanyPanel
```

### **3. Próximo: Visualización D3.js (FASE 4)**
```
Seleccionar empresa → Grafo dinámico
  - Nodos: proveedores + empresa + clientes
  - Líneas: dependencias (grosor = %)
  - Colores: estado geopolítico
  - Interactividad: hover, zoom, click
```

---

## 🔧 CÓMO CONTINUAR EN EL PRÓXIMO CHAT

### **Paso 1: Verificar Estado**
```bash
git status
git log --oneline -5
```

### **Paso 2: Ver Datos Generados**
```bash
wc -l src/data/*.json
# Debería ver:
# - empresas_500.json: ~14,000 líneas
# - dependencias.json: ~1,400 líneas
# - recursos_empresa.json: ~8,000 líneas
```

### **Paso 3: Ejecutar la App**
```bash
npm run dev
# Abrirá http://localhost:3000
```

### **Paso 4: Testear**
- ✅ Click en un país → Panel de país
- ✅ Click en una empresa → CompanyPanel
- ✅ Buscar "IMANES" → AdvancedSearchPanel
- ✅ Ver proveedores críticos resaltados

### **Paso 5: Continuar FASE 4**
Ver abajo: "INSTRUCCIONES PARA FASE 4"

---

## 📋 INSTRUCCIONES PARA FASE 4 (D3.js)

### **Archivos a crear:**

1. **`src/components/Graph/DependencyGraph.tsx`**
```typescript
// Componente principal de grafo D3.js
// Props: companyId, dependencias[]
// Muestra nodos y líneas interactivas
```

2. **`src/components/Graph/ConnectionLine.tsx`**
```typescript
// Línea SVG entre dos empresas
// Props: empresa_a, empresa_b, porcentaje
// Color según criticidad
```

3. **Integración en `page.tsx`:**
```typescript
// Agregar DependencyGraph al CompanyPanel
// Mostrar cuando se selecciona empresa
```

### **Librerías necesarias:**
```bash
npm install d3 @types/d3
# O usar Cytoscape.js como alternativa
```

### **Data que necesitarás:**
- ✅ `empresas_500.json` (ya existe)
- ✅ `dependencias.json` (ya existe)
- Solo necesitas conectarlas en D3

---

## 💾 DATOS GENERADOS AUTOMÁTICAMENTE

Si necesitas **regenerar datos**, ejecuta:

```bash
# Regenerar 500 empresas
node scripts/generar_empresas.js

# Regenerar 340 dependencias
node scripts/generar_dependencias.js

# Regenerar 2,821 relaciones empresa-recurso
node scripts/generar_recursos_empresa.js
```

**Nota:** Los scripts son idempotentes (pueden ejecutarse sin riesgo)

---

## 📊 ESTADÍSTICAS ACTUALES

```
📦 EMPRESAS: 500
   - 20 países
   - 10 sectores
   - Cap mercado: $10B - $3.5T

🔗 DEPENDENCIAS: 340
   - Críticas: 104 (30.6%)
   - Promedio: 2-3 proveedores por empresa

💰 RECURSOS: 15
   - Relaciones: 2,821
   - Distribución:
     • 610 fabrican
     • 543 importan
     • 1,240 exportan
     • 428 dependen

🌍 COBERTURA:
   - EEUU, China, Japón, Corea, Taiwán
   - Alemania, Holanda, Reino Unido, Francia
   - Canadá, Australia, Nueva Zelanda
   - + 8 países adicionales
```

---

## 🔐 RAMA GIT

**Rama de desarrollo:** `claude/ui-ux-pro-max-cli-install-k1wbdb`

**Commits recientes:**
1. FASE 1: Estructura Next.js + Mapa Bloomberg
2. FASE 2: 500 Empresas + Dependencias + CompanyPanel
3. FASE 3: Búsqueda Avanzada + Recursos Críticos

**Para empezar nuevo chat:**
```bash
git checkout claude/ui-ux-pro-max-cli-install-k1wbdb
git pull origin claude/ui-ux-pro-max-cli-install-k1wbdb
```

---

## 🎨 DISEÑO VISUAL

**Colores Bloomberg Terminal:**
- Fondo: `#0a0a0a`
- Océanos: `#001a33`
- Continentes: `#0a0a0a`
- **Bordes países: `#ff8c42` (NARANJA)**
- Accent: `#00d4ff` (Cian)
- Crítico: `#ff3333` (Rojo)
- Header: Naranja + Rojo

**Tipografía:**
- Terminal: `-apple-system, BlinkMacSystemFont, Segoe UI`
- Mono: `Courier New` para precios/valores

---

## 📝 NOTAS IMPORTANTES

1. **Datos JSON:** Están diseñados para ser fáciles de actualizar manualmente o mediante scripts
2. **Supabase:** Cuando se pague la cuenta, solo hay que cambiar las rutas de datos
3. **Performance:** Con 500 empresas, considerar lazy loading si crece
4. **Búsqueda:** Full-text search actualmente es básico pero funcional
5. **D3.js:** Para FASE 4, el grafo debe ser fluido con zoom/pan

---

## 🔗 REFERENCIAS ÚTILES

- Bloomberg Terminal (estética visual)
- Global Supply Chain Data (investigar fuentes públicas)
- D3.js Documentation: https://d3js.org
- Cytoscape.js (alternativa a D3): https://cytoscape.org

---

**Última actualización:** 2025-08-22
**Estado:** FASE 3 Completa - Listo para FASE 4
**Siguiente paso:** Visualización D3.js de grafos de dependencia
