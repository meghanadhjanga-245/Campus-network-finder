// Telemetry API service
export interface TelemetryData {
  rsrp: number; // Reference Signal Received Power (dBm)
  sinr: number; // Signal to Interference plus Noise Ratio (dB)
  rsrq: number; // Reference Signal Received Quality (dB)
  rssi: number; // Received Signal Strength Indicator (dBm)
  latency: number; // Network latency (ms)
  jitter: number; // Packet jitter (ms)
  download: number; // Download speed (Mbps)
  upload: number; // Upload speed (Mbps)
  packetLoss: number; // Packet loss percentage
  timestamp: Date;
  sampleCount: number;
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  carrier: string;
  technology: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const telemetryAPI = {
  getCurrentTelemetry: async (): Promise<TelemetryData> => {
    await delay(1000);

    // In real app, this would be:
    // return fetch('/api/telemetry/current').then(res => res.json());

    // Return realistic simulated data for now
    // In a real implementation, this would come from actual SDR instruments or carrier APIs
    return {
      rsrp: -62 + (Math.random() - 0.5) * 4,
      sinr: 26.4 + (Math.random() - 0.5) * 2,
      rsrq: -8 + (Math.random() - 0.5) * 1.5,
      rssi: -55 + (Math.random() - 0.5) * 3,
      latency: Math.max(1, 9.2 + (Math.random() - 0.5) * 2),
      jitter: Math.max(0.1, 1.2 + (Math.random() - 0.5) * 0.5),
      download: Math.max(0, 780 + (Math.random() - 0.5) * 100),
      upload: Math.max(0, 45 + (Math.random() - 0.5) * 15),
      packetLoss: Math.max(0, Math.min(5, 0.1 + (Math.random() - 0.5) * 0.3)),
      timestamp: new Date(),
      sampleCount: 24 + Math.floor(Math.random() * 6),
      confidence: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      carrier: 'Jio True 5G',
      technology: '5G SA'
    };
  },

  getTelemetryHistory: async (_hours: number = 24): Promise<TelemetryData[]> => {
    await delay(1000);
    // In real app: return fetch(`/api/telemetry/history?_hours=${_hours}`).then(res => res.json());

    const history: TelemetryData[] = [];
    const now = Date.now();

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now - i * 60 * 60 * 1000); // Hourly data
      history.push({
        ...(await telemetryAPI.getCurrentTelemetry()),
        timestamp,
        sampleCount: 10 + Math.floor(Math.random() * 20)
      });
    }

    return history;
  }
};