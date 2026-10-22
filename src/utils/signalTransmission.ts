// Utility for calculating animated 5G electromagnetic signal transmissions along pedestrian routes

export function getPointAlongPath(coords: [number, number][], progress: number): [number, number] {
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

export function getRouteSignalTransmission(
  coords: [number, number][],
  phase: number,
  routeColor: string = '#38bdf8'
) {
  if (!coords || coords.length < 2) {
    return {
      packets: { type: 'FeatureCollection', features: [] },
      beamSegments: { type: 'FeatureCollection', features: [] },
      pulseRings: { type: 'FeatureCollection', features: [] }
    };
  }

  const packetCount = 8;
  const packetFeatures: any[] = [];
  const beamFeatures: any[] = [];

  for (let i = 0; i < packetCount; i++) {
    const progress = (phase + i / packetCount) % 1;
    const pt = getPointAlongPath(coords, progress);

    // Natural fade-in at the start and fade-out at destination
    const envelope = Math.sin(progress * Math.PI); // 0 at edges, 1 in center
    const opacity = 0.35 + 0.65 * envelope;

    packetFeatures.push({
      type: 'Feature',
      properties: {
        id: i,
        progress,
        color: routeColor,
        opacity,
        radius: 4.5 + envelope * 2.5,
        glowRadius: 12 + envelope * 8,
        glowOpacity: 0.3 + 0.45 * envelope
      },
      geometry: {
        type: 'Point',
        coordinates: pt
      }
    });

    // Trail segment (beam waveguide pulse)
    const trailLength = 0.035; // 3.5% of total route distance
    const samples = 4;
    const trailCoords: [number, number][] = [];
    for (let s = 0; s <= samples; s++) {
      const t = Math.max(0, progress - (trailLength * (samples - s)) / samples);
      trailCoords.push(getPointAlongPath(coords, t));
    }

    beamFeatures.push({
      type: 'Feature',
      properties: {
        id: i,
        color: routeColor,
        opacity: opacity * 0.85
      },
      geometry: {
        type: 'LineString',
        coordinates: trailCoords
      }
    });
  }

  // Radiating RF electromagnetic pulse waves at Source (Start Transmitter)
  const startPt = coords[0];
  const endPt = coords[coords.length - 1];

  const ringPhase1 = (phase * 2.5) % 1;
  const ringPhase2 = (phase * 2.5 + 0.5) % 1;
  const destPulse = 0.5 + 0.5 * Math.sin(phase * Math.PI * 6);

  const pulseRings: any[] = [
    // Expanding transmitter wave 1
    {
      type: 'Feature',
      properties: {
        role: 'source-wave-1',
        radius: 8 + ringPhase1 * 34,
        opacity: Math.max(0, 1 - ringPhase1) * 0.75,
        color: '#10b981'
      },
      geometry: { type: 'Point', coordinates: startPt }
    },
    // Expanding transmitter wave 2
    {
      type: 'Feature',
      properties: {
        role: 'source-wave-2',
        radius: 8 + ringPhase2 * 34,
        opacity: Math.max(0, 1 - ringPhase2) * 0.75,
        color: '#10b981'
      },
      geometry: { type: 'Point', coordinates: startPt }
    },
    // Receiver antenna capture halo
    {
      type: 'Feature',
      properties: {
        role: 'dest-wave',
        radius: 12 + destPulse * 10,
        opacity: 0.4 + destPulse * 0.4,
        color: routeColor
      },
      geometry: { type: 'Point', coordinates: endPt }
    }
  ];

  return {
    packets: { type: 'FeatureCollection', features: packetFeatures },
    beamSegments: { type: 'FeatureCollection', features: beamFeatures },
    pulseRings: { type: 'FeatureCollection', features: pulseRings }
  };
}
