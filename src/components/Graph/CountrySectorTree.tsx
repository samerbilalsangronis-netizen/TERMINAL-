'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { supabase } from '@/lib/supabase'
import { Empresa, Pais } from '@/types'

interface CountrySectorTreeProps {
  countryId: string
  onCompanySelect: (companyId: string) => void
}

// Paleta fija para los sectores conocidos hoy; cualquier sector nuevo que se
// agregue más adelante cae en la paleta de respaldo (hash estable por nombre)
// así el árbol nunca se rompe visualmente al crecer el dataset.
const SECTOR_COLORS: Record<string, string> = {
  'Semiconductores': '#00d4ff',
  'Software y Nube': '#7c5cff',
  'Electrónica de Consumo': '#ff8c42',
  'Equipamiento': '#ffd166',
  'Automotriz': '#ff6b9d',
  'Manufactura': '#4ecdc4',
  'Energía': '#ff3333',
  'Minería y Recursos': '#a78bfa',
  'Logística': '#06d6a0',
  'Telecomunicaciones': '#f77f00',
}
const FALLBACK_PALETTE = ['#00d4ff', '#ff8c42', '#4ecdc4', '#a78bfa', '#ff6b9d', '#06d6a0']

function colorForSector(sector: string): string {
  if (SECTOR_COLORS[sector]) return SECTOR_COLORS[sector]
  let hash = 0
  for (let i = 0; i < sector.length; i++) hash = sector.charCodeAt(i) + ((hash << 5) - hash)
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length]
}

const ESTADO_BORDER: Record<string, string> = {
  normal: '#00d4ff',
  riesgo: '#ff8c42',
  critico: '#ff3333',
}

interface TreeNode extends d3.SimulationNodeDatum {
  id: string
  kind: 'root' | 'sector' | 'empresa'
  label: string
  color: string
  border?: string
  empresa?: Empresa
  radius: number
}

interface TreeLink extends d3.SimulationLinkDatum<TreeNode> {
  source: string | TreeNode
  target: string | TreeNode
}

export default function CountrySectorTree({ countryId, onCompanySelect }: CountrySectorTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pais, setPais] = useState<Pais | null>(null)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: paisData, error: paisError } = await supabase
          .from('paises').select('*').eq('codigo', countryId).maybeSingle()
        if (paisError) throw paisError
        setPais(paisData || null)

        if (paisData) {
          const { data: empresasData, error: empresasError } = await supabase
            .from('empresas').select('*').eq('pais_id', paisData.id)
          if (empresasError) throw empresasError
          setEmpresas(empresasData || [])
        } else {
          setEmpresas([])
        }
      } catch (err) {
        console.error('[CountrySectorTree] Error cargando datos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [countryId])

  useEffect(() => {
    if (!svgRef.current || !pais || empresas.length === 0) return

    const width = svgRef.current.clientWidth || 400
    const height = svgRef.current.clientHeight || 500

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    // Construir jerarquía: país (raíz) → sectores → empresas
    const porSector = new Map<string, Empresa[]>()
    empresas.forEach((e) => {
      const list = porSector.get(e.sector) || []
      list.push(e)
      porSector.set(e.sector, list)
    })

    const nodes: TreeNode[] = []
    const links: TreeLink[] = []

    const rootId = 'root'
    nodes.push({ id: rootId, kind: 'root', label: pais.nombre, color: '#ff8c42', radius: 30 })

    porSector.forEach((empresasDelSector, sector) => {
      const sectorId = `sector-${sector}`
      const color = colorForSector(sector)
      nodes.push({ id: sectorId, kind: 'sector', label: `${sector} (${empresasDelSector.length})`, color, radius: 16 })
      links.push({ source: rootId, target: sectorId })

      empresasDelSector.forEach((empresa) => {
        const empresaId = `empresa-${empresa.id}`
        nodes.push({
          id: empresaId,
          kind: 'empresa',
          label: empresa.nombre,
          color,
          border: ESTADO_BORDER[empresa.estado_geopolitico] || '#333',
          empresa,
          radius: 9,
        })
        links.push({ source: sectorId, target: empresaId })
      })
    })

    const simulation = d3.forceSimulation<TreeNode>(nodes)
      .force('link', d3.forceLink<TreeNode, TreeLink>(links)
        .id((d) => d.id)
        .distance((l) => {
          const target = l.target as TreeNode
          return target.kind === 'sector' ? 110 : 46
        })
        .strength(0.9)
      )
      .force('charge', d3.forceManyBody().strength((d) => (d as TreeNode).kind === 'root' ? -400 : -90))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<TreeNode>().radius((d) => d.radius + (d.kind === 'empresa' ? 34 : 10)))

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => (d.target as TreeNode).color)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1)

    // Nodos: raíz y sectores como círculos, empresas como chips redondeados
    const node = g.append('g')
      .selectAll<SVGGElement, TreeNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', (d) => d.kind === 'empresa' ? 'pointer' : 'default')
      .call(d3.drag<SVGGElement, TreeNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
        }) as any
      )

    node.filter((d) => d.kind !== 'empresa')
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.kind === 'root' ? d.color : '#0a0a0a')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)

    node.filter((d) => d.kind !== 'empresa')
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.kind === 'root' ? '0.31em' : -d.radius - 6)
      .attr('font-size', (d) => d.kind === 'root' ? '12px' : '10px')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => d.kind === 'root' ? '#0a0a0a' : d.color)
      .attr('pointer-events', 'none')

    // Chips de empresa: rectángulo redondeado + texto truncado
    const chip = node.filter((d) => d.kind === 'empresa')
    const truncate = (s: string, n: number) => s.length > n ? `${s.slice(0, n - 1)}…` : s

    chip.append('rect')
      .attr('x', -32).attr('y', -10)
      .attr('width', 64).attr('height', 20)
      .attr('rx', 10).attr('ry', 10)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', 0.18)
      .attr('stroke', (d) => d.border || d.color)
      .attr('stroke-width', 1.5)

    chip.append('text')
      .text((d) => truncate(d.label, 12))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.32em')
      .attr('font-size', '8.5px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')

    chip.append('title').text((d) => d.label)

    chip.on('click', (event, d) => {
      event.stopPropagation()
      if (d.empresa) onCompanySelect(d.empresa.id)
    })

    chip.on('mouseenter', function () {
      d3.select(this).select('rect').attr('fill-opacity', 0.5)
    })
    chip.on('mouseleave', function () {
      d3.select(this).select('rect').attr('fill-opacity', 0.18)
    })

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as TreeNode).x || 0)
        .attr('y1', (d) => (d.source as TreeNode).y || 0)
        .attr('x2', (d) => (d.target as TreeNode).x || 0)
        .attr('y2', (d) => (d.target as TreeNode).y || 0)
      node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`)
    })

    // Ajustar zoom para que quepa todo el árbol al terminar de acomodarse
    simulation.on('end', () => {
      const xs = nodes.map((n) => n.x || 0)
      const ys = nodes.map((n) => n.y || 0)
      const minX = Math.min(...xs) - 40, maxX = Math.max(...xs) + 40
      const minY = Math.min(...ys) - 40, maxY = Math.max(...ys) + 40
      const bboxW = maxX - minX, bboxH = maxY - minY
      const scale = Math.min(1.5, 0.72 / Math.max(bboxW / width, bboxH / height))
      const tx = width / 2 - scale * (minX + maxX) / 2
      const ty = height / 2 - scale * (minY + maxY) / 2
      svg.transition().duration(500).call(
        zoom.transform as any,
        d3.zoomIdentity.translate(tx, ty).scale(scale)
      )
    })

    return () => { simulation.stop() }
  }, [pais, empresas, onCompanySelect])

  if (loading) {
    return <div className="p-5 text-[#aaa] text-xs text-center">Cargando mapa de empresas...</div>
  }

  if (!pais) {
    return <div className="p-5 text-[#aaa] text-xs text-center">País no encontrado</div>
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 text-[10px] text-[#aaa] flex items-center justify-between">
        <span>{empresas.length} empresas • {new Set(empresas.map(e => e.sector)).size} sectores</span>
        <span className="text-[#666]">Arrastra para mover • Rueda para zoom</span>
      </div>
      <svg ref={svgRef} className="flex-1 w-full cursor-grab active:cursor-grabbing" />
    </div>
  )
}
