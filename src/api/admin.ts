// Admin API service
export interface Campus {
  id: string;
  name: string;
  boundary: string;
  buildings: number;
  floors: number;
  lastUpdated: Date;
}

export interface Blueprint {
  id: string;
  name: string;
  type: string; // PDF, DWG, etc.
  campus: string;
  uploaded: Date;
  status: 'aligned' | 'needs_review' | 'processing';
}

export interface Survey {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'planned';
  routeLength: string;
  samplesToday: number;
  targetSamples: number;
  lastRun: Date;
}

export interface ModerationItem {
  id: string;
  location: string;
  carrier: string;
  timestamp: Date;
  sampleCount: number;
  qualityFlags: string;
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'staff' | 'survey_operator' | 'moderator' | 'admin';
  campus: string;
  lastActive: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminAPI = {
  getOverview: async (): Promise<{
    campuses: Campus[];
    recentMeasurements: number;
    uniqueDevices: number;
    dataQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    pendingModeration: number;
  }> => {
    await delay(800);

    // In real app: return fetch('/api/admin/overview').then(res => res.json());

    return {
      campuses: [
        {
          id: 'campus-001',
          name: 'RVRJC College of Engineering',
          boundary: '37.4 acres',
          buildings: 7,
          floors: 22,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'campus-002',
          name: 'IIT Hyderabad',
          boundary: '576 acres',
          buildings: 45,
          floors: 180,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ],
      recentMeasurements: 1247 + Math.floor(Math.random() * 50),
      uniqueDevices: 89 + Math.floor(Math.random() * 20),
      dataQuality: Math.random() > 0.3 ? 'Good' : 'Fair',
      pendingModeration: 23 + Math.floor(Math.random() * 10)
    };
  },

  getCampuses: async (): Promise<Campus[]> => {
    await delay(600);
    // In real app: return fetch('/api/admin/campuses').then(res => res.json());
    return (await adminAPI.getOverview()).campuses;
  },

  getBlueprints: async (): Promise<Blueprint[]> => {
    await delay(600);
    // In real app: return fetch('/api/admin/blueprints').then(res => res.json());
    return [
      {
        id: 'bp-001',
        name: 'Library Block Floor Plans',
        type: 'PDF',
        campus: 'RVRJC College of Engineering',
        uploaded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'aligned'
      },
      {
        id: 'bp-002',
        name: 'Cyber Block CAD Layout',
        type: 'DWG',
        campus: 'RVRJC College of Engineering',
        uploaded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'needs_review'
      }
    ];
  },

  getSurveys: async (): Promise<Survey[]> => {
    await delay(600);
    // In real app: return fetch('/api/admin/surveys').then(res => res.json());
    return [
      {
        id: 'surv-001',
        name: 'Weekly Campus Survey',
        status: 'active',
        routeLength: '2.4 km',
        samplesToday: 45 + Math.floor(Math.random() * 15),
        targetSamples: 200,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'surv-002',
        name: 'Hostel Network Audit',
        status: 'completed',
        routeLength: '1.2 km',
        samplesToday: 0,
        targetSamples: 120,
        lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
  },

  getModerationQueue: async (): Promise<ModerationItem[]> => {
    await delay(600);
    // In real app: return fetch('/api/admin/moderation').then(res => res.json());
    return Array.from({ length: 23 + Math.floor(Math.random() * 10) }, (_, index) => ({
      id: `mod-${index + 1}`,
      location: ['Library Reading Room', 'Computer Lab 205', 'Hostel A Wing', 'Main Canteen', 'Sports Field'][index % 5],
      carrier: ['Jio True 5G', 'Airtel 5G Plus', 'Campus Wi-Fi 6E', 'BSNL 4G'][index % 4],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000),
      sampleCount: 8 + Math.floor(Math.random() * 15),
      qualityFlags: ['GPS Accuracy: Good • Device: Consistent', 'GPS Accuracy: Excellent • Device: New', 'GPS Accuracy: Fair • Device: Old'][index % 3]
    }));
  },

  getAnalytics: async (): Promise<{
    speedDistribution: number[]; // histogram data
    latencyDistribution: number[];
  }> => {
    await delay(800);
    // In real app: return fetch('/api/admin/analytics').then(res => res.json());
    // Return mock histogram data
    return {
      speedDistribution: Array.from({ length: 10 }, () => Math.floor(Math.random() * 30)),
      latencyDistribution: Array.from({ length: 10 }, () => Math.floor(Math.random() * 20))
    };
  },

  getUsers: async (): Promise<User[]> => {
    await delay(800);
    // In real app: return fetch('/api/admin/users').then(res => res.json());
    const roles = ['student', 'staff', 'survey_operator', 'moderator', 'admin'] as const;
    return Array.from({ length: 50 }, (_, index) => ({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      role: roles[index % roles.length] as any,
      campus: 'RVRJC College of Engineering',
      lastActive: `Today, ${10 + (index % 12)}:${index < 10 ? `0${index}` : index} AM`
    }));
  },

  deleteItem: async (type: string, id: string): Promise<boolean> => {
    console.log(`Deleting ${type} with id ${id}`);
    await delay(1000);
    return true;
  }
};