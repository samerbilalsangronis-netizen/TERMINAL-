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

    // Limpiar capas anteriores
    map.eachLayer((layer: any) => {
      if (layer.isBottleneck) {
        map.removeLayer(layer)
      }
    })

    // Crear un FeatureGroup para los cuellos de botella
    const bottleneckGroup = L.featureGroup()

    // Añadir marcadores para cada cuello de botella
    bottlenecks.forEach((bottleneck) => {
      // Crear icono personalizado
      const iconSize = bottleneck.criticidad === 'CRÍTICA' ? 20 : 14
      const opacity = selectedBottleneck === bottleneck.id ? 1 : 0.7

      const svgIcon = L.divIcon({
        html: `
          <div style="
            width: ${iconSize}px;
            height: ${iconSize}px;
            background-color: ${bottleneck.color};
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            opacity: ${opacity};
            cursor: pointer;
            box-shadow: 0 0 ${bottleneck.criticidad === 'CRÍTICA' ? '12' : '6'}px ${bottleneck.color};
            transition: all 0.2s ease;
            transform: ${selectedBottleneck === bottleneck.id ? 'scale(1.3)' : 'scale(1)'};
          "></div>
        `,
        className: 'bottleneck-marker',
        iconSize: [iconSize, iconSize],
        popupAnchor: [0, -iconSize / 2]
      })

      // Crear marcador
      const marker = L.marker([bottleneck.latitud, bottleneck.longitud], {
        icon: svgIcon
      })

      // Popup con información
      const popupContent = `
        <div style="
          font-family: 'Courier New', monospace;
          color: #00d4ff;
          background: #0a0a0a;
          border: 1px solid ${bottleneck.color};
          padding: 8px;
          border-radius: 4px;
          max-width: 300px;
          font-size: 11px;
        ">
          <div style="color: ${bottleneck.color}; font-weight: bold; margin-bottom: 4px;">
            ${bottleneck.nombre}
          </div>
          <div style="color: #ff8c42; margin-bottom: 2px;">
            Criticidad: ${bottleneck.criticidad}
          </div>
          <div style="color: #00d4ff; margin-bottom: 2px;">
            ${bottleneck.porcentaje_global}% global
          </div>
          <div style="color: #888; font-size: 10px; margin-top: 4px;">
            ${bottleneck.tipo}
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'bottleneck-popup'
      })

      // Click handler
      marker.on('click', () => {
        onBottleneckSelect(bottleneck)
      })

      // Hover effects
      marker.on('mouseover', () => {
        marker.openPopup()
      })

      marker.on('mouseout', () => {
        if (selectedBottleneck !== bottleneck.id) {
          marker.closePopup()
        }
      })

      bottleneckGroup.addLayer(marker)

      // Marcar como perteneciente a esta capa
      ;(marker as any).isBottleneck = true
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
          opacity: 0.3,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round'
        }
      )

      polyline.addTo(map)
      ;(polyline as any).isBottleneck = true

      // Hover para resaltar conexiones
      polyline.on('mouseover', () => {
        polyline.setStyle({ opacity: 0.8, weight: 2 })
      })

      polyline.on('mouseout', () => {
        polyline.setStyle({ opacity: 0.3, weight: 1 })
      })
    }
  })
}
