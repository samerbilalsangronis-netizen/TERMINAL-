// Script para generar relaciones entre empresas y recursos críticos

const fs = require('fs');
const empresas = JSON.parse(fs.readFileSync('./src/data/empresas_500.json', 'utf-8'));
const recursos = JSON.parse(fs.readFileSync('./src/data/recursos_criticos.json', 'utf-8'));

const recursoSectorMap = {
  'IMANES': ['Manufactura', 'Automotriz', 'Electrónica de Consumo', 'Equipamiento'],
  'LITIO': ['Automotriz', 'Energía', 'Manufactura', 'Electrónica de Consumo'],
  'COBALTO': ['Manufactura', 'Energía', 'Automotriz'],
  'COBRE': ['Manufactura', 'Energía', 'Telecomunicaciones', 'Automotriz'],
  'SEMICONDUCTORES_CHIPS': ['Electrónica de Consumo', 'Software y Nube', 'Automotriz', 'Telecomunicaciones'],
  'PETROLEO': ['Energía', 'Transporte', 'Manufactura'],
  'GAS_NATURAL': ['Energía', 'Manufactura', 'Telecomunicaciones'],
  'SILICIO': ['Semiconductores', 'Manufactura', 'Energía'],
  'ALUMINIO': ['Automotriz', 'Manufactura', 'Aviación', 'Construcción'],
  'ORO': ['Electrónica de Consumo', 'Manufactura', 'Joyería'],
  'PANTALLAS_OLED': ['Electrónica de Consumo', 'Manufactura'],
  'BATERIAS_LITIO': ['Automotriz', 'Energía', 'Electrónica de Consumo'],
  'MEMORIA_DRAM': ['Semiconductores', 'Electrónica de Consumo', 'Software y Nube'],
  'SSD_NAND': ['Semiconductores', 'Electrónica de Consumo', 'Software y Nube'],
};

const tiposRelacion = ['fabrica', 'importa', 'exporta', 'depende'];

function generarRelacionesRecursos() {
  const relaciones = [];

  recursos.forEach(recurso => {
    const sectoresRelevantes = recursoSectorMap[recurso.id] || [];

    // Empresas que FABRICAN
    const fabricantes = empresas.filter(e =>
      sectoresRelevantes.includes(e.sector) &&
      e.cap_mercado > 10e9 &&
      Math.random() > 0.7
    );

    fabricantes.forEach(emp => {
      relaciones.push({
        id: `${emp.id}-${recurso.id}-fabrica`,
        empresa_id: emp.id,
        recurso_id: recurso.id,
        tipo: 'fabrica',
        volumen_anual: Math.floor(Math.random() * 100000),
        porcentaje_produccion_global: Math.random() * 15,
        descripcion: `${emp.nombre} fabrica ${recurso.nombre.toLowerCase()}`
      });
    });

    // Empresas que IMPORTAN
    const importadores = empresas.filter(e =>
      sectoresRelevantes.includes(e.sector) &&
      !fabricantes.find(f => f.id === e.id) &&
      Math.random() > 0.6
    );

    importadores.forEach(emp => {
      relaciones.push({
        id: `${emp.id}-${recurso.id}-importa`,
        empresa_id: emp.id,
        recurso_id: recurso.id,
        tipo: 'importa',
        volumen_anual: Math.floor(Math.random() * 50000),
        costo_anual: Math.floor(Math.random() * 500e6),
        proveedor_principal: recurso.principales_productores[0].pais,
        descripcion: `${emp.nombre} importa ${recurso.nombre.toLowerCase()}`
      });
    });

    // Empresas que EXPORTAN (principalmente de países productores)
    const exportadores = empresas.filter(e =>
      recurso.principales_productores.some(p =>
        p.pais === 'China' || p.pais === 'Chile' || p.pais === 'Congo'
      ) &&
      Math.random() > 0.75
    );

    exportadores.forEach(emp => {
      relaciones.push({
        id: `${emp.id}-${recurso.id}-exporta`,
        empresa_id: emp.id,
        recurso_id: recurso.id,
        tipo: 'exporta',
        volumen_anual: Math.floor(Math.random() * 150000),
        ingresos_anuales: Math.floor(Math.random() * 2e9),
        destinos_principales: ['EEUU', 'Unión Europea', 'Japón'],
        descripcion: `${emp.nombre} exporta ${recurso.nombre.toLowerCase()}`
      });
    });

    // Empresas que DEPENDEN
    const dependientes = empresas.filter(e =>
      sectoresRelevantes.includes(e.sector) &&
      !fabricantes.find(f => f.id === e.id) &&
      !importadores.find(i => i.id === e.id) &&
      Math.random() > 0.5
    );

    dependientes.forEach(emp => {
      relaciones.push({
        id: `${emp.id}-${recurso.id}-depende`,
        empresa_id: emp.id,
        recurso_id: recurso.id,
        tipo: 'depende',
        porcentaje_dependencia: 20 + Math.random() * 60,
        criticidad: Math.random() > 0.7 ? 'critica' : 'normal',
        alternativas_disponibles: Math.random() > 0.6 ? 1 : 3,
        descripcion: `${emp.nombre} depende de ${recurso.nombre.toLowerCase()}`
      });
    });
  });

  return relaciones;
}

const relaciones = generarRelacionesRecursos();

const outputPath = './src/data/recursos_empresa.json';
fs.writeFileSync(outputPath, JSON.stringify(relaciones, null, 2));

console.log(`✅ ${relaciones.length} relaciones empresa-recurso generadas`);
console.log(`📊 Guardado en: ${outputPath}`);

// Estadísticas
const porTipo = {};
relaciones.forEach(r => {
  if (!porTipo[r.tipo]) porTipo[r.tipo] = 0;
  porTipo[r.tipo]++;
});

console.log('\n📈 Distribución por tipo:');
Object.entries(porTipo).forEach(([tipo, count]) => {
  console.log(`  ${tipo.toUpperCase()}: ${count}`);
});

// Top recursos más relacionados
const recursoCount = {};
relaciones.forEach(r => {
  if (!recursoCount[r.recurso_id]) recursoCount[r.recurso_id] = 0;
  recursoCount[r.recurso_id]++;
});

const topRecursos = Object.entries(recursoCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

console.log(`\n🔝 Top 5 recursos más críticos:`);
topRecursos.forEach(([recursoId, count], idx) => {
  const recurso = recursos.find(r => r.id === recursoId);
  console.log(`  ${idx + 1}. ${recurso.nombre} (${count} relaciones)`);
});
