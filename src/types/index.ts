// Tipos principales del proyecto

export interface Pais {
  id: string
  nombre: string
  codigo: string
  region: string
  gdp: number
  poblacion: number
  industrias_clave: string[]
  embargo_status: 'none' | 'partial' | 'complete'
  coordenadas: {
    lat: number
    lon: number
  }
}

export interface Empresa {
  id: string
  nombre: string
  ticker: string
  pais_id: string
  sector: string
  subsector: string
  cap_mercado: number
  ubicacion_hq: {
    lat: number
    lon: number
  }
  resumen_trimestral: {
    trimestre: string
    ingresos: number
    beneficio_neto: number
    margenes: number
    yoy_crecimiento: number
  }
  estado_geopolitico: 'normal' | 'riesgo' | 'critico'
  descripcion: string
}

export interface Dependencia {
  id: string
  empresa_a: string // ID empresa que depende
  empresa_b: string // ID proveedor
  tipo: 'proveedor' | 'cliente' | 'complementaria'
  porcentaje_suministro: number
  es_critica: boolean
  alternativas?: string[]
  descripcion?: string
}

export interface RecursoCritico {
  id: string
  nombre: string
  tipo: string
  principales_productores: {
    pais: string
    porcentaje: number
  }[]
  dependencia_global: number
  precio_actual: number
  volatilidad: 'baja' | 'media' | 'alta'
}

export interface ComercioInternacional {
  id: string
  pais_exportador: string
  pais_importador: string
  recurso: string
  volumen_anual: number
  valor: number
  empresa_exportadora?: string
  empresa_importadora?: string
  porcentaje_del_total: number
}

export interface CuelloBotella {
  id: string
  nombre: string
  ubicacion: {
    lat: number
    lon: number
  }
  tipo: 'geografico' | 'logistico' | 'politico'
  porcentaje_comercio_global: number
  riesgo_nivel: 'bajo' | 'medio' | 'alto' | 'critico'
  empresas_afectadas: string[]
  conflictos_asociados: string[]
  descripcion: string
}

export interface ResultadoBusqueda {
  tipo: 'empresa' | 'pais' | 'recurso' | 'dependencia'
  id: string
  titulo: string
  descripcion: string
  relevancia: number
}

export interface Estado {
  pais_seleccionado: string | null
  empresa_seleccionada: string | null
  modo_conflicto: string | null
  mostrar_dependencias: boolean
  termino_busqueda: string
}
