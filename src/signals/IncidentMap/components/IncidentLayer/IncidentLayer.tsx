/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import MarkerCluster from 'components/MarkerCluster'
import type { FeatureCollection, Point } from 'geojson'
import type { LeafletEvent } from 'leaflet'
import L from 'leaflet'
import {
  dynamicIcon,
  selectedMarkerIcon,
} from 'shared/services/configuration/map-markers'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Incident, Properties } from '../../types'
import { DEFAULT_ZOOM } from '../utils'

const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface Props {
  handleIncidentSelect: (incident: Incident) => void
  incidents?: Incident[]
  passBbox(bbox: Bbox): void
  resetSelectedMarker: () => void
  selectedMarkerRef: MutableRefObject<L.Marker<Properties> | undefined>
  selectedIncident?: Incident
  zoomLevel: number
}

/* istanbul ignore next */
export const IncidentLayer = ({
  handleIncidentSelect,
  incidents,
  passBbox,
  resetSelectedMarker,
  selectedMarkerRef,
  selectedIncident,
  zoomLevel,
}: Props) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const activeLayer = useRef<L.GeoJSON>()
  const bbox = useBoundingBox()

  const focussedMarkerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (bbox) {
      passBbox(bbox)
    }
  }, [bbox, passBbox])

  useEffect(() => {
    if (!incidents || !layerInstance) return
    activeLayer.current?.remove()

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: incidents,
    }

    layerInstance.clearLayers()

    const layer = L.geoJSON(fc, {
      onEachFeature: (feature: Incident, layer: L.Layer) => {
        layer.on('click', (e: { target: L.Marker<Properties> }) => {
          if (selectedMarkerRef.current !== e.target) {
            resetSelectedMarker()
          }

          e.target.setIcon(selectedMarkerIcon)
          selectedMarkerRef.current = e.target
          focussedMarkerRef.current = e.target.getElement() || null
          handleIncidentSelect(feature)
        })

        layer.on(
          'keypress',
          (e: LeafletEvent & { originalEvent: KeyboardEvent }) => {
            if (['Enter', 'Space'].includes(e.originalEvent.code)) {
              focussedMarkerRef.current = e.target.getElement()
              handleIncidentSelect(feature)
            }
          }
        )
      },
      pointToLayer: (incident: Incident, latlng) => {
        let marker = L.marker(latlng, {
          icon: dynamicIcon(incident.properties?.icon),
          alt: incident.properties.category.name,
          keyboard: zoomLevel >= DEFAULT_ZOOM,
        })
        // Matching on created_at since incidents do not have an ID
        if (
          selectedMarkerRef.current?.feature?.properties.created_at ===
          incident.properties.created_at
        ) {
          marker = L.marker(latlng, {
            icon: selectedMarkerIcon,
            alt: incident.properties.category.name,
            keyboard: zoomLevel >= DEFAULT_ZOOM,
          })
          selectedMarkerRef.current = marker
        }

        return marker
      },
    })

    layer.addTo(layerInstance)

    activeLayer.current = layer

    // We ignore selectedIncident on purpose, otherwise markers are removed from the dom when selecting one.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [
    handleIncidentSelect,
    incidents,
    layerInstance,
    resetSelectedMarker,
    selectedMarkerRef,
    zoomLevel,
  ])

  useEffect(() => {
    if (!selectedIncident) {
      focussedMarkerRef.current?.focus()
    }
  }, [focussedMarkerRef, selectedIncident])

  const getIsSelectedCluster = useCallback(
    (cluster: L.MarkerCluster) => {
      const markers = cluster.getAllChildMarkers()

      // Matching on created_at since incidents do not have ID's
      return markers.some(
        (marker) =>
          marker.feature?.properties.created_at ===
          selectedMarkerRef.current?.feature?.properties.created_at
      )
    },
    [selectedMarkerRef]
  )

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
      getIsSelectedCluster={getIsSelectedCluster}
      spiderfySelectedCluster={false}
      keyboard={zoomLevel >= DEFAULT_ZOOM}
    />
  )
}
