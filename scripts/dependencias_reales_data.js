// Dependencias reales y bien documentadas entre empresas de
// empresas_reales_data.js. empresa_a depende de empresa_b (proveedor).
// Se referencian por nombre; generar_dependencias_reales.js resuelve los IDs
// contra src/data/empresas_500.json ya generado.
//
// porcentaje_suministro es una estimación razonable (no una cifra oficial
// exacta de cadena de suministro, que las empresas no publican).

module.exports = [
  // ===== Fabricación de chips (Taiwán/Holanda/Corea) =====
  { a: 'Apple', b: 'TSMC', porcentaje: 90, critica: true, desc: 'Apple depende de TSMC para fabricar los chips A-series y M-series' },
  { a: 'NVIDIA', b: 'TSMC', porcentaje: 92, critica: true, desc: 'NVIDIA depende de TSMC para fabricar sus GPUs de IA' },
  { a: 'AMD', b: 'TSMC', porcentaje: 88, critica: true, desc: 'AMD depende de TSMC para fabricar CPUs y GPUs' },
  { a: 'Qualcomm', b: 'TSMC', porcentaje: 70, critica: true, desc: 'Qualcomm depende de TSMC para fabricar chips móviles Snapdragon' },
  { a: 'MediaTek', b: 'TSMC', porcentaje: 85, critica: true, desc: 'MediaTek depende de TSMC para fabricar sus chips móviles' },
  { a: 'Foxconn (Hon Hai)', b: 'TSMC', porcentaje: 40, critica: false, desc: 'Foxconn ensambla productos que dependen de chips fabricados por TSMC' },

  { a: 'TSMC', b: 'ASML', porcentaje: 95, critica: true, desc: 'TSMC depende de ASML como único proveedor de máquinas de litografía EUV' },
  { a: 'Samsung Electronics', b: 'ASML', porcentaje: 90, critica: true, desc: 'Samsung depende de ASML para fabricar chips avanzados' },
  { a: 'Intel', b: 'ASML', porcentaje: 85, critica: true, desc: 'Intel depende de ASML para su nueva generación de procesos avanzados' },
  { a: 'SK Hynix', b: 'ASML', porcentaje: 80, critica: true, desc: 'SK Hynix depende de ASML para fabricar memoria avanzada' },
  { a: 'Micron Technology', b: 'ASML', porcentaje: 75, critica: false, desc: 'Micron depende de ASML para procesos de memoria de última generación' },

  { a: 'TSMC', b: 'Applied Materials', porcentaje: 60, critica: false, desc: 'TSMC depende de equipos de fabricación de Applied Materials' },
  { a: 'TSMC', b: 'Lam Research', porcentaje: 55, critica: false, desc: 'TSMC usa equipos de grabado de Lam Research' },
  { a: 'TSMC', b: 'KLA Corporation', porcentaje: 50, critica: false, desc: 'TSMC depende de equipos de inspección de KLA' },
  { a: 'TSMC', b: 'Tokyo Electron', porcentaje: 60, critica: false, desc: 'TSMC usa equipos de recubrimiento y grabado de Tokyo Electron' },
  { a: 'Samsung Electronics', b: 'Tokyo Electron', porcentaje: 55, critica: false, desc: 'Samsung depende de equipos de fabricación de Tokyo Electron' },
  { a: 'SK Hynix', b: 'Applied Materials', porcentaje: 50, critica: false, desc: 'SK Hynix depende de equipos de deposición de Applied Materials' },

  { a: 'SMIC', b: 'ASML', porcentaje: 30, critica: true, desc: 'SMIC depende de equipos de ASML, limitados por controles de exportación' },
  { a: 'Huawei', b: 'SMIC', porcentaje: 60, critica: true, desc: 'Huawei depende de SMIC tras quedar excluida de TSMC por sanciones de EEUU' },
  { a: 'ZTE', b: 'SMIC', porcentaje: 45, critica: true, desc: 'ZTE depende de fundiciones chinas como SMIC por restricciones de exportación' },

  // ===== Ensamblaje (Apple y otros → contratistas) =====
  { a: 'Apple', b: 'Foxconn (Hon Hai)', porcentaje: 65, critica: true, desc: 'Foxconn ensambla la mayoría de los iPhones' },
  { a: 'Apple', b: 'Pegatron', porcentaje: 20, critica: false, desc: 'Pegatron es el segundo mayor ensamblador de iPhones' },
  { a: 'Apple', b: 'Luxshare Precision', porcentaje: 15, critica: false, desc: 'Luxshare ensambla AirPods y participa en el ensamblaje de iPhones' },
  { a: 'Xiaomi', b: 'Wistron', porcentaje: 30, critica: false, desc: 'Wistron ensambla parte de los smartphones de Xiaomi' },
  { a: 'ASUS', b: 'Pegatron', porcentaje: 25, critica: false, desc: 'Pegatron, escindida de ASUS, ensambla parte de sus productos' },

  // ===== Chips para smartphones y computadoras =====
  { a: 'Xiaomi', b: 'Qualcomm', porcentaje: 55, critica: true, desc: 'Xiaomi depende de chips Snapdragon de Qualcomm en sus gamas altas' },
  { a: 'Xiaomi', b: 'MediaTek', porcentaje: 40, critica: false, desc: 'Xiaomi usa chips MediaTek en gamas media y baja' },
  { a: 'Dell Technologies', b: 'Intel', porcentaje: 60, critica: true, desc: 'Dell depende de procesadores Intel para la mayoría de sus equipos' },
  { a: 'Dell Technologies', b: 'AMD', porcentaje: 25, critica: false, desc: 'Dell incorpora procesadores AMD en parte de su línea' },
  { a: 'HP Inc.', b: 'Intel', porcentaje: 65, critica: true, desc: 'HP depende de procesadores Intel para la mayoría de sus PCs' },
  { a: 'ASUS', b: 'Intel', porcentaje: 50, critica: false, desc: 'ASUS depende de procesadores Intel en gran parte de su línea' },
  { a: 'ASUS', b: 'AMD', porcentaje: 30, critica: false, desc: 'ASUS incorpora procesadores AMD en su línea gaming' },
  { a: 'Acer', b: 'Intel', porcentaje: 55, critica: false, desc: 'Acer depende de procesadores Intel en la mayoría de sus laptops' },
  { a: 'Cisco Systems', b: 'Broadcom', porcentaje: 40, critica: false, desc: 'Cisco depende de chips de red de Broadcom' },

  // ===== Memoria y almacenamiento =====
  { a: 'NVIDIA', b: 'SK Hynix', porcentaje: 60, critica: true, desc: 'NVIDIA depende de SK Hynix para memoria HBM en sus GPUs de IA' },
  { a: 'NVIDIA', b: 'Samsung Electronics', porcentaje: 35, critica: false, desc: 'NVIDIA también usa memoria de Samsung en sus GPUs' },
  { a: 'Dell Technologies', b: 'Micron Technology', porcentaje: 40, critica: false, desc: 'Dell depende de memoria de Micron para sus servidores y PCs' },
  { a: 'Apple', b: 'Samsung Electronics', porcentaje: 30, critica: true, desc: 'Apple depende de Samsung para memoria y pantallas OLED' },
  { a: 'Apple', b: 'LG Display', porcentaje: 25, critica: false, desc: 'Apple depende de LG Display para pantallas OLED del iPhone' },

  // ===== Automotriz: chips =====
  { a: 'Toyota', b: 'Renesas Electronics', porcentaje: 40, critica: true, desc: 'Toyota depende de Renesas para chips de control automotriz' },
  { a: 'Honda', b: 'Renesas Electronics', porcentaje: 45, critica: true, desc: 'Honda depende de Renesas para semiconductores automotrices' },
  { a: 'Nissan', b: 'Renesas Electronics', porcentaje: 40, critica: false, desc: 'Nissan depende de Renesas para chips de control de vehículos' },
  { a: 'BMW Group', b: 'Infineon Technologies', porcentaje: 45, critica: true, desc: 'BMW depende de Infineon para semiconductores de potencia' },
  { a: 'Volkswagen Group', b: 'Infineon Technologies', porcentaje: 40, critica: true, desc: 'Volkswagen depende de Infineon para chips automotrices' },
  { a: 'Mercedes-Benz Group', b: 'Infineon Technologies', porcentaje: 40, critica: false, desc: 'Mercedes-Benz depende de Infineon para electrónica de potencia' },
  { a: 'General Motors', b: 'ON Semiconductor', porcentaje: 35, critica: false, desc: 'GM depende de ON Semiconductor para chips de potencia automotrices' },
  { a: 'Ford Motor', b: 'ON Semiconductor', porcentaje: 35, critica: false, desc: 'Ford depende de ON Semiconductor para semiconductores de vehículos' },
  { a: 'Renault', b: 'STMicroelectronics', porcentaje: 40, critica: false, desc: 'Renault depende de STMicroelectronics para chips automotrices' },
  { a: 'Volkswagen Group', b: 'Continental AG', porcentaje: 50, critica: false, desc: 'Volkswagen depende de Continental para sistemas electrónicos' },
  { a: 'BMW Group', b: 'Continental AG', porcentaje: 45, critica: false, desc: 'BMW depende de Continental para componentes y sensores' },

  // ===== Baterías EV y litio =====
  { a: 'Tesla', b: 'Panasonic', porcentaje: 40, critica: true, desc: 'Tesla depende de Panasonic para celdas de batería' },
  { a: 'Tesla', b: 'Samsung SDI', porcentaje: 20, critica: false, desc: 'Tesla también usa baterías de Samsung SDI' },
  { a: 'Tesla', b: 'Albemarle', porcentaje: 30, critica: true, desc: 'Tesla depende de Albemarle como proveedor de litio' },
  { a: 'BMW Group', b: 'Samsung SDI', porcentaje: 35, critica: true, desc: 'BMW depende de Samsung SDI para baterías de vehículos eléctricos' },
  { a: 'Volkswagen Group', b: 'Samsung SDI', porcentaje: 30, critica: false, desc: 'Volkswagen depende de Samsung SDI para baterías EV' },
  { a: 'Panasonic', b: 'Albemarle', porcentaje: 35, critica: true, desc: 'Panasonic depende de Albemarle como proveedor de litio para baterías' },
  { a: 'BYD', b: 'China Northern Rare Earth', porcentaje: 25, critica: false, desc: 'BYD depende de tierras raras para motores de vehículos eléctricos' },

  // ===== Tierras raras y minerales =====
  { a: 'Apple', b: 'China Northern Rare Earth', porcentaje: 20, critica: true, desc: 'Apple depende de tierras raras chinas para imanes y hápticos' },
  { a: 'Siemens', b: 'China Northern Rare Earth', porcentaje: 25, critica: true, desc: 'Siemens depende de tierras raras para motores eléctricos y turbinas' },
  { a: 'Renesas Electronics', b: 'China Northern Rare Earth', porcentaje: 15, critica: false, desc: 'Renesas depende parcialmente de tierras raras para componentes' },

  // ===== Refinación y petróleo =====
  { a: 'Shell', b: 'ExxonMobil', porcentaje: 10, critica: false, desc: 'Coordinación limitada en infraestructura conjunta de refinación' },
  { a: 'Toyota', b: 'ExxonMobil', porcentaje: 15, critica: false, desc: 'Toyota depende de combustibles y lubricantes refinados' },

  // ===== Telecomunicaciones =====
  { a: 'Vodafone', b: 'Ericsson', porcentaje: 40, critica: false, desc: 'Vodafone depende de Ericsson para infraestructura de red 5G' },
  { a: 'BT Group', b: 'Ericsson', porcentaje: 35, critica: false, desc: 'BT depende de Ericsson para equipamiento de red' },
  { a: 'KDDI', b: 'Ericsson', porcentaje: 30, critica: false, desc: 'KDDI depende de Ericsson para infraestructura 5G' },
  { a: 'China Mobile', b: 'Huawei', porcentaje: 50, critica: false, desc: 'China Mobile depende de Huawei para infraestructura de red' },
]
