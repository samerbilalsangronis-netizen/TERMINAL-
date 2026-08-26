// Genera src/data/empresas_500.json a partir de scripts/empresas_reales_data.js
// (lista curada de empresas reales). Reemplaza el generador anterior basado
// en nombres aleatorios (generar_empresas.js, ya no se usa).
//
// Las cifras financieras (cap_mercado, resumen_trimestral) son estimaciones
// ILUSTRATIVAS generadas por rango según el tamaño real de cada empresa
// (tier), no datos financieros oficiales en vivo.

const fs = require('fs');
const path = require('path');
const curadas = require('./empresas_reales_data');
const indiceUS = require('./sp500_nasdaq100_data');

// El índice (S&P 500 / Nasdaq-100) es nombre/ticker/sector/sede reales pero
// sin dependencias curadas a mano; si un ticker ya está en la lista curada
// (con sus dependencias reales), se descarta la versión del índice para no
// duplicar la empresa.
const tickersCurados = new Set(curadas.map((e) => e.ticker))
const empresas = [...curadas, ...indiceUS.filter((e) => !tickersCurados.has(e.ticker))]

// Empresas cuyo estado geopolítico refleja un riesgo real y documentado
// (dependencia de un solo proveedor, sanciones, tensión geopolítica activa).
const ESTADO_OVERRIDE = {
  'TSMC': 'critico',
  'ASML': 'critico',
  'Huawei': 'critico',
  'ZTE': 'critico',
  'National Iranian Oil Company': 'critico',
  'Iran Khodro': 'critico',
  'SMIC': 'riesgo',
  'Hua Hong Semiconductor': 'riesgo',
  'Samsung Electronics': 'riesgo',
  'MediaTek': 'riesgo',
  'UMC': 'riesgo',
  'China Northern Rare Earth': 'riesgo',
  'Zijin Mining': 'riesgo',
}

const TIER_RANGES = {
  mega: { capMin: 200e9, capMax: 3.5e12, ingresosMin: 15e9, ingresosMax: 100e9, margenMin: 15, margenMax: 45 },
  large: { capMin: 30e9, capMax: 200e9, ingresosMin: 3e9, ingresosMax: 20e9, margenMin: 8, margenMax: 35 },
  mid: { capMin: 3e9, capMax: 30e9, ingresosMin: 0.3e9, ingresosMax: 4e9, margenMin: 5, margenMax: 30 },
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function slugTicker(nombre, ticker, usedIds) {
  let base = (ticker && ticker !== 'PRIVADA' && ticker !== 'ESTATAL')
    ? ticker.split('.')[0].replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    : nombre.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8)
  let id = base
  let suffix = 1
  while (usedIds.has(id)) {
    id = `${base}${suffix}`
    suffix++
  }
  usedIds.add(id)
  return id
}

function generarEstadoGeopolitico(nombre) {
  if (ESTADO_OVERRIDE[nombre]) return ESTADO_OVERRIDE[nombre]
  const r = Math.random()
  if (r > 0.93) return 'critico'
  if (r > 0.80) return 'riesgo'
  return 'normal'
}

function generarResumenTrimestral(tier) {
  const range = TIER_RANGES[tier]
  const ingresos = rand(range.ingresosMin, range.ingresosMax)
  const margen = rand(range.margenMin, range.margenMax)
  return {
    trimestre: 'Q3 2024',
    ingresos: Math.floor(ingresos),
    beneficio_neto: Math.floor(ingresos * (margen / 100)),
    margenes: parseFloat(margen.toFixed(1)),
    yoy_crecimiento: parseFloat((-10 + Math.random() * 60).toFixed(1)),
  }
}

const usedIds = new Set()
const result = empresas.map((e) => {
  const range = TIER_RANGES[e.tier]
  const id = slugTicker(e.nombre, e.ticker, usedIds)
  return {
    id,
    nombre: e.nombre,
    ticker: (e.ticker === 'PRIVADA' || e.ticker === 'ESTATAL') ? id : e.ticker.split('.')[0],
    pais_id: e.pais_id,
    sector: e.sector,
    subsector: e.subsector,
    cap_mercado: Math.floor(rand(range.capMin, range.capMax)),
    ubicacion_hq: { lat: e.coords[0], lon: e.coords[1] },
    resumen_trimestral: generarResumenTrimestral(e.tier),
    estado_geopolitico: generarEstadoGeopolitico(e.nombre),
    descripcion: e.descripcion,
  }
})

const OUT = path.join(__dirname, '..', 'src', 'data', 'empresas_500.json')
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n')

// Reporte de distribución
const porPais = {}
result.forEach((e) => { porPais[e.pais_id] = (porPais[e.pais_id] || 0) + 1 })
console.log(`✅ ${result.length} empresas reales generadas en ${OUT}`)
console.log('Distribución por país:', porPais)
