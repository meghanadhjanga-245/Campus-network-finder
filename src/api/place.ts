// Place API service
export interface Place {
  id: string;
  name: string;
  type: string; // building, room, outdoor_zone, etc.
  building?: string;
  floor?: string | number;
  campus: string;
}

export interface PlaceDetails extends Place {
  recentMeasurements: Measurement[];
  carrierComparison: CarrierComparison;
}

export interface Measurement {
  id: string;
  timestamp: Date;
  location: string;
  carrier: string;
  technology: string;
  download: number;
  upload: number;
  latency: number;
  privacyLevel: 'aggregated' | 'private';
}

export interface CarrierComparison {
  bestForBrowsing: {
    carrier: string;
    reason: string;
    evidence: string;
    timestamp: Date;
  };
  bestForVideoCall: {
    carrier: string;
    reason: string;
    evidence: string;
    timestamp: Date;
  };
  bestForUpload: {
    carrier: string;
    reason: string;
    evidence: string;
    timestamp: Date;
  };
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const placeAPI = {
  getPlaceById: async (id: string): Promise<PlaceDetails | null> => {
    await delay(800);

    // In real app: return fetch(`/api/places/${id}`).then(res => res.json());

    // Mock data based on ID
    const places: Record<string, PlaceDetails> = {
      'lib-001': {
        id: 'lib-001',
        name: 'Central Library',
        type: 'building',
        building: 'Library Block',
        floor: 'Ground Floor',
        campus: 'RVRJC College of Engineering',
        recentMeasurements: [
          {
            id: 'meas-001',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            location: 'Library Reading Room, Library Block',
            carrier: 'Jio True 5G',
            technology: '5G SA',
            download: 765,
            upload: 43,
            latency: 9.1,
            privacyLevel: 'aggregated'
          },
          {
            id: 'meas-002',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            location: 'Central Library, Library Block',
            carrier: 'Campus Wi-Fi 6E',
            technology: 'Wi-Fi 6E',
            download: 1250,
            upload: 125,
            latency: 1.7,
            privacyLevel: 'aggregated'
          }
        ],
        carrierComparison: {
          bestForBrowsing: {
            carrier: 'Jio True 5G',
            reason: 'Highest median download speed in last 24h',
            evidence: '780 Mbps (24 samples, 92% confidence)',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          bestForVideoCall: {
            carrier: 'Campus Wi-Fi 6E',
            reason: 'Lowest latency and jitter',
            evidence: '1.8 ms latency, 0.5 ms jitter (45 samples, 95% confidence)',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
          },
          bestForUpload: {
            carrier: 'Campus Wi-Fi 6E',
            reason: 'Highest upload speed',
            evidence: '120 Mbps upload (45 samples, 90% confidence)',
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
          }
        }
      },
      'lab-205': {
        id: 'lab-205',
        name: 'Computer Lab 205',
        type: 'room',
        building: 'Cyber Block',
        floor: 2,
        campus: 'RVRJC College of Engineering',
        recentMeasurements: [
          {
            id: 'meas-003',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            location: 'Computer Lab 205, Cyber Block',
            carrier: 'Campus Wi-Fi 6E',
            technology: 'Wi-Fi 6E',
            download: 1240,
            upload: 120,
            latency: 1.8,
            privacyLevel: 'aggregated'
          }
        ],
        carrierComparison: {
          bestForBrowsing: {
            carrier: 'Jio True 5G',
            reason: 'Best balance of speed and availability in Cyber Block',
            evidence: '720 Mbps avg (20 samples, 85% confidence)',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          bestForVideoCall: {
            carrier: 'Campus Wi-Fi 6E',
            reason: 'Ultra-low latency for video conferencing',
            evidence: '1.6 ms latency, 0.3 ms jitter (30 samples, 90% confidence)',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
          },
          bestForUpload: {
            carrier: 'Campus Wi-Fi 6E',
            reason: 'Highest upload speed in academic buildings',
            evidence: '110 Mbps upload (25 samples, 80% confidence)',
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
          }
        }
      }
    };

    return places[id] || null;
  },

  searchPlaces: async (query: string): Promise<Place[]> => {
    await delay(600);

    // In real app: return fetch(`/api/places/search?q=${encodeURIComponent(query)}`).then(res => res.json());

    // Mock search results
    const allPlaces: Place[] = [
      { id: 'lib-001', name: 'Central Library', type: 'building', building: 'Library Block', floor: 'Ground Floor', campus: 'RVRJC College of Engineering' },
      { id: 'lab-205', name: 'Computer Lab 205', type: 'room', building: 'Cyber Block', floor: 2, campus: 'RVRJC College of Engineering' },
      { id: 'cafe-001', name: 'Main Canteen', type: 'outdoor_zone', building: 'Student Centre', floor: 'Ground', campus: 'RVRJC College of Engineering' },
      { id: 'hostel-a', name: 'Hostel A Wing', type: 'building', building: 'Hostel Complex', floor: 'All Floors', campus: 'RVRJC College of Engineering' },
      { id: 'gate-main', name: 'Main Gate', type: 'gate', building: undefined, floor: undefined, campus: 'RVRJC College of Engineering' },
      { id: 'admin-001', name: 'Administrative Block', type: 'building', building: 'Admin Block', floor: 'All Floors', campus: 'RVRJC College of Engineering' },
      { id: 'sports-001', name: 'Sports Complex', type: 'outdoor_zone', building: 'Sports Facility', floor: 'Ground', campus: 'RVRJC College of Engineering' }
    ];

    if (!query.trim()) return allPlaces.slice(0, 5);

    const lowerQuery = query.toLowerCase();
    return allPlaces.filter(place =>
      place.name.toLowerCase().includes(lowerQuery) ||
      place.building?.toLowerCase().includes(lowerQuery) ||
      place.type.toLowerCase().includes(lowerQuery)
    );
  }
};