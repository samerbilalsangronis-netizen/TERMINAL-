// Genera src/data/recursos_empresa.json a partir de
// scripts/recursos_empresa_reales_data.js (relaciones reales/plausibles),
// resolviendo nombre → id contra src/data/empresas_500.json ya generado.

const fs = require('fs');
const path = require('path');
const relaciones = require('./recursos_empresa_reales_data');

const empresasPath = path.join(__dirname, '..', 'src', 'data', 'empresas_500.json');
const empresas = JSON.parse(fs.readFileSync(empresasPath, 'utf-8'));
const porNombre = new Map(empresas.map((e) => [e.nombre, e.id]));

const recursosPath = path.join(__dirname, '..', 'src', 'data', 'recursos_criticos.json');
const recursosIds = new Set(JSON.parse(fs.readFileSync(recursosPath, 'utf-8')).map((r) => r.id));

function rand(min, max) {
  return min + Math.random() * (max - min)
}

const result = [];
const faltantes = new Set();

relaciones.forEach((r) => {
  const empresaId = porNombre.get(r.empresa);
  if (!empresaId) { faltantes.add(r.empresa); return; }
  if (!recursosIds.has(r.recurso)) { faltantes.add(r.recurso); return; }

  result.push({
    id: `${empresaId}-${r.recurso}-${r.tipo}`,
    empresa_id: empresaId,
    recurso_id: r.recurso,
    tipo: r.tipo,
    volumen_anual: Math.floor(rand(1000, 500000)),
    porcentaje_produccion_global: r.porcentaje,
    descripcion: r.desc,
  });
});

if (faltantes.size > 0) {
  console.warn('⚠️  No encontrados (relación omitida):', [...faltantes]);
}

const OUT = path.join(__dirname, '..', 'src', 'data', 'recursos_empresa.json');
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
console.log(`✅ ${result.length} relaciones recurso-empresa reales generadas en ${OUT} (${relaciones.length - result.length} omitidas)`);
