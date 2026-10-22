// Carrier API service
export interface CarrierData {
  name: string;
  technology: string;
  band: string;
  downloadSpeed: string;
  uploadSpeed: string;
  latency: string;
  jitter: string;
  packetLoss: string;
  rsrp: string;
  sinr: string;
  rsrq: string;
  rssi: string;
  status: 'optimal' | 'caution' | 'error';
  sampleCount: number;
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  lastUpdated: Date;
  color: string;
  bgColor: string;
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

export const carrierAPI = {
  getCarrierData: async (): Promise<CarrierData[]> => {
    await delay(1000);

    // In real app, this would be:
    // return fetch('/api/carrier/data').then(res => res.json());

    // Return carrier data (similar to what was simulated)
    const carriers = [
      {
        name: "Jio True 5G (SA)",
        technology: "5G SA",
        band: "n78 (3500 MHz)",
        downloadSpeed: `${780 + Math.round(Math.random() * 20)} Mbps`,
        uploadSpeed: `${45 + Math.round(Math.random() * 5)} Mbps`,
        latency: `${9.2 + Math.round((Math.random() - 0.5) * 2) * 10 / 10} ms`,
        jitter: `${1.2 + Math.round((Math.random() - 0.5) * 0.4) * 10 / 10} ms`,
        packetLoss: `${(0.1 + Math.round((Math.random() - 0.5) * 0.2) * 100 / 100).toFixed(2)}%`,
        rsrp: `${-62 + Math.round((Math.random() - 0.5) * 4)} dBm`,
        sinr: `${26.4 + Math.round((Math.random() - 0.5) * 2) * 10 / 10} dB`,
        rsrq: `${-8 + Math.round((Math.random() - 0.5) * 1) * 10 / 10} dB`,
        rssi: `${-55 + Math.round((Math.random() - 0.5) * 3)} dBm`,
        status: "optimal",
        sampleCount: 24 + Math.floor(Math.random() * 6),
        confidence: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3) * 60 * 60 * 1000), // 0-3 hours ago
        color: "#0ea5e9",
        bgColor: "rgba(14, 165, 233, 0.1)"
      },
      {
        name: "Airtel 5G Plus (NSA)",
        technology: "5G NSA",
        band: "n78 + B3 Anchor",
        downloadSpeed: `${640 + Math.round(Math.random() * 20)} Mbps`,
        uploadSpeed: `${38 + Math.round(Math.random() * 5)} Mbps`,
        latency: `${11.4 + Math.round((Math.random() - 0.5) * 2) * 10 / 10} ms`,
        jitter: `${1.8 + Math.round((Math.random() - 0.5) * 0.4) * 10 / 10} ms`,
        packetLoss: `${(0.2 + Math.round((Math.random() - 0.5) * 0.2) * 100 / 100).toFixed(2)}%`,
        rsrp: `${-66 + Math.round((Math.random() - 0.5) * 4)} dBm`,
        sinr: `${22.1 + Math.round((Math.random() - 0.5) * 2) * 10 / 10} dB`,
        rsrq: `${-9 + Math.round((Math.random() - 0.5) * 1) * 10 / 10} dB`,
        rssi: `${-58 + Math.round((Math.random() - 0.5) * 3)} dBm`,
        status: "optimal",
        sampleCount: 18 + Math.floor(Math.random() * 4),
        confidence: Math.random() > 0.7 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 6) * 60 * 60 * 1000), // 0-6 hours ago
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)"
      },
      {
        name: "BSNL 4G / 5G Ready",
        technology: "4G LTE",
        band: "B1 / B41 TDD",
        downloadSpeed: `${88 + Math.round(Math.random() * 10)} Mbps`,
        uploadSpeed: `${8 + Math.round(Math.random() * 2)} Mbps`,
        latency: `${28.5 + Math.round((Math.random() - 0.5) * 4) * 10 / 10} ms`,
        jitter: `${3.2 + Math.round((Math.random() - 0.5) * 0.8) * 10 / 10} ms`,
        packetLoss: `${(1.5 + Math.round((Math.random() - 0.5) * 0.5) * 100 / 100).toFixed(2)}%`,
        rsrp: `${-84 + Math.round((Math.random() - 0.5) * 4)} dBm`,
        sinr: `${12.0 + Math.round((Math.random() - 0.5) * 2) * 10 / 10} dB`,
        rsrq: `${-12 + Math.round((Math.random() - 0.5) * 1) * 10 / 10} dB`,
        rssi: `${-76 + Math.round((Math.random() - 0.5) * 3)} dBm`,
        status: "caution",
        sampleCount: 12 + Math.floor(Math.random() * 3),
        confidence: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 9) * 60 * 60 * 1000), // 0-9 hours ago
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)"
      },
      {
        name: "Campus Aruba Wi-Fi 6E",
        technology: "Wi-Fi 6E",
        band: "6 GHz (160 MHz)",
        downloadSpeed: `1,240 Mbps`, // Fixed for consistency
        uploadSpeed: `120 Mbps`,
        latency: `1.8 ms`,
        jitter: `0.5 ms`,
        packetLoss: `0.05%`,
        rsrp: `-48 dBm`,
        sinr: `+34.8 dB`,
        rsrq: `-5 dB`,
        rssi: `-42 dBm`,
        status: "optimal",
        sampleCount: 45,
        confidence: "high",
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        color: "#8b5cf6",
        bgColor: "rgba(139, 92, 246, 0.1)"
      }
    ];

    return carriers as CarrierData[];
  },

  getCarrierComparison: async (): Promise<CarrierComparison> => {
    await delay(1000);
    // In real app: return fetch('/api/carrier/comparison').then(res => res.json());

    return {
      bestForBrowsing: {
        carrier: "Jio True 5G",
        reason: "Highest median download speed with good coverage",
        evidence: "780 Mbps avg (24 samples, high confidence)",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      bestForVideoCall: {
        carrier: "Campus Aruba Wi-Fi 6E",
        reason: "Lowest latency and jitter for real-time communication",
        evidence: "1.8ms latency, 0.5ms jitter (45 samples, high confidence)",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      bestForUpload: {
        carrier: "Campus Aruba Wi-Fi 6E",
        reason: "Highest upload speed for sharing large files",
        evidence: "120 Mbps upload (45 samples, high confidence)",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
      }
    };
  }
};