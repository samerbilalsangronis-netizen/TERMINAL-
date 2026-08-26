// Relaciones reales/plausibles entre empresas y recursos críticos.
// tipo: fabrica | importa | exporta | depende
// porcentaje: estimación ilustrativa de participación en el mercado global
// del recurso (no una cifra oficial).

module.exports = [
  // ===== LITIO =====
  { empresa: 'Albemarle', recurso: 'LITIO', tipo: 'fabrica', porcentaje: 18, desc: 'Albemarle es uno de los mayores productores mundiales de litio' },
  { empresa: 'Pilbara Minerals', recurso: 'LITIO', tipo: 'fabrica', porcentaje: 8, desc: 'Pilbara Minerals opera una de las mayores minas de litio del mundo' },
  { empresa: 'Tesla', recurso: 'LITIO', tipo: 'depende', porcentaje: 6, desc: 'Tesla depende de litio para sus baterías de vehículos eléctricos' },
  { empresa: 'Panasonic', recurso: 'LITIO', tipo: 'depende', porcentaje: 4, desc: 'Panasonic depende de litio para producir celdas de batería' },
  { empresa: 'BYD', recurso: 'LITIO', tipo: 'depende', porcentaje: 5, desc: 'BYD depende de litio para su producción masiva de baterías LFP' },
  { empresa: 'Samsung SDI', recurso: 'LITIO', tipo: 'depende', porcentaje: 4, desc: 'Samsung SDI depende de litio para baterías EV' },

  // ===== IMANES (Tierras Raras) =====
  { empresa: 'China Northern Rare Earth', recurso: 'IMANES', tipo: 'fabrica', porcentaje: 35, desc: 'Mayor productora mundial de elementos de tierras raras' },
  { empresa: 'Apple', recurso: 'IMANES', tipo: 'depende', porcentaje: 2, desc: 'Apple depende de imanes de tierras raras para hápticos y altavoces' },
  { empresa: 'Siemens', recurso: 'IMANES', tipo: 'depende', porcentaje: 3, desc: 'Siemens depende de imanes para motores eléctricos y turbinas eólicas' },
  { empresa: 'BYD', recurso: 'IMANES', tipo: 'depende', porcentaje: 3, desc: 'BYD depende de imanes de tierras raras para motores EV' },
  { empresa: 'Renesas Electronics', recurso: 'IMANES', tipo: 'depende', porcentaje: 1, desc: 'Renesas usa componentes magnéticos en su producción' },

  // ===== COBALTO =====
  { empresa: 'Glencore', recurso: 'COBALTO', tipo: 'fabrica', porcentaje: 22, desc: 'Glencore es el mayor productor mundial de cobalto' },
  { empresa: 'Samsung SDI', recurso: 'COBALTO', tipo: 'depende', porcentaje: 5, desc: 'Samsung SDI depende de cobalto para cátodos de batería' },
  { empresa: 'Panasonic', recurso: 'COBALTO', tipo: 'depende', porcentaje: 4, desc: 'Panasonic depende de cobalto para celdas de batería de alto rendimiento' },
  { empresa: 'Tesla', recurso: 'COBALTO', tipo: 'depende', porcentaje: 3, desc: 'Tesla busca reducir su dependencia de cobalto en nuevas químicas de batería' },

  // ===== COBRE =====
  { empresa: 'Freeport-McMoRan', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 8, desc: 'Uno de los mayores productores de cobre del mundo' },
  { empresa: 'Zijin Mining', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 6, desc: 'Zijin Mining opera importantes minas de cobre a nivel global' },
  { empresa: 'Rio Tinto', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 5, desc: 'Rio Tinto produce cobre en múltiples operaciones globales' },
  { empresa: 'BHP Group', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 7, desc: 'BHP opera Escondida, la mayor mina de cobre del mundo' },
  { empresa: 'Teck Resources', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 3, desc: 'Teck Resources produce cobre en Canadá y Chile' },
  { empresa: 'Grupo México', recurso: 'COBRE', tipo: 'fabrica', porcentaje: 4, desc: 'Mayor productora de cobre de México' },
  { empresa: 'Siemens', recurso: 'COBRE', tipo: 'depende', porcentaje: 2, desc: 'Siemens depende de cobre para cableado y motores eléctricos' },
  { empresa: 'ABB', recurso: 'COBRE', tipo: 'depende', porcentaje: 2, desc: 'ABB depende de cobre para equipos eléctricos industriales' },

  // ===== SEMICONDUCTORES_CHIPS =====
  { empresa: 'TSMC', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 60, desc: 'TSMC fabrica la mayoría de los chips avanzados del mundo' },
  { empresa: 'Samsung Electronics', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 18, desc: 'Segundo mayor fabricante mundial de semiconductores' },
  { empresa: 'Intel', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 10, desc: 'Intel fabrica sus propios procesadores y busca ampliar su fundición' },
  { empresa: 'SMIC', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 5, desc: 'Mayor fundición de China, limitada por controles de exportación' },
  { empresa: 'UMC', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 4, desc: 'Tercera mayor fundición de semiconductores del mundo' },
  { empresa: 'GlobalFoundries', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'fabrica', porcentaje: 3, desc: 'Fundición independiente con operaciones en EEUU, Alemania y Singapur' },
  { empresa: 'Apple', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'depende', porcentaje: 8, desc: 'Apple depende de TSMC para todos sus chips propios' },
  { empresa: 'NVIDIA', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'depende', porcentaje: 7, desc: 'NVIDIA depende de fundiciones externas para fabricar sus GPUs' },
  { empresa: 'Dell Technologies', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'depende', porcentaje: 3, desc: 'Dell depende de semiconductores para todos sus equipos' },
  { empresa: 'Toyota', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'depende', porcentaje: 2, desc: 'Toyota depende de semiconductores automotrices, escasos en 2021-2022' },
  { empresa: 'BMW Group', recurso: 'SEMICONDUCTORES_CHIPS', tipo: 'depende', porcentaje: 2, desc: 'BMW depende de semiconductores para sistemas electrónicos del vehículo' },

  // ===== PETROLEO =====
  { empresa: 'ExxonMobil', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 3, desc: 'Una de las mayores productoras de petróleo del mundo' },
  { empresa: 'Chevron', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 2, desc: 'Chevron produce petróleo en múltiples cuencas globales' },
  { empresa: 'Shell', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 2, desc: 'Shell es una de las petroleras integradas más grandes del mundo' },
  { empresa: 'BP', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 2, desc: 'BP produce y refina petróleo a escala global' },
  { empresa: 'PetroChina', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 4, desc: 'Mayor productora de petróleo de China' },
  { empresa: 'National Iranian Oil Company', recurso: 'PETROLEO', tipo: 'exporta', porcentaje: 3, desc: 'Exporta petróleo iraní bajo restricciones de sanciones internacionales' },
  { empresa: 'Petrobras', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 3, desc: 'Petrobras lidera la producción de petróleo en aguas profundas de Brasil' },
  { empresa: 'Reliance Industries', recurso: 'PETROLEO', tipo: 'importa', porcentaje: 2, desc: 'Reliance importa y refina crudo en la mayor refinería del mundo' },
  { empresa: 'ONGC', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 1, desc: 'Mayor productora de petróleo y gas de India' },
  { empresa: 'Suncor Energy', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 1, desc: 'Suncor produce petróleo a partir de arenas bituminosas canadienses' },
  { empresa: 'PTT Public Company', recurso: 'PETROLEO', tipo: 'importa', porcentaje: 1, desc: 'PTT importa petróleo para el mercado energético tailandés' },
  { empresa: 'Pemex', recurso: 'PETROLEO', tipo: 'fabrica', porcentaje: 2, desc: 'Petrolera estatal mexicana' },
  { empresa: 'Toyota', recurso: 'PETROLEO', tipo: 'depende', porcentaje: 1, desc: 'Depende de derivados del petróleo para combustibles y plásticos' },

  // ===== GAS_NATURAL =====
  { empresa: 'Shell', recurso: 'GAS_NATURAL', tipo: 'fabrica', porcentaje: 4, desc: 'Shell es líder mundial en gas natural licuado (GNL)' },
  { empresa: 'TotalEnergies', recurso: 'GAS_NATURAL', tipo: 'fabrica', porcentaje: 3, desc: 'TotalEnergies opera importantes proyectos de GNL' },
  { empresa: 'Woodside Energy', recurso: 'GAS_NATURAL', tipo: 'fabrica', porcentaje: 2, desc: 'Mayor productora de gas natural de Australia' },
  { empresa: 'National Iranian Oil Company', recurso: 'GAS_NATURAL', tipo: 'fabrica', porcentaje: 3, desc: 'Irán tiene una de las mayores reservas de gas natural del mundo' },
  { empresa: 'RWE', recurso: 'GAS_NATURAL', tipo: 'importa', porcentaje: 2, desc: 'RWE importa gas natural para generación eléctrica en Alemania' },
  { empresa: 'PTT Public Company', recurso: 'GAS_NATURAL', tipo: 'importa', porcentaje: 1, desc: 'PTT importa GNL para el mercado tailandés' },

  // ===== SILICIO =====
  { empresa: 'TSMC', recurso: 'SILICIO', tipo: 'depende', porcentaje: 15, desc: 'TSMC depende de obleas de silicio de alta pureza' },
  { empresa: 'Samsung Electronics', recurso: 'SILICIO', tipo: 'depende', porcentaje: 12, desc: 'Samsung depende de silicio para fabricación de chips' },
  { empresa: 'Intel', recurso: 'SILICIO', tipo: 'depende', porcentaje: 8, desc: 'Intel depende de obleas de silicio para sus fábricas' },
  { empresa: 'GlobalFoundries', recurso: 'SILICIO', tipo: 'depende', porcentaje: 3, desc: 'GlobalFoundries depende de silicio de alta pureza' },

  // ===== ALUMINIO =====
  { empresa: 'Rio Tinto', recurso: 'ALUMINIO', tipo: 'fabrica', porcentaje: 5, desc: 'Rio Tinto es uno de los mayores productores de aluminio del mundo' },
  { empresa: 'BHP Group', recurso: 'ALUMINIO', tipo: 'fabrica', porcentaje: 2, desc: 'BHP produce alúmina y aluminio en operaciones globales' },
  { empresa: 'South32', recurso: 'ALUMINIO', tipo: 'fabrica', porcentaje: 2, desc: 'South32 produce aluminio y alúmina' },
  { empresa: 'Volkswagen Group', recurso: 'ALUMINIO', tipo: 'depende', porcentaje: 2, desc: 'Volkswagen depende de aluminio para carrocerías más ligeras' },
  { empresa: 'BMW Group', recurso: 'ALUMINIO', tipo: 'depende', porcentaje: 2, desc: 'BMW depende de aluminio para componentes estructurales' },
  { empresa: 'Ford Motor', recurso: 'ALUMINIO', tipo: 'depende', porcentaje: 2, desc: 'Ford usa aluminio extensivamente en su línea F-150' },

  // ===== ORO =====
  { empresa: 'Newmont', recurso: 'ORO', tipo: 'fabrica', porcentaje: 5, desc: 'Mayor productora de oro del mundo' },
  { empresa: 'Barrick Gold', recurso: 'ORO', tipo: 'fabrica', porcentaje: 4, desc: 'Una de las mayores mineras de oro del mundo' },
  { empresa: 'Agnico Eagle Mines', recurso: 'ORO', tipo: 'fabrica', porcentaje: 2, desc: 'Importante productora de oro canadiense' },
  { empresa: 'Zijin Mining', recurso: 'ORO', tipo: 'fabrica', porcentaje: 2, desc: 'Zijin Mining también produce oro junto con cobre' },

  // ===== PANTALLAS_OLED =====
  { empresa: 'Samsung Electronics', recurso: 'PANTALLAS_OLED', tipo: 'fabrica', porcentaje: 45, desc: 'Mayor fabricante mundial de pantallas OLED' },
  { empresa: 'LG Display', recurso: 'PANTALLAS_OLED', tipo: 'fabrica', porcentaje: 25, desc: 'Segundo mayor fabricante de pantallas OLED, principal proveedor de TVs' },
  { empresa: 'BOE Technology', recurso: 'PANTALLAS_OLED', tipo: 'fabrica', porcentaje: 15, desc: 'BOE es el mayor fabricante de pantallas de China' },
  { empresa: 'Apple', recurso: 'PANTALLAS_OLED', tipo: 'depende', porcentaje: 10, desc: 'Apple depende de Samsung y LG para pantallas OLED del iPhone' },
  { empresa: 'Xiaomi', recurso: 'PANTALLAS_OLED', tipo: 'depende', porcentaje: 4, desc: 'Xiaomi depende de pantallas OLED de proveedores externos' },
  { empresa: 'Sony', recurso: 'PANTALLAS_OLED', tipo: 'depende', porcentaje: 3, desc: 'Sony depende de paneles OLED para sus televisores premium' },

  // ===== BATERIAS_LITIO =====
  { empresa: 'Samsung SDI', recurso: 'BATERIAS_LITIO', tipo: 'fabrica', porcentaje: 12, desc: 'Samsung SDI es uno de los mayores fabricantes de baterías de litio' },
  { empresa: 'Panasonic', recurso: 'BATERIAS_LITIO', tipo: 'fabrica', porcentaje: 10, desc: 'Panasonic fabrica las celdas de batería usadas por Tesla' },
  { empresa: 'Tesla', recurso: 'BATERIAS_LITIO', tipo: 'depende', porcentaje: 8, desc: 'Tesla depende de baterías de litio para todos sus vehículos' },
  { empresa: 'BMW Group', recurso: 'BATERIAS_LITIO', tipo: 'depende', porcentaje: 4, desc: 'BMW depende de baterías de litio para su línea de EVs' },
  { empresa: 'Volkswagen Group', recurso: 'BATERIAS_LITIO', tipo: 'depende', porcentaje: 5, desc: 'Volkswagen depende de baterías de litio para su transición a EVs' },
  { empresa: 'BYD', recurso: 'BATERIAS_LITIO', tipo: 'fabrica', porcentaje: 15, desc: 'BYD fabrica sus propias baterías LFP para vehículos eléctricos' },

  // ===== MEMORIA_DRAM =====
  { empresa: 'Samsung Electronics', recurso: 'MEMORIA_DRAM', tipo: 'fabrica', porcentaje: 40, desc: 'Mayor fabricante mundial de memoria DRAM' },
  { empresa: 'SK Hynix', recurso: 'MEMORIA_DRAM', tipo: 'fabrica', porcentaje: 28, desc: 'Segundo mayor fabricante mundial de memoria DRAM' },
  { empresa: 'Micron Technology', recurso: 'MEMORIA_DRAM', tipo: 'fabrica', porcentaje: 22, desc: 'Tercer mayor fabricante mundial de memoria DRAM' },
  { empresa: 'NVIDIA', recurso: 'MEMORIA_DRAM', tipo: 'depende', porcentaje: 8, desc: 'NVIDIA depende de memoria HBM para sus GPUs de IA' },
  { empresa: 'Dell Technologies', recurso: 'MEMORIA_DRAM', tipo: 'depende', porcentaje: 4, desc: 'Dell depende de memoria DRAM para servidores y PCs' },
  { empresa: 'Apple', recurso: 'MEMORIA_DRAM', tipo: 'depende', porcentaje: 5, desc: 'Apple depende de memoria DRAM de Samsung y SK Hynix' },

  // ===== SSD_NAND =====
  { empresa: 'Samsung Electronics', recurso: 'SSD_NAND', tipo: 'fabrica', porcentaje: 33, desc: 'Líder mundial en fabricación de memoria NAND flash' },
  { empresa: 'SK Hynix', recurso: 'SSD_NAND', tipo: 'fabrica', porcentaje: 20, desc: 'SK Hynix es uno de los mayores fabricantes de NAND flash' },
  { empresa: 'Kioxia', recurso: 'SSD_NAND', tipo: 'fabrica', porcentaje: 18, desc: 'Kioxia (ex-Toshiba Memory) es líder histórico en NAND flash' },
  { empresa: 'Micron Technology', recurso: 'SSD_NAND', tipo: 'fabrica', porcentaje: 12, desc: 'Micron fabrica memoria NAND flash para almacenamiento SSD' },
  { empresa: 'Dell Technologies', recurso: 'SSD_NAND', tipo: 'depende', porcentaje: 4, desc: 'Dell depende de NAND flash para almacenamiento en servidores y laptops' },
  { empresa: 'HP Inc.', recurso: 'SSD_NAND', tipo: 'depende', porcentaje: 3, desc: 'HP depende de almacenamiento SSD para sus equipos' },
]
