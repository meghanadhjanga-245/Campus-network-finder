export interface GlobalSignalTower {
  id: string;
  name: string;
  city: string;
  region: 'local' | 'national' | 'international';
  category: 'village' | 'mandal' | 'city' | 'global';
  country: string;
  coordinates: [number, number]; // [lon, lat]
  type: 'campus_hub' | 'regional_5g' | 'subsea_landing' | 'satellite_teleport' | 'core_ix' | 'village_cell' | 'mandal_hub';
  throughput: string;
  latencyToRVRJC: string;
  operator: string;
  status: 'active' | 'standby';
  description: string;
  isOrigin?: boolean;
}

export interface GlobalSignalLink {
  id: string;
  fromId: string;
  toId: string;
  name: string;
  type: 'local_5g_beam' | 'regional_optical' | 'subsea_fiber' | 'terrestrial_core' | 'satellite_uplink';
  capacity: string;
  latency: string;
  color: string;
}

export const GLOBAL_SIGNAL_TOWERS: GlobalSignalTower[] = [
  // =========================================================================
  // 1. LOCAL VILLAGES (Chowdavaram & surrounding Guntur/Amaravati rural areas)
  // =========================================================================
  {
    id: 'tower-rvrjc',
    name: 'RVRJC 5G Massive MIMO Base Station Mast',
    city: 'Chowdavaram (RVRJC)',
    region: 'local',
    category: 'village',
    country: 'India (AP - Guntur)',
    coordinates: [80.32399, 16.25509],
    type: 'campus_hub',
    throughput: '1.24 Gbps',
    latencyToRVRJC: '0.0 ms (Origin)',
    operator: 'RVRJC / Jio & Airtel 5G SA',
    status: 'active',
    description: 'Primary campus 64T64R Massive MIMO base station on Main Block.',
    isOrigin: true
  },
  {
    id: 'tower-nallapadu',
    name: 'Nallapadu Village Telecom Mast',
    city: 'Nallapadu Village',
    region: 'local',
    category: 'village',
    country: 'India (AP - Guntur)',
    coordinates: [80.3750, 16.2750],
    type: 'village_cell',
    throughput: '1.0 Gbps Microcell',
    latencyToRVRJC: '0.8 ms',
    operator: 'AP FiberNet / BSNL',
    status: 'active',
    description: 'Rural fiber-to-the-home and agricultural microcell relay.'
  },
  {
    id: 'tower-perecherla',
    name: 'Perecherla Junction Rural Tower',
    city: 'Perecherla Village',
    region: 'local',
    category: 'village',
    country: 'India (AP - Guntur)',
    coordinates: [80.3350, 16.3250],
    type: 'village_cell',
    throughput: '2.5 Gbps Highway Node',
    latencyToRVRJC: '1.2 ms',
    operator: 'Airtel 5G Plus',
    status: 'active',
    description: 'Western Guntur highway junction cellular relay.'
  },
  {
    id: 'tower-chebrolu',
    name: 'Chebrolu Historical Mandal Tower',
    city: 'Chebrolu',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.5280, 16.2020],
    type: 'mandal_hub',
    throughput: '5.0 Gbps Mandal Core',
    latencyToRVRJC: '2.1 ms',
    operator: 'Jio True 5G / AP FiberNet',
    status: 'active',
    description: 'Chebrolu mandal headquarters digital distribution hub.'
  },
  {
    id: 'tower-vatticherukuru',
    name: 'Vatticherukuru Mandal Hub',
    city: 'Vatticherukuru',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.4180, 16.2160],
    type: 'mandal_hub',
    throughput: '3.0 Gbps Hub',
    latencyToRVRJC: '1.5 ms',
    operator: 'BSNL 5G Core',
    status: 'active',
    description: 'Vatticherukuru mandal administrative optical repeater.'
  },
  {
    id: 'tower-prathipadu',
    name: 'Prathipadu Mandal Teleport',
    city: 'Prathipadu',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.3390, 16.1750],
    type: 'mandal_hub',
    throughput: '4.0 Gbps Sub-hub',
    latencyToRVRJC: '1.9 ms',
    operator: 'Airtel / Jio SA',
    status: 'active',
    description: 'NH-16 south agricultural corridor communication tower.'
  },
  {
    id: 'tower-pedakakani',
    name: 'Pedakakani Temple Village Tower',
    city: 'Pedakakani',
    region: 'local',
    category: 'village',
    country: 'India (AP - Guntur)',
    coordinates: [80.5010, 16.3460],
    type: 'village_cell',
    throughput: '3.5 Gbps Microcell',
    latencyToRVRJC: '2.4 ms',
    operator: 'Jio True 5G',
    status: 'active',
    description: 'Pedakakani temple town high-density pedestrian hotspot.'
  },
  {
    id: 'tower-tadikonda',
    name: 'Tadikonda Mandal Gateway',
    city: 'Tadikonda',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.4480, 16.4250],
    type: 'mandal_hub',
    throughput: '5.0 Gbps Mandal Link',
    latencyToRVRJC: '2.8 ms',
    operator: 'AP FiberNet',
    status: 'active',
    description: 'Connects western Guntur mandals directly to Amaravati Smart Core.'
  },
  {
    id: 'tower-kunchanapalli',
    name: 'Kunchanapalli Village Relay',
    city: 'Kunchanapalli Village',
    region: 'local',
    category: 'village',
    country: 'India (AP - Guntur)',
    coordinates: [80.5850, 16.4520],
    type: 'village_cell',
    throughput: '2.0 Gbps Feeder',
    latencyToRVRJC: '2.9 ms',
    operator: 'Airtel 5G',
    status: 'active',
    description: 'NH16 highway village transit microcell.'
  },
  {
    id: 'tower-tadepalli',
    name: 'Tadepalli Riverside Mandal Tower',
    city: 'Tadepalli',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.6020, 16.4810],
    type: 'mandal_hub',
    throughput: '20 Gbps Transit Core',
    latencyToRVRJC: '3.6 ms',
    operator: 'Jio / Airtel Core',
    status: 'active',
    description: 'Krishna River southern riverbank optical distribution node.'
  },
  {
    id: 'tower-penumaka',
    name: 'Penumaka Village Amaravati Node',
    city: 'Penumaka Village',
    region: 'local',
    category: 'village',
    country: 'India (AP - Amaravati)',
    coordinates: [80.5480, 16.4950],
    type: 'village_cell',
    throughput: '2.5 Gbps River Cell',
    latencyToRVRJC: '3.8 ms',
    operator: 'AP FiberNet',
    status: 'active',
    description: 'Riverfront rural fiber-to-the-farm wireless relay.'
  },
  {
    id: 'tower-velagapudi',
    name: 'Velagapudi AP Secretariat Village Core',
    city: 'Velagapudi (Secretariat)',
    region: 'local',
    category: 'village',
    country: 'India (AP - Amaravati)',
    coordinates: [80.5120, 16.5350],
    type: 'regional_5g',
    throughput: '50 Gbps Govt Optical Ring',
    latencyToRVRJC: '4.2 ms',
    operator: 'AP State Data Center / BSNL',
    status: 'active',
    description: 'AP Secretariat and legislative assembly high-security fiber hub.'
  },
  {
    id: 'tower-mandadam',
    name: 'Mandadam Capital Village Tower',
    city: 'Mandadam Village',
    region: 'local',
    category: 'village',
    country: 'India (AP - Amaravati)',
    coordinates: [80.5360, 16.5180],
    type: 'village_cell',
    throughput: '5.0 Gbps Smart Cell',
    latencyToRVRJC: '4.0 ms',
    operator: 'Airtel 5G Plus',
    status: 'active',
    description: 'Amaravati core capital agricultural & smart-city wireless node.'
  },
  {
    id: 'tower-kankipadu',
    name: 'Kankipadu Mandal Hub',
    city: 'Kankipadu',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Krishna)',
    coordinates: [80.7680, 16.4250],
    type: 'mandal_hub',
    throughput: '6.0 Gbps Mandal Link',
    latencyToRVRJC: '5.8 ms',
    operator: 'BSNL / AP FiberNet',
    status: 'active',
    description: 'Krishna delta agricultural IoT and telecommunications tower.'
  },
  {
    id: 'tower-ponnur',
    name: 'Ponnur Mandal Gateway',
    city: 'Ponnur',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Guntur)',
    coordinates: [80.5620, 16.0680],
    type: 'mandal_hub',
    throughput: '8.0 Gbps Optical Hub',
    latencyToRVRJC: '3.4 ms',
    operator: 'Jio 5G / Airtel',
    status: 'active',
    description: 'Ponnur municipal fiber exchange connecting south Guntur.'
  },
  {
    id: 'tower-bapatla',
    name: 'Bapatla Coastal Mandal & Air Force Teleport',
    city: 'Bapatla',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Bapatla)',
    coordinates: [80.4680, 15.9040],
    type: 'mandal_hub',
    throughput: '15 Gbps Coastal Optical Core',
    latencyToRVRJC: '4.8 ms',
    operator: 'BSNL / Defense Optical Network',
    status: 'active',
    description: 'Coastal airbase and university wireless communication gateway.'
  },
  {
    id: 'tower-chilakaluripet',
    name: 'Chilakaluripet Mandal Tower',
    city: 'Chilakaluripet',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Palnadu)',
    coordinates: [80.1650, 16.0910],
    type: 'mandal_hub',
    throughput: '12 Gbps Highway Core',
    latencyToRVRJC: '4.5 ms',
    operator: 'Airtel / Jio 5G',
    status: 'active',
    description: 'NH-16 transit hub linking Guntur to southern districts.'
  },
  {
    id: 'tower-sattenapalle',
    name: 'Sattenapalle Mandal Teleport',
    city: 'Sattenapalle',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Palnadu)',
    coordinates: [80.1800, 16.3980],
    type: 'mandal_hub',
    throughput: '10 Gbps Regional Node',
    latencyToRVRJC: '4.7 ms',
    operator: 'AP FiberNet / BSNL',
    status: 'active',
    description: 'Palnadu region optical switching and 5G cellular distribution.'
  },
  {
    id: 'tower-machilipatnam',
    name: 'Machilipatnam Port & District Teleport',
    city: 'Machilipatnam',
    region: 'local',
    category: 'mandal',
    country: 'India (AP - Krishna)',
    coordinates: [81.1350, 16.1820],
    type: 'mandal_hub',
    throughput: '25 Gbps Maritime Optical Hub',
    latencyToRVRJC: '7.2 ms',
    operator: 'AP Maritime Board / BSNL',
    status: 'active',
    description: 'Bay of Bengal deepwater port and coastal defense radar node.'
  },

  // =========================================================================
  // 2. ANDHRA PRADESH REGIONAL CITIES & CORRIDOR HUBS
  // =========================================================================
  {
    id: 'tower-guntur-city',
    name: 'Guntur Central Tower (Arundelpet / Clock Tower)',
    city: 'Guntur City',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.4365, 16.3067],
    type: 'regional_5g',
    throughput: '40 Gbps Metro Ring',
    latencyToRVRJC: '1.8 ms',
    operator: 'BSNL / Airtel 5G Core',
    status: 'active',
    description: 'District optical distribution and municipal 5G macro tower.'
  },
  {
    id: 'tower-mangalagiri',
    name: 'Mangalagiri IT Corridor & AIIMS 5G Hub',
    city: 'Mangalagiri',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.5630, 16.4357],
    type: 'regional_5g',
    throughput: '80 Gbps Optical Hub',
    latencyToRVRJC: '3.2 ms',
    operator: 'AP FiberNet / Jio True 5G',
    status: 'active',
    description: 'Tech park high-density microcell and medical telemetry relay.'
  },
  {
    id: 'tower-amaravati',
    name: 'Amaravati Capital Smart City Central Teleport',
    city: 'Amaravati (Tulluru)',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.5186, 16.5131],
    type: 'regional_5g',
    throughput: '100 Gbps Core Ring',
    latencyToRVRJC: '4.1 ms',
    operator: 'Amaravati Smart Grid / Airtel',
    status: 'active',
    description: 'Government Secretariat gigabit backbone and data center corridor.'
  },
  {
    id: 'tower-vijayawada',
    name: 'Vijayawada Core Telecom Gateway (Benz Circle)',
    city: 'Vijayawada',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.6480, 16.5062],
    type: 'core_ix',
    throughput: '200 Gbps Core IX',
    latencyToRVRJC: '4.8 ms',
    operator: 'BSNL / Tata Tele / Jio 5G',
    status: 'active',
    description: 'Krishna River trans-delta optical junction and regional switching exchange.'
  },
  {
    id: 'tower-vijayawada-rail',
    name: 'Vijayawada Railway Junction RailTel Node',
    city: 'Vijayawada West',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.6200, 16.5180],
    type: 'regional_5g',
    throughput: '40 Gbps RailTel',
    latencyToRVRJC: '5.2 ms',
    operator: 'RailTel Optical Backbone',
    status: 'active',
    description: 'Major railway communications and passenger Wi-Fi transit hub.'
  },
  {
    id: 'tower-gannavaram',
    name: 'Gannavaram International Airport 5G Cell',
    city: 'Gannavaram (VGA)',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.7968, 16.5273],
    type: 'regional_5g',
    throughput: '20 Gbps Aviation Teleport',
    latencyToRVRJC: '6.4 ms',
    operator: 'AAI / Airtel 5G Plus',
    status: 'active',
    description: 'Airport flight control radar and passenger ultra-fast 5G cell.'
  },
  {
    id: 'tower-tenali',
    name: 'Tenali Optical Distribution Node',
    city: 'Tenali',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.6441, 16.2435],
    type: 'regional_5g',
    throughput: '20 Gbps Delta Fiber',
    latencyToRVRJC: '3.6 ms',
    operator: 'AP FiberNet / Jio',
    status: 'active',
    description: 'Southern Guntur district agricultural IoT and cellular repeater.'
  },
  {
    id: 'tower-ongole',
    name: 'Ongole Coastal Microwave Relay',
    city: 'Ongole',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [80.0440, 15.5057],
    type: 'regional_5g',
    throughput: '20 Gbps Coastal Beam',
    latencyToRVRJC: '8.2 ms',
    operator: 'BSNL / Jio 5G',
    status: 'active',
    description: 'Coastal highway microwave repeater linking Guntur to Chennai.'
  },
  {
    id: 'tower-tirupati',
    name: 'Tirupati Foothills Core Optical Exchange',
    city: 'Tirupati',
    region: 'local',
    category: 'city',
    country: 'India (AP)',
    coordinates: [79.4192, 13.6288],
    type: 'regional_5g',
    throughput: '40 Gbps Rayalaseema Core',
    latencyToRVRJC: '9.4 ms',
    operator: 'BSNL / Airtel 5G',
    status: 'active',
    description: 'Rayalaseema technological and pilgrimage optical hub.'
  },
  {
    id: 'tower-vizag',
    name: 'Visakhapatnam Subsea Fiber Cable Landing Station',
    city: 'Visakhapatnam',
    region: 'national',
    category: 'city',
    country: 'India (AP)',
    coordinates: [83.2185, 17.6868],
    type: 'subsea_landing',
    throughput: '12.8 Tbps Subsea',
    latencyToRVRJC: '12.5 ms',
    operator: 'BSNL / Sea-Me-We Landing',
    status: 'active',
    description: 'Deepwater international subsea cable terminal on Bay of Bengal.'
  },

  // =========================================================================
  // 3. NATIONAL INDIAN METROS & BACKBONE HUBS
  // =========================================================================
  {
    id: 'tower-hyderabad',
    name: 'Hyderabad HITEC City & NIXI Teleport',
    city: 'Hyderabad',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [78.3750, 17.4470],
    type: 'core_ix',
    throughput: '28.0 Tbps Core',
    latencyToRVRJC: '7.8 ms',
    operator: 'NIXI / Airtel / CtrlS Hub',
    status: 'active',
    description: 'Telangana technological core routing exchange and cloud hub.'
  },
  {
    id: 'tower-bengaluru',
    name: 'Bengaluru Electronic City Optical Core',
    city: 'Bengaluru',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [77.6700, 12.8500],
    type: 'core_ix',
    throughput: '32.0 Tbps Core',
    latencyToRVRJC: '12.4 ms',
    operator: 'Equinix / Jio Cloud Core',
    status: 'active',
    description: 'Silicon valley of India primary data center exchange.'
  },
  {
    id: 'tower-chennai',
    name: 'Chennai Subsea Cable Landing Hub',
    city: 'Chennai',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [80.2707, 13.0827],
    type: 'subsea_landing',
    throughput: '48.0 Tbps Subsea',
    latencyToRVRJC: '9.8 ms',
    operator: 'Tata Com / BBG & i2i Cable',
    status: 'active',
    description: 'Southern international optical gateway connecting India to SE Asia.'
  },
  {
    id: 'tower-mumbai',
    name: 'Mumbai Subsea Landing Station & Core Teleport',
    city: 'Mumbai',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [72.8777, 19.0760],
    type: 'subsea_landing',
    throughput: '86.4 Tbps Subsea',
    latencyToRVRJC: '18.4 ms',
    operator: 'Tata Com / SEA-ME-WE 5 / AAE-1',
    status: 'active',
    description: 'Premier Indian international cable junction connecting to Europe & Middle East.'
  },
  {
    id: 'tower-pune',
    name: 'Pune Hinjawadi Tech Hub',
    city: 'Pune',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [73.8567, 18.5204],
    type: 'core_ix',
    throughput: '18.0 Tbps Core',
    latencyToRVRJC: '19.2 ms',
    operator: 'Tata Communications',
    status: 'active',
    description: 'Western India cloud and software export telecom exchange.'
  },
  {
    id: 'tower-delhi',
    name: 'New Delhi National Internet Exchange (NIXI)',
    city: 'New Delhi',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [77.2090, 28.6139],
    type: 'core_ix',
    throughput: '36.0 Tbps',
    latencyToRVRJC: '24.2 ms',
    operator: 'NIXI Northern Node',
    status: 'active',
    description: 'Northern Indian national telecom backbone.'
  },
  {
    id: 'tower-kolkata',
    name: 'Kolkata Salt Lake Teleport',
    city: 'Kolkata',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [88.3639, 22.5726],
    type: 'core_ix',
    throughput: '22.0 Tbps Core',
    latencyToRVRJC: '21.5 ms',
    operator: 'BSNL / Airtel Eastern Core',
    status: 'active',
    description: 'Eastern India and ASEAN border fiber exchange.'
  },
  {
    id: 'tower-ahmedabad',
    name: 'Ahmedabad GIFT City Fintech Hub',
    city: 'Ahmedabad',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [72.5714, 23.0225],
    type: 'core_ix',
    throughput: '24.0 Tbps Fintech Core',
    latencyToRVRJC: '22.8 ms',
    operator: 'GIFT City / Jio 5G',
    status: 'active',
    description: 'International financial services optical transmission exchange.'
  },
  {
    id: 'tower-kochi',
    name: 'Kochi Subsea Cable Landing Hub',
    city: 'Kochi',
    region: 'national',
    category: 'city',
    country: 'India',
    coordinates: [76.2673, 9.9312],
    type: 'subsea_landing',
    throughput: '26.0 Tbps Subsea',
    latencyToRVRJC: '16.8 ms',
    operator: 'Tata / SEA-ME-WE 3',
    status: 'active',
    description: 'Arabian Sea southern submarine fiber landing station.'
  },

  // =========================================================================
  // 4. WORLD MAIN CITIES & GLOBAL INTERNET EXCHANGES ACROSS ALL CONTINENTS
  // =========================================================================
  // --- Asia-Pacific ---
  {
    id: 'tower-singapore',
    name: 'Singapore Equinix SG1 Core Internet Exchange',
    city: 'Singapore',
    region: 'international',
    category: 'global',
    country: 'Singapore',
    coordinates: [103.8198, 1.3521],
    type: 'core_ix',
    throughput: '58.2 Tbps',
    latencyToRVRJC: '38.2 ms',
    operator: 'Equinix / Singtel SJC2',
    status: 'active',
    description: 'Asia-Pacific premier transcontinental routing hub.'
  },
  {
    id: 'tower-kualalumpur',
    name: 'Kuala Lumpur Cyberjaya Core',
    city: 'Kuala Lumpur',
    region: 'international',
    category: 'global',
    country: 'Malaysia',
    coordinates: [101.6869, 3.1390],
    type: 'core_ix',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '41.0 ms',
    operator: 'MyIX / TM',
    status: 'active',
    description: 'Southeast Asian digital corridor teleport.'
  },
  {
    id: 'tower-bangkok',
    name: 'Bangkok BKNIX Exchange',
    city: 'Bangkok',
    region: 'international',
    category: 'global',
    country: 'Thailand',
    coordinates: [100.5018, 13.7563],
    type: 'core_ix',
    throughput: '18.0 Tbps',
    latencyToRVRJC: '42.5 ms',
    operator: 'BKNIX / CAT Telecom',
    status: 'active',
    description: 'Indochina peninsula communications hub.'
  },
  {
    id: 'tower-hongkong',
    name: 'Hong Kong HKIX Mega-Exchange',
    city: 'Hong Kong',
    region: 'international',
    category: 'global',
    country: 'Hong Kong',
    coordinates: [114.1694, 22.3193],
    type: 'core_ix',
    throughput: '44.0 Tbps',
    latencyToRVRJC: '62.0 ms',
    operator: 'HKIX / PCCW Global',
    status: 'active',
    description: 'East Asian trans-pacific optical switching exchange.'
  },
  {
    id: 'tower-shanghai',
    name: 'Shanghai Pudong Telecom Teleport',
    city: 'Shanghai',
    region: 'international',
    category: 'global',
    country: 'China',
    coordinates: [121.4737, 31.2304],
    type: 'core_ix',
    throughput: '52.0 Tbps',
    latencyToRVRJC: '74.5 ms',
    operator: 'China Telecom / CHINANET',
    status: 'active',
    description: 'Yangtze River Delta digital center and submarine landing point.'
  },
  {
    id: 'tower-beijing',
    name: 'Beijing National Internet Exchange',
    city: 'Beijing',
    region: 'international',
    category: 'global',
    country: 'China',
    coordinates: [116.4074, 39.9042],
    type: 'core_ix',
    throughput: '48.0 Tbps',
    latencyToRVRJC: '82.0 ms',
    operator: 'China Unicom',
    status: 'active',
    description: 'Northern China state communications backbone exchange.'
  },
  {
    id: 'tower-seoul',
    name: 'Seoul KINX Broadband Hub',
    city: 'Seoul',
    region: 'international',
    category: 'global',
    country: 'South Korea',
    coordinates: [126.9780, 37.5665],
    type: 'core_ix',
    throughput: '38.0 Tbps',
    latencyToRVRJC: '86.0 ms',
    operator: 'KINX / KT Corp',
    status: 'active',
    description: 'World-leading ultra-high-speed broadband and 5G capital exchange.'
  },
  {
    id: 'tower-tokyo',
    name: 'Tokyo Otemachi Telecom Teleport Tower',
    city: 'Tokyo',
    region: 'international',
    category: 'global',
    country: 'Japan',
    coordinates: [139.6917, 35.6895],
    type: 'core_ix',
    throughput: '42.8 Tbps',
    latencyToRVRJC: '84.6 ms',
    operator: 'NTT Com / JPIX / FASTER',
    status: 'active',
    description: 'Trans-Pacific optical landing junction connecting Asia to North America.'
  },
  {
    id: 'tower-sydney',
    name: 'Sydney Equinix SY1 Southern Cross Teleport',
    city: 'Sydney',
    region: 'international',
    category: 'global',
    country: 'Australia',
    coordinates: [151.2093, -33.8688],
    type: 'subsea_landing',
    throughput: '28.4 Tbps',
    latencyToRVRJC: '142.0 ms',
    operator: 'Telstra / Southern Cross NEXT',
    status: 'active',
    description: 'Australasian trans-oceanic gateway hub.'
  },
  {
    id: 'tower-melbourne',
    name: 'Melbourne ME1 Equinix Gateway',
    city: 'Melbourne',
    region: 'international',
    category: 'global',
    country: 'Australia',
    coordinates: [144.9631, -37.8136],
    type: 'core_ix',
    throughput: '20.0 Tbps',
    latencyToRVRJC: '146.0 ms',
    operator: 'Optus / Vocus',
    status: 'active',
    description: 'Southern Australia continental fiber transit center.'
  },
  {
    id: 'tower-auckland',
    name: 'Auckland Hawaiki Subsea Landing',
    city: 'Auckland',
    region: 'international',
    category: 'global',
    country: 'New Zealand',
    coordinates: [174.7633, -36.8485],
    type: 'subsea_landing',
    throughput: '16.0 Tbps',
    latencyToRVRJC: '158.0 ms',
    operator: 'Spark / Hawaiki Cable',
    status: 'active',
    description: 'South Pacific trans-oceanic cable landing hub.'
  },

  // --- Middle East ---
  {
    id: 'tower-dubai',
    name: 'Dubai International Telecom Gateway Tower',
    city: 'Dubai',
    region: 'international',
    category: 'global',
    country: 'UAE',
    coordinates: [55.2708, 25.2048],
    type: 'satellite_teleport',
    throughput: '24.6 Tbps',
    latencyToRVRJC: '41.5 ms',
    operator: 'e& (Etisalat) / AAE-1 Hub',
    status: 'active',
    description: 'Middle Eastern 5G cross-continental telecommunications gateway.'
  },
  {
    id: 'tower-riyadh',
    name: 'Riyadh STC Telecom Core',
    city: 'Riyadh',
    region: 'international',
    category: 'global',
    country: 'Saudi Arabia',
    coordinates: [46.6753, 24.7136],
    type: 'core_ix',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '47.0 ms',
    operator: 'STC / Mobily',
    status: 'active',
    description: 'Arabian Peninsula backbone internet exchange.'
  },
  {
    id: 'tower-doha',
    name: 'Doha Ooredoo Cable Hub',
    city: 'Doha',
    region: 'international',
    category: 'global',
    country: 'Qatar',
    coordinates: [51.5310, 25.2854],
    type: 'subsea_landing',
    throughput: '18.0 Tbps',
    latencyToRVRJC: '44.0 ms',
    operator: 'Ooredoo / GBI Cable',
    status: 'active',
    description: 'Persian Gulf submarine optical gateway.'
  },
  {
    id: 'tower-telaviv',
    name: 'Tel Aviv IIX Exchange',
    city: 'Tel Aviv',
    region: 'international',
    category: 'global',
    country: 'Israel',
    coordinates: [34.7818, 32.0853],
    type: 'core_ix',
    throughput: '18.5 Tbps',
    latencyToRVRJC: '68.0 ms',
    operator: 'Bezeq / IIX',
    status: 'active',
    description: 'Eastern Mediterranean high-tech fiber junction.'
  },

  // --- Europe ---
  {
    id: 'tower-frankfurt',
    name: 'Frankfurt DE-CIX Teleport & 5G Backbone',
    city: 'Frankfurt',
    region: 'international',
    category: 'global',
    country: 'Germany',
    coordinates: [8.6821, 50.1109],
    type: 'core_ix',
    throughput: '72.0 Tbps',
    latencyToRVRJC: '108.2 ms',
    operator: 'DE-CIX Frankfurt',
    status: 'active',
    description: 'World leading European Internet exchange handling peak intercontinental traffic.'
  },
  {
    id: 'tower-london',
    name: 'London Telehouse North & Docklands Teleport',
    city: 'London',
    region: 'international',
    category: 'global',
    country: 'United Kingdom',
    coordinates: [-0.1278, 51.5074],
    type: 'core_ix',
    throughput: '64.5 Tbps',
    latencyToRVRJC: '118.4 ms',
    operator: 'LINX / Telehouse Europe',
    status: 'active',
    description: 'Transatlantic junction terminal and Western European carrier core.'
  },
  {
    id: 'tower-paris',
    name: 'Paris Interxion Core Teleport',
    city: 'Paris',
    region: 'international',
    category: 'global',
    country: 'France',
    coordinates: [2.3522, 48.8566],
    type: 'core_ix',
    throughput: '38.4 Tbps',
    latencyToRVRJC: '114.2 ms',
    operator: 'France-IX / Orange Marine',
    status: 'active',
    description: 'Western Europe continental fiber distribution point.'
  },
  {
    id: 'tower-amsterdam',
    name: 'Amsterdam AMS-IX Core Gateway',
    city: 'Amsterdam',
    region: 'international',
    category: 'global',
    country: 'Netherlands',
    coordinates: [4.9041, 52.3676],
    type: 'core_ix',
    throughput: '54.0 Tbps',
    latencyToRVRJC: '112.0 ms',
    operator: 'AMS-IX Europe',
    status: 'active',
    description: 'Key European digital transit center.'
  },
  {
    id: 'tower-berlin',
    name: 'Berlin BCIX Teleport',
    city: 'Berlin',
    region: 'international',
    category: 'global',
    country: 'Germany',
    coordinates: [13.4050, 52.5200],
    type: 'core_ix',
    throughput: '28.0 Tbps',
    latencyToRVRJC: '109.5 ms',
    operator: 'BCIX / Deutsche Telekom',
    status: 'active',
    description: 'Central-Eastern European gateway exchange.'
  },
  {
    id: 'tower-zurich',
    name: 'Zurich SwissIX Alps Teleport',
    city: 'Zurich',
    region: 'international',
    category: 'global',
    country: 'Switzerland',
    coordinates: [8.5417, 47.3769],
    type: 'core_ix',
    throughput: '24.0 Tbps',
    latencyToRVRJC: '110.0 ms',
    operator: 'SwissIX / Swisscom',
    status: 'active',
    description: 'Alpine ultra-secure financial data transmission center.'
  },
  {
    id: 'tower-milan',
    name: 'Milan MIX Teleport',
    city: 'Milan',
    region: 'international',
    category: 'global',
    country: 'Italy',
    coordinates: [9.1900, 45.4642],
    type: 'core_ix',
    throughput: '26.0 Tbps',
    latencyToRVRJC: '116.5 ms',
    operator: 'MIX Milan / TIM',
    status: 'active',
    description: 'Southern European Mediterranean transit hub.'
  },
  {
    id: 'tower-madrid',
    name: 'Madrid ESpanix Hub',
    city: 'Madrid',
    region: 'international',
    category: 'global',
    country: 'Spain',
    coordinates: [-3.7038, 40.4168],
    type: 'core_ix',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '124.0 ms',
    operator: 'ESpanix / Telefonica',
    status: 'active',
    description: 'Iberian gateway to South America and Africa.'
  },
  {
    id: 'tower-dublin',
    name: 'Dublin INEX Subsea Gateway',
    city: 'Dublin',
    region: 'international',
    category: 'global',
    country: 'Ireland',
    coordinates: [-6.2603, 53.3498],
    type: 'core_ix',
    throughput: '32.0 Tbps',
    latencyToRVRJC: '122.0 ms',
    operator: 'INEX / AWS Cloud Core',
    status: 'active',
    description: 'European headquarters of global cloud computing giants.'
  },
  {
    id: 'tower-stockholm',
    name: 'Stockholm Netnod Teleport',
    city: 'Stockholm',
    region: 'international',
    category: 'global',
    country: 'Sweden',
    coordinates: [18.0686, 59.3293],
    type: 'core_ix',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '115.0 ms',
    operator: 'Netnod / Telia',
    status: 'active',
    description: 'Nordic & Baltic digital core routing center.'
  },
  {
    id: 'tower-warsaw',
    name: 'Warsaw PLIX Hub',
    city: 'Warsaw',
    region: 'international',
    category: 'global',
    country: 'Poland',
    coordinates: [21.0122, 52.2297],
    type: 'core_ix',
    throughput: '20.0 Tbps',
    latencyToRVRJC: '104.0 ms',
    operator: 'PLIX / Orange Polska',
    status: 'active',
    description: 'Eastern European optical routing nexus.'
  },
  {
    id: 'tower-istanbul',
    name: 'Istanbul Bosphorus Gateway',
    city: 'Istanbul',
    region: 'international',
    category: 'global',
    country: 'Turkey',
    coordinates: [28.9784, 41.0082],
    type: 'core_ix',
    throughput: '24.0 Tbps',
    latencyToRVRJC: '88.0 ms',
    operator: 'Turkcell / Turk Telekom',
    status: 'active',
    description: 'Cross-continental bridge connecting Europe and Asia.'
  },

  // --- Americas ---
  {
    id: 'tower-newyork',
    name: 'New York 60 Hudson St Transatlantic Landing Hub',
    city: 'New York',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-74.0060, 40.7128],
    type: 'subsea_landing',
    throughput: '85.0 Tbps',
    latencyToRVRJC: '184.6 ms',
    operator: 'Telx / Apollo / Dunant Subsea',
    status: 'active',
    description: 'Premier transatlantic subsea cable landing junction.'
  },
  {
    id: 'tower-ashburn',
    name: 'Ashburn Data Center Corridor Hub',
    city: 'Ashburn, VA',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-77.4874, 39.0438],
    type: 'core_ix',
    throughput: '120.0 Tbps',
    latencyToRVRJC: '190.2 ms',
    operator: 'Equinix / AWS Core East',
    status: 'active',
    description: 'Carries over 70% of global internet traffic.'
  },
  {
    id: 'tower-chicago',
    name: 'Chicago Equinix CH1 Core Teleport',
    city: 'Chicago, IL',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-87.6298, 41.8781],
    type: 'core_ix',
    throughput: '42.0 Tbps',
    latencyToRVRJC: '198.0 ms',
    operator: 'CME / Equinix',
    status: 'active',
    description: 'Midwest financial and algorithmic trading ultra-low latency hub.'
  },
  {
    id: 'tower-siliconvalley',
    name: 'Silicon Valley Equinix SV1 Transpacific Teleport',
    city: 'San Jose, CA',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-121.8863, 37.3382],
    type: 'satellite_teleport',
    throughput: '68.0 Tbps',
    latencyToRVRJC: '215.4 ms',
    operator: 'Equinix / Google Pacific Light',
    status: 'active',
    description: 'Pacific fiber termination station connecting US to Asia.'
  },
  {
    id: 'tower-losangeles',
    name: 'Los Angeles One Wilshire Subsea Terminal',
    city: 'Los Angeles, CA',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-118.2437, 34.0522],
    type: 'subsea_landing',
    throughput: '56.0 Tbps',
    latencyToRVRJC: '218.0 ms',
    operator: 'CoreSite / Pacific Crossing',
    status: 'active',
    description: 'Most densely connected telecommunications building on West Coast.'
  },
  {
    id: 'tower-seattle',
    name: 'Seattle Westin Building Teleport',
    city: 'Seattle, WA',
    region: 'international',
    category: 'global',
    country: 'United States',
    coordinates: [-122.3321, 47.6062],
    type: 'core_ix',
    throughput: '36.0 Tbps',
    latencyToRVRJC: '212.0 ms',
    operator: 'SIX / Microsoft Cloud Core',
    status: 'active',
    description: 'Northwest US and Alaska subsea routing portal.'
  },
  {
    id: 'tower-toronto',
    name: 'Toronto TorIX Core Hub',
    city: 'Toronto',
    region: 'international',
    category: 'global',
    country: 'Canada',
    coordinates: [-79.3832, 43.6532],
    type: 'core_ix',
    throughput: '32.0 Tbps',
    latencyToRVRJC: '194.0 ms',
    operator: 'TorIX / Bell Canada',
    status: 'active',
    description: 'Canadian national internet exchange and fiber hub.'
  },
  {
    id: 'tower-mexicocity',
    name: 'Mexico City IXP Teleport',
    city: 'Mexico City',
    region: 'international',
    category: 'global',
    country: 'Mexico',
    coordinates: [-99.1332, 19.4326],
    type: 'core_ix',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '235.0 ms',
    operator: 'Telmex / KIO Networks',
    status: 'active',
    description: 'Central American digital routing exchange.'
  },
  {
    id: 'tower-saopaulo',
    name: 'São Paulo SP4 Subsea Teleport',
    city: 'São Paulo',
    region: 'international',
    category: 'global',
    country: 'Brazil',
    coordinates: [-46.6333, -23.5505],
    type: 'subsea_landing',
    throughput: '22.0 Tbps',
    latencyToRVRJC: '245.0 ms',
    operator: 'GlobeNet / Monet Subsea',
    status: 'active',
    description: 'South American telecommunications core routing hub.'
  },
  {
    id: 'tower-buenosaires',
    name: 'Buenos Aires Cabase IXP',
    city: 'Buenos Aires',
    region: 'international',
    category: 'global',
    country: 'Argentina',
    coordinates: [-58.3816, -34.6037],
    type: 'core_ix',
    throughput: '16.0 Tbps',
    latencyToRVRJC: '258.0 ms',
    operator: 'CABASE / Telecom Argentina',
    status: 'active',
    description: 'Southern Cone trans-Andean fiber exchange.'
  },
  {
    id: 'tower-santiago',
    name: 'Santiago PIT Chile Teleport',
    city: 'Santiago',
    region: 'international',
    category: 'global',
    country: 'Chile',
    coordinates: [-70.6693, -33.4489],
    type: 'subsea_landing',
    throughput: '14.0 Tbps',
    latencyToRVRJC: '264.0 ms',
    operator: 'PIT Chile / Humboldt Cable',
    status: 'active',
    description: 'South American Pacific subsea cable terminal.'
  },
  {
    id: 'tower-bogota',
    name: 'Bogota NAP Colombia Hub',
    city: 'Bogota',
    region: 'international',
    category: 'global',
    country: 'Colombia',
    coordinates: [-74.0721, 4.7110],
    type: 'core_ix',
    throughput: '15.0 Tbps',
    latencyToRVRJC: '240.0 ms',
    operator: 'NAP Colombia / Claro',
    status: 'active',
    description: 'Northern Andes and Caribbean communications link.'
  },

  // --- Africa ---
  {
    id: 'tower-cairo',
    name: 'Cairo Telecom Egypt Core Teleport',
    city: 'Cairo',
    region: 'international',
    category: 'global',
    country: 'Egypt',
    coordinates: [31.2357, 30.0444],
    type: 'subsea_landing',
    throughput: '20.0 Tbps',
    latencyToRVRJC: '74.0 ms',
    operator: 'Telecom Egypt / Suez Canal Subsea',
    status: 'active',
    description: 'Suez Canal maritime digital bottleneck connecting Europe to Asia.'
  },
  {
    id: 'tower-johannesburg',
    name: 'Johannesburg Teraco JB1 Continental Gateway',
    city: 'Johannesburg',
    region: 'international',
    category: 'global',
    country: 'South Africa',
    coordinates: [28.0473, -26.2041],
    type: 'core_ix',
    throughput: '18.5 Tbps',
    latencyToRVRJC: '175.0 ms',
    operator: 'Teraco / 2Africa Cable',
    status: 'active',
    description: 'Sub-Saharan African transit teleport and 2Africa subsea cable node.'
  },
  {
    id: 'tower-capetown',
    name: 'Cape Town WACS Subsea Landing Hub',
    city: 'Cape Town',
    region: 'international',
    category: 'global',
    country: 'South Africa',
    coordinates: [18.4241, -33.9249],
    type: 'subsea_landing',
    throughput: '16.0 Tbps',
    latencyToRVRJC: '182.0 ms',
    operator: 'WACS / Telkom SA',
    status: 'active',
    description: 'Atlantic and Indian ocean oceanic fiber cape landing.'
  },
  {
    id: 'tower-lagos',
    name: 'Lagos MainOne Landing Station',
    city: 'Lagos',
    region: 'international',
    category: 'global',
    country: 'Nigeria',
    coordinates: [3.3792, 6.5244],
    type: 'subsea_landing',
    throughput: '18.0 Tbps',
    latencyToRVRJC: '148.0 ms',
    operator: 'MainOne / Equinix West Africa',
    status: 'active',
    description: 'West African economic capital high-speed digital exchange.'
  },
  {
    id: 'tower-nairobi',
    name: 'Nairobi KIXP East Africa Hub',
    city: 'Nairobi',
    region: 'international',
    category: 'global',
    country: 'Kenya',
    coordinates: [36.8219, -1.2921],
    type: 'core_ix',
    throughput: '14.0 Tbps',
    latencyToRVRJC: '112.0 ms',
    operator: 'KIXP / Safaricom',
    status: 'active',
    description: 'East African Silicon Savannah core routing exchange.'
  },
  {
    id: 'tower-casablanca',
    name: 'Casablanca Maroc Telecom Teleport',
    city: 'Casablanca',
    region: 'international',
    category: 'global',
    country: 'Morocco',
    coordinates: [-7.5898, 33.5731],
    type: 'subsea_landing',
    throughput: '15.0 Tbps',
    latencyToRVRJC: '128.0 ms',
    operator: 'Maroc Telecom / MedNautilus',
    status: 'active',
    description: 'Northwest African gateway into Europe.'
  }
];

export const GLOBAL_SIGNAL_LINKS: GlobalSignalLink[] = [
  // =========================================================================
  // 1. LOCAL VILLAGE & MANDAL MESH (Around RVRJC & Guntur/Krishna/Amaravati)
  // =========================================================================
  { id: 'link-rvrjc-chowdavaram', fromId: 'tower-rvrjc', toId: 'tower-nallapadu', name: 'RVRJC - Nallapadu Village 5G Beam', type: 'local_5g_beam', capacity: '2.5 Gbps', latency: '0.8 ms', color: '#00f0ff' },
  { id: 'link-rvrjc-perecherla', fromId: 'tower-rvrjc', toId: 'tower-perecherla', name: 'RVRJC - Perecherla Highway Relay', type: 'local_5g_beam', capacity: '2.5 Gbps', latency: '1.2 ms', color: '#00f0ff' },
  { id: 'link-rvrjc-vatticherukuru', fromId: 'tower-rvrjc', toId: 'tower-vatticherukuru', name: 'RVRJC - Vatticherukuru Rural Beam', type: 'local_5g_beam', capacity: '2.0 Gbps', latency: '1.4 ms', color: '#34d399' },
  { id: 'link-rvrjc-prathipadu', fromId: 'tower-rvrjc', toId: 'tower-prathipadu', name: 'RVRJC - Prathipadu Mandal Link', type: 'local_5g_beam', capacity: '3.0 Gbps', latency: '1.8 ms', color: '#34d399' },
  { id: 'link-rvrjc-chebrolu', fromId: 'tower-rvrjc', toId: 'tower-chebrolu', name: 'RVRJC - Chebrolu Mandal 5G Feeder', type: 'local_5g_beam', capacity: '4.0 Gbps', latency: '2.0 ms', color: '#00f0ff' },
  
  { id: 'link-nallapadu-guntur', fromId: 'tower-nallapadu', toId: 'tower-guntur-city', name: 'Nallapadu - Guntur Central Optical Ring', type: 'regional_optical', capacity: '10 Gbps', latency: '1.0 ms', color: '#00f0ff' },
  { id: 'link-perecherla-guntur', fromId: 'tower-perecherla', toId: 'tower-guntur-city', name: 'Perecherla - Guntur Western Link', type: 'local_5g_beam', capacity: '10 Gbps', latency: '1.2 ms', color: '#38bdf8' },
  { id: 'link-perecherla-sattenapalle', fromId: 'tower-perecherla', toId: 'tower-sattenapalle', name: 'Perecherla - Sattenapalle Highway Beam', type: 'local_5g_beam', capacity: '8.0 Gbps', latency: '2.4 ms', color: '#34d399' },
  { id: 'link-vatticherukuru-guntur', fromId: 'tower-vatticherukuru', toId: 'tower-guntur-city', name: 'Vatticherukuru - Guntur Rural Link', type: 'local_5g_beam', capacity: '5.0 Gbps', latency: '1.2 ms', color: '#38bdf8' },
  { id: 'link-prathipadu-chilakaluripet', fromId: 'tower-prathipadu', toId: 'tower-chilakaluripet', name: 'Prathipadu - Chilakaluripet Corridor', type: 'regional_optical', capacity: '10 Gbps', latency: '2.2 ms', color: '#00f0ff' },
  
  { id: 'link-chebrolu-tenali', fromId: 'tower-chebrolu', toId: 'tower-tenali', name: 'Chebrolu - Tenali Delta Fiber', type: 'regional_optical', capacity: '10 Gbps', latency: '1.5 ms', color: '#34d399' },
  { id: 'link-chebrolu-ponnur', fromId: 'tower-chebrolu', toId: 'tower-ponnur', name: 'Chebrolu - Ponnur Mandal Link', type: 'local_5g_beam', capacity: '6.0 Gbps', latency: '1.8 ms', color: '#00f0ff' },
  { id: 'link-ponnur-bapatla', fromId: 'tower-ponnur', toId: 'tower-bapatla', name: 'Ponnur - Bapatla Coastal Optical Feeder', type: 'regional_optical', capacity: '15 Gbps', latency: '2.2 ms', color: '#38bdf8' },
  
  { id: 'link-pedakakani-guntur', fromId: 'tower-pedakakani', toId: 'tower-guntur-city', name: 'Pedakakani - Guntur NH16 Optical Feeder', type: 'local_5g_beam', capacity: '10 Gbps', latency: '1.1 ms', color: '#00f0ff' },
  { id: 'link-pedakakani-mangalagiri', fromId: 'tower-pedakakani', toId: 'tower-mangalagiri', name: 'Pedakakani - Mangalagiri Concourse', type: 'regional_optical', capacity: '20 Gbps', latency: '1.3 ms', color: '#34d399' },
  { id: 'link-tadikonda-guntur', fromId: 'tower-tadikonda', toId: 'tower-guntur-city', name: 'Tadikonda - Guntur Fiber', type: 'regional_optical', capacity: '10 Gbps', latency: '1.6 ms', color: '#38bdf8' },
  { id: 'link-tadikonda-amaravati', fromId: 'tower-tadikonda', toId: 'tower-amaravati', name: 'Tadikonda - Amaravati Capital Express', type: 'regional_optical', capacity: '25 Gbps', latency: '1.4 ms', color: '#00f0ff' },

  { id: 'link-mangalagiri-kunchanapalli', fromId: 'tower-mangalagiri', toId: 'tower-kunchanapalli', name: 'Mangalagiri - Kunchanapalli Microcell Link', type: 'local_5g_beam', capacity: '10 Gbps', latency: '0.6 ms', color: '#34d399' },
  { id: 'link-kunchanapalli-tadepalli', fromId: 'tower-kunchanapalli', toId: 'tower-tadepalli', name: 'Kunchanapalli - Tadepalli NH16 Highway Beam', type: 'local_5g_beam', capacity: '15 Gbps', latency: '0.8 ms', color: '#00f0ff' },
  { id: 'link-tadepalli-vijayawada', fromId: 'tower-tadepalli', toId: 'tower-vijayawada', name: 'Tadepalli - Vijayawada Prakasam Barrage Span', type: 'regional_optical', capacity: '40 Gbps', latency: '0.9 ms', color: '#38bdf8' },
  
  { id: 'link-penumaka-amaravati', fromId: 'tower-penumaka', toId: 'tower-amaravati', name: 'Penumaka - Amaravati Riverfront Fiber', type: 'regional_optical', capacity: '20 Gbps', latency: '1.1 ms', color: '#34d399' },
  { id: 'link-amaravati-velagapudi', fromId: 'tower-amaravati', toId: 'tower-velagapudi', name: 'Amaravati - Velagapudi Secretariat Ring', type: 'regional_optical', capacity: '50 Gbps', latency: '0.7 ms', color: '#00f0ff' },
  { id: 'link-velagapudi-mandadam', fromId: 'tower-velagapudi', toId: 'tower-mandadam', name: 'Velagapudi - Mandadam Capital Cell', type: 'local_5g_beam', capacity: '20 Gbps', latency: '0.5 ms', color: '#34d399' },
  { id: 'link-mandadam-tadepalli', fromId: 'tower-mandadam', toId: 'tower-tadepalli', name: 'Mandadam - Tadepalli Optical Corridor', type: 'regional_optical', capacity: '30 Gbps', latency: '1.2 ms', color: '#38bdf8' },
  
  { id: 'link-vijayawada-kankipadu', fromId: 'tower-vijayawada', toId: 'tower-kankipadu', name: 'Vijayawada - Kankipadu Eastern Feeder', type: 'regional_optical', capacity: '20 Gbps', latency: '1.8 ms', color: '#00f0ff' },
  { id: 'link-kankipadu-machilipatnam', fromId: 'tower-kankipadu', toId: 'tower-machilipatnam', name: 'Kankipadu - Machilipatnam Port Optical Trunk', type: 'regional_optical', capacity: '25 Gbps', latency: '2.8 ms', color: '#38bdf8' },

  // =========================================================================
  // 2. ANDHRA PRADESH REGIONAL HIGHWAY CORRIDOR (Guntur - Vijayawada - Amaravati)
  // =========================================================================
  { id: 'link-rvrjc-guntur', fromId: 'tower-rvrjc', toId: 'tower-guntur-city', name: 'RVRJC Chowdavaram - Guntur City 5G Link', type: 'local_5g_beam', capacity: '10 Gbps', latency: '1.8 ms', color: '#00f0ff' },
  { id: 'link-guntur-mangalagiri', fromId: 'tower-guntur-city', toId: 'tower-mangalagiri', name: 'Guntur - Mangalagiri IT Corridor Beam', type: 'regional_optical', capacity: '40 Gbps', latency: '2.4 ms', color: '#00f0ff' },
  { id: 'link-mangalagiri-amaravati', fromId: 'tower-mangalagiri', toId: 'tower-amaravati', name: 'Mangalagiri - Amaravati Capital Fiber', type: 'regional_optical', capacity: '100 Gbps', latency: '1.6 ms', color: '#34d399' },
  { id: 'link-mangalagiri-vijayawada', fromId: 'tower-mangalagiri', toId: 'tower-vijayawada', name: 'Mangalagiri - Vijayawada Benz Circle 5G Concourse', type: 'local_5g_beam', capacity: '80 Gbps', latency: '2.1 ms', color: '#00f0ff' },
  { id: 'link-amaravati-vijayawada', fromId: 'tower-amaravati', toId: 'tower-vijayawada', name: 'Amaravati - Vijayawada Krishna River Optical Span', type: 'regional_optical', capacity: '100 Gbps', latency: '1.9 ms', color: '#38bdf8' },
  { id: 'link-vijayawada-rail', fromId: 'tower-vijayawada', toId: 'tower-vijayawada-rail', name: 'Vijayawada Central - RailTel Junction Node', type: 'local_5g_beam', capacity: '40 Gbps', latency: '0.8 ms', color: '#34d399' },
  { id: 'link-vijayawada-gannavaram', fromId: 'tower-vijayawada', toId: 'tower-gannavaram', name: 'Vijayawada - Gannavaram Airport High-Speed Link', type: 'regional_optical', capacity: '40 Gbps', latency: '2.8 ms', color: '#38bdf8' },
  { id: 'link-guntur-tenali', fromId: 'tower-guntur-city', toId: 'tower-tenali', name: 'Guntur - Tenali Delta Link', type: 'local_5g_beam', capacity: '10 Gbps', latency: '2.5 ms', color: '#00f0ff' },
  { id: 'link-tenali-vijayawada', fromId: 'tower-tenali', toId: 'tower-vijayawada', name: 'Tenali - Vijayawada South Corridor', type: 'regional_optical', capacity: '20 Gbps', latency: '3.1 ms', color: '#34d399' },
  { id: 'link-rvrjc-ongole', fromId: 'tower-rvrjc', toId: 'tower-ongole', name: 'RVRJC - Ongole Coastal Relay', type: 'local_5g_beam', capacity: '20 Gbps', latency: '6.5 ms', color: '#38bdf8' },
  { id: 'link-ongole-tirupati', fromId: 'tower-ongole', toId: 'tower-tirupati', name: 'Ongole - Tirupati Optical Link', type: 'terrestrial_core', capacity: '40 Gbps', latency: '4.8 ms', color: '#00f0ff' },

  // =========================================================================
  // 3. AP TO NATIONAL INDIAN TRUNK BACKBONES
  // =========================================================================
  { id: 'link-gannavaram-vizag', fromId: 'tower-gannavaram', toId: 'tower-vizag', name: 'Vijayawada - Visakhapatnam Subsea Feeder', type: 'terrestrial_core', capacity: '100 Gbps', latency: '8.4 ms', color: '#34d399' },
  { id: 'link-vijayawada-hyderabad', fromId: 'tower-vijayawada', toId: 'tower-hyderabad', name: 'Vijayawada - Hyderabad NIXI Optical Trunk', type: 'terrestrial_core', capacity: '400 Gbps', latency: '4.8 ms', color: '#38bdf8' },
  { id: 'link-guntur-hyderabad', fromId: 'tower-guntur-city', toId: 'tower-hyderabad', name: 'Guntur - Hyderabad Direct Highway Fiber', type: 'terrestrial_core', capacity: '200 Gbps', latency: '5.2 ms', color: '#00f0ff' },
  { id: 'link-tirupati-chennai', fromId: 'tower-tirupati', toId: 'tower-chennai', name: 'Tirupati - Chennai Landing Feeder', type: 'terrestrial_core', capacity: '100 Gbps', latency: '3.8 ms', color: '#34d399' },
  { id: 'link-tirupati-bengaluru', fromId: 'tower-tirupati', toId: 'tower-bengaluru', name: 'Tirupati - Bengaluru Tech Link', type: 'terrestrial_core', capacity: '100 Gbps', latency: '4.2 ms', color: '#38bdf8' },
  { id: 'link-ongole-chennai', fromId: 'tower-ongole', toId: 'tower-chennai', name: 'Ongole - Chennai Landing Station Trunk', type: 'terrestrial_core', capacity: '200 Gbps', latency: '6.8 ms', color: '#34d399' },
  
  // Interstate Indian Mesh
  { id: 'link-hyderabad-bengaluru', fromId: 'tower-hyderabad', toId: 'tower-bengaluru', name: 'Hyderabad - Bengaluru Tech Corridor', type: 'terrestrial_core', capacity: '600 Gbps', latency: '6.2 ms', color: '#38bdf8' },
  { id: 'link-bengaluru-chennai', fromId: 'tower-bengaluru', toId: 'tower-chennai', name: 'Bengaluru - Chennai Coastal Optical Trunk', type: 'terrestrial_core', capacity: '800 Gbps', latency: '4.5 ms', color: '#00f0ff' },
  { id: 'link-bengaluru-kochi', fromId: 'tower-bengaluru', toId: 'tower-kochi', name: 'Bengaluru - Kochi Subsea Feeder', type: 'terrestrial_core', capacity: '400 Gbps', latency: '5.2 ms', color: '#34d399' },
  { id: 'link-hyderabad-mumbai', fromId: 'tower-hyderabad', toId: 'tower-mumbai', name: 'Hyderabad - Mumbai National Optical Highway', type: 'terrestrial_core', capacity: '1.2 Tbps', latency: '12.4 ms', color: '#38bdf8' },
  { id: 'link-mumbai-pune', fromId: 'tower-mumbai', toId: 'tower-pune', name: 'Mumbai - Pune Expressway Fiber', type: 'terrestrial_core', capacity: '800 Gbps', latency: '2.1 ms', color: '#00f0ff' },
  { id: 'link-mumbai-ahmedabad', fromId: 'tower-mumbai', toId: 'tower-ahmedabad', name: 'Mumbai - Ahmedabad GIFT Corridor', type: 'terrestrial_core', capacity: '600 Gbps', latency: '5.8 ms', color: '#34d399' },
  { id: 'link-delhi-mumbai', fromId: 'tower-delhi', toId: 'tower-mumbai', name: 'New Delhi - Mumbai Super-Corridor', type: 'terrestrial_core', capacity: '1.6 Tbps', latency: '16.0 ms', color: '#34d399' },
  { id: 'link-delhi-kolkata', fromId: 'tower-delhi', toId: 'tower-kolkata', name: 'New Delhi - Kolkata Gangetic Plain Fiber', type: 'terrestrial_core', capacity: '800 Gbps', latency: '18.4 ms', color: '#38bdf8' },
  { id: 'link-kolkata-vizag', fromId: 'tower-kolkata', toId: 'tower-vizag', name: 'Kolkata - Vizag East Coast Subsea Feeder', type: 'terrestrial_core', capacity: '600 Gbps', latency: '11.0 ms', color: '#00f0ff' },

  // =========================================================================
  // 4. INTERNATIONAL SUBSEA & INTERCONTINENTAL LASER BEAMS ACROSS THE WORLD
  // =========================================================================
  // India to Overseas Gateways
  { id: 'link-chennai-singapore', fromId: 'tower-chennai', toId: 'tower-singapore', name: 'Bay of Bengal Express Subsea Cable', type: 'subsea_fiber', capacity: '48 Tbps', latency: '34 ms', color: '#00f0ff' },
  { id: 'link-vizag-singapore', fromId: 'tower-vizag', toId: 'tower-singapore', name: 'Visakhapatnam - Singapore Direct Marine Beam', type: 'subsea_fiber', capacity: '24 Tbps', latency: '36 ms', color: '#34d399' },
  { id: 'link-mumbai-dubai', fromId: 'tower-mumbai', toId: 'tower-dubai', name: 'Arabian Sea Subsea Cable (AAE-1)', type: 'subsea_fiber', capacity: '40 Tbps', latency: '22 ms', color: '#00f0ff' },
  { id: 'link-kochi-dubai', fromId: 'tower-kochi', toId: 'tower-dubai', name: 'Kochi - Dubai Direct Indian Ocean Subsea', type: 'subsea_fiber', capacity: '28 Tbps', latency: '26 ms', color: '#38bdf8' },

  // Middle East & Africa Core
  { id: 'link-dubai-riyadh', fromId: 'tower-dubai', toId: 'tower-riyadh', name: 'Gulf Trans-Arabian Fiber Backbone', type: 'terrestrial_core', capacity: '30 Tbps', latency: '12 ms', color: '#34d399' },
  { id: 'link-dubai-doha', fromId: 'tower-dubai', toId: 'tower-doha', name: 'Dubai - Doha Subsea Coastal Feeder', type: 'subsea_fiber', capacity: '25 Tbps', latency: '6 ms', color: '#00f0ff' },
  { id: 'link-dubai-cairo', fromId: 'tower-dubai', toId: 'tower-cairo', name: 'Middle East - Red Sea Subsea Arc', type: 'subsea_fiber', capacity: '45 Tbps', latency: '38 ms', color: '#38bdf8' },
  { id: 'link-cairo-telaviv', fromId: 'tower-cairo', toId: 'tower-telaviv', name: 'Levant Regional Fiber Connector', type: 'terrestrial_core', capacity: '20 Tbps', latency: '8 ms', color: '#00f0ff' },
  { id: 'link-cairo-milan', fromId: 'tower-cairo', toId: 'tower-milan', name: 'Eastern Mediterranean Subsea to Italy', type: 'subsea_fiber', capacity: '36 Tbps', latency: '42 ms', color: '#34d399' },
  { id: 'link-cairo-casablanca', fromId: 'tower-cairo', toId: 'tower-casablanca', name: 'North Africa Mediterranean Fiber Trunk', type: 'terrestrial_core', capacity: '24 Tbps', latency: '48 ms', color: '#38bdf8' },
  { id: 'link-cairo-nairobi', fromId: 'tower-cairo', toId: 'tower-nairobi', name: 'Pan-African East Coast Core Fiber', type: 'terrestrial_core', capacity: '22 Tbps', latency: '52 ms', color: '#00f0ff' },
  { id: 'link-nairobi-johannesburg', fromId: 'tower-nairobi', toId: 'tower-johannesburg', name: 'East African Inland Fiber Corridor', type: 'terrestrial_core', capacity: '28 Tbps', latency: '44 ms', color: '#34d399' },
  { id: 'link-johannesburg-capetown', fromId: 'tower-johannesburg', toId: 'tower-capetown', name: 'South African National Core Fiber', type: 'terrestrial_core', capacity: '32 Tbps', latency: '16 ms', color: '#00f0ff' },
  { id: 'link-capetown-lagos', fromId: 'tower-capetown', toId: 'tower-lagos', name: 'WACS Atlantic Subsea Link', type: 'subsea_fiber', capacity: '28 Tbps', latency: '68 ms', color: '#38bdf8' },
  { id: 'link-lagos-london', fromId: 'tower-lagos', toId: 'tower-london', name: 'Equiano & 2Africa West African Highway', type: 'subsea_fiber', capacity: '42 Tbps', latency: '82 ms', color: '#00f0ff' },
  { id: 'link-casablanca-madrid', fromId: 'tower-casablanca', toId: 'tower-madrid', name: 'Strait of Gibraltar Marine Crossing', type: 'subsea_fiber', capacity: '30 Tbps', latency: '14 ms', color: '#34d399' },

  // Asia-Pacific & Oceania Core
  { id: 'link-singapore-kualalumpur', fromId: 'tower-singapore', toId: 'tower-kualalumpur', name: 'Straits of Malacca High-Speed Fiber', type: 'terrestrial_core', capacity: '40 Tbps', latency: '4 ms', color: '#00f0ff' },
  { id: 'link-singapore-bangkok', fromId: 'tower-singapore', toId: 'tower-bangkok', name: 'ASEAN Terrestrial Optical Ring', type: 'terrestrial_core', capacity: '32 Tbps', latency: '18 ms', color: '#34d399' },
  { id: 'link-singapore-hongkong', fromId: 'tower-singapore', toId: 'tower-hongkong', name: 'South China Sea Subsea Cable (SJC)', type: 'subsea_fiber', capacity: '64 Tbps', latency: '28 ms', color: '#38bdf8' },
  { id: 'link-hongkong-shanghai', fromId: 'tower-hongkong', toId: 'tower-shanghai', name: 'China East Coast Coastal Optical Highway', type: 'terrestrial_core', capacity: '56 Tbps', latency: '16 ms', color: '#00f0ff' },
  { id: 'link-shanghai-beijing', fromId: 'tower-shanghai', toId: 'tower-beijing', name: 'Beijing - Shanghai National Quantum/Optical Trunk', type: 'terrestrial_core', capacity: '60 Tbps', latency: '14 ms', color: '#34d399' },
  { id: 'link-shanghai-tokyo', fromId: 'tower-shanghai', toId: 'tower-tokyo', name: 'East China Sea Subsea Cable', type: 'subsea_fiber', capacity: '48 Tbps', latency: '24 ms', color: '#38bdf8' },
  { id: 'link-tokyo-seoul', fromId: 'tower-tokyo', toId: 'tower-seoul', name: 'Korea - Japan Subsea Cable (KJCN)', type: 'subsea_fiber', capacity: '42 Tbps', latency: '18 ms', color: '#00f0ff' },
  { id: 'link-singapore-sydney', fromId: 'tower-singapore', toId: 'tower-sydney', name: 'Oceania Southern Cross Express', type: 'subsea_fiber', capacity: '32 Tbps', latency: '76 ms', color: '#00f0ff' },
  { id: 'link-sydney-melbourne', fromId: 'tower-sydney', toId: 'tower-melbourne', name: 'Australian East Coast High-Capacity Core', type: 'terrestrial_core', capacity: '38 Tbps', latency: '8 ms', color: '#34d399' },
  { id: 'link-sydney-auckland', fromId: 'tower-sydney', toId: 'tower-auckland', name: 'Tasman Sea Subsea Cable (Tasman Global)', type: 'subsea_fiber', capacity: '26 Tbps', latency: '24 ms', color: '#38bdf8' },

  // Europe Continental Dense Mesh
  { id: 'link-dubai-frankfurt', fromId: 'tower-dubai', toId: 'tower-frankfurt', name: 'Middle East - Europe Trans-Continental', type: 'subsea_fiber', capacity: '52 Tbps', latency: '64 ms', color: '#38bdf8' },
  { id: 'link-frankfurt-london', fromId: 'tower-frankfurt', toId: 'tower-london', name: 'European Core Gigabit Mesh', type: 'terrestrial_core', capacity: '64 Tbps', latency: '10 ms', color: '#00f0ff' },
  { id: 'link-frankfurt-amsterdam', fromId: 'tower-frankfurt', toId: 'tower-amsterdam', name: 'DE-CIX to AMS-IX High-Capacity Bridge', type: 'terrestrial_core', capacity: '72 Tbps', latency: '6 ms', color: '#34d399' },
  { id: 'link-frankfurt-paris', fromId: 'tower-frankfurt', toId: 'tower-paris', name: 'Central European Optical Ring', type: 'terrestrial_core', capacity: '48 Tbps', latency: '8 ms', color: '#38bdf8' },
  { id: 'link-frankfurt-berlin', fromId: 'tower-frankfurt', toId: 'tower-berlin', name: 'German National Core Optical Spine', type: 'terrestrial_core', capacity: '54 Tbps', latency: '7 ms', color: '#00f0ff' },
  { id: 'link-frankfurt-zurich', fromId: 'tower-frankfurt', toId: 'tower-zurich', name: 'Rhine Valley High-Speed Fiber', type: 'terrestrial_core', capacity: '38 Tbps', latency: '5 ms', color: '#34d399' },
  { id: 'link-frankfurt-milan', fromId: 'tower-frankfurt', toId: 'tower-milan', name: 'Trans-Alpine Optical Corridor', type: 'terrestrial_core', capacity: '42 Tbps', latency: '9 ms', color: '#38bdf8' },
  { id: 'link-frankfurt-warsaw', fromId: 'tower-frankfurt', toId: 'tower-warsaw', name: 'Central-Eastern European Gateway', type: 'terrestrial_core', capacity: '32 Tbps', latency: '14 ms', color: '#00f0ff' },
  { id: 'link-frankfurt-istanbul', fromId: 'tower-frankfurt', toId: 'tower-istanbul', name: 'Balkan & Aegean Trans-Europe Backbone', type: 'terrestrial_core', capacity: '36 Tbps', latency: '28 ms', color: '#34d399' },
  { id: 'link-london-dublin', fromId: 'tower-london', toId: 'tower-dublin', name: 'Irish Sea Subsea Fiber', type: 'subsea_fiber', capacity: '46 Tbps', latency: '6 ms', color: '#00f0ff' },
  { id: 'link-london-amsterdam', fromId: 'tower-london', toId: 'tower-amsterdam', name: 'North Sea Marine Fiber', type: 'subsea_fiber', capacity: '52 Tbps', latency: '7 ms', color: '#38bdf8' },
  { id: 'link-paris-madrid', fromId: 'tower-paris', toId: 'tower-madrid', name: 'Western European Iberian Optical Trunk', type: 'terrestrial_core', capacity: '34 Tbps', latency: '16 ms', color: '#34d399' },
  { id: 'link-berlin-stockholm', fromId: 'tower-berlin', toId: 'tower-stockholm', name: 'Baltic Sea Subsea Cable', type: 'subsea_fiber', capacity: '36 Tbps', latency: '15 ms', color: '#00f0ff' },

  // Transatlantic & Pan-American Mesh
  { id: 'link-london-newyork', fromId: 'tower-london', toId: 'tower-newyork', name: 'Transatlantic Dunant & Apollo Subsea Cable', type: 'subsea_fiber', capacity: '85 Tbps', latency: '66 ms', color: '#00f0ff' },
  { id: 'link-paris-newyork', fromId: 'tower-paris', toId: 'tower-newyork', name: 'Amitié Transatlantic High-Speed Cable', type: 'subsea_fiber', capacity: '75 Tbps', latency: '68 ms', color: '#34d399' },
  { id: 'link-dublin-newyork', fromId: 'tower-dublin', toId: 'tower-newyork', name: 'AEConnect North Atlantic Subsea', type: 'subsea_fiber', capacity: '60 Tbps', latency: '62 ms', color: '#38bdf8' },
  { id: 'link-newyork-ashburn', fromId: 'tower-newyork', toId: 'tower-ashburn', name: 'US East Internet Corridor', type: 'terrestrial_core', capacity: '120 Tbps', latency: '5 ms', color: '#34d399' },
  { id: 'link-newyork-toronto', fromId: 'tower-newyork', toId: 'tower-toronto', name: 'North American Great Lakes Highway', type: 'terrestrial_core', capacity: '42 Tbps', latency: '9 ms', color: '#00f0ff' },
  { id: 'link-newyork-chicago', fromId: 'tower-newyork', toId: 'tower-chicago', name: 'Trans-Appalachian Ultra-Low Latency Core', type: 'terrestrial_core', capacity: '64 Tbps', latency: '14 ms', color: '#38bdf8' },
  { id: 'link-ashburn-chicago', fromId: 'tower-ashburn', toId: 'tower-chicago', name: 'Midwest Cloud Expressway', type: 'terrestrial_core', capacity: '80 Tbps', latency: '12 ms', color: '#00f0ff' },
  { id: 'link-chicago-seattle', fromId: 'tower-chicago', toId: 'tower-seattle', name: 'Northern US Transcontinental Route', type: 'terrestrial_core', capacity: '52 Tbps', latency: '28 ms', color: '#34d399' },
  { id: 'link-ashburn-siliconvalley', fromId: 'tower-ashburn', toId: 'tower-siliconvalley', name: 'Transcontinental USA Core Beam', type: 'terrestrial_core', capacity: '80 Tbps', latency: '32 ms', color: '#38bdf8' },
  { id: 'link-siliconvalley-losangeles', fromId: 'tower-siliconvalley', toId: 'tower-losangeles', name: 'California Coastal Fiber Spine', type: 'terrestrial_core', capacity: '72 Tbps', latency: '6 ms', color: '#00f0ff' },
  { id: 'link-losangeles-mexicocity', fromId: 'tower-losangeles', toId: 'tower-mexicocity', name: 'US - Mexico International Border Fiber', type: 'terrestrial_core', capacity: '36 Tbps', latency: '34 ms', color: '#34d399' },
  { id: 'link-mexicocity-bogota', fromId: 'tower-mexicocity', toId: 'tower-bogota', name: 'Central America & Andean Gateway', type: 'subsea_fiber', capacity: '28 Tbps', latency: '46 ms', color: '#38bdf8' },

  // South America & Trans-Pacific
  { id: 'link-madrid-saopaulo', fromId: 'tower-madrid', toId: 'tower-saopaulo', name: 'EllaLink Trans-South Atlantic Subsea', type: 'subsea_fiber', capacity: '36 Tbps', latency: '94 ms', color: '#34d399' },
  { id: 'link-newyork-saopaulo', fromId: 'tower-newyork', toId: 'tower-saopaulo', name: 'Americas Seabras-1 Subsea Link', type: 'subsea_fiber', capacity: '28 Tbps', latency: '105 ms', color: '#f59e0b' },
  { id: 'link-saopaulo-buenosaires', fromId: 'tower-saopaulo', toId: 'tower-buenosaires', name: 'South American Mercosur Optical Highway', type: 'terrestrial_core', capacity: '32 Tbps', latency: '22 ms', color: '#00f0ff' },
  { id: 'link-buenosaires-santiago', fromId: 'tower-buenosaires', toId: 'tower-santiago', name: 'Trans-Andean Fiber Expressway', type: 'terrestrial_core', capacity: '24 Tbps', latency: '16 ms', color: '#34d399' },
  { id: 'link-santiago-bogota', fromId: 'tower-santiago', toId: 'tower-bogota', name: 'Pacific South American Subsea Cable', type: 'subsea_fiber', capacity: '26 Tbps', latency: '52 ms', color: '#38bdf8' },

  // Trans-Pacific Links to Asia
  { id: 'link-siliconvalley-tokyo', fromId: 'tower-siliconvalley', toId: 'tower-tokyo', name: 'Trans-Pacific FASTER Optical Subsea', type: 'subsea_fiber', capacity: '75 Tbps', latency: '78 ms', color: '#00f0ff' },
  { id: 'link-seattle-tokyo', fromId: 'tower-seattle', toId: 'tower-tokyo', name: 'North Pacific Great Circle Marine Fiber', type: 'subsea_fiber', capacity: '60 Tbps', latency: '74 ms', color: '#34d399' },
  { id: 'link-losangeles-sydney', fromId: 'tower-losangeles', toId: 'tower-sydney', name: 'Trans-Pacific Southern Cross Cable', type: 'subsea_fiber', capacity: '36 Tbps', latency: '138 ms', color: '#38bdf8' }
];

// Great-circle interpolation function for smooth spherical arcs
function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

export function getGreatCirclePoints(
  p1: [number, number],
  p2: [number, number],
  numPoints = 64
): [number, number][] {
  const lon1 = toRad(p1[0]), lat1 = toRad(p1[1]);
  const lon2 = toRad(p2[0]), lat2 = toRad(p2[1]);

  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
  ));

  if (d < 0.0001) return [p1, p2];

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push([toDeg(lon), toDeg(lat)]);
  }
  return points;
}

// Generate GeoJSON of all network lines (both local Guntur-Vijayawada and international)
export const GLOBAL_LINKS_GEOJSON: any = {
  type: 'FeatureCollection',
  features: GLOBAL_SIGNAL_LINKS.map((link) => {
    const fromTower = GLOBAL_SIGNAL_TOWERS.find((t) => t.id === link.fromId);
    const toTower = GLOBAL_SIGNAL_TOWERS.find((t) => t.id === link.toId);
    if (!fromTower || !toTower) return null;

    const coordinates = getGreatCirclePoints(fromTower.coordinates, toTower.coordinates, 48);

    return {
      type: 'Feature',
      properties: {
        id: link.id,
        name: link.name,
        type: link.type,
        capacity: link.capacity,
        latency: link.latency,
        color: link.color
      },
      geometry: {
        type: 'LineString',
        coordinates
      }
    };
  }).filter(Boolean)
};

// Generate GeoJSON of all network towers for WebGL rendering (avoids giant HTML DOM marker overlaps)
export const GLOBAL_TOWERS_GEOJSON: any = {
  type: 'FeatureCollection',
  features: GLOBAL_SIGNAL_TOWERS.map((tower) => ({
    type: 'Feature',
    properties: {
      id: tower.id,
      name: tower.name,
      city: tower.city,
      region: tower.region,
      category: tower.category,
      country: tower.country,
      throughput: tower.throughput,
      latency: tower.latencyToRVRJC,
      isOrigin: tower.isOrigin || false,
      color: tower.isOrigin
        ? '#00f0ff'
        : tower.category === 'village'
        ? '#34d399'
        : tower.category === 'mandal'
        ? '#38bdf8'
        : tower.category === 'city'
        ? '#818cf8'
        : '#f43f5e'
    },
    geometry: {
      type: 'Point',
      coordinates: tower.coordinates
    }
  }))
};

// Compute moving signal packet points at phase t (0 <= t <= 1) along all links
export function getMovingSignalPackets(phase: number): any {
  const features: any[] = [];

  GLOBAL_SIGNAL_LINKS.forEach((link, linkIdx) => {
    const fromTower = GLOBAL_SIGNAL_TOWERS.find((t) => t.id === link.fromId);
    const toTower = GLOBAL_SIGNAL_TOWERS.find((t) => t.id === link.toId);
    if (!fromTower || !toTower) return;

    const pts = getGreatCirclePoints(fromTower.coordinates, toTower.coordinates, 48);
    
    // Packet 1: Forward pulse
    const p1Index = Math.floor(((phase + linkIdx * 0.08) % 1) * (pts.length - 1));
    const coord1 = pts[p1Index];
    if (coord1) {
      features.push({
        type: 'Feature',
        properties: {
          linkId: link.id,
          direction: 'forward',
          color: link.color,
          name: link.name
        },
        geometry: {
          type: 'Point',
          coordinates: coord1
        }
      });
    }

    // Packet 2: Return pulse
    const p2Index = Math.floor(((1 - (phase + linkIdx * 0.08) % 1)) * (pts.length - 1));
    const coord2 = pts[p2Index];
    if (coord2) {
      features.push({
        type: 'Feature',
        properties: {
          linkId: link.id,
          direction: 'reverse',
          color: '#ffffff',
          name: link.name
        },
        geometry: {
          type: 'Point',
          coordinates: coord2
        }
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features
  };
}
