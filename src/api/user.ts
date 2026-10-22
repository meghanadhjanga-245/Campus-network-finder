// User API service
export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'student' | 'staff' | 'admin' | 'super_admin';
  campus: string;
  memberSince: string;
  lastLogin: string;
  avatar?: string;
}

export interface MeasurementHistory {
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

export interface SavedPlace {
  id: string;
  name: string;
  type: string;
  building?: string;
  floor?: string | number;
  campus: string;
  lastUpdated: Date;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userAPI = {
  getUserProfile: async (_userId: string): Promise<User> => {
    await delay(800);

    // In real app: return fetch(`/api/users/${_userId}`).then(res => res.json());

    // Return mock user data
    return {
      id: _userId || 'user-001',
      displayName: 'Megha Janga',
      email: 'megha.janga@rvrjce.ac.in',
      role: 'student',
      campus: 'RVRJC College of Engineering',
      memberSince: 'March 2024',
      lastLogin: 'Today, 10:30 AM',
      avatar: 'https://example.com/avatar.jpg'
    };
  },

  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(1000);

    // In real app: return fetch(`/api/users/${updates.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // }).then(res => res.json());

    // Mock update
    return {
      id: updates.id || 'user-001',
      displayName: updates.displayName || 'Megha Janga',
      email: updates.email || 'megha.janga@rvrjce.ac.in',
      role: updates.role || 'student',
      campus: updates.campus || 'RVRJC College of Engineering',
      memberSince: 'March 2024',
      lastLogin: 'Today, 10:30 AM',
      avatar: updates.avatar
    };
  },

  getMeasurementHistory: async (_userId: string, limit: number = 20): Promise<MeasurementHistory[]> => {
    await delay(800);

    // In real app: return fetch(`/api/users/${_userId}/measurements?limit=${limit}`).then(res => res.json());

    const history: MeasurementHistory[] = [];
    const locations = [
      'Library Reading Room, Library Block',
      'Computer Lab 205, Cyber Block',
      'Hostel A Wing, Room 304',
      'Main Canteen, Student Centre',
      'Sports Field, Sports Complex'
    ];
    const carriers = ['Jio True 5G', 'Airtel 5G Plus', 'Campus Wi-Fi 6E', 'BSNL 4G'];
    const technologies = ['5G SA', '5G NSA', 'Wi-Fi 6E', '4G LTE'];

    for (let i = 0; i < limit; i++) {
      history.push({
        id: `meas-${i+1}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        location: locations[Math.floor(Math.random() * locations.length)],
        ...(() => {
          const cIdx = Math.floor(Math.random() * carriers.length);
          return { carrier: carriers[cIdx], technology: technologies[cIdx] };
        })(),
        download: Math.floor(100 + Math.random() * 1200),
        upload: Math.floor(10 + Math.random() * 130),
        latency: Math.floor(1 + Math.random() * 30),
        privacyLevel: 'aggregated'
      });
    }

    return history;
  },

  getSavedPlaces: async (_userId: string): Promise<SavedPlace[]> => {
    await delay(600);

    // In real app: return fetch(`/api/users/${_userId}/saved-places`).then(res => res.json());

    return [
      {
        id: 'place-001',
        name: 'Library Reading Room',
        type: 'room',
        building: 'Library Block',
        floor: 2,
        campus: 'RVRJC College of Engineering',
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: 'place-002',
        name: 'Computer Lab 205',
        type: 'room',
        building: 'Cyber Block',
        floor: 2,
        campus: 'RVRJC College of Engineering',
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        id: 'place-003',
        name: 'Main Canteen Seating Area',
        type: 'outdoor_zone',
        building: 'Student Centre',
        floor: 'Ground',
        campus: 'RVRJC College of Engineering',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
  },

  deleteAccount: async (_userId: string): Promise<boolean> => {
    await delay(1500);

    // In real app: return fetch(`/api/users/${_userId}`, {
    //   method: 'DELETE'
    // }).then(res => res.ok);

    return true;
  }
};