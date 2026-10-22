// ChatBot API service
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Array<{
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }>;
}

export interface ChatRequest {
  message: string;
  context?: {
    locationId?: string;
    recentPlaces?: string[];
  };
}

export interface ChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Array<{
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }>;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const chatAPI = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    await delay(1000); // Simulate processing time

    // In real app: return fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request)
    // }).then(res => res.json());

    const lowerQuery = request.message.toLowerCase();

    // Handle different types of queries
    if (lowerQuery.includes('video call') && (lowerQuery.includes('library') || lowerQuery.includes('near'))) {
      return {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: 'Based on recent measurements, the best spot for video calls near the library is the Library Reading Room (Room 201 in Library Block). Campus Wi-Fi 6E provides the most stable connection here with average latency of 1.8ms and jitter under 0.5ms. Jio True 5G is also available with 9.2ms latency as a backup option.',
        timestamp: new Date(),
        suggestions: [
          {
            id: `place-lib-201`,
            name: 'Library Reading Room',
            type: 'room',
            building: 'Library Block',
            floor: 2,
            campus: 'RVRJC College of Engineering'
          }
        ]
      };
    }

    if (lowerQuery.includes('carrier') && (lowerQuery.includes('compare') || lowerQuery.includes('cyber'))) {
      return {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: 'In the Cyber Block, recent measurements show:\n• Jio True 5G: 780 Mbps download, 9.2ms latency (24 samples, high confidence)\n• Airtel 5G Plus: 640 Mbps download, 11.4ms latency (18 samples, medium confidence)\n• Campus Wi-Fi 6E: 1,240 Mbps download, 1.8ms latency (45 samples, high confidence)\n\nFor browsing: Jio True 5G offers the best balance of speed and availability.\nFor video calls: Campus Wi-Fi 6E is strongly recommended due to ultra-low latency.',
        timestamp: new Date(),
        suggestions: [
          {
            id: `place-cyber-block`,
            name: 'Cyber Block',
            type: 'building',
            campus: 'RVRJC College of Engineering'
          }
        ]
      };
    }

    if (lowerQuery.includes('wifi') && (lowerQuery.includes('6e') || lowerQuery.includes('wi-fi')) && (lowerQuery.includes('hostel') || lowerQuery.includes('a'))) {
      return {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: 'Campus Wi-Fi 6E is available in Hostel A Wing with excellent performance:\n• Average download speed: 1,240 Mbps\n• Average upload speed: 120 Mbps\n• Average latency: 1.8ms\n• Signal strength: -48 dBm (excellent)\n\nThis represents 45 recent measurements with high confidence. The service is available on all floors of Hostel A.',
        timestamp: new Date(),
        suggestions: [
          {
            id: `place-hostel-a`,
            name: 'Hostel A Wing',
            type: 'building',
            campus: 'RVRJC College of Engineering'
          }
        ]
      };
    }

    if (lowerQuery.includes('best') && lowerQuery.includes('browsing')) {
      return {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: 'For general web browsing across campus:\n• Jio True 5G: Median 720 Mbps download (city-wide)\n• Airtel 5G Plus: Median 580 Mbps download\n• Campus Wi-Fi 6E: Median 1,100 Mbps download (indoor areas only)\n\nJio True 5G provides the widest coverage with consistently high speeds, making it the best overall choice for browsing when moving between buildings.',
        timestamp: new Date(),
        suggestions: []
      };
    }

    // Default response for unrecognized queries
    return {
      id: `resp-${Date.now()}`,
      role: 'assistant',
      content: `I don't have enough specific data to answer "${request.message}" accurately. For the most accurate results, try:\n1. Being more specific about location (e.g., "near the library entrance" vs "near library")\n2. Specifying what you're trying to do (video call, file upload, browsing)\n3. Checking if recent measurements exist for that area\n\nWould you like me to help you find a place to take a new measurement to improve our data coverage?`,
      timestamp: new Date(),
      suggestions: [
        {
          id: 'suggest-measure',
          name: 'Take a new measurement',
          type: 'action',
          campus: 'RVRJC College of Engineering'
        }
      ]
    };
  },

  getSuggestions: async (partial: string): Promise<Array<{
    id: string;
    name: string;
    type: string;
    building?: string;
    floor?: string | number;
    campus: string;
  }>> => {
    await delay(300);

    // In real app: return fetch(`/api/chat/suggestions?q=${encodeURIComponent(partial)}`).then(res => res.json());

    // Mock suggestions based on partial input
    const places = [
      { id: 'lib-001', name: 'Central Library', type: 'building', building: 'Library Block', floor: 'Ground Floor', campus: 'RVRJC College of Engineering' },
      { id: 'lab-205', name: 'Computer Lab 205', type: 'room', building: 'Cyber Block', floor: 2, campus: 'RVRJC College of Engineering' },
      { id: 'cafe-001', name: 'Main Canteen', type: 'outdoor_zone', building: 'Student Centre', floor: 'Ground', campus: 'RVRJC College of Engineering' },
      { id: 'hostel-a', name: 'Hostel A Wing', type: 'building', building: 'Hostel Complex', floor: 'All Floors', campus: 'RVRJC College of Engineering' }
    ];

    if (!partial.trim()) return places.slice(0, 3);

    const lowerPartial = partial.toLowerCase();
    return places.filter(place =>
      place.name.toLowerCase().includes(lowerPartial) ||
      place.building?.toLowerCase().includes(lowerPartial) ||
      place.type.toLowerCase().includes(lowerPartial)
    ).slice(0, 5);
  }
};