import { useEffect } from 'react'
import L from 'leaflet'

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

interface BottleneckLayerProps {
  map: L.Map | null
  bottlenecks: Bottleneck[]
  onBottleneckSelect: (bottleneck: Bottleneck) => void
  selectedBottleneck: string | null
}

export default function BottleneckLayer({
  map,
  bottlenecks,
  onBottleneckSelect,
  selectedBottleneck
}: BottleneckLayerProps) {
  useEffect(() => {
    if (!map) return

    console.log('[BottleneckLayer] Renderizando', bottlenecks.length, 'cuellos de botella')

    // Crear un pane específico para los cuellos de botella
    let bottleneckPane = map.getPane('bottleneckPane')
    if (!bottleneckPane) {
      bottleneckPane = map.createPane('bottleneckPane')
      if (bottleneckPane) {
        bottleneckPane.style.zIndex = '250'
        bottleneckPane.style.pointerEvents = 'auto'
      }
    }

    // Limpiar capas anteriores de cuellos de botella
    map.eachLayer((layer: any) => {
      if (layer.isBottleneck) {
        map.removeLayer(layer)
      }
    })

    // Crear un FeatureGroup para los cuellos de botella
    const bottleneckGroup = L.featureGroup()

    // Añadir círculos para cada cuello de botella
    bottlenecks.forEach((bottleneck, idx) => {
      console.log(`[BottleneckLayer] Zona ${idx + 1}:`, bottleneck.nombre, `(${bottleneck.latitud}, ${bottleneck.longitud})`)

      // Tamaño del círculo basado en criticidad y porcentaje global
      const baseRadius = bottleneck.criticidad === 'CRÍTICA' ? 400 : bottleneck.criticidad === 'ALTA' ? 300 : 200
      const scaledRadius = baseRadius + (bottleneck.porcentaje_global * 2)

      // Opacidad y estilo según selección
      const isSelected = selectedBottleneck === bottleneck.id
      const opacity = isSelected ? 0.6 : 0.25
      const weight = isSelected ? 3 : 1.5
      const dashArray = isSelected ? '0' : '5, 5'

      const circle = L.circle(
        [bottleneck.latitud, bottleneck.longitud],
        {
          radius: scaledRadius * 1000, // convertir a metros
          color: bottleneck.color,
          weight: weight,
          opacity: opacity,
          dashArray: dashArray,
          fillColor: bottleneck.color,
          fillOpacity: isSelected ? 0.35 : 0.20,
          pane: 'bottleneckPane'
        }
      )

      // Popup con información
      const popupContent = `
        <div style="
          font-family: 'Courier New', monospace;
          color: #00d4ff;
          background: #0a0a0a;
          border: 2px solid ${bottleneck.color};
          padding: 12px;
          border-radius: 4px;
          max-width: 320px;
          font-size: 11px;
        ">
          <div style="color: ${bottleneck.color}; font-weight: bold; font-size: 12px; margin-bottom: 8px;">
            ⚠ ${bottleneck.nombre}
          </div>
          <div style="color: #ff8c42; margin-bottom: 4px;">
            Criticidad: ${bottleneck.criticidad}
          </div>
          <div style="color: #00d4ff; margin-bottom: 4px;">
            Impacto global: ${bottleneck.porcentaje_global}%
          </div>
          <div style="color: #888; font-size: 10px; margin-bottom: 6px;">
            Tipo: ${bottleneck.tipo}
          </div>
          <div style="color: #b0b0b0; font-size: 10px;">
            ${bottleneck.descripcion.substring(0, 100)}...
          </div>
        </div>
      `

      circle.bindPopup(popupContent, {
        maxWidth: 340,
        className: 'bottleneck-popup'
      })

      // Click handler
      circle.on('click', () => {
        onBottleneckSelect(bottleneck)
      })

      // Hover effects
      circle.on('mouseover', () => {
        circle.setStyle({
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.25
        })
        circle.openPopup()
      })

      circle.on('mouseout', () => {
        const newOpacity = isSelected ? 0.6 : 0.25
        const newFillOpacity = isSelected ? 0.15 : 0.08
        circle.setStyle({
          weight: isSelected ? 3 : 1.5,
          opacity: newOpacity,
          fillOpacity: newFillOpacity
        })
        if (!isSelected) {
          circle.closePopup()
        }
      })

      bottleneckGroup.addLayer(circle)

      // Marcar como perteneciente a esta capa
      ;(circle as any).isBottleneck = true
    })

    // Añadir grupo al mapa
    bottleneckGroup.addTo(map)

    // Líneas entre cuellos de botella relacionados (cadenas de suministro críticas)
    drawBottleneckConnections(map, bottlenecks)

    return () => {
      bottleneckGroup.eachLayer((layer) => {
        bottleneckGroup.removeLayer(layer)
      })
    }
  }, [map, bottlenecks, selectedBottleneck, onBottleneckSelect])

  return null
}

// Función para dibujar conexiones entre cuellos de botella
function drawBottleneckConnections(map: L.Map, bottlenecks: Bottleneck[]) {
  // Obtener o crear el pane para conexiones
  let connectionPane = map.getPane('bottleneckPane')
  if (!connectionPane) {
    connectionPane = map.createPane('bottleneckPane')
    if (connectionPane) {
      connectionPane.style.zIndex = '250'
    }
  }

  // Definir conexiones lógicas entre cuellos de botella
  const connections = [
    { from: 'taiwan-chips', to: 'holanda-litografia' }, // Chips dependen de máquinas ASML
    { from: 'taiwan-chips', to: 'ormuz-petroleo' }, // Chips necesitan energía
    { from: 'china-tierras-raras', to: 'taiwan-chips' }, // Elementos raros para chips
    { from: 'china-tierras-raras', to: 'australia-litio' }, // Competencia por minerales
    { from: 'ormuz-petroleo', to: 'singapur-refineria' }, // Petróleo a refinería
    { from: 'mineria-cobalto', to: 'china-aluminio' }, // Batería y materiales
    { from: 'australia-litio', to: 'mineria-cobalto' }, // Componentes de batería
    { from: 'estrecho-malaca', to: 'ormuz-petroleo' }, // Rutas comerciales
    { from: 'panama-canal', to: 'estrecho-malaca' }, // Rutas globales
    { from: 'rusia-gas-natural', to: 'ucrania-trigo' }, // Geopolítica
  ]

  // Dibujar líneas de conexión
  connections.forEach((conn) => {
    const fromBottleneck = bottlenecks.find(b => b.id === conn.from)
    const toBottleneck = bottlenecks.find(b => b.id === conn.to)

    if (fromBottleneck && toBottleneck) {
      const polyline = L.polyline(
        [
          [fromBottleneck.latitud, fromBottleneck.longitud],
          [toBottleneck.latitud, toBottleneck.longitud]
        ],
        {
          color: '#ff8c42',
          weight: 1,
          opacity: 0.2,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round',
          pane: 'bottleneckPane'
        }
      )

      polyline.addTo(map)
      ;(polyline as any).isBottleneck = true

      // Hover para resaltar conexiones
      polyline.on('mouseover', () => {
        polyline.setStyle({ opacity: 0.6, weight: 2 })
      })

      polyline.on('mouseout', () => {
        polyline.setStyle({ opacity: 0.2, weight: 1 })
      })
    }
  })
}
