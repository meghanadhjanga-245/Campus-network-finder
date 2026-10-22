import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { CAMPUS_HEATMAP_GEOJSON, getFilteredHeatmapData } from '../../data/heatmapData';
import { BEAMS_GEOJSON } from '../../data/beamData';
import type { CampusWalkingRoute } from '../../data/navigationRoutes';
import { getRouteSignalTransmission } from '../../utils/signalTransmission';
import {
  GLOBAL_TOWERS_GEOJSON,
  GLOBAL_LINKS_GEOJSON,
  getMovingSignalPackets
} from '../../data/globalNetworkData';

function getPointAlongPath(coords: [number, number][], progress: number): [number, number] {
  if (!coords || coords.length === 0) return [0, 0];
  if (coords.length === 1) return coords[0];
  const totalSegments = coords.length - 1;
  const t = Math.max(0, Math.min(1, progress)) * totalSegments;
  const segIndex = Math.min(Math.floor(t), totalSegments - 1);
  const segT = t - segIndex;
  const p1 = coords[segIndex];
  const p2 = coords[segIndex + 1];
  return [
    p1[0] + (p2[0] - p1[0]) * segT,
    p1[1] + (p2[1] - p1[1]) * segT
  ];
}

const getMapStyleUrl = (style: 'satellite' | 'street' | 'blueprint' | 'floor-plan'): string | any => {
  if (style === 'satellite') {
    return {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri World Imagery'
        }
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };
  }

  if (style === 'street') {
    return 'mapbox://styles/mapbox/standard';
  }

  return 'mapbox://styles/mapbox/dark-v11';
};

export const MapView = ({
  showPlaceDetail = false,
  selectedPlace,
  onPlaceSelect,
  onPlaceDeselect,
  onMeasurementRequest,
  mapStyle = 'floor-plan',
  is3D = true,
  onToggle3D,
  showHeatmap = false,
  showBeams = false,
  selectedRoute = null,
  currentFloor = 0,
  isGlobalView = false,
  onToggleGlobalView,
  activeSlice = 'all',
  activeCarrierFilter = 'all'
}: {
  showPlaceDetail?: boolean;
  selectedPlace: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  } | null;
  onPlaceSelect: (place: {
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }) => void;
  onPlaceDeselect: () => void;
  onMeasurementRequest: () => void;
  mapStyle?: 'satellite' | 'street' | 'blueprint' | 'floor-plan';
  is3D?: boolean;
  onToggle3D?: () => void;
  showHeatmap?: boolean;
  showBeams?: boolean;
  selectedRoute?: CampusWalkingRoute | null;
  currentFloor?: number;
  isGlobalView?: boolean;
  onToggleGlobalView?: () => void;
  activeSlice?: 'all' | 'embb' | 'urllc' | 'mmtc';
  activeCarrierFilter?: 'all' | 'jio' | 'airtel' | 'wifi';
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  void showPlaceDetail;
  void onPlaceDeselect;
  void onMeasurementRequest;
  void onToggle3D;
  void currentFloor;
  void onToggleGlobalView;

  const onPlaceSelectRef = useRef(onPlaceSelect);
  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  const selectedRouteRef = useRef(selectedRoute);
  useEffect(() => {
    selectedRouteRef.current = selectedRoute;
  }, [selectedRoute]);

  const initialStyleRef = useRef(getMapStyleUrl(mapStyle));
  const initialPitchRef = useRef(is3D ? 45 : 0);
  const initialShowHeatmapRef = useRef(showHeatmap);
  const initialShowBeamsRef = useRef(showBeams);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Map with 3D Globe Projection
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const defaultToken = typeof atob !== 'undefined'
        ? atob('cGsuZXlKMUlqb2liV1ZuYUdGdVlXUm9JaXdpWVNJNkltTnRkWGxuWjJJM2JqQm9NbkV5ZDNJME1YcDVaMjkwTldzaWZRLkQ4cEtkRDFIWVFHMDlUbkppR05GbUE=')
        : '';
      (mapboxgl as any).accessToken =
        import.meta.env.VITE_MAPBOX_TOKEN || defaultToken;

      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: initialStyleRef.current,
        center: [80.3238, 16.2554], // RVRJC central campus coordinates
        zoom: 17.2,
        pitch: initialPitchRef.current,
        bearing: -25,
        antialias: true,
        projection: { name: 'globe' } as any
      });

      newMap.on('error', (e) => {
        console.warn('Mapbox message:', e);
      });

      // Add zoom & rotation controls on bottom-right
      newMap.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');

      // Add scale indicator
      newMap.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

      // Setup layers once style is loaded
      const setupLayers = () => {
        try {
          // Set Photorealistic Space Atmosphere Fog
          newMap.setFog({
            color: 'rgb(10, 16, 28)', // Lower atmosphere
            'high-color': 'rgb(14, 23, 42)', // Upper atmosphere
            'horizon-blend': 0.15, // Horizon thickness
            'space-color': 'rgb(4, 7, 14)', // Space background
            'star-intensity': 0.85 // Star field
          });

          // 1. 3D Buildings
          if (newMap.getSource('composite') && !newMap.getLayer('3d-buildings')) {
            newMap.addLayer({
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#0284c7',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['get', 'height'],
                  0, 0,
                  30, 30
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['get', 'min_height'],
                  0, 0,
                  30, 30
                ],
                'fill-extrusion-opacity': 0.7
              }
            });
          }

          // 2. 5G RF Heatmap Layer
          if (!newMap.getSource('campus-heatmap-source')) {
            newMap.addSource('campus-heatmap-source', {
              type: 'geojson',
              data: CAMPUS_HEATMAP_GEOJSON
            });
          }

          if (!newMap.getLayer('campus-heatmap-layer')) {
            newMap.addLayer({
              id: 'campus-heatmap-layer',
              type: 'heatmap',
              source: 'campus-heatmap-source',
              maxzoom: 22,
              layout: {
                visibility: initialShowHeatmapRef.current ? 'visible' : 'none'
              },
              paint: {
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'rsrp'], -95, 0.1, -45, 1],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 14, 1.2, 18, 3.5],
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, 'rgba(239, 68, 68, 0.55)',
                  0.45, 'rgba(245, 158, 11, 0.7)',
                  0.75, 'rgba(52, 211, 153, 0.85)',
                  1, 'rgba(56, 189, 248, 0.95)'
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 14, 25, 18, 55],
                'heatmap-opacity': 0.8
              }
            });
          }

          // 3. Massive MIMO 64T64R Beamforming Ray-Tracing Layer
          if (!newMap.getSource('mimo-beams-source')) {
            newMap.addSource('mimo-beams-source', {
              type: 'geojson',
              data: BEAMS_GEOJSON
            });
          }

          if (!newMap.getLayer('mimo-beams-layer')) {
            newMap.addLayer({
              id: 'mimo-beams-layer',
              type: 'line',
              source: 'mimo-beams-source',
              layout: {
                visibility: initialShowBeamsRef.current ? 'visible' : 'none',
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': ['get', 'color'],
                'line-width': ['get', 'beamWidth'],
                'line-opacity': 0.85
              }
            });
          }

          // 3b. Campus Background Topological Network Mesh (Gray/blue connectivity graph from screenshot)
          if (!newMap.getSource('campus-topology-source')) {
            newMap.addSource('campus-topology-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.32399, 16.25509], [80.32360, 16.25480], [80.32349, 16.25458], [80.32284, 16.25380]] } },
                  { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.32399, 16.25509], [80.32372, 16.25700], [80.32373, 16.25779], [80.32446, 16.25652]] } },
                  { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.32372, 16.25700], [80.32531, 16.25440], [80.32180, 16.25480]] } },
                  { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.32531, 16.25440], [80.32580, 16.25680]] } },
                  { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.32446, 16.25652], [80.32580, 16.25680]] } }
                ]
              }
            });
          }

          if (!newMap.getLayer('campus-topology-layer')) {
            newMap.addLayer({
              id: 'campus-topology-layer',
              type: 'line',
              source: 'campus-topology-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#1e293b',
                'line-width': 1.8,
                'line-opacity': 0.75,
                'line-dasharray': [2, 2]
              }
            });
          }

          // 4. Navigation Waypoint Walking Route Layers (Vibrant Electric Cyan Beam Conduit)
          if (!newMap.getSource('nav-route-source')) {
            newMap.addSource('nav-route-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });
          }

          // Intense glowing cyan outer aura
          if (!newMap.getLayer('nav-route-glow')) {
            newMap.addLayer({
              id: 'nav-route-glow',
              type: 'line',
              source: 'nav-route-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#00f0ff',
                'line-width': 26,
                'line-opacity': 0.75,
                'line-blur': 12
              }
            });
          }

          // Focused electric conduit casing line
          if (!newMap.getLayer('nav-route-casing')) {
            newMap.addLayer({
              id: 'nav-route-casing',
              type: 'line',
              source: 'nav-route-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#00b4d8',
                'line-width': 10,
                'line-opacity': 0.95,
                'line-blur': 3
              }
            });
          }

          // Bright white-cyan central waveguide
          if (!newMap.getLayer('nav-route-layer')) {
            newMap.addLayer({
              id: 'nav-route-layer',
              type: 'line',
              source: 'nav-route-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#e0f2fe',
                'line-width': 4.5,
                'line-opacity': 1.0
              }
            });
          }

          // Route dashed energy overlay
          if (!newMap.getLayer('nav-route-dash')) {
            newMap.addLayer({
              id: 'nav-route-dash',
              type: 'line',
              source: 'nav-route-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#ffffff',
                'line-width': 2.5,
                'line-dasharray': [2, 3],
                'line-opacity': 0.9
              }
            });
          }

          // Navigation Start & Destination Endpoints
          if (!newMap.getSource('nav-endpoints-source')) {
            newMap.addSource('nav-endpoints-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });
          }

          if (!newMap.getLayer('nav-endpoints-glow')) {
            newMap.addLayer({
              id: 'nav-endpoints-glow',
              type: 'circle',
              source: 'nav-endpoints-source',
              paint: {
                'circle-radius': 16,
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.45,
                'circle-blur': 0.8
              }
            });
          }

          if (!newMap.getLayer('nav-endpoints-core')) {
            newMap.addLayer({
              id: 'nav-endpoints-core',
              type: 'circle',
              source: 'nav-endpoints-source',
              paint: {
                'circle-radius': 6.5,
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            });
          }

          if (!newMap.getLayer('nav-endpoints-label')) {
            newMap.addLayer({
              id: 'nav-endpoints-label',
              type: 'symbol',
              source: 'nav-endpoints-source',
              layout: {
                'text-field': ['get', 'title'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 11,
                'text-offset': [0, 1.4],
                'text-anchor': 'top',
                'text-allow-overlap': true
              },
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#020617',
                'text-halo-width': 2.5
              }
            });
          }

          // Animated pedestrian walker pulse along path
          if (!newMap.getSource('nav-walker-source')) {
            newMap.addSource('nav-walker-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });
          }

          if (!newMap.getLayer('nav-walker-glow')) {
            newMap.addLayer({
              id: 'nav-walker-glow',
              type: 'circle',
              source: 'nav-walker-source',
              paint: {
                'circle-radius': 13,
                'circle-color': '#38bdf8',
                'circle-opacity': 0.65,
                'circle-blur': 0.8
              }
            });
          }

          if (!newMap.getLayer('nav-walker-dot')) {
            newMap.addLayer({
              id: 'nav-walker-dot',
              type: 'circle',
              source: 'nav-walker-source',
              paint: {
                'circle-radius': 5,
                'circle-color': '#ffffff',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#0284c7'
              }
            });
          }

          // 4b. Continuous 5G Signal Transmitting Layers (RF Waves, Photonic Waveguides & Expanding Beacons)
          if (!newMap.getSource('nav-signal-pulses-source')) {
            newMap.addSource('nav-signal-pulses-source', {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] }
            });
          }

          if (!newMap.getLayer('nav-signal-pulses-layer')) {
            newMap.addLayer({
              id: 'nav-signal-pulses-layer',
              type: 'circle',
              source: 'nav-signal-pulses-source',
              paint: {
                'circle-radius': ['get', 'radius'],
                'circle-color': ['get', 'color'],
                'circle-opacity': ['get', 'opacity'],
                'circle-stroke-width': 1.8,
                'circle-stroke-color': ['get', 'color'],
                'circle-blur': 0.2
              }
            });
          }

          if (!newMap.getSource('nav-signal-beams-source')) {
            newMap.addSource('nav-signal-beams-source', {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] }
            });
          }

          if (!newMap.getLayer('nav-signal-beams-layer')) {
            newMap.addLayer({
              id: 'nav-signal-beams-layer',
              type: 'line',
              source: 'nav-signal-beams-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': ['get', 'color'],
                'line-width': 6,
                'line-opacity': ['get', 'opacity'],
                'line-blur': 1.2
              }
            });
          }

          if (!newMap.getSource('nav-signal-packets-source')) {
            newMap.addSource('nav-signal-packets-source', {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] }
            });
          }

          if (!newMap.getLayer('nav-signal-packets-glow')) {
            newMap.addLayer({
              id: 'nav-signal-packets-glow',
              type: 'circle',
              source: 'nav-signal-packets-source',
              paint: {
                'circle-radius': ['get', 'glowRadius'],
                'circle-color': ['get', 'color'],
                'circle-opacity': ['get', 'glowOpacity'],
                'circle-blur': 0.85
              }
            });
          }

          if (!newMap.getLayer('nav-signal-packets-core')) {
            newMap.addLayer({
              id: 'nav-signal-packets-core',
              type: 'circle',
              source: 'nav-signal-packets-source',
              paint: {
                'circle-radius': ['get', 'radius'],
                'circle-color': '#ffffff',
                'circle-stroke-width': 2,
                'circle-stroke-color': ['get', 'color']
              }
            });
          }

          // 5. Global Worldwide Signal Backbone Links Layer
          if (!newMap.getSource('global-links-source')) {
            newMap.addSource('global-links-source', {
              type: 'geojson',
              data: GLOBAL_LINKS_GEOJSON
            });
          }

          // Outer glowing halo
          if (!newMap.getLayer('global-links-glow')) {
            newMap.addLayer({
              id: 'global-links-glow',
              type: 'line',
              source: 'global-links-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': ['get', 'color'],
                'line-width': 5,
                'line-opacity': 0.35,
                'line-blur': 4
              }
            });
          }

          // Core fiber / laser beam
          if (!newMap.getLayer('global-links-core')) {
            newMap.addLayer({
              id: 'global-links-core',
              type: 'line',
              source: 'global-links-source',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.9
              }
            });
          }

          // 6. Moving Signals / Packets Layer (Real-time animated photons)
          if (!newMap.getSource('global-packets-source')) {
            newMap.addSource('global-packets-source', {
              type: 'geojson',
              data: getMovingSignalPackets(0)
            });
          }

          if (!newMap.getLayer('global-packets-glow')) {
            newMap.addLayer({
              id: 'global-packets-glow',
              type: 'circle',
              source: 'global-packets-source',
              paint: {
                'circle-radius': 8,
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.6,
                'circle-blur': 0.8
              }
            });
          }

          if (!newMap.getLayer('global-packets-core')) {
            newMap.addLayer({
              id: 'global-packets-core',
              type: 'circle',
              source: 'global-packets-source',
              paint: {
                'circle-radius': 3.5,
                'circle-color': '#ffffff',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': ['get', 'color']
              }
            });
          }

          // 7. Global Signal Towers & Teleports (Native WebGL layers - collision-safe & clutter-free)
          if (!newMap.getSource('global-towers-source')) {
            newMap.addSource('global-towers-source', {
              type: 'geojson',
              data: GLOBAL_TOWERS_GEOJSON
            });
          }

          // Glowing outer halo
          if (!newMap.getLayer('global-towers-glow')) {
            newMap.addLayer({
              id: 'global-towers-glow',
              type: 'circle',
              source: 'global-towers-source',
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  1, 8,
                  6, 14,
                  14, 22
                ],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.45,
                'circle-blur': 0.85
              }
            });
          }

          // Crisp core center point
          if (!newMap.getLayer('global-towers-core')) {
            newMap.addLayer({
              id: 'global-towers-core',
              type: 'circle',
              source: 'global-towers-source',
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  1, 3.5,
                  6, 5.5,
                  14, 9
                ],
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#ffffff'
              }
            });
          }

          // High-tech typography labels with collision avoidance (prevents overlapping pills!)
          if (!newMap.getLayer('global-towers-label')) {
            newMap.addLayer({
              id: 'global-towers-label',
              type: 'symbol',
              source: 'global-towers-source',
              layout: {
                'text-field': ['get', 'city'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  2, 9,
                  6, 11,
                  14, 13
                ],
                'text-offset': [0, 1.2],
                'text-anchor': 'top',
                'text-allow-overlap': false,
                'text-optional': true
              },
              paint: {
                'text-color': '#f8fafc',
                'text-halo-color': '#020617',
                'text-halo-width': 2.5
              }
            });
          }

          // Tower Click Handler: Fly to tower & show sleek telemetry card
          newMap.on('click', 'global-towers-core', (e: any) => {
            if (!e.features || !e.features[0]) return;
            const feat = e.features[0] as any;
            const props = feat.properties || {};
            const geom = feat.geometry;
            if (!geom || !geom.coordinates) return;

            const targetZoom = props.category === 'village' ? 14 : props.category === 'mandal' ? 12 : Math.max(newMap.getZoom(), 8.5);

            newMap.flyTo({
              center: geom.coordinates,
              zoom: targetZoom,
              pitch: 45,
              duration: 1200,
              essential: true
            });

            const categoryBadgeColor =
              props.category === 'village'
                ? '#34d399'
                : props.category === 'mandal'
                ? '#38bdf8'
                : props.category === 'city'
                ? '#818cf8'
                : '#f43f5e';
            const categoryBadgeBg =
              props.category === 'village'
                ? 'rgba(52,211,153,0.18)'
                : props.category === 'mandal'
                ? 'rgba(56,189,248,0.18)'
                : props.category === 'city'
                ? 'rgba(129,140,248,0.18)'
                : 'rgba(244,63,94,0.18)';
            const categoryLabel = (props.category || props.region || 'HUB').toUpperCase();

            new mapboxgl.Popup({ offset: 12, className: 'dark-popup' })
              .setLngLat(geom.coordinates)
              .setHTML(`
                <div style="background:#090d16;color:#fff;padding:12px 16px;border-radius:16px;border:1.5px solid ${categoryBadgeColor};box-shadow:0 12px 35px rgba(0,0,0,0.85);font-family:Inter,sans-serif;min-width:220px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:6px;margin-bottom:6px;">
                    <span style="font-weight:800;font-size:13px;color:#fff;">${props.city}</span>
                    <span style="font-size:9px;background:${categoryBadgeBg};color:${categoryBadgeColor};padding:2px 7px;border-radius:6px;font-family:monospace;font-weight:800;letter-spacing:0.5px;">${categoryLabel}</span>
                  </div>
                  <div style="font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:6px;">${props.name}</div>
                  <div style="font-size:10px;color:#64748b;font-family:monospace;line-height:1.6;border-top:1px dashed #1e293b;padding-top:6px;">
                    <div>Region: <b style="color:#e2e8f0;">${props.country || 'Global'}</b></div>
                    <div>Bandwidth: <b style="color:#38bdf8;">${props.throughput}</b></div>
                    <div>Latency to RVRJC: <b style="color:#34d399;">${props.latency}</b></div>
                  </div>
                </div>
              `)
              .addTo(newMap);
          });

          newMap.on('mouseenter', 'global-towers-core', () => {
            newMap.getCanvas().style.cursor = 'pointer';
          });
          newMap.on('mouseleave', 'global-towers-core', () => {
            newMap.getCanvas().style.cursor = '';
          });

          // 8. Start Real-time Signal Animation Loop (Signals + Pedestrian Walker + 5G Route Transmissions)
          let packetPhase = 0;
          let walkerPhase = 0;
          let signalPhase = 0;
          const animateSignalPackets = () => {
            packetPhase = (packetPhase + 0.0035) % 1;
            const pSource: any = newMap.getSource('global-packets-source');
            if (pSource) {
              pSource.setData(getMovingSignalPackets(packetPhase));
            }

            // Animate 5G Signal Transmissions along active pedestrian route from Source to Destination
            if (
              selectedRouteRef.current &&
              selectedRouteRef.current.coordinates &&
              selectedRouteRef.current.coordinates.length > 1
            ) {
              // High-frequency electromagnetic pulse speed
              signalPhase = (signalPhase + 0.008) % 1;
              const { packets, beamSegments, pulseRings } = getRouteSignalTransmission(
                selectedRouteRef.current.coordinates,
                signalPhase,
                selectedRouteRef.current.color || '#38bdf8'
              );

              const pkSource: any = newMap.getSource('nav-signal-packets-source');
              if (pkSource) pkSource.setData(packets);

              const bmSource: any = newMap.getSource('nav-signal-beams-source');
              if (bmSource) bmSource.setData(beamSegments);

              const plSource: any = newMap.getSource('nav-signal-pulses-source');
              if (plSource) plSource.setData(pulseRings);

              // Animate human pedestrian walker marker along route
              walkerPhase = (walkerPhase + 0.0025) % 1;
              const pt = getPointAlongPath(selectedRouteRef.current.coordinates, walkerPhase);
              const wSource: any = newMap.getSource('nav-walker-source');
              if (wSource) {
                wSource.setData({
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: pt
                  }
                });
              }
            } else {
              // Clear route signal layers when not in navigation mode
              const pkSource: any = newMap.getSource('nav-signal-packets-source');
              if (pkSource) pkSource.setData({ type: 'FeatureCollection', features: [] });

              const bmSource: any = newMap.getSource('nav-signal-beams-source');
              if (bmSource) bmSource.setData({ type: 'FeatureCollection', features: [] });

              const plSource: any = newMap.getSource('nav-signal-pulses-source');
              if (plSource) plSource.setData({ type: 'FeatureCollection', features: [] });
            }

            animFrameRef.current = requestAnimationFrame(animateSignalPackets);
          };
          animateSignalPackets();

        } catch (e) {
          console.warn('Layer setup notice:', e);
        }
      };

      newMap.on('style.load', setupLayers);

      const markerInstances: mapboxgl.Marker[] = [];
      const campusMarkerEls: HTMLElement[] = [];

      // 1. Central 5G Base Station Tower Mast Marker (Administrative Block, RVRJC)
      const towerEl = document.createElement('div');
      towerEl.className = 'group cursor-pointer transform hover:scale-110 transition-transform';
      towerEl.innerHTML = `
        <div style="position:relative;display:flex;align-items:center;gap:6px;background:rgba(2,132,199,0.95);backdrop-filter:blur(8px);border:2px solid #38bdf8;border-radius:9999px;padding:5px 12px 5px 8px;box-shadow:0 0 25px rgba(56,189,248,0.7);">
          <div style="position:absolute;left:-4px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(56,189,248,0.4);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:22px;height:22px;border-radius:50%;background:#032b44;display:flex;align-items:center;justify-content:center;color:#38bdf8;position:relative;z-index:2;">
            <span style="font-family:'Material Symbols Outlined';font-size:16px;line-height:1;">cell_tower</span>
          </div>
          <div style="display:flex;flex-direction:column;position:relative;z-index:2;">
            <span style="font-size:11px;font-weight:800;color:#fff;white-space:nowrap;letter-spacing:0.5px;">RVRJC MAIN gNodeB</span>
            <span style="font-size:9px;color:#e0f2fe;font-family:'JetBrains Mono',monospace;">64T64R • 3.5 GHz n78</span>
          </div>
        </div>
      `;
      towerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onPlaceSelectRef.current({
          id: 'tower-main',
          name: 'RVRJC 5G Massive MIMO Base Station',
          type: 'tower',
          building: 'Administrative Block Rooftop',
          floor: 'Rooftop Mast',
          campus: 'RVRJC College of Engineering'
        });
      });

      const towerMarker = new mapboxgl.Marker({ element: towerEl, anchor: 'center' })
        .setLngLat([80.32399, 16.25509])
        .addTo(newMap);
      markerInstances.push(towerMarker);
      campusMarkerEls.push(towerEl);

      // 2. Add Campus Landmark Pins (Clean Numbered Badges matching user GIS screenshot)
      CAMPUS_LOCATIONS.forEach((loc) => {
        const el = document.createElement('div');
        el.className = 'campus-gis-marker group cursor-pointer transform hover:scale-110 transition-transform';
        el.setAttribute('data-code', loc.code);
        el.setAttribute('data-id', loc.id);
        el.innerHTML = `
          <div style="position:relative;display:flex;align-items:center;gap:6px;background:rgba(11,17,30,0.96);backdrop-filter:blur(8px);border:1.5px solid #1e293b;border-radius:8px;padding:3px 8px 3px 6px;box-shadow:0 6px 20px rgba(0,0,0,0.8);white-space:nowrap;user-select:none;transition:border-color 0.2s, box-shadow 0.2s;">
            <span style="width:6px;height:6px;border-radius:50%;background:#38bdf8;box-shadow:0 0 8px #38bdf8;display:inline-block;shrink:0;"></span>
            <span style="font-size:11px;font-weight:700;color:#e2e8f0;letter-spacing:0.3px;font-family:Inter,sans-serif;">${loc.shortName}</span>
            <span style="font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:800;color:#94a3b8;background:#1e293b;padding:1px 5px;border-radius:5px;border:1px solid #334155;">${loc.code}</span>
            <div class="origin-target-ring" style="display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;border:2px solid #00f0ff;box-shadow:0 0 25px rgba(0,240,255,0.7);animation:ping 2.5s cubic-bezier(0,0,0.2,1) infinite;pointer-events:none;"></div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onPlaceSelectRef.current(loc);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(loc.coordinates)
          .addTo(newMap);
        markerInstances.push(marker);
        campusMarkerEls.push(el);
      });

      // Adaptive marker visibility: campus landmark cards only show when zoomed into campus (zoom >= 13.5)
      // This leaves the regional view (Guntur-Vijayawada) and global view completely clean!
      const updateMarkerVisibility = () => {
        const z = newMap.getZoom();
        const showCampus = z >= 13.5;
        campusMarkerEls.forEach((el) => {
          el.style.display = showCampus ? 'block' : 'none';
        });
      };
      newMap.on('zoom', updateMarkerVisibility);
      updateMarkerVisibility();

      setMap(newMap);

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        markerInstances.forEach((m) => m.remove());
        newMap.remove();
      };
    } catch (err: any) {
      console.error('Failed to initialize map:', err);
      setMapError(err.message || 'Map loading error');
    }
  }, []);

  // Handle map style changes
  useEffect(() => {
    if (!map) return;
    const styleUrl = getMapStyleUrl(mapStyle);
    map.setStyle(styleUrl);
  }, [mapStyle, map]);

  // Handle 3D / 2D camera pitch
  useEffect(() => {
    if (!map) return;
    map.easeTo({
      pitch: is3D ? 58 : 0,
      duration: 800
    });
  }, [is3D, map]);

  // Toggle Global Earth Orbital View vs Campus View
  useEffect(() => {
    if (!map) return;
    if (isGlobalView) {
      map.flyTo({
        center: [30, 20],
        zoom: 1.8,
        pitch: 35,
        bearing: 0,
        essential: true,
        duration: 2500
      });
    } else {
      map.flyTo({
        center: [80.3238, 16.2554],
        zoom: 17.5,
        pitch: is3D ? 58 : 0,
        bearing: -25,
        essential: true,
        duration: 2500
      });
    }
  }, [isGlobalView, is3D, map]);

  // Recenter on selected place
  useEffect(() => {
    if (!map || !selectedPlace || isGlobalView) return;

    const matched = CAMPUS_LOCATIONS.find(
      (l) => l.id === selectedPlace.id || l.name === selectedPlace.name
    );
    const coords: [number, number] = matched ? matched.coordinates : [80.3238, 16.2554];

    map.flyTo({
      center: coords,
      zoom: 18.2,
      pitch: is3D ? 60 : 0,
      bearing: -25,
      essential: true,
      duration: 1200
    });
  }, [selectedPlace, isGlobalView, is3D, map]);

  // Toggle Heatmap visibility
  useEffect(() => {
    if (map && map.getLayer('campus-heatmap-layer')) {
      map.setLayoutProperty(
        'campus-heatmap-layer',
        'visibility',
        showHeatmap ? 'visible' : 'none'
      );
    }
  }, [showHeatmap, map]);

  // Update Heatmap Source based on 5G Slicing & Carrier Filter
  useEffect(() => {
    if (!map) return;
    const heatmapSource: any = map.getSource('campus-heatmap-source');
    if (heatmapSource) {
      heatmapSource.setData(getFilteredHeatmapData(activeSlice, activeCarrierFilter));
    }
  }, [activeSlice, activeCarrierFilter, map]);

  // Toggle MIMO Beams visibility
  useEffect(() => {
    if (map && map.getLayer('mimo-beams-layer')) {
      map.setLayoutProperty(
        'mimo-beams-layer',
        'visibility',
        showBeams ? 'visible' : 'none'
      );
    }
  }, [showBeams, map]);

  // Update Navigation Route Layer, Endpoints & Camera Frame
  useEffect(() => {
    if (!map) return;
    selectedRouteRef.current = selectedRoute;

    const routeSource: any = map.getSource('nav-route-source');
    const endpointSource: any = map.getSource('nav-endpoints-source');
    const walkerSource: any = map.getSource('nav-walker-source');

    if (routeSource) {
      if (selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length > 0) {
        routeSource.setData({
          type: 'Feature',
          properties: {
            color: selectedRoute.color
          },
          geometry: {
            type: 'LineString',
            coordinates: selectedRoute.coordinates
          }
        });

        if (map.getLayer('nav-route-layer')) {
          map.setPaintProperty('nav-route-layer', 'line-color', selectedRoute.color);
        }
        if (map.getLayer('nav-route-glow')) {
          map.setPaintProperty('nav-route-glow', 'line-color', selectedRoute.color);
        }

        // Set start & destination endpoint markers
        if (endpointSource && selectedRoute.coordinates.length >= 2) {
          const startPt = selectedRoute.coordinates[0];
          const endPt = selectedRoute.coordinates[selectedRoute.coordinates.length - 1];

          endpointSource.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  title: `⚡ START (TX): ${selectedRoute.originName || 'Source'}`,
                  color: '#10b981'
                },
                geometry: {
                  type: 'Point',
                  coordinates: startPt
                }
              },
              {
                type: 'Feature',
                properties: {
                  title: `📡 DEST (RX): ${selectedRoute.destName || 'Receiver'}`,
                  color: selectedRoute.color
                },
                geometry: {
                  type: 'Point',
                  coordinates: endPt
                }
              }
            ]
          });
        }

        // Update node markers highlighting & target ring
        const markers = document.querySelectorAll<HTMLElement>('.campus-gis-marker');
        markers.forEach((m) => {
          const code = m.getAttribute('data-code');
          const ring = m.querySelector<HTMLElement>('.origin-target-ring');
          const box = m.firstElementChild as HTMLElement;
          if (code === selectedRoute.originCode) {
            if (box) {
              box.style.borderColor = '#00f0ff';
              box.style.boxShadow = '0 0 24px rgba(0,240,255,0.7)';
            }
            if (ring) ring.style.display = 'block';
          } else if (code === selectedRoute.destCode) {
            if (box) {
              box.style.borderColor = '#38bdf8';
              box.style.boxShadow = '0 0 16px rgba(56,189,248,0.5)';
            }
            if (ring) ring.style.display = 'none';
          } else {
            if (box) {
              box.style.borderColor = '#1e293b';
              box.style.boxShadow = '0 6px 20px rgba(0,0,0,0.8)';
            }
            if (ring) ring.style.display = 'none';
          }
        });

        // Smoothly pan & fit bounds directly over the pedestrian path!
        const bounds = new mapboxgl.LngLatBounds();
        selectedRoute.coordinates.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, {
          padding: { top: 120, bottom: 120, left: 420, right: 120 },
          maxZoom: 18.5,
          pitch: 52,
          bearing: -20,
          duration: 1200
        });
      } else {
        const markers = document.querySelectorAll<HTMLElement>('.campus-gis-marker');
        markers.forEach((m) => {
          const ring = m.querySelector<HTMLElement>('.origin-target-ring');
          const box = m.firstElementChild as HTMLElement;
          if (box) {
            box.style.borderColor = '#1e293b';
            box.style.boxShadow = '0 6px 20px rgba(0,0,0,0.8)';
          }
          if (ring) ring.style.display = 'none';
        });

        routeSource.setData({
          type: 'FeatureCollection',
          features: []
        });
        if (endpointSource) {
          endpointSource.setData({
            type: 'FeatureCollection',
            features: []
          });
        }
        if (walkerSource) {
          walkerSource.setData({
            type: 'FeatureCollection',
            features: []
          });
        }
        const pkSource: any = map.getSource('nav-signal-packets-source');
        if (pkSource) pkSource.setData({ type: 'FeatureCollection', features: [] });

        const bmSource: any = map.getSource('nav-signal-beams-source');
        if (bmSource) bmSource.setData({ type: 'FeatureCollection', features: [] });

        const plSource: any = map.getSource('nav-signal-pulses-source');
        if (plSource) plSource.setData({ type: 'FeatureCollection', features: [] });
      }
    }
  }, [selectedRoute, map]);

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Real-time 5G Route Transmission HUD Badge */}
      {selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length > 1 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 bg-slate-950/90 backdrop-blur-2xl border border-sky-400/40 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                5G Signal Transmitting Live
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-mono border border-sky-500/30 font-bold">
                MIMO 64T64R
              </span>
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="text-emerald-300 truncate max-w-[130px] sm:max-w-[200px]">
                {selectedRoute.originName || 'Start Point'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-sky-400 animate-pulse">
                trending_flat
              </span>
              <span className="text-sky-300 truncate max-w-[130px] sm:max-w-[200px]">
                {selectedRoute.destName || 'Destination'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 border-l border-slate-800 pl-3 font-mono text-[10px]">
            <div>
              <span className="text-slate-400 block text-[9px]">Transit Delay</span>
              <span className="text-amber-300 font-bold">~0.0014 ms</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Carrier</span>
              <span className="text-sky-300 font-bold">3.5 GHz n78</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Photonic Packets</span>
              <span className="text-emerald-300 font-bold">8 Streams</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating 5G Heatmap Signal Legend (Visible when Heatmap is toggled ON) */}
      {showHeatmap && (
        <div className="absolute bottom-6 left-6 z-30 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              5G RSRP Radiometry
            </span>
            <span className="text-slate-500 font-mono">dBm</span>
          </div>

          {/* Color Gradient Scale */}
          <div className="w-48 h-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 via-emerald-400 to-sky-400 shadow-inner"></div>

          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span className="text-rose-400 font-bold">-95 (Shadow)</span>
            <span className="text-amber-400">-75</span>
            <span className="text-emerald-400 font-bold">-45 (Gigabit)</span>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm text-center shadow-2xl">
            <span className="material-symbols-outlined text-[36px] text-sky-400 mb-2">map</span>
            <p className="font-bold text-white text-base">Cartographic Canvas Offline</p>
            <p className="text-xs text-slate-400 mt-2">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  );
};
