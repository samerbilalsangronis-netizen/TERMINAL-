import { useEffect, useState } from 'react'

interface Bottleneck {
  id: string
  nombre: string
  pais: string
  latitud: number
  longitud: number
  tipo: string
  criticidad: string
  porcentaje_global: number
  impacto_sectores: string[]
  descripcion: string
  vulnerabilidades: string[]
  empresas_afectadas: string[]
  consecuencias_si_falla: string
  color: string
}

interface BottleneckPanelProps {
  bottleneck: Bottleneck
  onClose: () => void
}

export default function BottleneckPanel({ bottleneck, onClose }: BottleneckPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('vulnerabilidades')

  const getCriticidadColor = (criticidad: string) => {
    switch (criticidad) {
      case 'CRÍTICA':
        return 'text-red-500'
      case 'ALTA':
        return 'text-orange-500'
      case 'MEDIA':
        return 'text-yellow-500'
      default:
        return 'text-cyan-400'
    }
  }

  const getBgColor = (criticidad: string) => {
    switch (criticidad) {
      case 'CRÍTICA':
        return 'bg-red-950 border-red-600'
      case 'ALTA':
        return 'bg-orange-950 border-orange-600'
      case 'MEDIA':
        return 'bg-yellow-950 border-yellow-600'
      default:
        return 'bg-cyan-950 border-cyan-600'
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${getBgColor(bottleneck.criticidad)}`}>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-white flex-1">{bottleneck.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none ml-2"
          >
            ✕
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`px-2 py-1 rounded text-xs font-mono font-bold ${getCriticidadColor(
              bottleneck.criticidad
            )} bg-black bg-opacity-50 border border-current`}
          >
            {bottleneck.criticidad}
          </span>
          <span className="px-2 py-1 rounded text-xs font-mono text-cyan-400 bg-black bg-opacity-50 border border-cyan-400">
            {bottleneck.porcentaje_global}% GLOBAL
          </span>
          <span className="px-2 py-1 rounded text-xs font-mono text-gray-400 bg-black bg-opacity-50 border border-gray-600">
            {bottleneck.tipo}
          </span>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        {/* Descripción general */}
        <div className="p-4 border-b border-gray-800">
          <p className="text-sm text-gray-300 leading-relaxed">{bottleneck.descripcion}</p>
        </div>

        {/* País */}
        <div className="p-4 border-b border-gray-800">
          <div className="text-xs text-gray-500 font-mono mb-1">LOCALIZACIÓN</div>
          <div className="text-sm text-cyan-400 font-mono">{bottleneck.pais}</div>
        </div>

        {/* Sectores impactados */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() =>
              setExpandedSection(expandedSection === 'sectores' ? null : 'sectores')
            }
            className="w-full flex justify-between items-center hover:bg-gray-900 p-2 rounded transition"
          >
            <div className="text-xs text-gray-500 font-mono font-bold">SECTORES IMPACTADOS</div>
            <span className="text-gray-500">
              {expandedSection === 'sectores' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'sectores' && (
            <div className="mt-2 space-y-1">
              {bottleneck.impacto_sectores.map((sector, idx) => (
                <div
                  key={idx}
                  className="text-xs text-orange-400 font-mono ml-2 py-1 border-l-2 border-orange-600 pl-2"
                >
                  ⚡ {sector}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vulnerabilidades */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === 'vulnerabilidades' ? null : 'vulnerabilidades'
              )
            }
            className="w-full flex justify-between items-center hover:bg-gray-900 p-2 rounded transition"
          >
            <div className="text-xs text-red-400 font-mono font-bold">🔴 VULNERABILIDADES</div>
            <span className="text-gray-500">
              {expandedSection === 'vulnerabilidades' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'vulnerabilidades' && (
            <div className="mt-2 space-y-1">
              {bottleneck.vulnerabilidades.map((vuln, idx) => (
                <div
                  key={idx}
                  className="text-xs text-red-400 font-mono ml-2 py-1 border-l-2 border-red-600 pl-2"
                >
                  ⚠️ {vuln}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empresas afectadas */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() =>
              setExpandedSection(expandedSection === 'empresas' ? null : 'empresas')
            }
            className="w-full flex justify-between items-center hover:bg-gray-900 p-2 rounded transition"
          >
            <div className="text-xs text-blue-400 font-mono font-bold">📊 EMPRESAS AFECTADAS</div>
            <span className="text-gray-500">
              {expandedSection === 'empresas' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'empresas' && (
            <div className="mt-2 space-y-1">
              {bottleneck.empresas_afectadas.map((empresa, idx) => (
                <div
                  key={idx}
                  className="text-xs text-blue-400 font-mono ml-2 py-1 border-l-2 border-blue-600 pl-2"
                >
                  🏢 {empresa}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consecuencias si falla */}
        <div className="p-4 border-b border-gray-800">
          <div className="text-xs text-red-400 font-mono font-bold mb-2">💣 CONSECUENCIAS SI FALLA</div>
          <div className="text-xs text-gray-300 leading-relaxed bg-red-950 bg-opacity-20 p-3 rounded border border-red-900">
            {bottleneck.consecuencias_si_falla}
          </div>
        </div>

        {/* Coordenadas */}
        <div className="p-4 bg-gray-900 bg-opacity-30">
          <div className="text-xs text-gray-500 font-mono mb-1">COORDENADAS</div>
          <div className="text-xs text-cyan-400 font-mono">
            {bottleneck.latitud.toFixed(4)}° N, {Math.abs(bottleneck.longitud).toFixed(4)}°{' '}
            {bottleneck.longitud >= 0 ? 'E' : 'W'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 bg-gray-900 bg-opacity-20 text-xs text-gray-500 text-center font-mono">
        ANÁLISIS GEOPOLÍTICO • FASE 5
      </div>
    </div>
  )
}
