import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLOBAL_SIGNAL_TOWERS, GLOBAL_SIGNAL_LINKS } from '../../data/globalNetworkData';

interface GlobalNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  type: string;
  category: 'village' | 'mandal' | 'city' | 'global';
  throughput: string;
  latencyToRVRJC: string;
  isOrigin?: boolean;
}

interface WorldwideSignalGlobeProps {
  onClose: () => void;
  onFocusCampus: () => void;
}

// Global Network Hubs dataset derived dynamically from centralized data
const GLOBAL_NODES: GlobalNode[] = GLOBAL_SIGNAL_TOWERS.map((t) => ({
  id: t.id,
  name: t.name,
  city: t.city,
  country: t.country,
  lat: t.coordinates[1],
  lon: t.coordinates[0],
  type: t.type,
  category: t.category,
  throughput: t.throughput,
  latencyToRVRJC: t.latencyToRVRJC,
  isOrigin: t.isOrigin
}));

// Intercontinental and Regional Link Pairs
const GLOBAL_CONNECTIONS: [string, string][] = GLOBAL_SIGNAL_LINKS.map((l) => [l.fromId, l.toId]);

export const WorldwideSignalGlobe = ({ onClose, onFocusCampus }: WorldwideSignalGlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GlobalNode | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [activeRegion, setActiveRegion] = useState<'all' | 'ap_villages' | 'ap_corridor' | 'asia' | 'europe' | 'americas' | 'rvrjc'>('all');

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridMeshRef = useRef<THREE.Group | null>(null);
  const beamsGroupRef = useRef<THREE.Group | null>(null);

  // Spherical Coordinates Converter
  const latLonToVector3 = useCallback((lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }, []);

  // Camera Fly Transition
  const transitionCameraTo = useCallback((pos: THREE.Vector3, lookAt: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let progress = 0;

    const animateTransition = () => {
      progress += 0.04;
      if (progress < 1) {
        camera.position.lerpVectors(startPos, pos, progress);
        controls.target.lerpVectors(startTarget, lookAt, progress);
        controls.update();
        requestAnimationFrame(animateTransition);
      } else {
        camera.position.copy(pos);
        controls.target.copy(lookAt);
        controls.update();
      }
    };
    animateTransition();
  }, []);

  const handleRegionView = (region: 'all' | 'ap_villages' | 'ap_corridor' | 'asia' | 'europe' | 'americas' | 'rvrjc') => {
    setActiveRegion(region);
    if (region === 'all') {
      transitionCameraTo(new THREE.Vector3(0, 18, 48), new THREE.Vector3(0, 0, 0));
    } else if (region === 'europe') {
      // Perspective matching the user's uploaded image (angled look over Europe/Mediterranean)
      transitionCameraTo(new THREE.Vector3(12, 28, 22), new THREE.Vector3(4, 14, 10));
    } else if (region === 'asia') {
      transitionCameraTo(new THREE.Vector3(34, 16, 26), new THREE.Vector3(16, 6, 8));
    } else if (region === 'americas') {
      transitionCameraTo(new THREE.Vector3(-38, 18, 20), new THREE.Vector3(-14, 8, 4));
    } else if (region === 'ap_villages') {
      // Close aerial view directly focused on local villages around Chowdavaram, Chebrolu, Nallapadu, Perecherla
      const vPos = latLonToVector3(16.27, 80.38, 20);
      const camPos = vPos.clone().normalize().multiplyScalar(24);
      transitionCameraTo(camPos, vPos);
    } else if (region === 'ap_corridor') {
      // Focused regional aerial view of Guntur - Vijayawada - Amaravati 5G Corridor
      const gPos = latLonToVector3(16.38, 80.52, 20);
      const camPos = gPos.clone().normalize().multiplyScalar(27);
      transitionCameraTo(camPos, gPos);
    } else if (region === 'rvrjc') {
      const rPos = latLonToVector3(16.2551, 80.3240, 20);
      const camPos = rPos.clone().normalize().multiplyScalar(32);
      transitionCameraTo(camPos, rPos);
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 0.6;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (gridMeshRef.current) {
      gridMeshRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    if (beamsGroupRef.current) {
      beamsGroupRef.current.visible = showBeams;
    }
  }, [showBeams]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020409);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // Camera placed in orbital angle matching user's reference
    camera.position.set(14, 26, 32);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 22;
    controls.maxDistance = 90;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(60, 40, 50);
    scene.add(sunLight);

    const globeRadius = 18;

    // 1. Earth Sphere with Night Lights Texture
    const textureLoader = new THREE.TextureLoader();
    const earthLightsTexture = textureLoader.load('/images/planet/earth_lights.png');
    const earthColorTexture = textureLoader.load('/images/planet/earth_atmos.jpg');

    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthColorTexture,
      roughness: 0.85,
      metalness: 0.15,
      emissiveMap: earthLightsTexture,
      emissive: new THREE.Color(0xfff1aa),
      emissiveIntensity: 1.6
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // 2. Glowing Blue Atmospheric Rim / Horizon Limb Glow (matching user screenshot)
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.025, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // Outer faint atmospheric glow ring
    const outerAtmosGeo = new THREE.SphereGeometry(globeRadius * 1.08, 48, 48);
    const outerAtmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(0.02, 0.45, 0.95, 0.8) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const outerAtmosMesh = new THREE.Mesh(outerAtmosGeo, outerAtmosMat);
    scene.add(outerAtmosMesh);

    // 3. Coordinate Graticule Grid Lines (Lat/Lon) - matching screenshot cyan grid
    const graticuleGroup = new THREE.Group();
    gridMeshRef.current = graticuleGroup;
    const gridLineMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.22
    });

    // Latitude circles
    for (let lat = -80; lat <= 80; lat += 20) {
      const latRadius = globeRadius * Math.cos((lat * Math.PI) / 180) * 1.002;
      const latY = globeRadius * Math.sin((lat * Math.PI) / 180) * 1.002;
      const circleGeo = new THREE.BufferGeometry();
      const circlePts: THREE.Vector3[] = [];
      for (let a = 0; a <= Math.PI * 2; a += Math.PI / 36) {
        circlePts.push(new THREE.Vector3(Math.cos(a) * latRadius, latY, Math.sin(a) * latRadius));
      }
      circleGeo.setFromPoints(circlePts);
      const circleLine = new THREE.Line(circleGeo, gridLineMat);
      graticuleGroup.add(circleLine);
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      const lonGeo = new THREE.BufferGeometry();
      const lonPts: THREE.Vector3[] = [];
      const radLon = (lon * Math.PI) / 180;
      for (let lat = -90; lat <= 90; lat += 5) {
        const radLat = (lat * Math.PI) / 180;
        const x = globeRadius * 1.002 * Math.cos(radLat) * Math.sin(radLon);
        const y = globeRadius * 1.002 * Math.sin(radLat);
        const z = globeRadius * 1.002 * Math.cos(radLat) * Math.cos(radLon);
        lonPts.push(new THREE.Vector3(x, y, z));
      }
      lonGeo.setFromPoints(lonPts);
      const lonLine = new THREE.Line(lonGeo, gridLineMat);
      graticuleGroup.add(lonLine);
    }
    scene.add(graticuleGroup);

    // 4. Global Signal Towers Markers
    const interactiveTowers: THREE.Object3D[] = [];
    const towerPointsMap = new Map<string, THREE.Vector3>();

    GLOBAL_NODES.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, globeRadius * 1.003);
      towerPointsMap.set(node.id, pos);

      const towerGrp = new THREE.Group();
      towerGrp.position.copy(pos);

      // Align marker normal to surface
      towerGrp.lookAt(pos.clone().multiplyScalar(2));

      // Core point styled by category
      const isRVRJC = node.isOrigin || node.id.includes('rvrjc');
      const coreColor = isRVRJC
        ? 0x00f0ff
        : node.category === 'village'
        ? 0x34d399
        : node.category === 'mandal'
        ? 0x38bdf8
        : node.category === 'city'
        ? 0x818cf8
        : 0xf43f5e;

      const radiusSize = isRVRJC
        ? 0.42
        : node.category === 'village'
        ? 0.16
        : node.category === 'mandal'
        ? 0.22
        : 0.3;

      const coreGeo = new THREE.SphereGeometry(radiusSize, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({ color: coreColor });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      towerGrp.add(coreMesh);

      // Radar Beacon Wave Ring (Shown for mandals, cities, global hubs, and RVRJC)
      if (node.category !== 'village' || isRVRJC) {
        const ringGeo = new THREE.RingGeometry(radiusSize * 1.3, radiusSize * 2.4, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: coreColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.userData = { isBeacon: true, phase: Math.random() };
        towerGrp.add(ringMesh);
      }

      // Raycast collision target
      const hitGeo = new THREE.SphereGeometry(isRVRJC ? 1.4 : node.category === 'village' ? 0.7 : 1.0, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { nodeData: node };
      towerGrp.add(hitMesh);
      interactiveTowers.push(hitMesh);

      scene.add(towerGrp);
    });

    // 5. 3D Parabolic Curved Great-Circle Beams with Traveling Photons
    const beamsGroup = new THREE.Group();
    beamsGroupRef.current = beamsGroup;
    scene.add(beamsGroup);

    const beamCurves: { curve: THREE.QuadraticBezierCurve3; pulseMesh: THREE.Mesh; reversePulseMesh: THREE.Mesh }[] = [];

    GLOBAL_CONNECTIONS.forEach(([idA, idB], cIdx) => {
      const vA = towerPointsMap.get(idA);
      const vB = towerPointsMap.get(idB);
      if (!vA || !vB) return;

      const dist = vA.distanceTo(vB);
      const mid = new THREE.Vector3().addVectors(vA, vB).multiplyScalar(0.5);
      // Lift the arc above Earth curvature
      const arcHeight = Math.min(dist * 0.28, globeRadius * 0.4);
      mid.normalize().multiplyScalar(globeRadius + arcHeight);

      const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
      const pts = curve.getPoints(48);

      // Arc beam line geometry
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const isRVRJCLink = idA.includes('rvrjc') || idB.includes('rvrjc');
      const beamColor = isRVRJCLink ? 0x00f0ff : cIdx % 3 === 0 ? 0x10b981 : cIdx % 3 === 1 ? 0x38bdf8 : 0x818cf8;

      const lineMat = new THREE.LineBasicMaterial({
        color: beamColor,
        transparent: true,
        opacity: isRVRJCLink ? 0.85 : 0.45,
        linewidth: 2
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      beamsGroup.add(beamLine);

      // Glowing traveling photon / signal packet (Forward direction)
      const pulseGeo = new THREE.SphereGeometry(0.22, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.userData = { progress: (cIdx * 0.12) % 1, speed: 0.005 + (cIdx % 4) * 0.001 };
      beamsGroup.add(pulseMesh);

      // Glowing traveling photon (Reverse direction)
      const rPulseGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const rPulseMat = new THREE.MeshBasicMaterial({ color: beamColor });
      const rPulseMesh = new THREE.Mesh(rPulseGeo, rPulseMat);
      rPulseMesh.userData = { progress: (1 - (cIdx * 0.12) % 1), speed: 0.004 + (cIdx % 3) * 0.0015 };
      beamsGroup.add(rPulseMesh);

      beamCurves.push({ curve, pulseMesh, reversePulseMesh: rPulseMesh });
    });

    // 6. Deep Space Background Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 180 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 7. Raycasting for Tower Inspection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveTowers);
      if (hits.length > 0) {
        const node: GlobalNode = hits[0].object.userData.nodeData;
        setHoveredNode(node);
        setHoverPos({ x: e.clientX, y: e.clientY });
        return;
      }
      setHoveredNode(null);
      setHoverPos(null);
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveTowers);
      if (hits.length > 0) {
        const node: GlobalNode = hits[0].object.userData.nodeData;
        const targetPoint = latLonToVector3(node.lat, node.lon, globeRadius);
        const camTarget = targetPoint.clone().normalize().multiplyScalar(30);
        transitionCameraTo(camTarget, targetPoint);
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      void delta;

      controls.update();

      // Animate Moving Photons along 3D Arcs
      beamCurves.forEach(({ curve, pulseMesh, reversePulseMesh }) => {
        // Forward
        pulseMesh.userData.progress = (pulseMesh.userData.progress + pulseMesh.userData.speed) % 1;
        const ptFwd = curve.getPoint(pulseMesh.userData.progress);
        pulseMesh.position.copy(ptFwd);

        // Reverse
        reversePulseMesh.userData.progress = (reversePulseMesh.userData.progress - reversePulseMesh.userData.speed + 1) % 1;
        const ptRev = curve.getPoint(reversePulseMesh.userData.progress);
        reversePulseMesh.position.copy(ptRev);
      });

      // Animate Radar Beacon Waves on Nodes
      scene.traverse((obj) => {
        if (obj.userData?.isBeacon) {
          obj.userData.phase = (obj.userData.phase + 0.015) % 1;
          const s = 1 + obj.userData.phase * 2.2;
          obj.scale.set(s, s, s);
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = Math.max(0, 0.7 - obj.userData.phase * 0.7);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, latLonToVector3, transitionCameraTo]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020409] select-none font-sans overflow-hidden flex flex-col animate-in fade-in duration-300">
      
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-2xl border border-slate-700/80 p-2.5 px-4 rounded-3xl shadow-2xl pointer-events-auto">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-sky-500/20">
            <span className="material-symbols-outlined text-[20px]">public</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wider uppercase">
                Planetary Signal Mesh &amp; Subsea Fiber Twin
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Live Global Routing • Transatlantic, Transpacific &amp; 5G Core Network
            </p>
          </div>
        </div>

        {/* Center: Camera Presets */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-2xl border border-slate-700/80 p-1.5 rounded-3xl shadow-2xl pointer-events-auto font-mono text-[11px]">
          {[
            { id: 'all', label: '🌐 Global Orbit' },
            { id: 'ap_villages', label: '🌾 AP Villages & Mandals' },
            { id: 'ap_corridor', label: '📍 Guntur - Vijayawada 5G' },
            { id: 'asia', label: '🇮🇳 India & Asia' },
            { id: 'europe', label: '🇪🇺 Europe Mesh' },
            { id: 'americas', label: '🇺🇸 Americas' },
            { id: 'rvrjc', label: '🏛️ RVRJC Focus' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleRegionView(preset.id as any)}
              className={`px-3 py-1.5 rounded-2xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeRegion === preset.id
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Focus RVRJC Campus */}
          <button
            onClick={onFocusCampus}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xl shadow-sky-500/25"
            title="Descend from space down to RVRJC College of Engineering"
          >
            <span className="material-symbols-outlined text-[16px]">location_searching</span>
            <span>Descend to RVRJC</span>
          </button>

          {/* Close / Return Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer shadow-xl"
            title="Exit Globe View"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Floating Hover Tooltip for Global Tower / Teleport */}
      {hoveredNode && hoverPos && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-4 animate-in fade-in duration-100"
          style={{ left: `${hoverPos.x}px`, top: `${hoverPos.y}px` }}
        >
          <div className="bg-slate-950/95 backdrop-blur-2xl border border-sky-400/60 rounded-2xl p-3 shadow-2xl min-w-56 text-left">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
              <span className="text-xs font-black text-white">{hoveredNode.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                hoveredNode.category === 'village'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : hoveredNode.category === 'mandal'
                  ? 'bg-sky-500/20 text-sky-300'
                  : hoveredNode.category === 'city'
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {(hoveredNode.category || hoveredNode.type).toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <div className="mt-1.5 space-y-1 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-bold">{hoveredNode.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backbone Capacity:</span>
                <span className="text-sky-400 font-bold">{hoveredNode.throughput}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latency to RVRJC:</span>
                <span className="text-emerald-400 font-bold">{hoveredNode.latencyToRVRJC}</span>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-slate-400 font-mono flex items-center gap-1 border-t border-slate-800 pt-1">
              <span className="material-symbols-outlined text-[11px] text-sky-400">touch_app</span>
              Click tower to rotate and inspect
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Telemetry Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-mono text-[11px]">
        {/* Left: Global Metrics */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-slate-800/80 text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>42 Planetary Core Teleports</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>50+ Intercontinental Laser Beams</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-sky-400 font-bold">580 Tbps</span>
            <span className="text-slate-400">Transcontinental Traffic</span>
          </div>
        </div>

        {/* Right: Layer Toggles */}
        <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-2xl p-1 rounded-2xl border border-slate-800/80 pointer-events-auto">
          {/* Auto-Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              autoRotate ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Earth Rotation"
          >
            <span className="material-symbols-outlined text-[15px]">360</span>
            <span className="text-[10px]">Rotation</span>
          </button>

          {/* Graticule Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              showGrid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Lat/Lon Graticule Grid"
          >
            <span className="material-symbols-outlined text-[15px]">grid_4x4</span>
            <span className="text-[10px]">Grid</span>
          </button>

          {/* Beams */}
          <button
            onClick={() => setShowBeams(!showBeams)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              showBeams ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Signal Arcs"
          >
            <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
            <span className="text-[10px]">Beams</span>
          </button>
        </div>
      </div>
    </div>
  );
};
