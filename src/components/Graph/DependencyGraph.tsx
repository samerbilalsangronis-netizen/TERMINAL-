'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import empresas from '@/data/empresas_500.json'
import dependencias from '@/data/dependencias.json'
import { Empresa, Dependencia } from '@/types'

interface DependencyGraphProps {
  companyId: string
  onNodeClick?: (companyId: string) => void
}

interface GraphNode extends Empresa {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface GraphLink extends Dependencia {
  source?: GraphNode | string
  target?: GraphNode | string
}

const COLORS = {
  normal: '#00d4ff',
  riesgo: '#ff8c42',
  critico: '#ff3333',
  background: '#0a0a0a',
  border: '#333',
  text: '#aaa',
}

export default function DependencyGraph({ companyId, onNodeClick }: DependencyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[]
    links: GraphLink[]
  } | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    // Construir grafo: empresa central + proveedores + clientes
    const mainEmpresa = empresas.find(e => e.id === companyId)
    if (!mainEmpresa) return

    const nodes: Map<string, GraphNode> = new Map()
    const links: GraphLink[] = []

    // Agregar empresa central
    nodes.set(companyId, { ...mainEmpresa })

    // Agregar proveedores (empresas_b de dependencias donde empresa_a = companyId)
    const misDependencias = dependencias.filter(d => d.empresa_a === companyId)
    misDependencias.forEach(dep => {
      const proveedor = empresas.find(e => e.id === dep.empresa_b)
      if (proveedor) {
        nodes.set(dep.empresa_b, proveedor)
        links.push({
          ...dep,
          source: companyId,
          target: dep.empresa_b,
        })
      }
    })

    // Agregar clientes (empresas_a de dependencias donde empresa_b = companyId)
    const dependientesDeEsta = dependencias.filter(d => d.empresa_b === companyId)
    dependientesDeEsta.forEach(dep => {
      const cliente = empresas.find(e => e.id === dep.empresa_a)
      if (cliente) {
        nodes.set(dep.empresa_a, cliente)
        links.push({
          ...dep,
          source: dep.empresa_a,
          target: companyId,
        })
      }
    })

    setGraphData({
      nodes: Array.from(nodes.values()),
      links,
    })
  }, [companyId])

  useEffect(() => {
    if (!graphData || !svgRef.current) return

    const width = svgRef.current.clientWidth || 800
    const height = svgRef.current.clientHeight || 600

    // Limpiar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove()

    // Crear SVG y grupos
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    // Agregar fondo
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', COLORS.background)

    // Crear grupo para zoom/pan
    const g = svg.append('g')

    // Agregar comportamiento de zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Inicializar simulación de fuerzas
    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links)
        .id((d) => d.id)
        .distance(150)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => {
        const radius = Math.log(d.cap_mercado / 1e9 + 1) * 5 + 15
        return radius + 5
      }))

    // Crear links (líneas)
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', (d) => {
        return d.es_critica ? COLORS.critico : COLORS.border
      })
      .attr('stroke-width', (d) => {
        return d.es_critica ? 3 : 1.5
      })
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', (d) => 'url(#arrowhead)')

    // Crear marcador para flechas
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 25)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', COLORS.border)

    // Crear nodos (círculos)
    const node = g.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', (d) => {
        // Radio basado en cap. de mercado en escala logarítmica
        return Math.log(d.cap_mercado / 1e9 + 1) * 5 + 15
      })
      .attr('fill', (d) => {
        return COLORS[d.estado_geopolitico as keyof typeof COLORS] || COLORS.normal
      })
      .attr('stroke', (d) => {
        return d.id === companyId ? '#ffff00' : COLORS.border
      })
      .attr('stroke-width', (d) => {
        return d.id === companyId ? 3 : 1
      })
      .attr('opacity', 1)
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )

    // Agregar labels
    const labels = g.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.31em')
      .attr('font-size', '11px')
      .attr('fill', COLORS.text)
      .attr('font-weight', (d) => d.id === companyId ? 'bold' : 'normal')
      .text((d) => d.ticker.substring(0, 6))
      .attr('pointer-events', 'none')

    // Interactividad con hover
    node.on('mouseenter', (event, d) => {
      setHoveredNode(d.id)

      // Resaltar nodo actual
      d3.select(event.currentTarget)
        .attr('stroke-width', 3)
        .attr('stroke', COLORS.critico)

      // Resaltar conexiones
      link.attr('stroke-opacity', (link) => {
        return (link.source as GraphNode).id === d.id || (link.target as GraphNode).id === d.id
          ? 1
          : 0.2
      })
      link.attr('stroke-width', (link) => {
        return (link.source as GraphNode).id === d.id || (link.target as GraphNode).id === d.id
          ? 3
          : 1.5
      })

      // Resaltar nodos conectados
      node.attr('opacity', (node) => {
        if (node.id === d.id) return 1
        const isConnected = graphData.links.some(
          link => ((link.source as GraphNode).id === d.id && (link.target as GraphNode).id === node.id) ||
                   ((link.source as GraphNode).id === node.id && (link.target as GraphNode).id === d.id)
        )
        return isConnected ? 1 : 0.3
      })
    })

    node.on('mouseleave', () => {
      setHoveredNode(null)

      // Restaurar estilos
      node.attr('stroke-width', (d) => d.id === companyId ? 3 : 1)
        .attr('stroke', (d) => d.id === companyId ? '#ffff00' : COLORS.border)
        .attr('opacity', 1)

      link.attr('stroke-opacity', 0.6)
        .attr('stroke-width', (d) => d.es_critica ? 3 : 1.5)
    })

    node.on('click', (event, d) => {
      event.stopPropagation()
      onNodeClick?.(d.id)
    })

    // Funciones de arrastre
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    // Actualizar posiciones en cada tick de la simulación
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x || 0)
        .attr('y1', (d) => (d.source as GraphNode).y || 0)
        .attr('x2', (d) => (d.target as GraphNode).x || 0)
        .attr('y2', (d) => (d.target as GraphNode).y || 0)

      node
        .attr('cx', (d) => d.x || 0)
        .attr('cy', (d) => d.y || 0)

      labels
        .attr('x', (d) => d.x || 0)
        .attr('y', (d) => d.y || 0)
    })

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [graphData, onNodeClick])

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] border border-[#333] rounded">
      <div className="p-3 border-b border-[#333] bg-[#1a1a1a]">
        <h3 className="text-white font-bold text-sm">📊 Grafo de Dependencias</h3>
        <p className="text-xs text-[#aaa] mt-1">
          Arrastra para mover • Rueda para zoom • Click en nodo para seleccionar
        </p>
      </div>
      <svg
        ref={svgRef}
        className="flex-1 cursor-grab active:cursor-grabbing"
        style={{ background: COLORS.background }}
      />
      {hoveredNode && (
        <div className="absolute bottom-2 left-2 bg-[#1a1a1a] border border-[#333] rounded p-2 text-xs text-white">
          {empresas.find(e => e.id === hoveredNode)?.nombre}
        </div>
      )}
    </div>
  )
}
