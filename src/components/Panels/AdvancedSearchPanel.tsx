'use client'

import { useEffect, useState } from 'react'
import { Empresa } from '@/types'
import { supabase } from '@/lib/supabase'

interface AdvancedSearchPanelProps {
  searchTerm: string
  onCompanySelect: (companyId: string) => void
}

interface ResultadoRecurso {
  tipo: 'fabrica' | 'importa' | 'exporta' | 'depende'
  empresa: Empresa
  recurso: any
  relacion: any
}

export default function AdvancedSearchPanel({ searchTerm, onCompanySelect }: AdvancedSearchPanelProps) {
  const [resultados, setResultados] = useState<ResultadoRecurso[]>([])
  const [recursoEncontrado, setRecursoEncontrado] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [recursos, setRecursos] = useState<any[]>([])
  const [recursosEmpresa, setRecursosEmpresa] = useState<any[]>([])

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [empresasRes, recursosRes, recursosEmpresaRes] = await Promise.all([
          supabase.from('empresas').select('*'),
          supabase.from('recursos_criticos').select('*'),
          supabase.from('recursos_empresa').select('*'),
        ])

        if (empresasRes.error) throw empresasRes.error
        if (recursosRes.error) throw recursosRes.error
        if (recursosEmpresaRes.error) throw recursosEmpresaRes.error

        setEmpresas(empresasRes.data || [])
        setRecursos(recursosRes.data || [])
        setRecursosEmpresa(recursosEmpresaRes.data || [])
        setDataLoaded(true)
      } catch (error) {
        console.error('Error loading data:', error)
        setDataLoaded(true)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2 || !dataLoaded) {
      setResultados([])
      setRecursoEncontrado(null)
      return
    }

    setIsLoading(true)

    const termLower = searchTerm.toLowerCase()

    // Buscar recurso crítico
    const recursoMatch = recursos.find((r: any) =>
      r.nombre.toLowerCase().includes(termLower) ||
      r.id.toLowerCase().includes(termLower) ||
      r.descripcion.toLowerCase().includes(termLower)
    )

    if (recursoMatch) {
      setRecursoEncontrado(recursoMatch)

      // Obtener todas las relaciones para este recurso
      const relacionesRecurso = recursosEmpresa.filter(
        (r: any) => r.recurso_id === recursoMatch.id
      )

      // Mapear a empresas y agrupar por tipo
      const resultadosAgrupados = relacionesRecurso
        .map((rel: any) => ({
          tipo: rel.tipo as 'fabrica' | 'importa' | 'exporta' | 'depende',
          empresa: empresas.find((e: any) => e.id === rel.empresa_id),
          recurso: recursoMatch,
          relacion: rel,
        }))
        .filter(r => r.empresa) as ResultadoRecurso[]

      setResultados(resultadosAgrupados)
    } else {
      // Búsqueda por empresa o sector
      const resultadoEmpresas = empresas.filter((e: any) =>
        e.nombre.toLowerCase().includes(termLower) ||
        e.ticker.toLowerCase().includes(termLower) ||
        e.sector.toLowerCase().includes(termLower) ||
        e.subsector.toLowerCase().includes(termLower)
      )

      const resultadosMap = resultadoEmpresas.map((emp: any) => ({
        tipo: 'depende' as const,
        empresa: emp,
        recurso: { nombre: 'Búsqueda General', id: 'GENERAL' },
        relacion: {},
      }))

      setResultados(resultadosMap as any)
      setRecursoEncontrado(null)
    }

    setIsLoading(false)
  }, [searchTerm, dataLoaded, empresas, recursos, recursosEmpresa])

  const fabricantes = resultados.filter(r => r.tipo === 'fabrica')
  const importadores = resultados.filter(r => r.tipo === 'importa')
  const exportadores = resultados.filter(r => r.tipo === 'exporta')
  const dependientes = resultados.filter(r => r.tipo === 'depende')

  return (
    <div className="p-5 space-y-6 text-sm overflow-y-auto">
      {/* Encabezado */}
      <div>
        <div className="panel-title">Resultados de Búsqueda</div>

        {isLoading ? (
          <p className="text-xs text-[#aaa] py-8 text-center">Buscando...</p>
        ) : recursoEncontrado ? (
          // Resultados para Recurso Crítico
          <>
            <div className="bg-[#1a1a1a] p-4 rounded border border-[#ff8c42] mt-3 space-y-2">
              <h3 className="font-bold text-[#ff8c42]">📦 {recursoEncontrado.nombre}</h3>
              <p className="text-xs text-[#aaa]">{recursoEncontrado.descripcion}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-[#0a0a0a] p-2 rounded">
                  <span className="text-[#aaa]">Volatilidad:</span>
                  <div className="text-[#ff8c42] font-bold">{recursoEncontrado.volatilidad.toUpperCase()}</div>
                </div>
                <div className="bg-[#0a0a0a] p-2 rounded">
                  <span className="text-[#aaa]">Precio:</span>
                  <div className="text-[#00d4ff] font-bold">${recursoEncontrado.precio_actual}</div>
                </div>
              </div>

              {/* Principales Productores */}
              <div className="mt-3 pt-3 border-t border-[#333]">
                <div className="text-xs font-bold text-[#ff8c42] mb-2">Principales Productores:</div>
                <div className="space-y-1">
                  {recursoEncontrado.principales_productores.map((prod: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#aaa]">{prod.pais}</span>
                      <span className="text-[#00d4ff]">{prod.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Empresas por Tipo de Relación */}
            <div className="mt-4 space-y-4">
              {/* Fabricantes */}
              {fabricantes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#ff8c42] mb-2 flex items-center gap-2">
                    ✏️ FABRICAN ({fabricantes.length})
                  </div>
                  <div className="space-y-2">
                    {fabricantes.slice(0, 5).map(res => (
                      <div
                        key={res.empresa.id}
                        className="bg-[#1a1a1a] p-2 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
                        onClick={() => onCompanySelect(res.empresa.id)}
                      >
                        <div className="font-bold text-white text-xs">{res.empresa.nombre}</div>
                        <div className="text-xs text-[#aaa] mt-1">
                          {res.empresa.sector} • Cap: ${(res.empresa.cap_mercado / 1e9).toFixed(0)}B
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Importadores */}
              {importadores.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#00d4ff] mb-2 flex items-center gap-2">
                    📥 IMPORTAN ({importadores.length})
                  </div>
                  <div className="space-y-2">
                    {importadores.slice(0, 5).map(res => (
                      <div
                        key={res.empresa.id}
                        className="bg-[#1a1a1a] p-2 rounded border border-[#333] hover:border-[#00d4ff] cursor-pointer transition-all"
                        onClick={() => onCompanySelect(res.empresa.id)}
                      >
                        <div className="font-bold text-white text-xs">{res.empresa.nombre}</div>
                        <div className="text-xs text-[#aaa] mt-1">
                          {res.empresa.sector} • {res.relacion.proveedor_principal && `Proveedor: ${res.relacion.proveedor_principal}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exportadores */}
              {exportadores.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#ff8c42] mb-2 flex items-center gap-2">
                    📤 EXPORTAN ({exportadores.length})
                  </div>
                  <div className="space-y-2">
                    {exportadores.slice(0, 5).map(res => (
                      <div
                        key={res.empresa.id}
                        className="bg-[#1a1a1a] p-2 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
                        onClick={() => onCompanySelect(res.empresa.id)}
                      >
                        <div className="font-bold text-white text-xs">{res.empresa.nombre}</div>
                        <div className="text-xs text-[#aaa] mt-1">
                          Ingresos: ${(res.relacion.ingresos_anuales / 1e9).toFixed(2)}B
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependientes */}
              {dependientes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#ff3333] mb-2 flex items-center gap-2">
                    🔗 DEPENDEN ({dependientes.length})
                  </div>
                  <div className="space-y-2">
                    {dependientes.slice(0, 5).map(res => (
                      <div
                        key={res.empresa.id}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          res.relacion.criticidad === 'critica'
                            ? 'bg-[#ff3333] bg-opacity-10 border-[#ff3333]'
                            : 'bg-[#1a1a1a] border-[#333]'
                        }`}
                        onClick={() => onCompanySelect(res.empresa.id)}
                      >
                        <div className="font-bold text-white text-xs">{res.empresa.nombre}</div>
                        <div className="text-xs text-[#aaa] mt-1">
                          Dependencia: {res.relacion.porcentaje_dependencia?.toFixed(0)}%
                          {res.relacion.criticidad === 'critica' && <span className="text-[#ff3333] font-bold ml-2">⚠️ CRÍTICA</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Resultados por empresa
          <div className="mt-3 space-y-2">
            {resultados.length > 0 ? (
              resultados.slice(0, 10).map(res => (
                <div
                  key={res.empresa.id}
                  className="bg-[#1a1a1a] p-3 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
                  onClick={() => onCompanySelect(res.empresa.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white">{res.empresa.nombre}</div>
                      <div className="text-xs text-[#aaa] mt-1">
                        {res.empresa.ticker} • {res.empresa.sector}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[#ff8c42]">
                      ${(res.empresa.cap_mercado / 1e9).toFixed(0)}B
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#aaa] text-xs py-8 text-center">
                No se encontraron resultados. Intenta:
                <br />
                • "IMANES" • "LITIO" • "SEMICONDUCTORES"
                <br />
                • "Taiwán" • "TSMC" • "NVIDIA"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sugerencias */}
      {!searchTerm && (
        <div className="border-t border-[#333] pt-4">
          <div className="panel-title text-xs mb-3">Busca Recursos Críticos</div>
          <div className="space-y-2">
            {['IMANES', 'LITIO', 'SEMICONDUCTORES_CHIPS', 'PETROLEO', 'COBRE'].map(r => (
              <button
                key={r}
                className="w-full text-left text-xs bg-[#1a1a1a] p-2 rounded border border-[#333] hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all"
              >
                {r.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
