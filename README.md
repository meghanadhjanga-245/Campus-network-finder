# 📡 Campus Network Finder — 5G Signal Tracer & Cartographic GIS

[![Deploy to GitHub Pages](https://github.com/meghanadhjanga-245/Campus-network-finder/actions/workflows/deploy.yml/badge.svg)](https://github.com/meghanadhjanga-245/Campus-network-finder/actions/workflows/deploy.yml)

A high-performance **5G Massive MIMO Radiometry & 3D Cartographic Signal Transmission System** engineered for **R.V.R. & J.C. College of Engineering (Guntur, AP)**.

---

## 🌟 Key Features

- **⚡ Real-time 5G Signal Transmission Engine**: Continuous animated electromagnetic wave beams and photonic pulse packets propagating from Source Transmitter (TX) to Destination Receiver (RX) along campus quadrangle walkways.
- **🧭 A* Waypoint Pathfinding**: Comprehensive pedestrian navigation between all 10 numbered campus blocks (`01. Hi-Tech`, `02. Cyber`, `03. Digital`, `04. Silver`, `05. Administrative`, `06. Central`, `07. Chemical`, `08. Open`, `09. RJ`, `10. NSS`).
- **📱 Responsive for Mobile & Desktop**: Adaptive layouts, touch-friendly expandable/collapsible route HUDs, and gesture-driven 3D cartographic inspection on both mobile smartphones and high-resolution desktop displays.
- **🌐 5G Network Slicing & Multi-Carrier Heatmaps**: Dynamic filtering for **Universal 5G**, **eMBB (Gigabit Broadband)**, **URLLC (Ultra-low Latency <10ms)**, and **mMTC (Mass IoT)** across Jio True 5G, Airtel 5G Plus, and Wi-Fi 6E.
- **🌦️ Live Meteorological RF Telemetry**: Real-time integration with Open-Meteo API for Guntur coordinates calculating ITU-R P.676 atmospheric vapor density and specific RF attenuation across Sub-6 and mmWave bands.
- **🔊 Procedural Web Audio FX Engine**: Zero-asset procedural synthesizer producing radar pings, MIMO beam-locks, frequency acceleration sweeps, and navigation chimes via Web Audio API.
- **📜 Verified Speed Benchmark Certificate**: One-click printable accredited physical-layer QoS certificate with cryptographic digest verification.
- **🌍 Worldwide Signal Backbone Mesh**: Interactive 3D orbital twin displaying global teleports and inter-city cellular traffic links.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Mapping & GIS**: Mapbox GL JS (3D terrain, extrusion buildings, native WebGL particle layers)
- **3D Digital Twin**: Three.js
- **Styling**: Tailwind CSS v4 with Dark Glassmorphism design system
- **Audio Synthesis**: Native Browser Web Audio API (zero external sound files)
- **Meteorological API**: Open-Meteo REST API

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/meghanadhjanga-245/Campus-network-finder.git
cd Campus-network-finder

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run type check and linter
npm run lint
npx tsc --noEmit

# 5. Build production bundle
npm run build
```

---

## 🌐 Deployment Options

### 1. GitHub Pages (Automated via GitHub Actions)
The repository includes a ready-to-run GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In your GitHub repository, go to **Settings** ➔ **Pages**.
2. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
3. Push to `main`: GitHub Actions will automatically compile the bundle and publish to:
   ```
   https://meghanadhjanga-245.github.io/Campus-network-finder/
   ```

### 2. Vercel (1-Click Deployment)
Included `vercel.json` provides zero-configuration deployment:
1. Import repository at [vercel.com](https://vercel.com).
2. Framework Preset: **Vite**.
3. Click **Deploy**.

### 3. Netlify
Included `netlify.toml` handles build commands and SPA routing redirects automatically.

---

## 🏛️ Campus Landmark Directory

| Block Code | Landmark Facility | Coordinates | Default Peak Speed |
|---|---|---|---|
| **01** | Hi-Tech Block (Library & R&D) | `16.2546°N, 80.3235°E` | `1,240 Mbps` |
| **02** | Cyber Block (CSE / IT) | `16.2538°N, 80.3228°E` | `890 Mbps` |
| **03** | Digital Block (Civil / CAD) | `16.2548°N, 80.3236°E` | `780 Mbps` |
| **04** | Silver Jubilee Block (Mechanical) | `16.2578°N, 80.3237°E` | `760 Mbps` |
| **05** | Administrative Block (Main) | `16.2551°N, 80.3240°E` | `1,120 Mbps` |
| **06** | Central Quadrangle (Canteen & Plaza) | `16.2570°N, 80.3237°E` | `680 Mbps` |
| **07** | Chemical Block | `16.2565°N, 80.3245°E` | `620 Mbps` |
| **08** | Open Arena / Cricket Stadium | `16.2544°N, 80.3253°E` | `540 Mbps` |
| **09** | RJ Block (Hostel Complex) | `16.2568°N, 80.3258°E` | `820 Mbps` |
| **10** | NSS / Main Campus Entrance Gate | `16.2548°N, 80.3218°E` | `590 Mbps` |

---

*© 2026 R.V.R. & J.C. College of Engineering • Autonomous Institution • Accredited 'A+' Grade by NAAC*
