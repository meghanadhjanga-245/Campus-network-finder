export interface MimoBeam {
  id: string;
  targetName: string;
  targetCoords: [number, number];
  frequency: string;
  bandwidth: string;
  sinr: number;
  rsrp: number;
  status: 'active' | 'adapting' | 'standby';
}

// 5G gNodeB Tower atop Main Block (Administrative Center of Campus)
export const CAMPUS_TOWER_COORDS: [number, number] = [80.32399, 16.25509];

export const MIMO_BEAMS: MimoBeam[] = [
  {
    id: 'beam-1',
    targetName: 'Hitech Block (Library)',
    targetCoords: [80.32349, 16.25458],
    frequency: '3.5 GHz (n78)',
    bandwidth: '100 MHz',
    sinr: 34.2,
    rsrp: -48,
    status: 'active'
  },
  {
    id: 'beam-2',
    targetName: 'Cyber Block (CSE/IT)',
    targetCoords: [80.32284, 16.25380],
    frequency: '3.5 GHz (n78)',
    bandwidth: '100 MHz',
    sinr: 31.0,
    rsrp: -52,
    status: 'active'
  },
  {
    id: 'beam-3',
    targetName: 'Main Canteen',
    targetCoords: [80.32372, 16.25700],
    frequency: '3.5 GHz (n78)',
    bandwidth: '80 MHz',
    sinr: 26.5,
    rsrp: -60,
    status: 'active'
  },
  {
    id: 'beam-4',
    targetName: 'Mechanical Block',
    targetCoords: [80.32373, 16.25779],
    frequency: '700 MHz (n28)',
    bandwidth: '40 MHz',
    sinr: 22.8,
    rsrp: -64,
    status: 'active'
  },
  {
    id: 'beam-5',
    targetName: 'Chemical Block',
    targetCoords: [80.32446, 16.25652],
    frequency: '3.5 GHz (n78)',
    bandwidth: '60 MHz',
    sinr: 25.1,
    rsrp: -58,
    status: 'active'
  },
  {
    id: 'beam-6',
    targetName: 'Cricket Ground',
    targetCoords: [80.32531, 16.25440],
    frequency: '700 MHz (n28)',
    bandwidth: '40 MHz',
    sinr: 20.4,
    rsrp: -68,
    status: 'adapting'
  },
  {
    id: 'beam-7',
    targetName: 'Hostel Complex',
    targetCoords: [80.32580, 16.25680],
    frequency: '3.5 GHz (n78)',
    bandwidth: '80 MHz',
    sinr: 24.2,
    rsrp: -62,
    status: 'active'
  }
];

export const BEAMS_GEOJSON: any = {
  type: 'FeatureCollection',
  features: MIMO_BEAMS.map((b) => ({
    type: 'Feature',
    properties: {
      id: b.id,
      targetName: b.targetName,
      frequency: b.frequency,
      sinr: b.sinr,
      rsrp: b.rsrp,
      status: b.status
    },
    geometry: {
      type: 'LineString',
      coordinates: [CAMPUS_TOWER_COORDS, b.targetCoords]
    }
  }))
};
