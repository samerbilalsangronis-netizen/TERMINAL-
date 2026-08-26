// Genera supabase/seed.sql a partir de los JSON en src/data/.
// Correr con: node scripts/generar_seed_sql.js
// El resultado se pega y corre en el SQL Editor de Supabase (después de schema.sql).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_FILE = path.join(__dirname, '..', 'supabase', 'seed.sql');
const BATCH_SIZE = 200;

function sqlStr(value) {
  if (value === null || value === undefined) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNum(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'null';
  return String(value);
}

function sqlBool(value) {
  return value ? 'true' : 'false';
}

function sqlJson(value) {
  const json = JSON.stringify(value ?? {});
  return `'${json.replace(/'/g, "''")}'::jsonb`;
}

function insertBatches(table, columns, rows, rowToValues) {
  if (rows.length === 0) return '';
  const parts = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = batch.map((row) => `  (${rowToValues(row).join(', ')})`).join(',\n');
    parts.push(
      `insert into ${table} (${columns.join(', ')}) values\n${values}\non conflict (id) do nothing;`
    );
  }
  return parts.join('\n\n');
}

function load(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8'));
}

const paises = load('paises.json');
const empresas = load('empresas_500.json');
const dependencias = load('dependencias.json');
const recursosCriticos = load('recursos_criticos.json');
const recursosEmpresa = load('recursos_empresa.json');
const cuellosBotella = load('cuellos_botella.json');

const sections = [];

sections.push('-- Generado por scripts/generar_seed_sql.js — no editar a mano.');
sections.push('-- Correr después de schema.sql en el SQL Editor de Supabase.\n');

sections.push('-- ===== paises =====');
sections.push(insertBatches(
  'paises',
  ['id', 'nombre', 'codigo', 'region', 'gdp', 'poblacion', 'industrias_clave', 'embargo_status', 'coordenadas'],
  paises,
  (p) => [
    sqlStr(p.id), sqlStr(p.nombre), sqlStr(p.codigo), sqlStr(p.region),
    sqlNum(p.gdp), sqlNum(p.poblacion), sqlJson(p.industrias_clave),
    sqlStr(p.embargo_status), sqlJson(p.coordenadas),
  ]
));

sections.push('\n-- ===== empresas =====');
sections.push(insertBatches(
  'empresas',
  ['id', 'nombre', 'ticker', 'pais_id', 'sector', 'subsector', 'cap_mercado', 'ubicacion_hq', 'resumen_trimestral', 'estado_geopolitico', 'descripcion'],
  empresas,
  (e) => [
    sqlStr(e.id), sqlStr(e.nombre), sqlStr(e.ticker), sqlStr(e.pais_id),
    sqlStr(e.sector), sqlStr(e.subsector), sqlNum(e.cap_mercado),
    sqlJson(e.ubicacion_hq), sqlJson(e.resumen_trimestral),
    sqlStr(e.estado_geopolitico), sqlStr(e.descripcion),
  ]
));

sections.push('\n-- ===== dependencias =====');
sections.push(insertBatches(
  'dependencias',
  ['id', 'empresa_a', 'empresa_b', 'tipo', 'porcentaje_suministro', 'es_critica', 'descripcion'],
  dependencias,
  (d) => [
    sqlStr(d.id), sqlStr(d.empresa_a), sqlStr(d.empresa_b), sqlStr(d.tipo),
    sqlNum(d.porcentaje_suministro), sqlBool(d.es_critica), sqlStr(d.descripcion),
  ]
));

sections.push('\n-- ===== recursos_criticos =====');
sections.push(insertBatches(
  'recursos_criticos',
  ['id', 'nombre', 'tipo', 'descripcion', 'principales_productores', 'dependencia_global', 'precio_actual', 'volatilidad'],
  recursosCriticos,
  (r) => [
    sqlStr(r.id), sqlStr(r.nombre), sqlStr(r.tipo), sqlStr(r.descripcion),
    sqlJson(r.principales_productores), sqlNum(r.dependencia_global),
    sqlNum(r.precio_actual), sqlStr(r.volatilidad),
  ]
));

sections.push('\n-- ===== recursos_empresa =====');
sections.push(insertBatches(
  'recursos_empresa',
  ['id', 'empresa_id', 'recurso_id', 'tipo', 'volumen_anual', 'porcentaje_produccion_global', 'descripcion'],
  recursosEmpresa,
  (r) => [
    sqlStr(r.id), sqlStr(r.empresa_id), sqlStr(r.recurso_id), sqlStr(r.tipo),
    sqlNum(r.volumen_anual), sqlNum(r.porcentaje_produccion_global), sqlStr(r.descripcion),
  ]
));

sections.push('\n-- ===== cuellos_botella =====');
sections.push(insertBatches(
  'cuellos_botella',
  ['id', 'nombre', 'pais', 'latitud', 'longitud', 'tipo', 'criticidad', 'porcentaje_global', 'impacto_sectores', 'descripcion', 'vulnerabilidades', 'empresas_afectadas', 'consecuencias_si_falla', 'color'],
  cuellosBotella,
  (c) => [
    sqlStr(c.id), sqlStr(c.nombre), sqlStr(c.pais), sqlNum(c.latitud), sqlNum(c.longitud),
    sqlStr(c.tipo), sqlStr(c.criticidad), sqlNum(c.porcentaje_global),
    sqlJson(c.impacto_sectores), sqlStr(c.descripcion), sqlJson(c.vulnerabilidades),
    sqlJson(c.empresas_afectadas), sqlStr(c.consecuencias_si_falla), sqlStr(c.color),
  ]
));

fs.writeFileSync(OUT_FILE, sections.join('\n') + '\n');

console.log(`✅ ${OUT_FILE} generado:`);
console.log(`   ${paises.length} países, ${empresas.length} empresas, ${dependencias.length} dependencias,`);
console.log(`   ${recursosCriticos.length} recursos críticos, ${recursosEmpresa.length} relaciones recurso-empresa,`);
console.log(`   ${cuellosBotella.length} cuellos de botella`);
