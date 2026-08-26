// Lista curada de empresas reales y reconocibles, con país/sector/subsector
// reales. Se deja que la concentración geográfica real se note (EEUU/China/
// Taiwán/Japón/Corea concentran mucho más que Nueva Zelanda o Tailandia) en
// vez de forzar un reparto parejo artificial.
//
// tier controla el RANGO de cifras financieras sintéticas (cap_mercado,
// ingresos, etc.) que genera generar_empresas_reales.js — esas cifras son
// estimaciones ilustrativas, no datos financieros reales en vivo.
//
// coords son aproximadas de la ciudad sede real (o del país si no se conoce
// la ciudad exacta).

module.exports = [
  // ===== ESTADOS UNIDOS =====
  { nombre: 'NVIDIA', ticker: 'NVDA', pais_id: 'US', sector: 'Semiconductores', subsector: 'GPUs', tier: 'mega', coords: [37.3688, -121.9647], descripcion: 'Líder mundial en GPUs y chips para inteligencia artificial' },
  { nombre: 'Intel', ticker: 'INTC', pais_id: 'US', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'large', coords: [37.3894, -121.9633], descripcion: 'Fabricante histórico de procesadores x86 y chips' },
  { nombre: 'AMD', ticker: 'AMD', pais_id: 'US', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'large', coords: [37.5407, -121.9781], descripcion: 'Diseñador de CPUs, GPUs y chips para centros de datos' },
  { nombre: 'Qualcomm', ticker: 'QCOM', pais_id: 'US', sector: 'Semiconductores', subsector: 'Chips móviles', tier: 'large', coords: [32.8934, -117.1990], descripcion: 'Chips y módems para smartphones, líder en 5G' },
  { nombre: 'Broadcom', ticker: 'AVGO', pais_id: 'US', sector: 'Semiconductores', subsector: 'Chips de redes', tier: 'mega', coords: [37.3861, -122.0839], descripcion: 'Semiconductores para redes, almacenamiento y software empresarial' },
  { nombre: 'Texas Instruments', ticker: 'TXN', pais_id: 'US', sector: 'Semiconductores', subsector: 'Microcontroladores', tier: 'large', coords: [32.9483, -96.7299], descripcion: 'Semiconductores analógicos y microcontroladores industriales' },
  { nombre: 'Micron Technology', ticker: 'MU', pais_id: 'US', sector: 'Semiconductores', subsector: 'Memoria DRAM', tier: 'large', coords: [43.6046, -116.2023], descripcion: 'Fabricante de memoria DRAM y NAND flash' },
  { nombre: 'Marvell Technology', ticker: 'MRVL', pais_id: 'US', sector: 'Semiconductores', subsector: 'Chips de redes', tier: 'mid', coords: [37.4085, -121.9280], descripcion: 'Semiconductores para infraestructura de datos' },
  { nombre: 'ON Semiconductor', ticker: 'ON', pais_id: 'US', sector: 'Semiconductores', subsector: 'Semiconductores automotrices', tier: 'mid', coords: [43.6187, -116.2146], descripcion: 'Semiconductores de potencia para automotriz e industrial' },
  { nombre: 'Analog Devices', ticker: 'ADI', pais_id: 'US', sector: 'Semiconductores', subsector: 'Componentes especializados', tier: 'large', coords: [42.3722, -71.1568], descripcion: 'Semiconductores analógicos y de señal mixta' },
  { nombre: 'GlobalFoundries', ticker: 'GFS', pais_id: 'US', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'mid', coords: [42.8864, -73.8265], descripcion: 'Fundición de semiconductores independiente' },

  { nombre: 'Microsoft', ticker: 'MSFT', pais_id: 'US', sector: 'Software y Nube', subsector: 'Cloud Computing', tier: 'mega', coords: [47.6396, -122.1281], descripcion: 'Azure, Windows, Office y plataformas de IA empresarial' },
  { nombre: 'Alphabet (Google)', ticker: 'GOOGL', pais_id: 'US', sector: 'Software y Nube', subsector: 'IA y ML', tier: 'mega', coords: [37.4220, -122.0841], descripcion: 'Búsqueda, Google Cloud, Android e investigación en IA' },
  { nombre: 'Meta Platforms', ticker: 'META', pais_id: 'US', sector: 'Software y Nube', subsector: 'IA y ML', tier: 'mega', coords: [37.4847, -122.1477], descripcion: 'Facebook, Instagram, WhatsApp e infraestructura de IA' },
  { nombre: 'Oracle', ticker: 'ORCL', pais_id: 'US', sector: 'Software y Nube', subsector: 'ERP', tier: 'large', coords: [37.5297, -122.2669], descripcion: 'Bases de datos empresariales y cloud computing' },
  { nombre: 'Salesforce', ticker: 'CRM', pais_id: 'US', sector: 'Software y Nube', subsector: 'SaaS', tier: 'large', coords: [37.7897, -122.3972], descripcion: 'Plataforma líder de CRM en la nube' },
  { nombre: 'Adobe', ticker: 'ADBE', pais_id: 'US', sector: 'Software y Nube', subsector: 'SaaS', tier: 'large', coords: [37.3318, -121.8946], descripcion: 'Software creativo y de marketing digital' },
  { nombre: 'ServiceNow', ticker: 'NOW', pais_id: 'US', sector: 'Software y Nube', subsector: 'ERP', tier: 'mid', coords: [37.5407, -122.2557], descripcion: 'Plataforma de automatización de flujos de trabajo empresariales' },
  { nombre: 'Palantir Technologies', ticker: 'PLTR', pais_id: 'US', sector: 'Software y Nube', subsector: 'Analytics', tier: 'mid', coords: [32.7157, -117.1611], descripcion: 'Software de análisis de datos para gobierno y empresas' },
  { nombre: 'IBM', ticker: 'IBM', pais_id: 'US', sector: 'Software y Nube', subsector: 'Ciberseguridad', tier: 'large', coords: [41.1024, -73.7195], descripcion: 'Cómputo empresarial, IA y consultoría tecnológica' },

  { nombre: 'Apple', ticker: 'AAPL', pais_id: 'US', sector: 'Electrónica de Consumo', subsector: 'Smartphones', tier: 'mega', coords: [37.3349, -122.0090], descripcion: 'iPhone, Mac, servicios y ecosistema de hardware premium' },
  { nombre: 'Dell Technologies', ticker: 'DELL', pais_id: 'US', sector: 'Electrónica de Consumo', subsector: 'Computadoras', tier: 'large', coords: [30.3322, -97.7559], descripcion: 'Computadoras, servidores y soluciones empresariales' },
  { nombre: 'HP Inc.', ticker: 'HPQ', pais_id: 'US', sector: 'Electrónica de Consumo', subsector: 'Computadoras', tier: 'large', coords: [37.4419, -122.1430], descripcion: 'Computadoras personales e impresoras' },

  { nombre: 'Lam Research', ticker: 'LRCX', pais_id: 'US', sector: 'Equipamiento', subsector: 'Equipamiento fab', tier: 'large', coords: [37.3771, -121.9647], descripcion: 'Equipos de fabricación de semiconductores' },
  { nombre: 'KLA Corporation', ticker: 'KLAC', pais_id: 'US', sector: 'Equipamiento', subsector: 'Herramientas de test', tier: 'large', coords: [37.2839, -121.9622], descripcion: 'Equipos de inspección y medición para fabricación de chips' },
  { nombre: 'Applied Materials', ticker: 'AMAT', pais_id: 'US', sector: 'Equipamiento', subsector: 'Equipamiento fab', tier: 'large', coords: [37.3733, -121.9705], descripcion: 'Mayor proveedor mundial de equipos de fabricación de semiconductores' },

  { nombre: 'Tesla', ticker: 'TSLA', pais_id: 'US', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mega', coords: [30.2214, -97.6199], descripcion: 'Vehículos eléctricos, baterías y energía solar' },
  { nombre: 'General Motors', ticker: 'GM', pais_id: 'US', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [42.3314, -83.0458], descripcion: 'Uno de los mayores fabricantes de automóviles de EEUU' },
  { nombre: 'Ford Motor', ticker: 'F', pais_id: 'US', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [42.2793, -83.2280], descripcion: 'Fabricante histórico de automóviles y camionetas' },

  { nombre: 'ExxonMobil', ticker: 'XOM', pais_id: 'US', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [32.9070, -96.9797], descripcion: 'Una de las mayores petroleras integradas del mundo' },
  { nombre: 'Chevron', ticker: 'CVX', pais_id: 'US', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [29.7361, -95.3417], descripcion: 'Petrolera integrada con operaciones globales' },
  { nombre: 'ConocoPhillips', ticker: 'COP', pais_id: 'US', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [29.7377, -95.4013], descripcion: 'Exploración y producción de petróleo y gas' },

  { nombre: 'Freeport-McMoRan', ticker: 'FCX', pais_id: 'US', sector: 'Minería y Recursos', subsector: 'Cobre', tier: 'mid', coords: [33.4734, -112.0576], descripcion: 'Uno de los mayores productores de cobre del mundo' },
  { nombre: 'Newmont', ticker: 'NEM', pais_id: 'US', sector: 'Minería y Recursos', subsector: 'Oro', tier: 'mid', coords: [39.6480, -104.9942], descripcion: 'Mayor productora de oro del mundo' },
  { nombre: 'Albemarle', ticker: 'ALB', pais_id: 'US', sector: 'Minería y Recursos', subsector: 'Litio', tier: 'mid', coords: [35.7885, -78.6389], descripcion: 'Uno de los mayores productores de litio del mundo' },

  { nombre: 'FedEx', ticker: 'FDX', pais_id: 'US', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [35.0421, -89.9792], descripcion: 'Logística y transporte de paquetería a nivel global' },
  { nombre: 'UPS', ticker: 'UPS', pais_id: 'US', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [33.7573, -84.3963], descripcion: 'Uno de los mayores operadores logísticos del mundo' },

  { nombre: 'Verizon', ticker: 'VZ', pais_id: 'US', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [40.7580, -73.9855], descripcion: 'Mayor operador de telecomunicaciones de EEUU' },
  { nombre: 'AT&T', ticker: 'T', pais_id: 'US', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [32.7767, -96.7970], descripcion: 'Telecomunicaciones e infraestructura de red en EEUU' },
  { nombre: 'Cisco Systems', ticker: 'CSCO', pais_id: 'US', sector: 'Telecomunicaciones', subsector: 'Equipamiento de red', tier: 'large', coords: [37.4085, -121.9622], descripcion: 'Equipamiento de redes e infraestructura de internet' },

  // ===== CHINA =====
  { nombre: 'SMIC', ticker: '0981.HK', pais_id: 'CN', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'mid', coords: [31.2027, 121.5919], descripcion: 'Mayor fundición de semiconductores de China' },
  { nombre: 'Hua Hong Semiconductor', ticker: '1347.HK', pais_id: 'CN', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'mid', coords: [31.2027, 121.5919], descripcion: 'Fundición de semiconductores china' },
  { nombre: 'Tencent', ticker: '0700.HK', pais_id: 'CN', sector: 'Software y Nube', subsector: 'SaaS', tier: 'mega', coords: [22.5350, 113.9350], descripcion: 'WeChat, videojuegos y servicios de nube en China' },
  { nombre: 'Alibaba Group', ticker: 'BABA', pais_id: 'CN', sector: 'Software y Nube', subsector: 'Cloud Computing', tier: 'mega', coords: [30.2741, 120.1551], descripcion: 'E-commerce y computación en la nube líder en China' },
  { nombre: 'Baidu', ticker: 'BIDU', pais_id: 'CN', sector: 'Software y Nube', subsector: 'IA y ML', tier: 'mid', coords: [39.9992, 116.3061], descripcion: 'Buscador líder de China e IA' },
  { nombre: 'ByteDance', ticker: 'PRIVADA', pais_id: 'CN', sector: 'Software y Nube', subsector: 'IA y ML', tier: 'large', coords: [39.9163, 116.4457], descripcion: 'Matriz de TikTok/Douyin, algoritmos de recomendación' },
  { nombre: 'Xiaomi', ticker: '1810.HK', pais_id: 'CN', sector: 'Electrónica de Consumo', subsector: 'Smartphones', tier: 'large', coords: [39.9930, 116.3055], descripcion: 'Fabricante chino de smartphones y electrónica' },
  { nombre: 'Lenovo', ticker: '0992.HK', pais_id: 'CN', sector: 'Electrónica de Consumo', subsector: 'Computadoras', tier: 'large', coords: [39.9163, 116.2867], descripcion: 'Mayor fabricante mundial de PCs' },
  { nombre: 'Haier', ticker: '600690.SS', pais_id: 'CN', sector: 'Electrónica de Consumo', subsector: 'Accesorios', tier: 'mid', coords: [36.0986, 120.3719], descripcion: 'Electrodomésticos y electrónica de consumo' },
  { nombre: 'BYD', ticker: '1211.HK', pais_id: 'CN', sector: 'Automotriz', subsector: 'Baterías EV', tier: 'mega', coords: [22.6325, 114.0579], descripcion: 'Mayor fabricante de vehículos eléctricos de China' },
  { nombre: 'Geely', ticker: '0175.HK', pais_id: 'CN', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mid', coords: [28.1000, 120.6667], descripcion: 'Grupo automotriz chino (Volvo, Polestar)' },
  { nombre: 'NIO', ticker: 'NIO', pais_id: 'CN', sector: 'Automotriz', subsector: 'Baterías EV', tier: 'mid', coords: [31.2304, 121.4737], descripcion: 'Fabricante chino de vehículos eléctricos premium' },
  { nombre: 'Luxshare Precision', ticker: '002475.SZ', pais_id: 'CN', sector: 'Manufactura', subsector: 'Ensamble', tier: 'mid', coords: [22.6203, 113.9159], descripcion: 'Ensamblador de componentes electrónicos para Apple y otros' },
  { nombre: 'BOE Technology', ticker: '000725.SZ', pais_id: 'CN', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [39.9042, 116.4074], descripcion: 'Mayor fabricante de pantallas del mundo' },
  { nombre: 'PetroChina', ticker: '0857.HK', pais_id: 'CN', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [39.9042, 116.4074], descripcion: 'Mayor petrolera de China' },
  { nombre: 'Sinopec', ticker: '0386.HK', pais_id: 'CN', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [39.9042, 116.4074], descripcion: 'Refinación y distribución de petróleo en China' },
  { nombre: 'China Northern Rare Earth', ticker: '600111.SS', pais_id: 'CN', sector: 'Minería y Recursos', subsector: 'Tierras raras', tier: 'mid', coords: [40.6570, 109.8397], descripcion: 'Mayor productora de tierras raras del mundo' },
  { nombre: 'Zijin Mining', ticker: '2899.HK', pais_id: 'CN', sector: 'Minería y Recursos', subsector: 'Cobre', tier: 'mid', coords: [25.0700, 116.3500], descripcion: 'Minería de cobre y oro a gran escala' },
  { nombre: 'COSCO Shipping', ticker: '1919.HK', pais_id: 'CN', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [31.2304, 121.4737], descripcion: 'Una de las mayores navieras del mundo' },
  { nombre: 'China Mobile', ticker: '0941.HK', pais_id: 'CN', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'mega', coords: [39.9042, 116.4074], descripcion: 'Mayor operador de telecomunicaciones del mundo por usuarios' },
  { nombre: 'Huawei', ticker: 'PRIVADA', pais_id: 'CN', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [22.6273, 114.0576], descripcion: 'Infraestructura de telecomunicaciones y smartphones, bajo sanciones de EEUU' },
  { nombre: 'ZTE', ticker: '0763.HK', pais_id: 'CN', sector: 'Telecomunicaciones', subsector: 'Equipamiento de red', tier: 'mid', coords: [22.5350, 114.0287], descripcion: 'Equipamiento de telecomunicaciones y 5G' },

  // ===== REINO UNIDO =====
  { nombre: 'ARM Holdings', ticker: 'ARM', pais_id: 'GB', sector: 'Semiconductores', subsector: 'Microcontroladores', tier: 'large', coords: [52.2053, 0.1218], descripcion: 'Diseña la arquitectura de chips usada en casi todos los smartphones' },
  { nombre: 'BP', ticker: 'BP', pais_id: 'GB', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [51.5099, -0.1180], descripcion: 'Petrolera integrada británica' },
  { nombre: 'Shell', ticker: 'SHEL', pais_id: 'GB', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [51.5136, -0.0983], descripcion: 'Una de las mayores petroleras del mundo' },
  { nombre: 'Rio Tinto', ticker: 'RIO', pais_id: 'GB', sector: 'Minería y Recursos', subsector: 'Aluminio', tier: 'mega', coords: [51.5054, -0.0235], descripcion: 'Minería diversificada: hierro, aluminio, cobre, litio' },
  { nombre: 'Anglo American', ticker: 'AAL', pais_id: 'GB', sector: 'Minería y Recursos', subsector: 'Cobre', tier: 'large', coords: [51.5138, -0.0984], descripcion: 'Minería diversificada global' },
  { nombre: 'Vodafone', ticker: 'VOD', pais_id: 'GB', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [51.4772, -0.6062], descripcion: 'Uno de los mayores operadores móviles del mundo' },
  { nombre: 'BT Group', ticker: 'BT.A', pais_id: 'GB', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [51.5171, -0.0985], descripcion: 'Principal operador de telecomunicaciones del Reino Unido' },

  // ===== ALEMANIA =====
  { nombre: 'Infineon Technologies', ticker: 'IFX.DE', pais_id: 'DE', sector: 'Semiconductores', subsector: 'Semiconductores automotrices', tier: 'large', coords: [48.1750, 11.6167], descripcion: 'Líder europeo en semiconductores para automotriz e industria' },
  { nombre: 'SAP', ticker: 'SAP.DE', pais_id: 'DE', sector: 'Software y Nube', subsector: 'ERP', tier: 'mega', coords: [49.2933, 8.6428], descripcion: 'Mayor proveedor europeo de software ERP empresarial' },
  { nombre: 'Volkswagen Group', ticker: 'VOW3.DE', pais_id: 'DE', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mega', coords: [52.4278, 10.7865], descripcion: 'Mayor fabricante de automóviles de Europa' },
  { nombre: 'BMW Group', ticker: 'BMW.DE', pais_id: 'DE', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [48.1767, 11.5560], descripcion: 'Fabricante alemán de automóviles premium' },
  { nombre: 'Mercedes-Benz Group', ticker: 'MBG.DE', pais_id: 'DE', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [48.7773, 9.2377], descripcion: 'Fabricante alemán de automóviles de lujo' },
  { nombre: 'Continental AG', ticker: 'CON.DE', pais_id: 'DE', sector: 'Automotriz', subsector: 'Sistemas de conducción autónoma', tier: 'mid', coords: [52.3667, 9.7167], descripcion: 'Componentes automotrices y neumáticos' },
  { nombre: 'Siemens', ticker: 'SIE.DE', pais_id: 'DE', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mega', coords: [48.1351, 11.5820], descripcion: 'Conglomerado industrial y tecnológico alemán' },
  { nombre: 'Robert Bosch', ticker: 'PRIVADA', pais_id: 'DE', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [48.7449, 9.1668], descripcion: 'Componentes automotrices y electrodomésticos' },
  { nombre: 'RWE', ticker: 'RWE.DE', pais_id: 'DE', sector: 'Energía', subsector: 'Energías renovables', tier: 'large', coords: [51.4508, 7.0131], descripcion: 'Energía y renovables, una de las mayores utilities de Europa' },
  { nombre: 'Deutsche Post DHL', ticker: 'DHL.DE', pais_id: 'DE', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [53.0578, 8.7897], descripcion: 'Una de las mayores empresas de logística del mundo' },
  { nombre: 'Deutsche Telekom', ticker: 'DTE.DE', pais_id: 'DE', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [53.0793, 8.7841], descripcion: 'Mayor operador de telecomunicaciones de Europa' },

  // ===== JAPÓN =====
  { nombre: 'Renesas Electronics', ticker: '6723.T', pais_id: 'JP', sector: 'Semiconductores', subsector: 'Semiconductores automotrices', tier: 'large', coords: [35.6762, 139.7503], descripcion: 'Líder en semiconductores automotrices' },
  { nombre: 'Kioxia', ticker: 'PRIVADA', pais_id: 'JP', sector: 'Semiconductores', subsector: 'Memoria DRAM', tier: 'mid', coords: [35.6284, 139.7387], descripcion: 'Fabricante de memoria flash NAND, ex-Toshiba Memory' },
  { nombre: 'Sony', ticker: '6758.T', pais_id: 'JP', sector: 'Electrónica de Consumo', subsector: 'Accesorios', tier: 'mega', coords: [35.6297, 139.7378], descripcion: 'Electrónica, videojuegos (PlayStation) y sensores de imagen' },
  { nombre: 'Panasonic', ticker: '6752.T', pais_id: 'JP', sector: 'Electrónica de Consumo', subsector: 'Accesorios', tier: 'large', coords: [34.6937, 135.5023], descripcion: 'Electrónica de consumo y baterías para EVs' },
  { nombre: 'Sharp', ticker: '6753.T', pais_id: 'JP', sector: 'Electrónica de Consumo', subsector: 'Accesorios', tier: 'mid', coords: [34.6937, 135.5023], descripcion: 'Pantallas y electrónica de consumo japonesa' },
  { nombre: 'Tokyo Electron', ticker: '8035.T', pais_id: 'JP', sector: 'Equipamiento', subsector: 'Equipamiento fab', tier: 'large', coords: [35.6654, 139.7707], descripcion: 'Segundo mayor fabricante mundial de equipos para semiconductores' },
  { nombre: 'Nikon', ticker: '7731.T', pais_id: 'JP', sector: 'Equipamiento', subsector: 'Máquinas de litografía', tier: 'mid', coords: [35.6586, 139.7454], descripcion: 'Óptica de precisión y equipos de litografía' },
  { nombre: 'Canon', ticker: '7751.T', pais_id: 'JP', sector: 'Equipamiento', subsector: 'Máquinas de litografía', tier: 'large', coords: [35.6528, 139.7315], descripcion: 'Óptica, imagen y equipos de litografía para semiconductores' },
  { nombre: 'Toyota', ticker: '7203.T', pais_id: 'JP', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mega', coords: [35.0844, 137.1561], descripcion: 'Mayor fabricante de automóviles del mundo' },
  { nombre: 'Honda', ticker: '7267.T', pais_id: 'JP', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [35.6580, 139.7016], descripcion: 'Fabricante japonés de automóviles y motocicletas' },
  { nombre: 'Nissan', ticker: '7201.T', pais_id: 'JP', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [35.4437, 139.6380], descripcion: 'Fabricante japonés de automóviles, alianza con Renault' },
  { nombre: 'NTT', ticker: '9432.T', pais_id: 'JP', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'mega', coords: [35.6895, 139.6917], descripcion: 'Mayor operador de telecomunicaciones de Japón' },
  { nombre: 'SoftBank Group', ticker: '9984.T', pais_id: 'JP', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [35.6586, 139.7454], descripcion: 'Telecomunicaciones e inversión tecnológica global (Arm, Vision Fund)' },
  { nombre: 'KDDI', ticker: '9433.T', pais_id: 'JP', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [35.6812, 139.7671], descripcion: 'Segundo mayor operador móvil de Japón' },
  { nombre: 'Nippon Yusen (NYK Line)', ticker: '9101.T', pais_id: 'JP', sector: 'Logística', subsector: 'Transporte', tier: 'mid', coords: [35.6812, 139.7671], descripcion: 'Una de las mayores navieras del mundo' },
  { nombre: 'Mitsubishi Corporation', ticker: '8058.T', pais_id: 'JP', sector: 'Logística', subsector: 'Distribución', tier: 'large', coords: [35.6812, 139.7671], descripcion: 'Trading y logística diversificada japonesa' },

  // ===== COREA DEL SUR =====
  { nombre: 'Samsung Electronics', ticker: '005930.KS', pais_id: 'KR', sector: 'Semiconductores', subsector: 'Memoria DRAM', tier: 'mega', coords: [37.2636, 127.0286], descripcion: 'Mayor fabricante de memoria y segundo de chips del mundo' },
  { nombre: 'SK Hynix', ticker: '000660.KS', pais_id: 'KR', sector: 'Semiconductores', subsector: 'Memoria DRAM', tier: 'mega', coords: [37.4001, 127.1120], descripcion: 'Segundo mayor fabricante mundial de memoria' },
  { nombre: 'LG Electronics', ticker: '066570.KS', pais_id: 'KR', sector: 'Electrónica de Consumo', subsector: 'Accesorios', tier: 'large', coords: [37.5511, 126.8882], descripcion: 'Electrodomésticos y electrónica de consumo surcoreana' },
  { nombre: 'LG Display', ticker: '034220.KS', pais_id: 'KR', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [37.4138, 127.5183], descripcion: 'Fabricante líder de pantallas OLED' },
  { nombre: 'Samsung SDI', ticker: '006400.KS', pais_id: 'KR', sector: 'Automotriz', subsector: 'Baterías EV', tier: 'large', coords: [37.2636, 127.0286], descripcion: 'Baterías para vehículos eléctricos' },
  { nombre: 'Hyundai Motor', ticker: '005380.KS', pais_id: 'KR', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mega', coords: [37.5326, 127.0246], descripcion: 'Mayor fabricante de automóviles de Corea del Sur' },
  { nombre: 'Kia', ticker: '000270.KS', pais_id: 'KR', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [37.5326, 127.0246], descripcion: 'Fabricante surcoreano de automóviles' },
  { nombre: 'SK Telecom', ticker: '017670.KS', pais_id: 'KR', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [37.5289, 127.0247], descripcion: 'Mayor operador móvil de Corea del Sur' },
  { nombre: 'KT Corporation', ticker: '030200.KS', pais_id: 'KR', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [37.5665, 126.9780], descripcion: 'Operador de telecomunicaciones e infraestructura de Corea' },

  // ===== TAIWÁN =====
  { nombre: 'TSMC', ticker: '2330.TW', pais_id: 'TW', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'mega', coords: [24.7738, 121.0068], descripcion: 'Controla el 92% de la fabricación mundial de chips de 5nm' },
  { nombre: 'MediaTek', ticker: '2454.TW', pais_id: 'TW', sector: 'Semiconductores', subsector: 'Chips móviles', tier: 'large', coords: [24.7877, 121.0466], descripcion: 'Diseñador líder de chips para smartphones' },
  { nombre: 'UMC', ticker: '2303.TW', pais_id: 'TW', sector: 'Semiconductores', subsector: 'Procesadores', tier: 'mid', coords: [24.7738, 121.0068], descripcion: 'Tercera mayor fundición de semiconductores del mundo' },
  { nombre: 'Powerchip Semiconductor', ticker: '6770.TWO', pais_id: 'TW', sector: 'Semiconductores', subsector: 'Memoria DRAM', tier: 'mid', coords: [24.6931, 121.0294], descripcion: 'Fundición de memoria y semiconductores' },
  { nombre: 'Foxconn (Hon Hai)', ticker: '2317.TW', pais_id: 'TW', sector: 'Manufactura', subsector: 'Ensamble', tier: 'mega', coords: [24.9937, 121.3660], descripcion: 'Mayor ensamblador de electrónica del mundo, fabrica iPhones' },
  { nombre: 'Pegatron', ticker: '4938.TW', pais_id: 'TW', sector: 'Manufactura', subsector: 'Ensamble', tier: 'large', coords: [25.0700, 121.5700], descripcion: 'Ensamblador de electrónica de consumo' },
  { nombre: 'Wistron', ticker: '3231.TW', pais_id: 'TW', sector: 'Manufactura', subsector: 'Ensamble', tier: 'mid', coords: [25.0700, 121.5700], descripcion: 'Fabricante contratado de electrónica' },
  { nombre: 'Quanta Computer', ticker: '2382.TW', pais_id: 'TW', sector: 'Manufactura', subsector: 'Ensamble', tier: 'mid', coords: [25.0170, 121.2168], descripcion: 'Mayor fabricante contratado de laptops del mundo' },
  { nombre: 'ASUS', ticker: '2357.TW', pais_id: 'TW', sector: 'Electrónica de Consumo', subsector: 'Computadoras', tier: 'mid', coords: [25.0632, 121.5442], descripcion: 'Fabricante taiwanés de computadoras y componentes' },
  { nombre: 'Acer', ticker: '2353.TW', pais_id: 'TW', sector: 'Electrónica de Consumo', subsector: 'Computadoras', tier: 'mid', coords: [25.0330, 121.5500], descripcion: 'Fabricante taiwanés de PCs' },
  { nombre: 'ASE Technology', ticker: '3711.TW', pais_id: 'TW', sector: 'Equipamiento', subsector: 'Componentes especializados', tier: 'mid', coords: [22.6273, 120.3014], descripcion: 'Mayor proveedor de empaquetado y pruebas de semiconductores' },

  // ===== PAÍSES BAJOS =====
  { nombre: 'ASML', ticker: 'ASML.AS', pais_id: 'NL', sector: 'Equipamiento', subsector: 'Máquinas de litografía', tier: 'mega', coords: [51.4160, 5.4340], descripcion: 'Único fabricante mundial de máquinas de litografía EUV' },
  { nombre: 'ASM International', ticker: 'ASM.AS', pais_id: 'NL', sector: 'Equipamiento', subsector: 'Equipamiento fab', tier: 'mid', coords: [52.3072, 4.7286], descripcion: 'Equipos de deposición atómica para semiconductores' },
  { nombre: 'Philips', ticker: 'PHIA.AS', pais_id: 'NL', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [52.3676, 4.9041], descripcion: 'Tecnología de salud y electrónica holandesa' },

  // ===== CANADÁ =====
  { nombre: 'Barrick Gold', ticker: 'ABX.TO', pais_id: 'CA', sector: 'Minería y Recursos', subsector: 'Oro', tier: 'large', coords: [43.6511, -79.3832], descripcion: 'Una de las mayores mineras de oro del mundo' },
  { nombre: 'Teck Resources', ticker: 'TECK.TO', pais_id: 'CA', sector: 'Minería y Recursos', subsector: 'Cobre', tier: 'mid', coords: [49.2827, -123.1207], descripcion: 'Minería diversificada canadiense: cobre, zinc, carbón' },
  { nombre: 'Agnico Eagle Mines', ticker: 'AEM.TO', pais_id: 'CA', sector: 'Minería y Recursos', subsector: 'Oro', tier: 'mid', coords: [45.5017, -73.5673], descripcion: 'Minera de oro canadiense' },
  { nombre: 'Suncor Energy', ticker: 'SU.TO', pais_id: 'CA', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [51.0447, -114.0719], descripcion: 'Mayor productora de arenas petrolíferas de Canadá' },
  { nombre: 'Canadian Natural Resources', ticker: 'CNQ.TO', pais_id: 'CA', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [51.0447, -114.0719], descripcion: 'Productora de petróleo y gas natural canadiense' },
  { nombre: 'Enbridge', ticker: 'ENB.TO', pais_id: 'CA', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [43.4643, -80.5204], descripcion: 'Infraestructura de oleoductos y gasoductos' },
  { nombre: 'BCE Inc (Bell Canada)', ticker: 'BCE.TO', pais_id: 'CA', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [45.5017, -73.5673], descripcion: 'Mayor operador de telecomunicaciones de Canadá' },
  { nombre: 'Telus', ticker: 'T.TO', pais_id: 'CA', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [49.2827, -123.1207], descripcion: 'Operador de telecomunicaciones canadiense' },

  // ===== AUSTRALIA =====
  { nombre: 'BHP Group', ticker: 'BHP.AX', pais_id: 'AU', sector: 'Minería y Recursos', subsector: 'Aluminio', tier: 'mega', coords: [-31.9505, 115.8605], descripcion: 'Mayor minera del mundo por capitalización' },
  { nombre: 'Fortescue Metals Group', ticker: 'FMG.AX', pais_id: 'AU', sector: 'Minería y Recursos', subsector: 'Aluminio', tier: 'large', coords: [-31.9505, 115.8605], descripcion: 'Una de las mayores productoras de mineral de hierro' },
  { nombre: 'South32', ticker: 'S32.AX', pais_id: 'AU', sector: 'Minería y Recursos', subsector: 'Cobalto', tier: 'mid', coords: [-31.9505, 115.8605], descripcion: 'Minería diversificada: aluminio, manganeso, plata' },
  { nombre: 'Pilbara Minerals', ticker: 'PLS.AX', pais_id: 'AU', sector: 'Minería y Recursos', subsector: 'Litio', tier: 'mid', coords: [-31.9505, 115.8605], descripcion: 'Uno de los mayores productores de litio del mundo' },
  { nombre: 'Woodside Energy', ticker: 'WDS.AX', pais_id: 'AU', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [-31.9505, 115.8605], descripcion: 'Mayor productora de gas natural de Australia' },
  { nombre: 'Santos', ticker: 'STO.AX', pais_id: 'AU', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mid', coords: [-34.9285, 138.6007], descripcion: 'Productora australiana de petróleo y gas' },
  { nombre: 'Telstra', ticker: 'TLS.AX', pais_id: 'AU', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [-37.8136, 144.9631], descripcion: 'Mayor operador de telecomunicaciones de Australia' },

  // ===== IRÁN =====
  { nombre: 'National Iranian Oil Company', ticker: 'ESTATAL', pais_id: 'IR', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [35.7219, 51.3347], descripcion: 'Petrolera estatal de Irán, bajo embargo internacional' },
  { nombre: 'Iran Khodro', ticker: 'IKCO', pais_id: 'IR', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mid', coords: [35.6892, 51.3890], descripcion: 'Mayor fabricante de automóviles de Irán' },

  // ===== SINGAPUR =====
  { nombre: 'Flex Ltd', ticker: 'FLEX', pais_id: 'SG', sector: 'Manufactura', subsector: 'Ensamble', tier: 'large', coords: [1.3521, 103.8198], descripcion: 'Fabricante contratado de electrónica con sede en Singapur' },
  { nombre: 'Venture Corporation', ticker: 'V03.SI', pais_id: 'SG', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [1.3521, 103.8198], descripcion: 'Fabricación electrónica contratada en Singapur' },
  { nombre: 'PSA International', ticker: 'ESTATAL', pais_id: 'SG', sector: 'Logística', subsector: 'Puertos', tier: 'large', coords: [1.2655, 103.8201], descripcion: 'Operador del puerto de Singapur, uno de los más transitados del mundo' },
  { nombre: 'Singtel', ticker: 'Z74.SI', pais_id: 'SG', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [1.3050, 103.8318], descripcion: 'Mayor operador de telecomunicaciones del sudeste asiático' },
  { nombre: 'Sea Limited', ticker: 'SE', pais_id: 'SG', sector: 'Software y Nube', subsector: 'SaaS', tier: 'mid', coords: [1.3050, 103.8318], descripcion: 'Matriz de Shopee y Garena, tecnología del sudeste asiático' },

  // ===== FRANCIA =====
  { nombre: 'STMicroelectronics', ticker: 'STM', pais_id: 'FR', sector: 'Semiconductores', subsector: 'Semiconductores automotrices', tier: 'large', coords: [48.8938, 2.2470], descripcion: 'Semiconductores franco-italianos para automotriz e industrial' },
  { nombre: 'Renault', ticker: 'RNO.PA', pais_id: 'FR', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [48.8683, 2.2413], descripcion: 'Fabricante francés de automóviles, alianza con Nissan' },
  { nombre: 'TotalEnergies', ticker: 'TTE.PA', pais_id: 'FR', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [48.8926, 2.2360], descripcion: 'Una de las mayores petroleras integradas del mundo' },
  { nombre: 'Schneider Electric', ticker: 'SU.PA', pais_id: 'FR', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [45.6014, 4.8357], descripcion: 'Gestión de energía y automatización industrial' },
  { nombre: 'Thales', ticker: 'HO.PA', pais_id: 'FR', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [48.7841, 2.2331], descripcion: 'Electrónica de defensa, aeroespacial y ciberseguridad' },
  { nombre: 'CMA CGM', ticker: 'PRIVADA', pais_id: 'FR', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [43.2965, 5.3698], descripcion: 'Tercera mayor naviera de contenedores del mundo' },
  { nombre: 'Orange', ticker: 'ORA.PA', pais_id: 'FR', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [48.8341, 2.2385], descripcion: 'Principal operador de telecomunicaciones de Francia' },

  // ===== SUECIA =====
  { nombre: 'Ericsson', ticker: 'ERIC-B.ST', pais_id: 'SE', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [59.3293, 18.0686], descripcion: 'Líder mundial en infraestructura de redes 5G' },
  { nombre: 'Volvo Cars', ticker: 'VOLCAR-B.ST', pais_id: 'SE', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [57.7089, 11.9746], descripcion: 'Fabricante sueco de automóviles, propiedad de Geely' },
  { nombre: 'Volvo Group', ticker: 'VOLV-B.ST', pais_id: 'SE', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [57.7089, 11.9746], descripcion: 'Fabricante sueco de camiones y equipo pesado' },
  { nombre: 'Atlas Copco', ticker: 'ATCO-A.ST', pais_id: 'SE', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [59.3293, 18.0686], descripcion: 'Equipos industriales y compresores' },

  // ===== SUIZA =====
  { nombre: 'Glencore', ticker: 'GLEN.L', pais_id: 'CH', sector: 'Minería y Recursos', subsector: 'Cobalto', tier: 'mega', coords: [47.1660, 8.5155], descripcion: 'Mayor comercializadora de materias primas del mundo' },
  { nombre: 'ABB', ticker: 'ABBN.SW', pais_id: 'CH', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [47.3769, 8.5417], descripcion: 'Automatización industrial y robótica suiza' },
  { nombre: 'Kuehne+Nagel', ticker: 'KNIN.SW', pais_id: 'CH', sector: 'Logística', subsector: 'Transporte', tier: 'large', coords: [47.3841, 8.5340], descripcion: 'Una de las mayores empresas de logística del mundo' },
  { nombre: 'Nestlé', ticker: 'NESN.SW', pais_id: 'CH', sector: 'Manufactura', subsector: 'Ensamble', tier: 'mega', coords: [46.4415, 6.9107], descripcion: 'Mayor empresa de alimentos y bebidas del mundo' },

  // ===== ISRAEL =====
  { nombre: 'Tower Semiconductor', ticker: 'TSEM', pais_id: 'IL', sector: 'Semiconductores', subsector: 'Componentes especializados', tier: 'mid', coords: [32.1730, 34.8447], descripcion: 'Fundición de semiconductores especializados israelí' },
  { nombre: 'Check Point Software', ticker: 'CHKP', pais_id: 'IL', sector: 'Software y Nube', subsector: 'Ciberseguridad', tier: 'mid', coords: [32.0879, 34.7749], descripcion: 'Líder en ciberseguridad empresarial' },
  { nombre: 'Wix.com', ticker: 'WIX', pais_id: 'IL', sector: 'Software y Nube', subsector: 'SaaS', tier: 'mid', coords: [32.0668, 34.7743], descripcion: 'Plataforma de creación de sitios web' },
  { nombre: 'NICE Ltd', ticker: 'NICE', pais_id: 'IL', sector: 'Software y Nube', subsector: 'Analytics', tier: 'mid', coords: [32.1637, 34.8347], descripcion: 'Software de analytics e IA conversacional' },
  { nombre: 'Monday.com', ticker: 'MNDY', pais_id: 'IL', sector: 'Software y Nube', subsector: 'ERP', tier: 'mid', coords: [32.0668, 34.7743], descripcion: 'Plataforma de gestión de trabajo colaborativo' },

  // ===== INDIA =====
  { nombre: 'Tata Consultancy Services', ticker: 'TCS.NS', pais_id: 'IN', sector: 'Software y Nube', subsector: 'SaaS', tier: 'mega', coords: [19.0176, 72.8562], descripcion: 'Mayor empresa de servicios de TI de India' },
  { nombre: 'Infosys', ticker: 'INFY.NS', pais_id: 'IN', sector: 'Software y Nube', subsector: 'Ciberseguridad', tier: 'large', coords: [12.9698, 77.7500], descripcion: 'Servicios de TI y consultoría tecnológica global' },
  { nombre: 'Wipro', ticker: 'WIPRO.NS', pais_id: 'IN', sector: 'Software y Nube', subsector: 'ERP', tier: 'large', coords: [12.9698, 77.7500], descripcion: 'Servicios de TI y consultoría india' },
  { nombre: 'HCL Technologies', ticker: 'HCLTECH.NS', pais_id: 'IN', sector: 'Software y Nube', subsector: 'Cloud Computing', tier: 'large', coords: [28.6692, 77.4538], descripcion: 'Servicios de TI y transformación digital' },
  { nombre: 'Reliance Industries', ticker: 'RELIANCE.NS', pais_id: 'IN', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [18.9750, 72.8258], descripcion: 'Conglomerado indio de energía, retail y telecomunicaciones' },
  { nombre: 'ONGC', ticker: 'ONGC.NS', pais_id: 'IN', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [28.6304, 77.2177], descripcion: 'Mayor productora de petróleo y gas de India' },
  { nombre: 'Reliance Jio', ticker: 'PRIVADA', pais_id: 'IN', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [18.9750, 72.8258], descripcion: 'Mayor operador móvil de India' },
  { nombre: 'Bharti Airtel', ticker: 'BHARTIARTL.NS', pais_id: 'IN', sector: 'Telecomunicaciones', subsector: 'Infraestructura 5G', tier: 'large', coords: [28.5478, 77.1946], descripcion: 'Segundo mayor operador de telecomunicaciones de India' },
  { nombre: 'Tata Motors', ticker: 'TATAMOTORS.NS', pais_id: 'IN', sector: 'Automotriz', subsector: 'Vehículos', tier: 'large', coords: [18.9633, 72.8300], descripcion: 'Mayor fabricante de vehículos comerciales de India' },
  { nombre: 'Mahindra & Mahindra', ticker: 'M&M.NS', pais_id: 'IN', sector: 'Automotriz', subsector: 'Vehículos', tier: 'mid', coords: [19.1197, 72.9051], descripcion: 'Fabricante indio de vehículos y tractores' },
  { nombre: 'Tata Steel', ticker: 'TATASTEEL.NS', pais_id: 'IN', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'large', coords: [22.8046, 86.2029], descripcion: 'Uno de los mayores productores de acero del mundo' },

  // ===== BRASIL =====
  { nombre: 'Vale', ticker: 'VALE3.SA', pais_id: 'BR', sector: 'Minería y Recursos', subsector: 'Aluminio', tier: 'mega', coords: [-22.9068, -43.1729], descripcion: 'Mayor productora de mineral de hierro y níquel del mundo' },
  { nombre: 'Petrobras', ticker: 'PETR4.SA', pais_id: 'BR', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'mega', coords: [-22.9068, -43.1729], descripcion: 'Petrolera estatal brasileña, líder en exploración en aguas profundas' },
  { nombre: 'Embraer', ticker: 'EMBR3.SA', pais_id: 'BR', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [-23.2237, -45.8894], descripcion: 'Tercer mayor fabricante de aviones del mundo' },
  { nombre: 'JBS', ticker: 'JBSS3.SA', pais_id: 'BR', sector: 'Manufactura', subsector: 'Ensamble', tier: 'large', coords: [-23.5505, -46.6333], descripcion: 'Mayor procesadora de carne del mundo' },

  // ===== MÉXICO =====
  { nombre: 'América Móvil', ticker: 'AMX', pais_id: 'MX', sector: 'Telecomunicaciones', subsector: 'Servicios', tier: 'large', coords: [19.4326, -99.1332], descripcion: 'Mayor operador de telecomunicaciones de América Latina' },
  { nombre: 'Pemex', ticker: 'ESTATAL', pais_id: 'MX', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [19.4326, -99.1332], descripcion: 'Petrolera estatal mexicana' },
  { nombre: 'Grupo México', ticker: 'GMEXICOB.MX', pais_id: 'MX', sector: 'Minería y Recursos', subsector: 'Cobre', tier: 'mid', coords: [19.4326, -99.1332], descripcion: 'Mayor productora de cobre de México' },

  // ===== NUEVA ZELANDA =====
  { nombre: 'Fisher & Paykel Healthcare', ticker: 'FPH.NZ', pais_id: 'NZ', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [-36.8485, 174.7633], descripcion: 'Fabricante neozelandés de dispositivos médicos respiratorios' },
  { nombre: 'Xero', ticker: 'XRO.NZ', pais_id: 'NZ', sector: 'Software y Nube', subsector: 'SaaS', tier: 'mid', coords: [-36.8485, 174.7633], descripcion: 'Software de contabilidad en la nube neozelandés' },

  // ===== TAILANDIA =====
  { nombre: 'PTT Public Company', ticker: 'PTT.BK', pais_id: 'TH', sector: 'Energía', subsector: 'Petróleo y Gas', tier: 'large', coords: [13.7563, 100.5018], descripcion: 'Petrolera estatal de Tailandia' },
  { nombre: 'Delta Electronics Thailand', ticker: 'DELTA.BK', pais_id: 'TH', sector: 'Manufactura', subsector: 'Componentes electrónicos', tier: 'mid', coords: [13.7563, 100.5018], descripcion: 'Fabricante de componentes electrónicos y de energía' },
  { nombre: 'Hana Microelectronics', ticker: 'HANA.BK', pais_id: 'TH', sector: 'Semiconductores', subsector: 'Componentes especializados', tier: 'mid', coords: [13.7563, 100.5018], descripcion: 'Ensamblaje y prueba de semiconductores' },
]
