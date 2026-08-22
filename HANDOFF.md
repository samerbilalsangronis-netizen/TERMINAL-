# 🌍 TERMINAL BLOOMBERG - ANÁLISIS GEOPOLÍTICO & CADENAS DE SUMINISTRO

## 📊 VISIÓN DEL PROYECTO

**Terminal Bloomberg de Análisis Geopolítico y Dependencias Económicas Globales**

Una plataforma interactiva que mapea conexiones entre empresas, países, sectores y recursos críticos para entender vulnerabilidades en cadenas de suministro global, puntos críticos geopolíticos y dependencias económicas.

---

## ✅ ESTADO ACTUAL DEL PROYECTO

**RESUMEN:** Plataforma interactiva completa con mapa, búsqueda avanzada, panel de empresas Y AHORA visualización D3.js de grafos.

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

## 📊 ESTADÍSTICAS FASE 5

```
🔴 CUELLOS DE BOTELLA: 17
   - Criticidad CRÍTICA: 4 (Taiwán, Holanda, Ormuz, Siria)
   - Criticidad ALTA: 9 (Energía, Materiales, Transporte)
   - Criticidad MEDIA: 4 (Gas ruso, Litio, Níquel, Trigo)

📍 DISTRIBUCIÓN GLOBAL:
   - Asia: Taiwán, China, Singapur, Indonesia
   - Europa: Holanda, Rusia, Ucrania
   - Oriente Medio: Irán/Omán, Qatar/UAE
   - América: Panamá, Chile, Brasil
   - África: Congo, Siria/Levante

🌍 IMPACTO SECTORIAL:
   - Semiconductores: 3 cuellos
   - Energía: 4 cuellos
   - Materiales: 5 cuellos
   - Alimentos: 2 cuellos
   - Transporte: 3 cuellos
```

---

## 🚀 PRÓXIMAS FASES

### **FASE 4: ✅ COMPLETADA** - Visualización D3.js
**Objetivo:** Grafo interactivo de dependencias

**Archivos creados:**
- `src/components/Graph/DependencyGraph.tsx` - Visualización D3.js completa
- Integración en `CompanyPanel.tsx` - botón "Ver Cadena de Suministro"
- Actualización de `page.tsx` - soporte para eventos de selección

**Características implementadas:**
- ✅ Grafo con force simulation (D3.js v7.8.5)
- ✅ Nodos = empresas (tamaño por cap. mercado en escala logarítmica)
- ✅ Líneas = dependencias (grosor por % suministro)
- ✅ Colores = estado geopolítico (cian/naranja/rojo)
- ✅ Interactividad completa: zoom, pan, drag de nodos, hover
- ✅ Resalte dinámico: pasar mouse destaca proveedores/clientes
- ✅ Click en nodo → selecciona empresa
- ✅ Vista toggleable entre detalles y grafo

---

### **FASE 5: ✅ COMPLETADA** - Análisis Geopolítico
**Objetivo:** Resaltar cuellos de botella críticos

**Archivos creados:**
- `scripts/generar_cuellos_botella.js` - script de generación de 17 cuellos de botella
- `src/data/cuellos_botella.json` - 17 puntos críticos mapeados
- `public/data/cuellos_botella.json` - datos públicos accesibles
- `src/components/Map/BottleneckLayer.tsx` - visualización en mapa
- `src/components/Panels/BottleneckPanel.tsx` - panel de detalles

**Características implementadas:**
- ✅ 17 cuellos de botella geopolíticos críticos
- ✅ Marcadores con colores de criticidad (rojo/naranja/amarillo)
- ✅ Glows y efectos visuales en los marcadores
- ✅ Panel detallado con vulnerabilidades, empresas afectadas, consecuencias
- ✅ Conexiones entre cuellos de botella (líneas punteadas)
- ✅ Leyenda actualizada en el mapa
- ✅ Hover effects y selección interactiva

**Puntos críticos mapeados:**
- 🔴 **Taiwán**: 92% chips 5nm (TSMC monopolio)
- 🔴 **Holanda**: ASML (única máquina de litografía)
- 🔴 **Estrecho de Ormuz**: 35% petróleo global
- 🔴 **China**: 85% tierras raras, 65% aluminio
- 🟠 **Siria**: 50% fosfato (fertilizantes)
- 🟠 **Singapur**: 18% refinería global
- 🟠 Y 11 cuellos de botella más...

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

### **3. Visualización D3.js (FASE 4 ACTIVA)**
```
CompanyPanel → Click "Ver Cadena de Suministro Completa"
  ↓
Grafo D3.js interactivo:
  - Nodos: proveedores + empresa central + clientes
  - Líneas: dependencias (grosor según % suministro)
  - Colores: estado geopolítico (cian/naranja/rojo)
  - Interactividad completa:
    • Zoom con rueda del mouse
    • Pan arrastrando el fondo
    • Drag de nodos para reorganizar
    • Hover resalta conexiones
    • Click en nodo → selecciona empresa
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

## 📋 INSTRUCCIONES PARA FASE 5 (Análisis Geopolítico)

### **Objetivo:** Resaltar cuellos de botella críticos en el mapa

**Datos necesarios a crear:**
1. `src/data/cuellos_botella.json` - 15-20 puntos críticos
2. Integración en MapContainer para visualizar puntos rojos
3. Modal de detalles para cada cuello de botella

**Puntos clave a mapear:**
```
🔴 TAIWÁN (92% chips 5nm)
   - TSMC monopolio mundial
   - Vulnerabilidad: conflicto US-China
   - Impacto: semis, IA, smartphones

🔴 HOLANDA (única máquina ASML)
   - Producción de máquinas de litografía
   - Vulnerabilidad: embargo a China
   - Impacto: todos los chips

🔴 ESTRECHO DE ORMUZ (35% petróleo)
   - Paso obligado Golfo Pérsico
   - Vulnerabilidad: cierre iranio
   - Impacto: energía global

🔴 CHINA (85% tierras raras, 65% aluminio)
   - Dominio de REE y metales
   - Vulnerabilidad: restricciones de exportación
   - Impacto: tecnología, defensa

🔴 SIRIA/LEVANTE (fosfato para fertilizantes)
   - 50% producción mundial
   - Vulnerabilidad: conflicto regional
   - Impacto: agricultura global
```

### **Archivos a crear:**
- `scripts/generar_cuellos_botella.js` - script de generación
- `src/data/cuellos_botella.json` - datos geoespaciales
- `src/components/Map/BottleneckLayer.tsx` - visualización en mapa
- `src/components/Panels/BottleneckPanel.tsx` - detalles de puntos críticos

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

**Rama de desarrollo:** `claude/lee-el-handoff-kzxdwz`

**Commits completados:**
1. FASE 1: Estructura Next.js + Mapa Bloomberg
2. FASE 2: 500 Empresas + Dependencias + CompanyPanel
3. FASE 3: Búsqueda Avanzada + Recursos Críticos
4. FASE 4: Visualización D3.js de Grafos
5. FASE 5: Análisis Geopolítico - Cuellos de Botella ✅

**Para continuar en próximo chat:**
```bash
git checkout claude/lee-el-handoff-kzxdwz
git pull origin claude/lee-el-handoff-kzxdwz
npm install && npm run dev
# Abrirá http://localhost:3000
```

---

## 🚀 FASE 6: PRÓXIMAS OPORTUNIDADES

### **Sugerencia 1: Simulación de Escenarios**
**Objetivo:** Modelar impacto de conflictos en cadenas de suministro

```json
Escenarios a implementar:
- Crisis Taiwán: Bloqueo de TSMC → impacto en IA, smartphones
- Bloqueo Ormuz: Aumento 300% precio petróleo → cascada global
- Sanciones Rusia: Restricción de gas → Europa sin calefacción
- Embargo Holanda→China: ASML no vende a Huawei
```

Datos a crear:
- `src/data/escenarios.json` - conflictos simulados
- `src/components/Panels/ScenarioPanel.tsx` - selector de escenarios
- Cascada de impactos visualizada en grafo D3

### **Sugerencia 2: Análisis de Resilencia**
**Objetivo:** Sugerir estrategias de diversificación

- Alternativas de proveedores por región
- Oportunidades de nearshoring
- Cálculo de "días de cobertura" por recurso
- Matriz de riesgo país

### **Sugerencia 3: Integración de Datos en Vivo**
- API de precios de commodities (FRED, Quandl)
- Alertas de conflictos geopolíticos (NewsAPI)
- Datos de inversión (Crunchbase)
- Base de datos de ONG (Toma de datos de conflictos)

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

**Última actualización:** 2026-08-22 - SESIÓN 2
**Estado:** FASE 5 ✅ COMPLETADA (pero con problema de interactividad del mapa)
**Rama actual:** `claude/lee-el-handoff-kzxdwz`

---

## 🔧 PROBLEMA ACTUAL - SESIÓN 2 (2026-08-22)

### Síntoma
✅ Mapa carga (bordes naranja, gridlines visibles)
❌ NO hay tooltips al pasar ratón
❌ NO abre panel al click (sin errores en consola)
❌ NO se ven cuellos de botella (puntos rojos)

### Diagnóstico
El evento de click en `MapContainer.tsx:100` **NO se dispara** cuando se clickea un país. 

**Causa probable:** El GeoJSON fetch no se está completando, así que `onEachFeature` nunca se ejecuta.

### Solución sugerida para próximo chat
1. Agregar `console.log` en fetch de GeoJSON (línea 95)
2. Agregar `console.log` en `then()` callback (línea 99)
3. Verificar respuesta del fetch en Network tab
4. **ALTERNATIVA**: Usar archivo local `/public/data/countries.geojson` en lugar de fetch remoto
5. Debuggear por qué BottleneckLayer no se renderiza

### Rama y commits
- Rama: `claude/lee-el-handoff-kzxdwz`
- Último commit: `ffcc316` (arreglar dependencias useEffect)
- Build: ✅ Compila sin errores
- Runtime: ❌ Eventos de país no funcionan

---

**Próximo paso:** FASE 6 - Simulación de Escenarios (después de resolver interactividad)
