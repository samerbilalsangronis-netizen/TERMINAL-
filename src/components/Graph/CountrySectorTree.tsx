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

interface NodeDatum {
  id: string
  kind: 'root' | 'sector' | 'empresa'
  label: string
  color: string
  border?: string
  empresa?: Empresa
  children?: NodeDatum[]
}

const ROOT_W = 200, ROOT_H = 64
const SECTOR_W = 150, SECTOR_H = 44
const CHIP_W = 112, CHIP_H = 30

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

    const el = svgRef.current
    const width = el.clientWidth || 900
    const height = el.clientHeight || 600

    d3.select(el).selectAll('*').remove()

    const svg = d3.select(el)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    // Construir jerarquía rígida: país (raíz) → sectores → empresas
    const porSector = new Map<string, Empresa[]>()
    empresas.forEach((e) => {
      const list = porSector.get(e.sector) || []
      list.push(e)
      porSector.set(e.sector, list)
    })

    const data: NodeDatum = {
      id: 'root',
      kind: 'root',
      label: pais.nombre,
      color: '#ff8c42',
      children: Array.from(porSector.entries()).map(([sector, empresasDelSector]) => {
        const color = colorForSector(sector)
        return {
          id: `sector-${sector}`,
          kind: 'sector',
          label: `${sector} (${empresasDelSector.length})`,
          color,
          children: empresasDelSector.map((empresa) => ({
            id: `empresa-${empresa.id}`,
            kind: 'empresa',
            label: empresa.nombre,
            color,
            border: ESTADO_BORDER[empresa.estado_geopolitico] || '#333',
            empresa,
          })),
        }
      }),
    }

    const root = d3.hierarchy(data)
    const layout = d3.tree<NodeDatum>().nodeSize([CHIP_W + 26, 150])
    layout(root)

    const nodes = root.descendants()
    const links = root.links()

    // Centrar horizontalmente y dejar margen arriba para la raíz
    const xs = nodes.map((n) => n.x)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const offsetX = width / 2 - (minX + maxX) / 2
    const offsetY = 50

    const px = (n: d3.HierarchyPointNode<NodeDatum>) => n.x + offsetX
    const py = (n: d3.HierarchyPointNode<NodeDatum>) => n.y + offsetY

    const nodeSize = (n: NodeDatum) =>
      n.kind === 'root' ? [ROOT_W, ROOT_H] : n.kind === 'sector' ? [SECTOR_W, SECTOR_H] : [CHIP_W, CHIP_H]

    // Ramas: curva vertical desde el borde inferior del nodo padre al
    // borde superior del nodo hijo (no desde el centro, para que no
    // atraviesen las cajas).
    const linkGen = d3.linkVertical<unknown, { x: number; y: number }>()
      .x((d: any) => d.x)
      .y((d: any) => d.y)

    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.target.data.color))
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 1.5)
      .attr('d', (d) => {
        const [, sh] = nodeSize(d.source.data)
        const [, th] = nodeSize(d.target.data)
        const sx = px(d.source as any), sy = py(d.source as any) + sh / 2
        const tx = px(d.target as any), ty = py(d.target as any) - th / 2
        return linkGen({ source: { x: sx, y: sy }, target: { x: tx, y: ty } } as any)
      })

    const node = g.append('g')
      .selectAll<SVGGElement, d3.HierarchyPointNode<NodeDatum>>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', (d) => d.data.kind === 'empresa' ? 'pointer' : 'default')
      .attr('opacity', 0)
      .attr('transform', (d) => `translate(${px(d as any)}, ${py(d as any)})`)

    // Raíz y sectores: caja redondeada con el nombre centrado
    const box = node.filter((d) => d.data.kind !== 'empresa')
    box.append('rect')
      .attr('x', (d) => -nodeSize(d.data)[0] / 2)
      .attr('y', (d) => -nodeSize(d.data)[1] / 2)
      .attr('width', (d) => nodeSize(d.data)[0])
      .attr('height', (d) => nodeSize(d.data)[1])
      .attr('rx', 8).attr('ry', 8)
      .attr('fill', (d) => d.data.kind === 'root' ? d.data.color : '#0a0a0a')
      .attr('stroke', (d) => d.data.color)
      .attr('stroke-width', (d) => d.data.kind === 'root' ? 2.5 : 2)

    box.append('text')
      .text((d) => d.data.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.32em')
      .attr('font-size', (d) => d.data.kind === 'root' ? '15px' : '11px')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => d.data.kind === 'root' ? '#0a0a0a' : d.data.color)
      .attr('pointer-events', 'none')

    // Empresas: chip más chico, clickeable
    const chip = node.filter((d) => d.data.kind === 'empresa')
    const truncate = (s: string, n: number) => s.length > n ? `${s.slice(0, n - 1)}…` : s

    chip.append('rect')
      .attr('x', -CHIP_W / 2).attr('y', -CHIP_H / 2)
      .attr('width', CHIP_W).attr('height', CHIP_H)
      .attr('rx', 10).attr('ry', 10)
      .attr('fill', (d) => d.data.color)
      .attr('fill-opacity', 0.18)
      .attr('stroke', (d) => d.data.border || d.data.color)
      .attr('stroke-width', 1.5)

    chip.append('text')
      .text((d) => truncate(d.data.label, 14))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.32em')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')

    chip.append('title').text((d) => d.data.label)

    chip.on('click', (event, d) => {
      event.stopPropagation()
      if (d.data.empresa) onCompanySelect(d.data.empresa.id)
    })
    chip.on('mouseenter', function () {
      d3.select(this).select('rect').attr('fill-opacity', 0.5)
    })
    chip.on('mouseleave', function () {
      d3.select(this).select('rect').attr('fill-opacity', 0.18)
    })

    // Revelado escalonado: la raíz aparece primero, luego cada nivel de
    // ramas se despliega hacia abajo (simula el país "asentándose" arriba
    // y las ramas creciendo desde él).
    node.filter((d) => d.data.kind === 'root')
      .transition().duration(400).ease(d3.easeCubicOut)
      .attr('opacity', 1)

    node.filter((d) => d.data.kind === 'sector')
      .transition().delay((d, i) => 350 + i * 60).duration(400).ease(d3.easeCubicOut)
      .attr('opacity', 1)

    node.filter((d) => d.data.kind === 'empresa')
      .transition().delay((d) => {
        const sectorIdx = root.children ? root.children.indexOf(d.parent!) : 0
        const empresaIdx = d.parent?.children ? d.parent.children.indexOf(d) : 0
        return 600 + sectorIdx * 60 + empresaIdx * 35
      })
      .duration(350).ease(d3.easeCubicOut)
      .attr('opacity', 1)

    link.transition()
      .delay((d) => d.target.data.kind === 'sector' ? 200 : 500)
      .duration(400)
      .attr('stroke-opacity', 0.45)

    // Encuadre inicial para que se vea todo el árbol
    const xs2 = nodes.map((n) => px(n as any))
    const ys2 = nodes.map((n) => py(n as any))
    const minX2 = Math.min(...xs2) - 70, maxX2 = Math.max(...xs2) + 70
    const minY2 = Math.min(...ys2) - 60, maxY2 = Math.max(...ys2) + 60
    const bboxW = maxX2 - minX2, bboxH = maxY2 - minY2
    const scale = Math.min(1.1, 0.94 / Math.max(bboxW / width, bboxH / height))
    const tx = width / 2 - scale * (minX2 + maxX2) / 2
    const ty = height / 2 - scale * (minY2 + maxY2) / 2
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(tx, ty).scale(scale))

    return () => { svg.selectAll('*').interrupt() }
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
