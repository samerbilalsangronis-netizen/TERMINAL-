// Genera src/data/dependencias.json a partir de scripts/dependencias_reales_data.js
// (relaciones de cadena de suministro reales y documentadas), resolviendo
// nombre → id contra src/data/empresas_500.json ya generado.

const fs = require('fs');
const path = require('path');
const relaciones = require('./dependencias_reales_data');

const empresasPath = path.join(__dirname, '..', 'src', 'data', 'empresas_500.json');
const empresas = JSON.parse(fs.readFileSync(empresasPath, 'utf-8'));
const porNombre = new Map(empresas.map((e) => [e.nombre, e.id]));

const result = [];
const faltantes = new Set();

relaciones.forEach((r) => {
  const idA = porNombre.get(r.a);
  const idB = porNombre.get(r.b);
  if (!idA) faltantes.add(r.a);
  if (!idB) faltantes.add(r.b);
  if (!idA || !idB) return;

  result.push({
    id: `${idA}-${idB}`,
    empresa_a: idA,
    empresa_b: idB,
    tipo: 'proveedor',
    porcentaje_suministro: r.porcentaje,
    es_critica: r.critica,
    descripcion: r.desc,
  });
});

if (faltantes.size > 0) {
  console.warn('⚠️  Empresas no encontradas en empresas_500.json (dependencia omitida):', [...faltantes]);
}

const OUT = path.join(__dirname, '..', 'src', 'data', 'dependencias.json');
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
console.log(`✅ ${result.length} dependencias reales generadas en ${OUT} (${relaciones.length - result.length} omitidas)`);
