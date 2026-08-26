// Genera supabase/seed/*.sql a partir de los JSON en src/data/.
// Correr con: node scripts/generar_seed_sql.js
// El SQL Editor de Supabase tiene un límite de tamaño por consulta, así que
// el seed se parte en varios archivos chicos en vez de uno solo grande.
// Correr en orden (00, 01, 02...) en el SQL Editor, uno por uno.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_DIR = path.join(__dirname, '..', 'supabase', 'seed');
const ROWS_PER_INSERT = 100; // filas por sentencia INSERT dentro de un archivo

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

function buildInsertSql(table, columns, rows, rowToValues) {
  const parts = [];
  for (let i = 0; i < rows.length; i += ROWS_PER_INSERT) {
    const batch = rows.slice(i, i + ROWS_PER_INSERT);
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

// Parte `rows` en archivos de máx. ~targetKb kilobytes cada uno (estimado a
// partir del tamaño del primer chunk) y los escribe como
// OUT_DIR/{prefix}_N_of_M.sql
function writeChunkedFiles(prefix, table, columns, rows, rowToValues, targetKb = 70) {
  if (rows.length === 0) return [];

  // Estimar filas por archivo a partir del tamaño de una muestra
  const sampleSize = Math.min(50, rows.length);
  const sampleSql = buildInsertSql(table, columns, rows.slice(0, sampleSize), rowToValues);
  const bytesPerRow = Buffer.byteLength(sampleSql, 'utf-8') / sampleSize;
  const rowsPerFile = Math.max(ROWS_PER_INSERT, Math.floor((targetKb * 1024) / bytesPerRow));

  const files = [];
  const totalFiles = Math.ceil(rows.length / rowsPerFile);
  for (let i = 0, fileIdx = 1; i < rows.length; i += rowsPerFile, fileIdx++) {
    const chunk = rows.slice(i, i + rowsPerFile);
    const sql = buildInsertSql(table, columns, chunk, rowToValues);
    const suffix = totalFiles > 1 ? `_${fileIdx}_de_${totalFiles}` : '';
    const filename = `${prefix}_${table}${suffix}.sql`;
    fs.writeFileSync(path.join(OUT_DIR, filename), `-- ${table}: filas ${i + 1}-${i + chunk.length} de ${rows.length}\n${sql}\n`);
    files.push(filename);
  }
  return files;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
// Limpiar archivos previos para no dejar restos de una corrida anterior
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith('.sql')) fs.unlinkSync(path.join(OUT_DIR, f));
}

const paises = load('paises.json');
const empresas = load('empresas_500.json');
const dependencias = load('dependencias.json');
const recursosCriticos = load('recursos_criticos.json');
const recursosEmpresa = load('recursos_empresa.json');
const cuellosBotella = load('cuellos_botella.json');

const allFiles = [];

allFiles.push(...writeChunkedFiles(
  '01', 'paises',
  ['id', 'nombre', 'codigo', 'region', 'gdp', 'poblacion', 'industrias_clave', 'embargo_status', 'coordenadas'],
  paises,
  (p) => [
    sqlStr(p.id), sqlStr(p.nombre), sqlStr(p.codigo), sqlStr(p.region),
    sqlNum(p.gdp), sqlNum(p.poblacion), sqlJson(p.industrias_clave),
    sqlStr(p.embargo_status), sqlJson(p.coordenadas),
  ]
));

allFiles.push(...writeChunkedFiles(
  '02', 'empresas',
  ['id', 'nombre', 'ticker', 'pais_id', 'sector', 'subsector', 'cap_mercado', 'ubicacion_hq', 'resumen_trimestral', 'estado_geopolitico', 'descripcion'],
  empresas,
  (e) => [
    sqlStr(e.id), sqlStr(e.nombre), sqlStr(e.ticker), sqlStr(e.pais_id),
    sqlStr(e.sector), sqlStr(e.subsector), sqlNum(e.cap_mercado),
    sqlJson(e.ubicacion_hq), sqlJson(e.resumen_trimestral),
    sqlStr(e.estado_geopolitico), sqlStr(e.descripcion),
  ]
));

allFiles.push(...writeChunkedFiles(
  '03', 'dependencias',
  ['id', 'empresa_a', 'empresa_b', 'tipo', 'porcentaje_suministro', 'es_critica', 'descripcion'],
  dependencias,
  (d) => [
    sqlStr(d.id), sqlStr(d.empresa_a), sqlStr(d.empresa_b), sqlStr(d.tipo),
    sqlNum(d.porcentaje_suministro), sqlBool(d.es_critica), sqlStr(d.descripcion),
  ]
));

allFiles.push(...writeChunkedFiles(
  '04', 'recursos_criticos',
  ['id', 'nombre', 'tipo', 'descripcion', 'principales_productores', 'dependencia_global', 'precio_actual', 'volatilidad'],
  recursosCriticos,
  (r) => [
    sqlStr(r.id), sqlStr(r.nombre), sqlStr(r.tipo), sqlStr(r.descripcion),
    sqlJson(r.principales_productores), sqlNum(r.dependencia_global),
    sqlNum(r.precio_actual), sqlStr(r.volatilidad),
  ]
));

allFiles.push(...writeChunkedFiles(
  '05', 'recursos_empresa',
  ['id', 'empresa_id', 'recurso_id', 'tipo', 'volumen_anual', 'porcentaje_produccion_global', 'descripcion'],
  recursosEmpresa,
  (r) => [
    sqlStr(r.id), sqlStr(r.empresa_id), sqlStr(r.recurso_id), sqlStr(r.tipo),
    sqlNum(r.volumen_anual), sqlNum(r.porcentaje_produccion_global), sqlStr(r.descripcion),
  ]
));

allFiles.push(...writeChunkedFiles(
  '06', 'cuellos_botella',
  ['id', 'nombre', 'pais', 'latitud', 'longitud', 'tipo', 'criticidad', 'porcentaje_global', 'impacto_sectores', 'descripcion', 'vulnerabilidades', 'empresas_afectadas', 'consecuencias_si_falla', 'color'],
  cuellosBotella,
  (c) => [
    sqlStr(c.id), sqlStr(c.nombre), sqlStr(c.pais), sqlNum(c.latitud), sqlNum(c.longitud),
    sqlStr(c.tipo), sqlStr(c.criticidad), sqlNum(c.porcentaje_global),
    sqlJson(c.impacto_sectores), sqlStr(c.descripcion), sqlJson(c.vulnerabilidades),
    sqlJson(c.empresas_afectadas), sqlStr(c.consecuencias_si_falla), sqlStr(c.color),
  ]
));

console.log(`✅ ${allFiles.length} archivos generados en supabase/seed/ (correr en orden):`);
allFiles.sort().forEach((f) => {
  const size = fs.statSync(path.join(OUT_DIR, f)).size;
  console.log(`   ${f}  (${(size / 1024).toFixed(1)} KB)`);
});
