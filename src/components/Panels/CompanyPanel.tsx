'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import empresas from '@/data/empresas_500.json'
import dependencias from '@/data/dependencias.json'
import paises from '@/data/paises.json'
import { Empresa, Dependencia } from '@/types'

const DependencyGraph = dynamic(() => import('@/components/Graph/DependencyGraph'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-[#0a0a0a] flex items-center justify-center text-[#aaa]">Cargando grafo...</div>
})

interface CompanyPanelProps {
  companyId: string
  onClose: () => void
}

export default function CompanyPanel({ companyId, onClose }: CompanyPanelProps) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [misDependencias, setMisDependencias] = useState<Dependencia[]>([])
  const [proveedores, setProveedores] = useState<Empresa[]>([])
  const [paisEmpresa, setPaisEmpresa] = useState<string>('')
  const [showGraph, setShowGraph] = useState(false)
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null)

  useEffect(() => {
    // Obtener datos de la empresa
    const empresaData = empresas.find(e => e.id === companyId)
    setEmpresa(empresaData || null)

    if (empresaData) {
      // Obtener país
      const pais = paises.find(p => p.id === empresaData.pais_id)
      setPaisEmpresa(pais?.nombre || 'Desconocido')

      // Obtener dependencias (donde esta empresa depende)
      const deps = dependencias.filter(d => d.empresa_a === companyId)
      setMisDependencias(deps)

      // Obtener proveedores
      const provs = deps
        .map(d => empresas.find(e => e.id === d.empresa_b))
        .filter(Boolean) as Empresa[]
      setProveedores(provs)
    }
  }, [companyId])

  // Manejar selección de nodo en grafo
  useEffect(() => {
    if (selectedGraphNode) {
      // Cambiar empresa seleccionada
      onClose()
      // Nota: el cambio de empresa debe hacerse desde el padre (page.tsx)
    }
  }, [selectedGraphNode])

  if (!empresa) {
    return (
      <div className="p-5 text-[#aaa]">
        Cargando detalles de la empresa...
      </div>
    )
  }

  // Mostrar grafo si está activado
  if (showGraph) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-[#333] bg-[#0a0a0a]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Cadena de Suministro: {empresa.nombre}</h2>
            <button
              onClick={() => setShowGraph(false)}
              className="text-[#ff8c42] hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#aaa] mt-2">
            {empresas.filter(e => {
              const hasLink = dependencias.some(
                d => (d.empresa_a === companyId && d.empresa_b === e.id) ||
                     (d.empresa_a === e.id && d.empresa_b === companyId)
              )
              return hasLink
            }).length} empresas conectadas
          </p>
        </div>
        <DependencyGraph
          companyId={companyId}
          onNodeClick={(nodeId) => {
            setSelectedGraphNode(nodeId)
            setShowGraph(false)
            // El padre (page.tsx) debe manejar el cambio de empresa
            window.dispatchEvent(new CustomEvent('selectCompany', { detail: nodeId }))
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-5 space-y-6 text-sm overflow-y-auto">
      {/* Header con cerrar */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{empresa.nombre}</h2>
          <div className="text-xs text-[#aaa] mt-1">
            {empresa.ticker} • {paisEmpresa}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#ff8c42] hover:text-white text-xl w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Info Principal */}
      <div className="bg-[#1a1a1a] p-4 rounded border border-[#333] space-y-3">
        <div className="flex justify-between">
          <div>
            <div className="text-[#aaa] text-xs">Cap. Mercado</div>
            <div className="text-[#ff8c42] font-bold">${(empresa.cap_mercado / 1e12).toFixed(2)}T</div>
          </div>
          <div>
            <div className="text-[#aaa] text-xs">Sector</div>
            <div className="text-white font-bold">{empresa.sector}</div>
          </div>
        </div>
        <div>
          <div className="text-[#aaa] text-xs">Subsector</div>
          <div className="text-white">{empresa.subsector}</div>
        </div>
        <div>
          <div className="text-[#aaa] text-xs mb-1">Estado Geopolítico</div>
          <div className={`text-xs px-2 py-1 rounded inline-block ${
            empresa.estado_geopolitico === 'critico' ? 'bg-[#ff3333] text-white' :
            empresa.estado_geopolitico === 'riesgo' ? 'bg-[#ff8c42] text-black' :
            'bg-[#00d4ff] text-black'
          }`}>
            {empresa.estado_geopolitico.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Resumen Trimestral */}
      <div>
        <div className="panel-title">Resumen Trimestral {empresa.resumen_trimestral.trimestre}</div>
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#333] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#aaa]">Ingresos:</span>
            <span className="text-white font-mono">${(empresa.resumen_trimestral.ingresos / 1e9).toFixed(2)}B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#aaa]">Beneficio Neto:</span>
            <span className="text-white font-mono">${(empresa.resumen_trimestral.beneficio_neto / 1e9).toFixed(2)}B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#aaa]">Margen:</span>
            <span className="text-[#ff8c42] font-mono">{empresa.resumen_trimestral.margenes.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between border-t border-[#333] pt-2 mt-2">
            <span className="text-[#aaa]">Crecimiento YoY:</span>
            <span className={empresa.resumen_trimestral.yoy_crecimiento > 0 ? 'text-[#00d4ff]' : 'text-[#ff3333]'}>
              {empresa.resumen_trimestral.yoy_crecimiento > 0 ? '+' : ''}
              {empresa.resumen_trimestral.yoy_crecimiento.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Dependencias (Proveedores) */}
      <div>
        <div className="panel-title">
          Proveedores Críticos ({proveedores.length})
        </div>
        {proveedores.length > 0 ? (
          <div className="space-y-2">
            {proveedores.map((proveedor, idx) => {
              const dep = misDependencias.find(d => d.empresa_b === proveedor.id)
              return (
                <div
                  key={proveedor.id}
                  className={`p-3 rounded border transition-all ${
                    dep?.es_critica
                      ? 'bg-[#ff3333] bg-opacity-10 border-[#ff3333]'
                      : 'bg-[#1a1a1a] border-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{proveedor.nombre}</div>
                      <div className="text-xs text-[#aaa] mt-1">{proveedor.sector}</div>
                    </div>
                    {dep?.es_critica && (
                      <div className="text-[#ff3333] text-xs font-bold">🔴 CRÍTICA</div>
                    )}
                  </div>
                  <div className="text-xs text-[#aaa] mt-2">
                    Suministra: <span className="text-[#ff8c42]">{dep?.porcentaje_suministro.toFixed(0)}%</span>
                  </div>
                  {dep?.descripcion && (
                    <div className="text-xs text-[#888] mt-2 italic">
                      {dep.descripcion}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[#aaa] text-xs py-4 text-center">
            No hay dependencias registradas
          </p>
        )}
      </div>

      {/* Ubicación */}
      <div>
        <div className="panel-title">Ubicación</div>
        <div className="text-xs text-[#aaa]">
          <p>Coordenadas: {empresa.ubicacion_hq.lat}, {empresa.ubicacion_hq.lon}</p>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <div className="panel-title">Descripción</div>
        <p className="text-[#aaa] text-xs leading-relaxed">
          {empresa.descripcion}
        </p>
      </div>

      {/* Botón Análisis de Cadena */}
      <button
        onClick={() => setShowGraph(true)}
        className="w-full bg-[#ff8c42] text-black px-4 py-2 rounded font-bold text-xs hover:bg-[#ffa060] transition-all"
      >
        📊 Ver Cadena de Suministro Completa
      </button>
    </div>
  )
}
