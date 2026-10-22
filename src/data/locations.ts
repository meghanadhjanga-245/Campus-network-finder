export interface CampusLocation {
  id: string;
  code: string;
  shortName: string;
  displayName: string;
  name: string;
  type: string;
  building?: string;
  floor?: string | number;
  campus: string;
  coordinates: [number, number];
  signalQuality: string;
  speed: string;
  carrier: string;
  image: string;
  gallery: string[];
  description: string;
  established?: string;
  departments?: string[];
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'lib-001',
    code: '01',
    shortName: 'Hi-Tech',
    displayName: '01. Hi-Tech Block',
    name: 'Hi-Tech Block (Library & R&D)',
    type: 'building',
    building: 'Hi-Tech Block',
    floor: 'Floor 1',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32349, 16.25458],
    signalQuality: 'Excellent',
    speed: '1,240 Mbps',
    carrier: 'Campus Wi-Fi 6E',
    image: '/images/campus/library.jpg',
    gallery: ['/images/campus/library.jpg', '/images/campus/library_reading.jpg'],
    description: 'State-of-the-art automated central library spanning 3 air-conditioned floors with over 120,000 volumes, IEEE digital access portal, and dedicated research carrels with sub-2ms deterministic latency.',
    established: '1998',
    departments: ['Digital Learning Center', 'IEEE & Springer Reference Room', 'Periodicals Archive', 'Postgraduate Reading Hall']
  },
  {
    id: 'cyber-001',
    code: '02',
    shortName: 'Cyber',
    displayName: '02. Cyber Block',
    name: 'Cyber Block (CSE/IT)',
    type: 'building',
    building: 'Cyber Block',
    floor: 2,
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32284, 16.25380],
    signalQuality: 'Optimal',
    speed: '890 Mbps',
    carrier: 'Jio True 5G',
    image: '/images/campus/cyber.jpg',
    gallery: ['/images/campus/cyber.jpg', '/images/campus/cyber_lab.jpg'],
    description: 'Ultra-modern 5-story computational complex housing Computer Science & Engineering, Information Technology, AI & Data Science labs. Features dedicated gigabit server rooms and 5G indoor microcells for zero latency.',
    established: '2012',
    departments: ['Computer Science & Engineering', 'Information Technology', 'AI & Machine Learning', 'Data Science Lab']
  },
  {
    id: 'civil-001',
    code: '03',
    shortName: 'Digital',
    displayName: '03. Digital Block',
    name: 'Digital Block (Civil/CAD)',
    type: 'room',
    building: 'Digital & Civil Block',
    floor: 'Ground',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32360, 16.25480],
    signalQuality: 'Good',
    speed: '780 Mbps',
    carrier: 'Jio True 5G',
    image: '/images/campus/civil.jpg',
    gallery: ['/images/campus/civil.jpg'],
    description: 'Digital laboratories and heavy structural CAD simulation facilities with total station survey gear and high-speed telemetry.',
    established: '1985',
    departments: ['CAD Modeling Studio', 'Digital Geomatics Lab', 'Structural Analysis Lab']
  },
  {
    id: 'mech-001',
    code: '04',
    shortName: 'Silver',
    displayName: '04. Silver Jubilee Block',
    name: 'Silver Jubilee Block (Mechanical)',
    type: 'building',
    building: 'Silver Jubilee Block',
    floor: 'Floor 1',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32373, 16.25779],
    signalQuality: 'Optimal',
    speed: '760 Mbps',
    carrier: 'Jio True 5G',
    image: '/images/campus/mechanical.jpg',
    gallery: ['/images/campus/mechanical.jpg'],
    description: 'Premier engineering laboratory wing housing CNC manufacturing centers, thermodynamics bays, CAD/CAM design workstations, and robotics fabrication cells.',
    established: '1985',
    departments: ['Thermal Engineering Lab', 'CNC Automation Bay', 'CAD/CAM Design Studio', 'Robotics Workshop']
  },
  {
    id: 'admin-001',
    code: '05',
    shortName: 'Administrative',
    displayName: '05. Administrative Block',
    name: 'Administrative Block (Main)',
    type: 'building',
    building: 'Main Block',
    floor: 'Ground Floor',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32399, 16.25509],
    signalQuality: 'Optimal',
    speed: '1,120 Mbps',
    carrier: 'Campus Wi-Fi 6E',
    image: '/images/campus/admin.jpg',
    gallery: ['/images/campus/admin.jpg', '/images/campus/admin_hall.jpg'],
    description: 'Central administrative headquarters of R.V.R. & J.C. College of Engineering. Houses the Principal Directorate, Examination Cell, Registrar, and Academic Council Chambers with high-density campus Wi-Fi 6E mesh and rooftop 5G base station mast.',
    established: '1985',
    departments: ['Office of Principal', 'Examination Cell', 'Academic Affairs', 'Dean Student Affairs']
  },
  {
    id: 'cafe-001',
    code: '06',
    shortName: 'Central',
    displayName: '06. Central Quadrangle',
    name: 'Central Quadrangle (Canteen & Plaza)',
    type: 'outdoor_zone',
    building: 'Canteen Complex',
    floor: 'Ground',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32372, 16.25700],
    signalQuality: 'Good',
    speed: '680 Mbps',
    carrier: 'Airtel 5G Plus',
    image: '/images/campus/canteen.jpg',
    gallery: ['/images/campus/canteen.jpg', '/images/campus/canteen_interior.jpg'],
    description: 'Central campus plaza and dining pavilion accommodating students and faculty with robust outdoor 5G coverage.',
    established: '1995',
    departments: ['Main Dining Hall', 'Juice & Coffee Bar', 'Student Common Area']
  },
  {
    id: 'chem-001',
    code: '07',
    shortName: 'Chemical',
    displayName: '07. Chemical Block',
    name: 'Chemical Block',
    type: 'building',
    building: 'Chemical Block',
    floor: 'Ground',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32446, 16.25652],
    signalQuality: 'Good',
    speed: '620 Mbps',
    carrier: 'Airtel 5G Plus',
    image: '/images/campus/chemical.jpg',
    gallery: ['/images/campus/chemical.jpg'],
    description: 'Advanced chemical and biotechnology laboratories featuring bioreactors and pilot process units with full wireless telemetry integration.',
    established: '1996',
    departments: ['Reaction Engineering Lab', 'Process Dynamics Lab', 'Polymer Testing']
  },
  {
    id: 'sports-001',
    code: '08',
    shortName: 'Open',
    displayName: '08. Open Arena / Pavilion',
    name: 'Open Arena (Cricket Ground & Athletics)',
    type: 'outdoor_zone',
    building: 'Sports Complex',
    floor: 'Ground',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32531, 16.25440],
    signalQuality: 'Good',
    speed: '540 Mbps',
    carrier: 'Airtel 5G Plus',
    image: '/images/campus/cricket.jpg',
    gallery: ['/images/campus/cricket.jpg', '/images/campus/sports_aerial.jpg'],
    description: 'Standard collegiate stadium featuring turf pitch, floodlight towers, 400m running track, and covered pavilion.',
    established: '1990',
    departments: ['Cricket Turf Stadium', 'Athletics 400m Track', 'Basketball Arena']
  },
  {
    id: 'hostel-a',
    code: '09',
    shortName: 'RJ',
    displayName: '09. RJ Block / Hostels',
    name: 'RJ Block (Hostel Complex)',
    type: 'building',
    building: 'Hostel Block',
    floor: 'All Floors',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32580, 16.25680],
    signalQuality: 'High',
    speed: '820 Mbps',
    carrier: 'Jio True 5G',
    image: '/images/campus/hostel.jpg',
    gallery: ['/images/campus/hostel.jpg'],
    description: 'Residential towers offering student hostels, study lounges, and high-speed Wi-Fi connectivity.',
    established: '2005',
    departments: ['Hostel Block A & B', 'Mess & Dining Hall', 'Student Recreation Center']
  },
  {
    id: 'gate-main',
    code: '10',
    shortName: 'NSS',
    displayName: '10. NSS / Main Gate',
    name: 'NSS / Main Campus Gate',
    type: 'gate',
    building: 'Campus Boulevard',
    floor: 'Ground',
    campus: 'RVRJC College of Engineering',
    coordinates: [80.32180, 16.25480],
    signalQuality: 'Good',
    speed: '590 Mbps',
    carrier: 'Jio True 5G',
    image: '/images/campus/gate.jpg',
    gallery: ['/images/campus/gate.jpg'],
    description: 'Monumental campus entrance archway on NH-16 with security monitoring and NSS reception kiosk.',
    established: '1985',
    departments: ['Main Security Post', 'NSS Office', 'Visitor Information Desk']
  }
];
