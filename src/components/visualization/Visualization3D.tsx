import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMPUS_LOCATIONS } from '../../data/locations';

interface Visualization3DProps {
  onSelectBuilding?: (buildingId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface HoveredBuildingInfo {
  id: string;
  name: string;
  speed: string;
  signalQuality: string;
  carrier: string;
  x: number;
  y: number;
}

export const Visualization3D = ({
  onSelectBuilding,
  isFullscreen = false,
  onToggleFullscreen
}: Visualization3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<HoveredBuildingInfo | null>(null);
  const [activePreset, setActivePreset] = useState<'overview' | 'tower' | 'cyber' | 'library' | 'sports'>('overview');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [showWaves, setShowWaves] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  // Three.js instances refs for UI controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const beamGroupRef = useRef<THREE.Group | null>(null);
  const waveGroupRef = useRef<THREE.Group | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh | THREE.Group>>(new Map());

  // Handle camera view transition
  const transitionCameraTo = useCallback((targetPos: THREE.Vector3, lookAtPos: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let progress = 0;

    const animateTransition = () => {
      progress += 0.04;
      if (progress < 1) {
        camera.position.lerpVectors(startPos, targetPos, progress);
        controls.target.lerpVectors(startTarget, lookAtPos, progress);
        controls.update();
        requestAnimationFrame(animateTransition);
      } else {
        camera.position.copy(targetPos);
        controls.target.copy(lookAtPos);
        controls.update();
      }
    };
    animateTransition();
  }, []);

  const handlePreset = (preset: 'overview' | 'tower' | 'cyber' | 'library' | 'sports') => {
    setActivePreset(preset);
    if (preset === 'overview') {
      transitionCameraTo(new THREE.Vector3(45, 38, 55), new THREE.Vector3(0, 4, 0));
    } else if (preset === 'tower') {
      transitionCameraTo(new THREE.Vector3(12, 22, 18), new THREE.Vector3(0, 14, 0));
    } else if (preset === 'cyber') {
      transitionCameraTo(new THREE.Vector3(-25, 18, -10), new THREE.Vector3(-20, 8, -15));
    } else if (preset === 'library') {
      transitionCameraTo(new THREE.Vector3(-8, 14, 18), new THREE.Vector3(-10, 5, 8));
    } else if (preset === 'sports') {
      transitionCameraTo(new THREE.Vector3(35, 20, -10), new THREE.Vector3(26, 2, -18));
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 0.8;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (beamGroupRef.current) {
      beamGroupRef.current.visible = showBeams;
    }
  }, [showBeams]);

  useEffect(() => {
    if (waveGroupRef.current) {
      waveGroupRef.current.visible = showWaves;
    }
  }, [showWaves]);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if ('wireframe' in mat) mat.wireframe = wireframeMode;
          });
        } else if ('wireframe' in child.material) {
          child.material.wireframe = wireframeMode;
        }
      }
    });
  }, [wireframeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.008);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      500
    );
    camera.position.set(45, 38, 55);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera going below ground
    controls.minDistance = 8;
    controls.maxDistance = 140;
    controls.target.set(0, 4, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.6);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(50, 70, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const shadowD = 60;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    scene.add(sunLight);

    // Soft colored accent lights
    const blueFill = new THREE.PointLight(0x0284c7, 2.5, 80);
    blueFill.position.set(-20, 20, -20);
    scene.add(blueFill);

    const emeraldFill = new THREE.PointLight(0x10b981, 2.0, 70);
    emeraldFill.position.set(20, 15, 20);
    scene.add(emeraldFill);

    // 6. Campus Ground & Terrain
    const groundGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.85,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor
    const grid = new THREE.GridHelper(160, 40, 0x1e293b, 0x0f172a);
    grid.position.y = 0.02;
    scene.add(grid);

    // 7. Roads & Walkways Network
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      roughness: 0.7,
      metalness: 0.2
    });

    const createRoad = (w: number, l: number, x: number, z: number, rotY = 0) => {
      const roadGeo = new THREE.PlaneGeometry(w, l);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotY;
      road.position.set(x, 0.05, z);
      road.receiveShadow = true;
      scene.add(road);
    };

    // Main Boulevard from Gate to Admin
    createRoad(7, 90, 0, 0);
    // East-West cross boulevard
    createRoad(6, 120, 0, 0, Math.PI / 2);
    // Perimeter ring road
    createRoad(5, 70, -25, 0);
    createRoad(5, 70, 25, 0);

    // 8. Low-Poly Trees Procedural Generation
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6, flatShading: true });
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.8, 6);
    const foliageGeo = new THREE.ConeGeometry(1.4, 3.2, 7);

    const placeTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9 * scale;
      trunk.castShadow = true;
      trunk.scale.set(scale, scale, scale);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = (1.8 + 1.4) * scale;
      foliage.castShadow = true;
      foliage.scale.set(scale, scale, scale);

      tree.add(trunk);
      tree.add(foliage);
      tree.position.set(x, 0, z);
      treeGroup.add(tree);
    };

    // Avenue trees along boulevards
    for (let z = -40; z <= 40; z += 10) {
      if (Math.abs(z) > 4) {
        placeTree(-4.8, z, 0.9 + Math.random() * 0.3);
        placeTree(4.8, z, 0.9 + Math.random() * 0.3);
      }
    }
    // Trees around cricket ground
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const tx = 26 + Math.cos(a) * 16;
      const tz = -18 + Math.sin(a) * 13;
      placeTree(tx, tz, 0.8 + Math.random() * 0.4);
    }
    scene.add(treeGroup);

    // 9. Procedural 3D Buildings of RVRJC
    const buildingMeshes = new Map<string, THREE.Mesh | THREE.Group>();
    const interactiveObjects: THREE.Object3D[] = [];

    // Helper: Create detailed building block
    const createCollegiateBlock = (
      id: string,
      name: string,
      w: number,
      h: number,
      d: number,
      x: number,
      z: number,
      colorHex: number,
      windowColorHex = 0x38bdf8,
      roofDetail = true
    ) => {
      const group = new THREE.Group();
      group.name = id;

      // Base wall structure
      const wallMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.5,
        metalness: 0.2
      });
      const bodyGeo = new THREE.BoxGeometry(w, h, d);
      const body = new THREE.Mesh(bodyGeo, wallMat);
      body.position.y = h / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Glass windows grid texture / strips
      const windowMat = new THREE.MeshStandardMaterial({
        color: windowColorHex,
        metalness: 0.8,
        roughness: 0.2,
        emissive: windowColorHex,
        emissiveIntensity: 0.15
      });

      // Front & Back window strips
      const floors = Math.max(2, Math.floor(h / 2.2));
      for (let f = 1; f <= floors; f++) {
        const winY = (h / (floors + 1)) * f;
        const winGeo = new THREE.BoxGeometry(w * 0.85, 0.7, d + 0.05);
        const winMesh = new THREE.Mesh(winGeo, windowMat);
        winMesh.position.y = winY;
        group.add(winMesh);
      }

      // Parapet / Roof rim
      if (roofDetail) {
        const rimGeo = new THREE.BoxGeometry(w + 0.4, 0.4, d + 0.4);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.y = h + 0.2;
        group.add(rim);

        // Rooftop AC chiller / equipment boxes
        const acGeo = new THREE.BoxGeometry(1.6, 0.8, 1.4);
        const acMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 });
        const ac = new THREE.Mesh(acGeo, acMat);
        ac.position.set(w * 0.2, h + 0.6, d * 0.2);
        group.add(ac);
      }

      // Wireframe hover highlight cage (initially hidden)
      const wireGeo = new THREE.BoxGeometry(w + 0.2, h + 0.2, d + 0.2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        visible: false
      });
      const wireframeBox = new THREE.Mesh(wireGeo, wireMat);
      wireframeBox.position.y = h / 2;
      wireframeBox.name = `${id}-wireframe`;
      group.add(wireframeBox);

      group.position.set(x, 0, z);
      scene.add(group);
      buildingMeshes.set(id, group);
      interactiveObjects.push(body);
      body.userData = { id, name, group };

      return group;
    };

    // A. Main Block (Admin) — Classic colonnaded portico with central tower
    const adminGroup = new THREE.Group();
    adminGroup.name = 'admin-001';

    // Central administrative block
    const adminCenter = createCollegiateBlock('admin-001', 'Main Block (Admin)', 14, 8, 10, 0, 0, 0x991b1b, 0x93c5fd);
    
    // Front Portico with Pillars
    const porticoRoofGeo = new THREE.BoxGeometry(7, 0.8, 4);
    const porticoMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
    const porticoRoof = new THREE.Mesh(porticoRoofGeo, porticoMat);
    porticoRoof.position.set(0, 5.5, 6);
    adminCenter.add(porticoRoof);

    // 4 Classical Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.35, 5, 12);
    for (let px of [-2.6, -0.9, 0.9, 2.6]) {
      const pillar = new THREE.Mesh(pillarGeo, porticoMat);
      pillar.position.set(px, 2.5, 7.2);
      pillar.castShadow = true;
      adminCenter.add(pillar);
    }

    // Flag mast on Admin Block
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.1, 4.5);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 10.2, 4);
    adminCenter.add(mast);

    // B. Central 5G Massive MIMO gNodeB Rooftop Lattice Mast
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, 8.2, 0); // Atop Main Block roof

    // Lattice Tower Structure
    const towerHeight = 16;
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.3
    });

    // 4 Corner Legs with taper
    const legGeo = new THREE.CylinderGeometry(0.08, 0.18, towerHeight);
    const legPositions = [
      [-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]
    ];
    legPositions.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, towerMat);
      leg.position.set(lx * 0.6, towerHeight / 2, lz * 0.6);
      towerGroup.add(leg);
    });

    // Cross-braces
    const braceGeo = new THREE.BoxGeometry(1.8, 0.08, 0.08);
    for (let by = 2; by <= towerHeight - 1; by += 2.5) {
      const brace1 = new THREE.Mesh(braceGeo, towerMat);
      brace1.position.set(0, by, 0.7);
      towerGroup.add(brace1);

      const brace2 = new THREE.Mesh(braceGeo, towerMat);
      brace2.position.set(0, by, -0.7);
      towerGroup.add(brace2);
    }

    // Top Antenna Platform & 3 Sectorized Massive MIMO Panel Antennas
    const platGeo = new THREE.CylinderGeometry(1.8, 1.6, 0.3, 8);
    const platMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = towerHeight;
    towerGroup.add(plat);

    // 3 Sectoral 64T64R Antenna Panels (120° apart)
    const panelGeo = new THREE.BoxGeometry(0.6, 2.2, 0.2);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.3
    });

    for (let a = 0; a < 3; a++) {
      const angle = (a * Math.PI * 2) / 3;
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(Math.sin(angle) * 1.5, towerHeight + 1.2, Math.cos(angle) * 1.5);
      panel.rotation.y = angle;
      towerGroup.add(panel);
    }

    // Top Pulsing Red Aviation Warning Beacon Light
    const beaconGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xff0000,
      emissiveIntensity: 2.0
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = towerHeight + 2.8;
    towerGroup.add(beacon);

    adminCenter.add(towerGroup);

    // C. Expanding Holographic Electromagnetic Wave Rings (5G Propagation)
    const waveGroup = new THREE.Group();
    waveGroupRef.current = waveGroup;
    scene.add(waveGroup);

    const waveRings: THREE.Mesh[] = [];
    const ringGeo = new THREE.RingGeometry(1, 1.6, 48);
    for (let r = 0; r < 5; r++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 8.2 + towerHeight + 1.5, 0);
      ring.scale.set(1 + r * 6, 1 + r * 6, 1 + r * 6);
      waveGroup.add(ring);
      waveRings.push(ring);
    }

    // D. 3D Ray-Traced Massive MIMO Beamforming Beams to Buildings
    const beamGroup = new THREE.Group();
    beamGroupRef.current = beamGroup;
    scene.add(beamGroup);

    const beamTargets = [
      { id: 'cyber-001', pos: new THREE.Vector3(-20, 7, -15), color: 0x38bdf8 },
      { id: 'lib-001', pos: new THREE.Vector3(-10, 5, 12), color: 0x34d399 },
      { id: 'cafe-001', pos: new THREE.Vector3(14, 3, 16), color: 0xf59e0b },
      { id: 'mech-001', pos: new THREE.Vector3(18, 5, -8), color: 0x818cf8 },
      { id: 'sports-001', pos: new THREE.Vector3(26, 1.5, -18), color: 0x10b981 }
    ];

    const towerApex = new THREE.Vector3(0, 8.2 + towerHeight + 1.5, 0);

    beamTargets.forEach((bt) => {
      // Create cylinder beam connecting tower to target
      const distance = towerApex.distanceTo(bt.pos);
      const cylinderGeo = new THREE.CylinderGeometry(0.12, 0.45, distance, 12);
      const cylinderMat = new THREE.MeshBasicMaterial({
        color: bt.color,
        transparent: true,
        opacity: 0.45,
        wireframe: false
      });
      const beam = new THREE.Mesh(cylinderGeo, cylinderMat);
      
      // Orient beam from tower to target
      const midpoint = new THREE.Vector3().addVectors(towerApex, bt.pos).multiplyScalar(0.5);
      beam.position.copy(midpoint);
      beam.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(bt.pos, towerApex).normalize()
      );
      beamGroup.add(beam);

      // Add energy pulse particle traveling along beam
      const pulseGeo = new THREE.SphereGeometry(0.35, 10, 10);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.userData = { start: towerApex.clone(), end: bt.pos.clone(), progress: Math.random() };
      beamGroup.add(pulse);
    });

    // E. Cyber Block (CSE/IT Complex) — High-tech modern glass building
    createCollegiateBlock('cyber-001', 'Cyber Block (CSE/IT)', 12, 14, 11, -20, -15, 0x0f172a, 0x00f0ff, true);

    // F. Hitech Block (Central Digital Library) — Glass central atrium
    const lib = createCollegiateBlock('lib-001', 'Hitech Block (Library)', 15, 9, 13, -10, 12, 0x1e293b, 0x38bdf8, true);
    // Add glass dome to Library
    const domeGeo = new THREE.SphereGeometry(3.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 9.2, 0);
    lib.add(dome);

    // G. Main Canteen — Pavilion with swooping curved canopy
    const cafe = createCollegiateBlock('cafe-001', 'Main Canteen', 13, 5, 11, 14, 16, 0x334155, 0xfacc15, false);
    // Canopy roof
    const canopyGeo = new THREE.CylinderGeometry(8, 8, 0.4, 16, 1, false, 0, Math.PI);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 5.4, 0);
    canopy.rotation.z = Math.PI;
    cafe.add(canopy);

    // H. Mechanical Block — Industrial saw-tooth gabled workshops
    createCollegiateBlock('mech-001', 'Mechanical Block', 16, 7, 10, 18, -8, 0x475569, 0x94a3b8, true);

    // I. Chemical Block
    createCollegiateBlock('chem-001', 'Chemical Block', 12, 8, 9, 22, 6, 0x1e293b, 0x22c55e, true);

    // J. Civil Workshop
    createCollegiateBlock('civil-001', 'Civil Workshop', 14, 6, 9, 10, -22, 0x334155, 0x38bdf8, false);

    // K. Sports Complex / Cricket Ground
    const cricketGroup = new THREE.Group();
    cricketGroup.name = 'sports-001';
    cricketGroup.position.set(26, 0.04, -18);

    // Oval grass turf
    const turfGeo = new THREE.CylinderGeometry(15, 15, 0.1, 32);
    const turfMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const turf = new THREE.Mesh(turfGeo, turfMat);
    cricketGroup.add(turf);

    // Pitch rectangle
    const pitchGeo = new THREE.BoxGeometry(2.2, 0.12, 6.5);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = 0.05;
    cricketGroup.add(pitch);

    // Boundary rope ring
    const ropeGeo = new THREE.TorusGeometry(14, 0.15, 8, 36);
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.1;
    cricketGroup.add(rope);

    // 4 Tall Stadium Floodlight Masts
    const lightMastGeo = new THREE.CylinderGeometry(0.15, 0.25, 12);
    const lightBankGeo = new THREE.BoxGeometry(1.6, 0.8, 0.3);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let fAngle of [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]) {
      const mastX = Math.cos(fAngle) * 16.5;
      const mastZ = Math.sin(fAngle) * 16.5;

      const smast = new THREE.Mesh(lightMastGeo, towerMat);
      smast.position.set(mastX, 6, mastZ);
      cricketGroup.add(smast);

      const bank = new THREE.Mesh(lightBankGeo, lightMat);
      bank.position.set(mastX, 12, mastZ);
      bank.lookAt(0, 0, 0);
      cricketGroup.add(bank);
    }

    scene.add(cricketGroup);
    buildingMeshes.set('sports-001', cricketGroup);
    turf.userData = { id: 'sports-001', name: 'Cricket Ground', group: cricketGroup };
    interactiveObjects.push(turf);

    // L. Main Campus Gate Archway (NH-16 Entrance)
    const gateGroup = new THREE.Group();
    gateGroup.name = 'gate-main';
    gateGroup.position.set(-35, 0, 0);

    const gatePillarGeo = new THREE.BoxGeometry(1.4, 6, 1.4);
    const gateArchGeo = new THREE.BoxGeometry(9, 1.2, 1.6);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });

    const pLeft = new THREE.Mesh(gatePillarGeo, gateMat);
    pLeft.position.set(0, 3, -3.5);
    const pRight = new THREE.Mesh(gatePillarGeo, gateMat);
    pRight.position.set(0, 3, 3.5);
    const arch = new THREE.Mesh(gateArchGeo, gateMat);
    arch.position.set(0, 6.2, 0);
    arch.rotation.y = Math.PI / 2;

    gateGroup.add(pLeft);
    gateGroup.add(pRight);
    gateGroup.add(arch);
    scene.add(gateGroup);
    buildingMeshes.set('gate-main', gateGroup);
    arch.userData = { id: 'gate-main', name: 'Main Campus Gate', group: gateGroup };
    interactiveObjects.push(arch);

    buildingMeshesRef.current = buildingMeshes;

    // 10. Mouse Raycasting for Interactive Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const bId = hit.userData?.id;
        const bName = hit.userData?.name;

        if (bId) {
          const loc = CAMPUS_LOCATIONS.find((l) => l.id === bId);
          setHoveredBuilding({
            id: bId,
            name: bName || loc?.name || 'Campus Block',
            speed: loc?.speed || '820 Mbps',
            signalQuality: loc?.signalQuality || 'Optimal',
            carrier: loc?.carrier || 'Jio True 5G',
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });

          // Show wireframe on hit group
          const grp = hit.userData?.group as THREE.Group | undefined;
          if (grp) {
            const wire = grp.getObjectByName(`${bId}-wireframe`) as THREE.Mesh | undefined;
            if (wire && wire.material) (wire.material as THREE.MeshBasicMaterial).visible = true;
          }
          return;
        }
      }

      // Clear wireframes
      buildingMeshes.forEach((grp, id) => {
        const wire = grp.getObjectByName(`${id}-wireframe`) as THREE.Mesh | undefined;
        if (wire && wire.material) (wire.material as THREE.MeshBasicMaterial).visible = false;
      });
      setHoveredBuilding(null);
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const bId = hit.userData?.id;
        if (bId) {
          onSelectBuilding?.(bId);
          const grp = hit.userData?.group as THREE.Group | undefined;
          if (grp) {
            const targetPos = grp.position.clone().add(new THREE.Vector3(12, 10, 14));
            transitionCameraTo(targetPos, grp.position.clone().add(new THREE.Vector3(0, 3, 0)));
          }
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update OrbitControls
      controls.update();

      // Pulsing Beacon Light on Tower Mast
      beaconMat.emissiveIntensity = 1.0 + Math.sin(elapsedTime * 6) * 1.0;

      // Animate Expanding Wave Rings
      waveRings.forEach((ring, idx) => {
        const phase = (elapsedTime * 0.8 + idx * 0.4) % 2.5;
        const scale = 1 + phase * 18;
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.6 - phase / 2.5);
      });

      // Animate Beam Pulse Particles traveling to buildings
      beamGroup.children.forEach((child) => {
        if (child.userData?.start && child.userData?.end) {
          child.userData.progress = (child.userData.progress + 0.02) % 1;
          child.position.lerpVectors(child.userData.start, child.userData.end, child.userData.progress);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectBuilding, transitionCameraTo, autoRotate]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950 font-sans">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Telemetry HUD Toolbar (Top Center) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Left: View Presets Pills */}
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 p-1 rounded-2xl shadow-xl pointer-events-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: '🏛️ Overview' },
            { id: 'tower', label: '📡 5G Mast' },
            { id: 'cyber', label: '💻 Cyber Block' },
            { id: 'library', label: '📚 Library' },
            { id: 'sports', label: '🏏 Sports' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset.id as any)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePreset === preset.id
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Layer Toggles & Mode */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 p-1 rounded-2xl shadow-xl pointer-events-auto">
          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              autoRotate ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title={autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          >
            <span className="material-symbols-outlined text-[15px]">360</span>
          </button>

          {/* Toggle Beams */}
          <button
            onClick={() => setShowBeams(!showBeams)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              showBeams ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle 5G Beamforming Rays"
          >
            <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
          </button>

          {/* Toggle EM Wave Rings */}
          <button
            onClick={() => setShowWaves(!showWaves)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              showWaves ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Electromagnetic Radiation Waves"
          >
            <span className="material-symbols-outlined text-[15px]">sensors</span>
          </button>

          {/* Toggle Holographic Wireframe */}
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              wireframeMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Hologram Wireframe Mode"
          >
            <span className="material-symbols-outlined text-[15px]">grid_4x4</span>
          </button>

          {/* Fullscreen Expand/Collapse */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Collapse PIP' : 'Expand Fullscreen'}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Raycast Building Tooltip Tag */}
      {hoveredBuilding && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${hoveredBuilding.x}px`, top: `${hoveredBuilding.y}px` }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-sky-400/50 rounded-2xl p-2.5 shadow-2xl min-w-44 text-left">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-white truncate">{hoveredBuilding.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Throughput:</span>
              <span className="text-sky-400 font-bold">{hoveredBuilding.speed}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Signal:</span>
              <span className="text-emerald-400 font-semibold">{hoveredBuilding.signalQuality}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-slate-800 text-[9px] text-slate-400 font-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px] text-amber-400">touch_app</span>
              Click building to focus camera
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 text-[10px] font-mono">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-slate-300 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>RVRJC 5G Massive MIMO Digital Twin • 64T64R Beamforming</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-slate-400 pointer-events-auto">
          <span>Drag to orbit • Scroll to zoom • Right-click to pan</span>
        </div>
      </div>
    </div>
  );
};
