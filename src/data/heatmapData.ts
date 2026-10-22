export interface HeatmapPointProperties {
  name: string;
  carrier: 'Jio True 5G' | 'Airtel 5G Plus' | 'Wi-Fi 6E';
  carrierKey: 'jio' | 'airtel' | 'wifi';
  slices: ('embb' | 'urllc' | 'mmtc')[];
  rsrp: number; // dBm (-95 to -45)
  throughput: number; // Mbps
  latency: number; // ms
  quality: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  weight: number;
}

export interface HeatmapFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: HeatmapPointProperties;
}

export const BASE_HEATMAP_POINTS: HeatmapFeature[] = [
  // Main Block & Administrative Tower Mast (Gigabit Hub)
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32399, 16.25509] },
    properties: {
      name: 'Administrative Tower Hub',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['embb', 'urllc', 'mmtc'],
      rsrp: -45,
      throughput: 1180,
      latency: 7.2,
      quality: 'Optimal',
      weight: 1.0
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32375, 16.25516] },
    properties: {
      name: 'Central Admin Portico',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['embb', 'urllc'],
      rsrp: -48,
      throughput: 980,
      latency: 8.5,
      quality: 'Optimal',
      weight: 0.96
    }
  },

  // Hitech Block (Central Library & Research Labs)
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32349, 16.25458] },
    properties: {
      name: 'Digital Library & R&D Center',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['embb', 'urllc', 'mmtc'],
      rsrp: -48,
      throughput: 1050,
      latency: 6.8,
      quality: 'Optimal',
      weight: 0.95
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32320, 16.25440] },
    properties: {
      name: 'Hitech Block Wi-Fi AP',
      carrier: 'Wi-Fi 6E',
      carrierKey: 'wifi',
      slices: ['embb', 'mmtc'],
      rsrp: -52,
      throughput: 620,
      latency: 11.2,
      quality: 'Optimal',
      weight: 0.90
    }
  },

  // Cyber Block (CSE / IT Department & AI Supercomputing Lab)
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32284, 16.25380] },
    properties: {
      name: 'Cyber Block AI Lab',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['embb', 'urllc'],
      rsrp: -52,
      throughput: 1120,
      latency: 5.9,
      quality: 'Optimal',
      weight: 0.91
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32260, 16.25360] },
    properties: {
      name: 'Cyber Block Software Lab',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['embb', 'urllc'],
      rsrp: -58,
      throughput: 890,
      latency: 9.1,
      quality: 'Good',
      weight: 0.84
    }
  },

  // Civil Engineering Workshop & Central Boulevard
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32426, 16.25587] },
    properties: {
      name: 'Central Campus Boulevard',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['embb', 'mmtc'],
      rsrp: -62,
      throughput: 740,
      latency: 12.4,
      quality: 'Good',
      weight: 0.78
    }
  },

  // Chemical Engineering Block
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32446, 16.25652] },
    properties: {
      name: 'Chemical Process Lab',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['urllc', 'mmtc'],
      rsrp: -58,
      throughput: 810,
      latency: 10.1,
      quality: 'Good',
      weight: 0.82
    }
  },

  // Student Canteen & Food Court Complex
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32372, 16.25700] },
    properties: {
      name: 'Student Food Court & Plaza',
      carrier: 'Wi-Fi 6E',
      carrierKey: 'wifi',
      slices: ['embb', 'mmtc'],
      rsrp: -60,
      throughput: 580,
      latency: 14.8,
      quality: 'Good',
      weight: 0.80
    }
  },

  // Mechanical & Silver Jubilee Block (Robotics & Mechatronics Lab)
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32373, 16.25779] },
    properties: {
      name: 'Robotics & Automation Center',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['urllc', 'mmtc'],
      rsrp: -64,
      throughput: 720,
      latency: 7.9,
      quality: 'Good',
      weight: 0.75
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32382, 16.25757] },
    properties: {
      name: 'Silver Jubilee IoT Gateway',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['mmtc'],
      rsrp: -63,
      throughput: 680,
      latency: 13.5,
      quality: 'Good',
      weight: 0.76
    }
  },

  // Cricket Ground & Athletics Zone
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32531, 16.25440] },
    properties: {
      name: 'Main Cricket Pavilion',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['embb'],
      rsrp: -68,
      throughput: 620,
      latency: 16.2,
      quality: 'Good',
      weight: 0.70
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32511, 16.25547] },
    properties: {
      name: 'Open Athletics Stadium',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['embb'],
      rsrp: -65,
      throughput: 670,
      latency: 15.0,
      quality: 'Good',
      weight: 0.74
    }
  },

  // Hostel A & B Complex
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32580, 16.25680] },
    properties: {
      name: 'Hostel Complex Residential Node',
      carrier: 'Wi-Fi 6E',
      carrierKey: 'wifi',
      slices: ['embb', 'mmtc'],
      rsrp: -62,
      throughput: 590,
      latency: 13.9,
      quality: 'Good',
      weight: 0.78
    }
  },

  // Main Campus Entrance Gate
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32180, 16.25480] },
    properties: {
      name: 'Main Arch Entrance Gate',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['embb', 'mmtc'],
      rsrp: -68,
      throughput: 580,
      latency: 17.5,
      quality: 'Good',
      weight: 0.70
    }
  },

  // Shadow & Attenuation Dead Zones
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32240, 16.25420] },
    properties: {
      name: 'Sub-Basement Electrical Vault',
      carrier: 'Airtel 5G Plus',
      carrierKey: 'airtel',
      slices: ['mmtc'],
      rsrp: -94,
      throughput: 45,
      latency: 48.0,
      quality: 'Poor',
      weight: 0.15
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [80.32480, 16.25730] },
    properties: {
      name: 'Concrete Structural Shadow Zone',
      carrier: 'Jio True 5G',
      carrierKey: 'jio',
      slices: ['mmtc'],
      rsrp: -90,
      throughput: 72,
      latency: 39.5,
      quality: 'Poor',
      weight: 0.22
    }
  }
];

export function getFilteredHeatmapData(
  slice: 'all' | 'embb' | 'urllc' | 'mmtc' = 'all',
  carrier: 'all' | 'jio' | 'airtel' | 'wifi' = 'all'
): any {
  let filtered = BASE_HEATMAP_POINTS;

  // 1. Filter by Carrier
  if (carrier !== 'all') {
    filtered = filtered.filter((p) => p.properties.carrierKey === carrier);
  }

  // 2. Filter / Reweight by 5G Network Slice
  const features = filtered.map((pt) => {
    let weight = pt.properties.weight;
    let rsrp = pt.properties.rsrp;

    if (slice === 'embb') {
      // eMBB: Emphasize throughput (>500 Mbps)
      const isEmbb = pt.properties.slices.includes('embb');
      weight = isEmbb ? Math.min(1.0, pt.properties.throughput / 1100) : weight * 0.35;
      rsrp = isEmbb ? pt.properties.rsrp : Math.min(pt.properties.rsrp - 15, -88);
    } else if (slice === 'urllc') {
      // URLLC: Emphasize ultra-low latency (<10ms)
      const isUrllc = pt.properties.slices.includes('urllc');
      const latScore = Math.max(0.2, 1.0 - pt.properties.latency / 30);
      weight = isUrllc ? latScore : weight * 0.3;
      rsrp = isUrllc ? -50 : -85;
    } else if (slice === 'mmtc') {
      // mMTC: Emphasize massive sensor density
      const isMmtc = pt.properties.slices.includes('mmtc');
      weight = isMmtc ? 0.85 : 0.25;
    }

    return {
      type: 'Feature',
      geometry: pt.geometry,
      properties: {
        ...pt.properties,
        weight: Number(weight.toFixed(2)),
        rsrp
      }
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

export const CAMPUS_HEATMAP_GEOJSON: any = getFilteredHeatmapData('all', 'all');
