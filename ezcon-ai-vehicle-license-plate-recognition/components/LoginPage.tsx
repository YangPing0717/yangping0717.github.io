import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Animation State
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  
  // Exit Transition State
  const [isExiting, setIsExiting] = useState(false);
  const isExitingRef = useRef(false);
  
  const vantaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // --- VANTA.JS BACKGROUND ---
  useEffect(() => {
    const initVanta = () => {
        if (window.VANTA && vantaRef.current && !vantaEffect.current) {
            vantaEffect.current = window.VANTA.DOTS({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x00ffff,     // Cyan connection lines
                color2: 0x2563eb,    // Blue dots
                backgroundColor: 0x0f172a, // Slate 950
                size: 3.0,
                spacing: 35.00,
                showLines: true
            });
        }
    };

    // Retry init if script loads late
    const interval = setInterval(() => {
        if (window.VANTA && window.VANTA.DOTS) {
            initVanta();
            clearInterval(interval);
        }
    }, 100);

    return () => {
        clearInterval(interval);
        if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  // --- THREE.JS SUPERCAR OVERLAY ---
  useEffect(() => {
    if (!window.THREE || !canvasRef.current) return;
    
    const THREE = window.THREE;
    const container = canvasRef.current;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // No fog needed as Vanta handles background depth
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    container.appendChild(renderer.domElement);

    // --- INTERACTION STATE ---
    let mouseX = 0;
    let mouseY = 0;
    let targetZoom = 1;
    let currentZoom = 1;

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleWheel = (e: WheelEvent) => {
        if (isExitingRef.current) return; 
        const delta = e.deltaY * 0.001;
        targetZoom -= delta;
        targetZoom = Math.max(0.8, Math.min(targetZoom, 2.0)); // Adjusted zoom limits
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: true });

    // --- ASSETS (Procedural Textures) ---
    const createTexture = (drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if(ctx) drawFn(ctx, 128, 128);
        return new THREE.CanvasTexture(canvas);
    };

    const glowTexture = createTexture((ctx, w, h) => {
        const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(0, 102, 255, 0.8)'); 
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)'); 
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    });

    // --- BUILD SCENE ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // HUD / CAR CONTAINER
    const hudGroup = new THREE.Group();
    hudGroup.position.set(0, 2, 0); // Center the car
    mainGroup.add(hudGroup);
    hudGroup.scale.setScalar(2.0);

    // Helper: Create Glowing Ring
    const createRing = (radius: number, thickness: number, color: number, opacity: number) => {
        const geometry = new THREE.RingGeometry(radius, radius + thickness, 128);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        return new THREE.Mesh(geometry, material);
    };

    // Helper: Create Dashed/Segmented Ring
    const createSegmentedRing = (radius: number, segments: number, color: number, opacity: number = 0.4) => {
        const geometry = new THREE.RingGeometry(radius, radius + 0.15, segments, 1, 0, Math.PI * 2);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
             color: color,
             transparent: true,
             opacity: opacity,
             blending: THREE.AdditiveBlending
        });
        return new THREE.LineSegments(edges, material);
    };

    // --- PROCEDURAL COMPLEX WIREFRAME CAR ---
    const createPlexusCar = () => {
        const carGroup = new THREE.Group();

        // Materials
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00ffff, 
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const pointMat = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 0.15, 
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        // Helper to convert mesh geometry to Plexus
        const createPlexusPart = (geometry: any, scaleVec: any, positionVec: any, rotationVec?: any) => {
             const wireframe = new THREE.WireframeGeometry(geometry);
             const lines = new THREE.LineSegments(wireframe, lineMat);
             const points = new THREE.Points(geometry, pointMat);

             const partGroup = new THREE.Group();
             partGroup.add(lines);
             partGroup.add(points);

             partGroup.scale.set(scaleVec.x, scaleVec.y, scaleVec.z);
             partGroup.position.set(positionVec.x, positionVec.y, positionVec.z);
             if (rotationVec) partGroup.rotation.set(rotationVec.x, rotationVec.y, rotationVec.z);
             
             return partGroup;
        };

        // --- FUTURISTIC HYPERCAR CONSTRUCTION ---
        
        // 1. Central Fuselage
        const bodyGeo = new THREE.CylinderGeometry(0.6, 0.8, 4.5, 8, 1);
        bodyGeo.rotateZ(Math.PI / 2); 
        carGroup.add(createPlexusPart(bodyGeo, {x: 1, y: 0.6, z: 1.5}, {x: 0, y: 0.5, z: 0}));

        // 2. Rear Engine Cover / Spine
        const spineGeo = new THREE.ConeGeometry(0.7, 3, 4);
        spineGeo.rotateZ(-Math.PI / 2);
        carGroup.add(createPlexusPart(spineGeo, {x: 1, y: 0.5, z: 1.2}, {x: -1, y: 0.7, z: 0}));

        // 3. Cockpit Canopy
        const cockpitGeo = new THREE.SphereGeometry(0.7, 8, 8);
        carGroup.add(createPlexusPart(cockpitGeo, {x: 1.8, y: 0.6, z: 0.9}, {x: -0.2, y: 0.9, z: 0}));

        // 4. Fenders
        const fenderGeo = new THREE.SphereGeometry(0.8, 6, 6);
        // Front
        carGroup.add(createPlexusPart(fenderGeo, {x: 1.4, y: 0.6, z: 0.8}, {x: 1.5, y: 0.4, z: 1.1}));
        carGroup.add(createPlexusPart(fenderGeo, {x: 1.4, y: 0.6, z: 0.8}, {x: 1.5, y: 0.4, z: -1.1}));
        // Rear
        carGroup.add(createPlexusPart(fenderGeo, {x: 1.6, y: 0.7, z: 0.9}, {x: -1.5, y: 0.5, z: 1.2}));
        carGroup.add(createPlexusPart(fenderGeo, {x: 1.6, y: 0.7, z: 0.9}, {x: -1.5, y: 0.5, z: -1.2}));

        // 5. Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 16, 1);
        wheelGeo.rotateZ(Math.PI/2); 
        const wheelPositions = [
            {x: 1.5, y: 0.35, z: 1.1}, {x: 1.5, y: 0.35, z: -1.1},
            {x: -1.5, y: 0.38, z: 1.2}, {x: -1.5, y: 0.38, z: -1.2}
        ];
        wheelPositions.forEach(pos => {
             carGroup.add(createPlexusPart(wheelGeo, {x: 1, y: 1, z: 1}, pos));
        });

        // 6. Rear Wing
        const wingGeo = new THREE.BoxGeometry(1, 0.1, 3);
        carGroup.add(createPlexusPart(wingGeo, {x: 0.5, y: 1, z: 1}, {x: -2.2, y: 0.8, z: 0}));
        
        return carGroup;
    };

    const carMesh = createPlexusCar();
    carMesh.rotation.y = Math.PI / 1.3; 
    carMesh.rotation.x = Math.PI / 16;
    hudGroup.add(carMesh);

    // --- HUD RINGS ---
    hudGroup.add(createRing(8, 0.3, 0x00ffff, 0.2));
    hudGroup.add(createSegmentedRing(10, 64, 0x0066ff, 0.5));
    hudGroup.add(createSegmentedRing(11, 32, 0x00ffff, 0.3));
    
    // Wireframe Globe (Surrounding the Car)
    const globeGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(6, 2));
    const globeMat = new THREE.LineBasicMaterial({ 
        color: 0x0044aa, 
        transparent: true, 
        opacity: 0.15, 
        blending: THREE.AdditiveBlending 
    });
    const globeMesh = new THREE.LineSegments(globeGeo, globeMat);
    hudGroup.add(globeMesh);

    // Scanning Laser
    const scanGeo = new THREE.PlaneGeometry(30, 0.2);
    const scanMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    scanLine.rotation.z = Math.PI / 4;
    hudGroup.add(scanLine);

    // VOLUMETRIC GLOW SPRITE FOR CAR
    const lightSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x0066ff, 
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.3
    }));
    lightSprite.scale.set(40, 40, 1);
    lightSprite.position.z = -5; 
    hudGroup.add(lightSprite);

    // --- ANIMATION CONTROL ---
    let time = 0;
    let lastTime = performance.now();

    const animate = () => {
        requestAnimationFrame(animate);

        const now = performance.now();
        const delta = (now - lastTime) * 0.001;
        lastTime = now;
        
        const effectiveSpeed = isExitingRef.current ? 5.0 : (isPausedRef.current ? 0 : speedRef.current);
        time += delta * effectiveSpeed;

        if (isExitingRef.current) {
            targetZoom += (20 - currentZoom) * 0.05 * effectiveSpeed;
        }
        currentZoom += (targetZoom - currentZoom) * 0.1;
        
        hudGroup.scale.setScalar(currentZoom * (isExitingRef.current ? 0.1 : 2.0)); 

        // Parallax
        const targetRotX = mouseY * 0.2; 
        const targetRotY = mouseX * 0.2;
        mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;
        mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;

        // Car float
        carMesh.position.y = Math.sin(time * 0.5) * 0.2;
        carMesh.rotation.y = (Math.PI / 1.3) + Math.sin(time * 0.2) * 0.1;

        // Rings
        globeMesh.rotation.y = time * 0.1;
        globeMesh.rotation.z = time * 0.05;
        hudGroup.children[2].rotation.z = time * 0.05; 

        // Scan line
        scanLine.position.y = Math.sin(time) * 8;
        scanLine.material.opacity = (Math.sin(time*10)+1)/2 * 0.5;

        // Pulse
        lightSprite.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;

        renderer.render(scene, camera);
    };

    const isPausedRef = { current: isPaused };
    const speedRef = { current: speedMultiplier };
    
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('wheel', handleWheel);
        if (container && renderer.domElement) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []); 

  // Sync state to refs
  const isPausedRef = useRef(isPaused);
  const speedRef = useRef(speedMultiplier);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedRef.current = speedMultiplier; }, [speedMultiplier]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isExitingRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
        onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center font-sans overflow-hidden bg-slate-950">
      
      {/* Vanta.js Background */}
      <div ref={vantaRef} className="fixed inset-0 z-0"></div>

      {/* Three.js Overlay */}
      <div ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none"></div>

      {/* Vignette Overlay */}
      <div className={`fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] opacity-60 transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-60'}`}></div>

      {/* UI Wrapper */}
      <div className={`z-20 w-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-150 blur-md' : 'opacity-100 scale-100'}`}>

        {/* Logo Section */}
        <div className="mb-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative"> 
            <img 
                src="https://drive.google.com/thumbnail?id=17vNlQGFcNEaqOVzQ8IFl_NzAkATdTjx6&sz=w1200"
                alt="EZ Ai" 
                className="h-24 w-auto min-w-[220px] object-contain mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                referrerPolicy="no-referrer"
            />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">ParkSmart</h1>
            <p className="text-cyan-400 font-bold text-sm mt-2 font-medium tracking-wide drop-shadow-sm">Smart Parking Made Simple</p>
        </div>

        {/* Main Card (Preserving Previous Style) */}
        <div 
            className="backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] w-full max-w-[420px] p-8 relative overflow-hidden animate-in zoom-in-95 duration-500 bg-slate-900/10"
            style={{
                border: '1px solid transparent',
                borderImage: 'linear-gradient(to bottom right, rgba(56, 189, 248, 0.5), rgba(56, 189, 248, 0)) 1'
            }}
        >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

            <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">Welcome</h2>
            <p className="text-slate-300 text-sm mt-1 drop-shadow-sm">Sign in to your account or create a new one</p>
            </div>

            {/* Toggle Switch */}
            <div className="bg-black/40 p-1 rounded-lg flex mb-8 border border-white/10 relative overflow-hidden">
                <div 
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-cyan-600/20 border border-cyan-500/50 rounded-md transition-all duration-300 ease-in-out ${isSignUp ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
                ></div>
                <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 relative z-10 ${
                    !isSignUp 
                        ? 'text-white text-shadow-glow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 relative z-10 ${
                    isSignUp 
                        ? 'text-white text-shadow-glow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                >
                    Sign Up
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider ml-1 drop-shadow-sm">Username</label>
                <div className="relative group">
                    <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 pl-10 transition-all outline-none placeholder-slate-500 backdrop-blur-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                    </div>
                </div>
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider ml-1 drop-shadow-sm">Email</label>
                <div className="relative group">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 pl-10 transition-all outline-none placeholder-slate-500 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Mail size={18} />
                </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider ml-1 drop-shadow-sm">Password</label>
                {!isSignUp && (
                    <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline shadow-black drop-shadow-md">Forgot?</a>
                )}
                </div>
                <div className="relative group">
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 pl-10 pr-10 transition-all outline-none placeholder-slate-500 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Lock size={18} />
                </div>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isExiting}
                className="w-full text-white bg-cyan-600/80 hover:bg-cyan-500/90 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 group transition-all mt-6 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-400/30 backdrop-blur-sm"
            >
                <span>{isExiting ? 'Authenticating...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                <ArrowRight size={16} className={`group-hover:translate-x-1 transition-transform ${isExiting ? 'animate-ping' : ''}`} />
            </button>
            </form>

            <div className="mt-8 border border-white/10 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Demo credentials:</h3>
            <div className="space-y-1">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 min-w-[40px]">Admin:</span>
                    <span>admin@parking.com / any password</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 min-w-[40px]">User:</span>
                    <span>any other email / any password</span>
                </div>
            </div>
            </div>
        </div>

        <div className="mt-8 bg-cyan-900/40 border border-cyan-500/30 backdrop-blur-md text-cyan-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-in fade-in duration-1000 delay-300">
            v2.0
        </div>
        <div className="mt-8 text-slate-400 text-xs font-medium animate-in fade-in duration-1000 delay-500 drop-shadow-md">
            © 2026 EZCON Ai. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;