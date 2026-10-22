// Measurement API service
export interface MeasurementRequest {
  locationId: string;
  carrierPreference?: 'jio' | 'airtel' | 'bsnl' | 'campus-wifi' | 'auto';
  testType?: 'quick' | 'standard' | 'comprehensive';
}

export interface MeasurementResult {
  id: string;
  timestamp: Date;
  locationId: string;
  carrier: string;
  technology: string;
  download: number; // Mbps
  upload: number; // Mbps
  latency: number; // ms
  jitter: number; // ms
  packetLoss: number; // percentage
  rsrp: number; // dBm
  rsrq: number; // dB
  sinr: number; // dB
  rssi: number; // dBm
  deviceInfo: {
    manufacturer: string;
    model: string;
    osVersion: string;
    appVersion: string;
  };
  privacyLevel: 'aggregated' | 'private';
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const measurementAPI = {
  startMeasurement: async (_request: MeasurementRequest): Promise<{ testId: string; estimatedDuration: number }> => {
    await delay(500);

    // In real app: return fetch('/api/measurements/start', { method: 'POST', body: JSON.stringify(_request) })
    //   .then(res => res.json());

    return {
      testId: `test-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      estimatedDuration: 3000 // 3 seconds
    };
  },

  getMeasurementResult: async (testId: string): Promise<MeasurementResult> => {
    await delay(2500); // Simulate test duration

    // In real app: return fetch(`/api/measurements/${testId}`).then(res => res.json());

    // Generate realistic measurement _results
    const carriers = ['Jio True 5G', 'Airtel 5G Plus', 'Campus Wi-Fi 6E', 'BSNL 4G'];
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];

    return {
      id: testId,
      timestamp: new Date(),
      locationId: 'loc-' + Math.floor(Math.random() * 100),
      carrier,
      technology: carrier.includes('Jio') ? '5G SA' :
                 carrier.includes('Airtel') ? '5G NSA' :
                 carrier.includes('Campus') ? 'Wi-Fi 6E' : '4G LTE',
      download: Math.floor(500 + Math.random() * 800), // 500-1300 Mbps
      upload: Math.floor(30 + Math.random() * 100),    // 30-130 Mbps
      latency: Math.floor(1 + Math.random() * 30),     // 1-30 ms
      jitter: Math.floor(0.1 + Math.random() * 5),     // 0.1-5.1 ms
      packetLoss: Math.round((Math.random() * 3) * 100) / 100, // 0-3% with 2 decimal places
      rsrp: Math.floor(-90 + Math.random() * 30),      // -90 to -60 dBm
      rsrq: Math.floor(-15 + Math.random() * 10),      // -15 to -5 dB
      sinr: Math.floor(0 + Math.random() * 40),        // 0-40 dB
      rssi: Math.floor(-80 + Math.random() * 40),      // -80 to -40 dBm
      deviceInfo: {
        manufacturer: ['Samsung', 'Apple', 'Xiaomi', 'OnePlus'][Math.floor(Math.random() * 4)],
        model: ['Galaxy S23', 'iPhone 15', 'Redmi Note 12', 'OnePlus 11'][Math.floor(Math.random() * 4)],
        osVersion: Math.random() > 0.5 ? 'Android 14' : 'iOS 17',
        appVersion: '1.2.0'
      },
      privacyLevel: 'aggregated'
    };
  },

  submitMeasurement: async (_result: MeasurementResult): Promise<boolean> => {
    await delay(800);

    // In real app: return fetch('/api/measurements', { method: 'POST', body: JSON.stringify(_result) })
    //   .then(res => res.ok);

    return true;
  },

  getMeasurementHistory: async (limit: number = 50): Promise<MeasurementResult[]> => {
    await delay(800);

    // In real app: return fetch(`/api/measurements/history?limit=${limit}`).then(res => res.json());

    const history: MeasurementResult[] = [];
    for (let i = 0; i < limit; i++) {
      history.push({
        ...(await measurementAPI.getMeasurementResult(`hist-${i}`)),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Last 30 days
      });
    }

    return history;
  }
};