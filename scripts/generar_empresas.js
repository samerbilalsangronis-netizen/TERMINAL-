// Script para generar 500+ empresas realistas con datos aleatorios pero coherentes

const fs = require('fs');

const paises = {
  'US': 'Estados Unidos',
  'CN': 'China',
  'TW': 'Taiwán',
  'JP': 'Japón',
  'KR': 'Corea del Sur',
  'DE': 'Alemania',
  'GB': 'Reino Unido',
  'NL': 'Países Bajos',
  'CA': 'Canadá',
  'AU': 'Australia',
  'SG': 'Singapur',
  'FR': 'Francia',
  'SE': 'Suecia',
  'CH': 'Suiza',
  'IL': 'Israel',
  'IN': 'India',
  'BR': 'Brasil',
  'MX': 'México',
  'NZ': 'Nueva Zelanda',
  'TH': 'Tailandia',
};

const sectores = [
  { nombre: 'Semiconductores', subsectores: ['Chips de IA', 'Memoria DRAM', 'Almacenamiento', 'Procesadores', 'GPUs', 'Microcontroladores'] },
  { nombre: 'Software y Nube', subsectores: ['Cloud Computing', 'IA y ML', 'Ciberseguridad', 'Analytics', 'ERP', 'SaaS'] },
  { nombre: 'Electrónica de Consumo', subsectores: ['Smartphones', 'Computadoras', 'Tablets', 'Wearables', 'Accesorios'] },
  { nombre: 'Equipamiento', subsectores: ['Máquinas de litografía', 'Equipamiento fab', 'Herramientas de test', 'Componentes especializados'] },
  { nombre: 'Automotriz', subsectores: ['Vehículos', 'Baterías EV', 'Semiconductores automotrices', 'Sistemas de conducción autónoma'] },
  { nombre: 'Manufactura', subsectores: ['Componentes electrónicos', 'Ensamble', 'Moldeado a presión', 'Fabricación de PCB'] },
  { nombre: 'Energía', subsectores: ['Paneles solares', 'Baterías', 'Petróleo y Gas', 'Energías renovables'] },
  { nombre: 'Minería y Recursos', subsectores: ['Litio', 'Cobalto', 'Cobre', 'Oro', 'Aluminio', 'Tierras raras'] },
  { nombre: 'Logística', subsectores: ['Transporte', 'Puertos', 'Distribución', 'Almacenes'] },
  { nombre: 'Telecomunicaciones', subsectores: ['Infraestructura 5G', 'Equipamiento de red', 'Servicios'] },
];

const nombresEmpresa = [
  'Advanced', 'Global', 'NextGen', 'Prime', 'Summit', 'Vision', 'Quantum', 'Apex', 'Zenith', 'Catalyst',
  'Precision', 'Frontier', 'Velocity', 'Spectrum', 'Nexus', 'Pinnacle', 'Ascent', 'Momentum', 'Epoch', 'Vertex',
  'Stellar', 'Titan', 'Pioneer', 'Horizon', 'Eclipse', 'Dynasty', 'Vanguard', 'Superior', 'Master', 'Elite',
];

const sufijos = [
  'Systems', 'Technologies', 'Corp', 'Industries', 'Solutions', 'Group', 'Labs', 'Semiconductor',
  'Electronics', 'Manufacturing', 'Innovations', 'Digital', 'Devices', 'Components', 'Services',
];

function generarNombreEmpresa() {
  const nombre = nombresEmpresa[Math.floor(Math.random() * nombresEmpresa.length)];
  const sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];
  return `${nombre} ${sufijo}`;
}

function generarTicker(nombre, index) {
  // Tomar primeras letras + número aleatorio
  const letras = nombre.split(' ').map(p => p[0]).join('');
  const numero = Math.floor(Math.random() * 99999);
  return (letras + numero).substring(0, 6).toUpperCase();
}

function generarCapMercado(sector) {
  // Empresas de semiconductores tienden a ser más grandes
  const min = sector === 'Semiconductores' ? 50e9 : 10e9;
  const max = sector === 'Semiconductores' ? 500e9 : 300e9;
  return min + Math.random() * (max - min);
}

function generarResumenTrimestral() {
  const ingresos = 1e9 + Math.random() * 100e9;
  const margen = 5 + Math.random() * 40;
  const beneficio = ingresos * (margen / 100);

  return {
    trimestre: 'Q3 2024',
    ingresos: Math.floor(ingresos),
    beneficio_neto: Math.floor(beneficio),
    margenes: parseFloat(margen.toFixed(1)),
    yoy_crecimiento: -20 + Math.random() * 100,
  };
}

function generarEstadoGeopolitico() {
  const rand = Math.random();
  if (rand > 0.9) return 'critico';
  if (rand > 0.75) return 'riesgo';
  return 'normal';
}

function generarCoordenadas(paisId) {
  // Coordenadas aproximadas por país
  const coordsPais = {
    'US': { lat: [24, 49], lon: [-125, -66] },
    'CN': { lat: [18, 53], lon: [73, 135] },
    'TW': { lat: [22, 25], lon: [120, 122] },
    'JP': { lat: [30, 45], lon: [130, 145] },
    'KR': { lat: [33, 43], lon: [124, 131] },
    'DE': { lat: [47, 56], lon: [6, 15] },
    'GB': { lat: [50, 59], lon: [-8, 2] },
    'NL': { lat: [50, 54], lon: [3, 8] },
    'CA': { lat: [42, 84], lon: [-141, -52] },
    'AU': { lat: [-44, -10], lon: [113, 154] },
    'SG': { lat: [1.2, 1.5], lon: [103.6, 104.1] },
    'FR': { lat: [42, 51], lon: [-5, 8] },
    'SE': { lat: [55, 69], lon: [11, 24] },
    'CH': { lat: [45.8, 47.8], lon: [5.9, 10.5] },
    'IL': { lat: [29, 34], lon: [34, 36] },
    'IN': { lat: [8, 35], lon: [68, 97] },
    'BR': { lat: [-33, 5], lon: [-73, -35] },
    'MX': { lat: [14, 33], lon: [-117, -87] },
    'NZ': { lat: [-47, -34], lon: [166, 178] },
    'TH': { lat: [5, 21], lon: [97, 106] },
  };

  const coords = coordsPais[paisId] || { lat: [-60, 60], lon: [-180, 180] };
  const lat = coords.lat[0] + Math.random() * (coords.lat[1] - coords.lat[0]);
  const lon = coords.lon[0] + Math.random() * (coords.lon[1] - coords.lon[0]);

  return { lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lon.toFixed(4)) };
}

function generarEmpresas(cantidad = 500) {
  const empresas = [];
  const paisesArray = Object.keys(paises);

  for (let i = 0; i < cantidad; i++) {
    const paisId = paisesArray[Math.floor(Math.random() * paisesArray.length)];
    const sector = sectores[Math.floor(Math.random() * sectores.length)];
    const subsector = sector.subsectores[Math.floor(Math.random() * sector.subsectores.length)];

    const nombre = generarNombreEmpresa();
    const ticker = generarTicker(nombre, i);

    const empresa = {
      id: ticker,
      nombre: nombre,
      ticker: ticker,
      pais_id: paisId,
      sector: sector.nombre,
      subsector: subsector,
      cap_mercado: Math.floor(generarCapMercado(sector.nombre)),
      ubicacion_hq: generarCoordenadas(paisId),
      resumen_trimestral: generarResumenTrimestral(),
      estado_geopolitico: generarEstadoGeopolitico(),
      descripcion: `Empresa de ${sector.nombre.toLowerCase()} especializada en ${subsector.toLowerCase()}`
    };

    empresas.push(empresa);
  }

  return empresas;
}

// Generar empresas
const empresas = generarEmpresas(500);

// Guardar a archivo
const outputPath = './src/data/empresas_500.json';
fs.writeFileSync(outputPath, JSON.stringify(empresas, null, 2));

console.log(`✅ ${empresas.length} empresas generadas`);
console.log(`📊 Guardado en: ${outputPath}`);

// Estadísticas
const porSector = {};
empresas.forEach(e => {
  if (!porSector[e.sector]) porSector[e.sector] = 0;
  porSector[e.sector]++;
});

console.log('\n📈 Distribución por sector:');
Object.entries(porSector).forEach(([sector, count]) => {
  console.log(`  ${sector}: ${count}`);
});

const porPais = {};
empresas.forEach(e => {
  if (!porPais[e.pais_id]) porPais[e.pais_id] = 0;
  porPais[e.pais_id]++;
});

console.log('\n🌍 Distribución por país:');
Object.entries(porPais).forEach(([pais, count]) => {
  console.log(`  ${pais}: ${count}`);
});
