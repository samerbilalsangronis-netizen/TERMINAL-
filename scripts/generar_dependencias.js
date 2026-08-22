// Script para generar dependencias realistas entre empresas

const fs = require('fs');
const empresas = JSON.parse(fs.readFileSync('./src/data/empresas_500.json', 'utf-8'));

const tiposDependencia = {
  'Semiconductores': {
    'Equipamiento': 0.8,  // Alta probabilidad que dependa de equipamiento
    'Manufacturar': 0.6,
    'Telecomunicaciones': 0.4,
  },
  'Software y Nube': {
    'Semiconductores': 0.7,
    'Telecomunicaciones': 0.6,
  },
  'Electrónica de Consumo': {
    'Semiconductores': 0.9,
    'Manufactura': 0.8,
    'Logística': 0.5,
  },
  'Automotriz': {
    'Semiconductores': 0.9,
    'Manufactura': 0.8,
    'Energía': 0.6,
  },
  'Manufactura': {
    'Minería y Recursos': 0.7,
    'Equipamiento': 0.6,
  },
};

function generarDependencias() {
  const dependencias = [];
  const mapaEmpresas = {};

  // Crear mapa rápido de empresas por sector
  empresas.forEach(empresa => {
    if (!mapaEmpresas[empresa.sector]) {
      mapaEmpresas[empresa.sector] = [];
    }
    mapaEmpresas[empresa.sector].push(empresa);
  });

  // Para cada empresa, generar dependencias
  empresas.forEach((empresa, idx) => {
    const sectorDependencias = tiposDependencia[empresa.sector] || {};

    // Generar 1-4 dependencias por empresa
    const numDependencias = Math.floor(1 + Math.random() * 4);

    Object.entries(sectorDependencias).forEach(([sectorProveedor, probabilidad]) => {
      if (Math.random() < probabilidad && numDependencias > dependencias.filter(d => d.empresa_a === empresa.id).length) {
        const proveedoresDisponibles = mapaEmpresas[sectorProveedor] || [];

        if (proveedoresDisponibles.length > 0) {
          const proveedor = proveedoresDisponibles[Math.floor(Math.random() * proveedoresDisponibles.length)];

          const dependencia = {
            id: `${empresa.id}-${proveedor.id}`,
            empresa_a: empresa.id,
            empresa_b: proveedor.id,
            tipo: 'proveedor',
            porcentaje_suministro: 5 + Math.random() * 85,
            es_critica: Math.random() > 0.7,
            descripcion: `${empresa.nombre} depende de ${proveedor.nombre} para ${empresa.subsector.toLowerCase()}`,
          };

          dependencias.push(dependencia);
        }
      }
    });
  });

  return dependencias;
}

// Generar dependencias
const dependencias = generarDependencias();

// Guardar
const outputPath = './src/data/dependencias.json';
fs.writeFileSync(outputPath, JSON.stringify(dependencias, null, 2));

console.log(`✅ ${dependencias.length} dependencias generadas`);
console.log(`📊 Guardado en: ${outputPath}`);

// Estadísticas
const criticas = dependencias.filter(d => d.es_critica).length;
const porcentajeCriticas = ((criticas / dependencias.length) * 100).toFixed(1);

console.log(`\n📈 Estadísticas:`);
console.log(`  Total de dependencias: ${dependencias.length}`);
console.log(`  Críticas: ${criticas} (${porcentajeCriticas}%)`);

// Top empresas más dependientes
const dependenciaPorEmpresa = {};
dependencias.forEach(d => {
  if (!dependenciaPorEmpresa[d.empresa_a]) {
    dependenciaPorEmpresa[d.empresa_a] = 0;
  }
  dependenciaPorEmpresa[d.empresa_a]++;
});

const topDependientes = Object.entries(dependenciaPorEmpresa)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log(`\n🏢 Top 10 empresas más dependientes:`);
topDependientes.forEach(([empresaId, count], idx) => {
  const empresa = empresas.find(e => e.id === empresaId);
  console.log(`  ${idx + 1}. ${empresa.nombre} (${count} dependencias)`);
});

// Top proveedores más críticos
const proveedorCritico = {};
dependencias.filter(d => d.es_critica).forEach(d => {
  if (!proveedorCritico[d.empresa_b]) {
    proveedorCritico[d.empresa_b] = 0;
  }
  proveedorCritico[d.empresa_b]++;
});

const topProveedores = Object.entries(proveedorCritico)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log(`\n🔴 Top 10 proveedores críticos:`);
topProveedores.forEach(([empresaId, count], idx) => {
  const empresa = empresas.find(e => e.id === empresaId);
  console.log(`  ${idx + 1}. ${empresa.nombre} (${count} dependientes críticos)`);
});
