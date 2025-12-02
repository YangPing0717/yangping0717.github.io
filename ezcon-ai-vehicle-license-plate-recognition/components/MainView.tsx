import React, { useState, useEffect, useMemo } from 'react';
import { Camera, LayoutType } from '../types';
import { Circle, Scan, ArrowRight, Check } from 'lucide-react';
import LayoutSelector from './LayoutSelector';
import EventDrawer from './EventDrawer';

interface MainViewProps {
  cameras: Camera[];
  selectedCameraId: string;
  onSelectCamera: (id: string) => void;
  layout: LayoutType;
  setLayout: (l: LayoutType) => void;
}

// Helper component for individual camera feeds
const VideoCell: React.FC<{ 
  camera?: Camera; 
  isMain?: boolean; 
  className?: string; 
  showDetails?: boolean;
  onDropCamera?: (cameraId: string) => void;
  onClick?: () => void;
}> = ({ camera, isMain = false, className = "", showDetails = true, onDropCamera, onClick }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // State for Gate Button Animation: 'idle' | 'success'
  const [gateState, setGateState] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
      setCurrentTime(`${timeStr}.${ms}`);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const cameraId = e.dataTransfer.getData('text/plain');
    if (cameraId && onDropCamera) {
      onDropCamera(cameraId);
    }
  };

  const handleGateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gateState === 'success') return;

    // Trigger Animation
    setGateState('success');

    // Reset after 2 seconds
    setTimeout(() => {
        setGateState('idle');
    }, 2000);
  };

  if (!camera) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-black relative flex items-center justify-center border border-slate-800 ${isDragOver ? 'border-2 border-cyan-400' : ''} ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-slate-600">
          <Scan size={32} className="opacity-50" />
          <span className="font-mono text-sm tracking-widest">NO SIGNAL</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      className={`relative bg-black group overflow-hidden border border-slate-900 transition-colors cursor-pointer ${isDragOver ? 'border-2 border-cyan-400 z-50' : 'hover:border-slate-700'} ${className}`}
    >
      {/* Video Content Layer */}
      <div className="w-full h-full relative">
        <img 
          src={camera.thumbnailUrl} 
          alt={camera.name} 
          className="w-full h-full object-cover grayscale-[20%] contrast-[115%] brightness-[90%]"
        />
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10"></div>
      </div>

      {/* Fake License Plate Detection Box - Only on Main */}
      {isMain && camera.status !== 'offline' && (
        <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-24 sm:w-64 sm:h-32 z-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
             <div className="w-full h-[1px] bg-green-500/50"></div>
             <div className="h-full w-[1px] bg-green-500/50 absolute"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      )}

      {/* Video HUD Info - Top Left */}
      <div className="absolute top-2 left-2 sm:top-6 sm:left-6 flex flex-col gap-1 z-30 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 bg-black/60 border border-white/10 px-2 py-1 sm:px-4 sm:py-2 rounded backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-white font-mono font-bold tracking-widest text-xs sm:text-lg truncate max-w-[150px] sm:max-w-none shadow-black drop-shadow-md">{camera.name}</span>
            {isMain && <span className="text-[8px] sm:text-[10px] text-green-400 font-mono tracking-wider">CAM_ID: {camera.id.toUpperCase()}</span>}
          </div>
          {camera.status === 'recording' && <Circle size={8} className="fill-red-500 text-red-500 animate-pulse" />}
          {camera.status === 'offline' && <Circle size={8} className="fill-gray-500 text-gray-500" />}
        </div>
      </div>

      {/* Video HUD Info - Top Right (Time) */}
      <div className="absolute top-2 right-12 sm:top-6 sm:right-6 z-30 pointer-events-none">
          <div className="bg-black/60 border border-white/10 px-2 py-1 sm:px-4 sm:py-2 rounded backdrop-blur-md flex flex-col items-end">
             <span className="text-green-400 font-mono text-sm sm:text-xl font-bold tracking-widest shadow-black drop-shadow-md">{currentTime.split(' ')[0]}</span>
             {isMain && <span className="text-white/50 text-[8px] sm:text-xs font-mono">29.97 FPS</span>}
          </div>
      </div>

      {/* Open Gate Button - Animated Feedback */}
      {camera.status !== 'offline' && (
        <button 
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center gap-1 
            border-l border-t border-b border-white/20 text-white 
            py-4 px-1 sm:px-2 rounded-l-xl shadow-xl shadow-black/50 transition-all duration-300
            ${gateState === 'success' 
                ? 'bg-green-600 w-12 sm:w-14' 
                : 'bg-blue-600 w-8 sm:w-12 hover:bg-blue-500 hover:w-14'
            } 
            active:scale-95 group/btn`}
          onClick={handleGateClick}
          title={gateState === 'success' ? '已開啟' : '開啟閘門'}
        >
          <div className={`bg-white/20 p-1 sm:p-1.5 rounded-full transition-transform duration-500 ${gateState === 'success' ? 'rotate-[360deg] scale-110 bg-green-500/50' : 'group-hover/btn:rotate-[-90deg]'}`}>
             {gateState === 'success' 
               ? <Check size={14} className="sm:w-5 sm:h-5 text-white" />
               : <ArrowRight size={14} className="sm:w-5 sm:h-5" />
             }
          </div>
          <span className={`text-[10px] sm:text-xs font-bold tracking-wider writing-vertical-rl transition-all duration-300 ${gateState === 'success' ? 'text-white' : ''}`}>
             {gateState === 'success' ? '開啟' : '開閘'}
          </span>
        </button>
      )}

      {/* Plate Recognition Result Overlay - Only on Main and if showDetails is true */}
      {isMain && showDetails && camera.status !== 'offline' && (
         <div className="absolute bottom-4 left-4 sm:bottom-32 sm:left-8 z-30 flex items-end gap-4 pointer-events-none origin-bottom-left scale-75 sm:scale-100">
             <div className="bg-slate-900/90 border border-cyan-500/50 p-1 rounded-lg backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden">
                <div className="bg-black/50 p-4 border border-cyan-500/20 rounded flex flex-col gap-2 min-w-[280px]">
                   <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-1">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Scan size={16} />
                        <span className="text-xs font-bold tracking-widest uppercase">Recognition</span>
                      </div>
                      <span className="text-[10px] text-green-400 bg-green-400/10 px-1 rounded animate-pulse">LIVE</span>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <span className="text-slate-400 text-xs">License Plate</span>
                     <span className="text-green-400 text-xs font-mono">98.4% Match</span>
                   </div>
                   <div className="bg-black border-2 border-white/20 px-4 py-2 rounded text-center relative overflow-hidden">
                      <h1 className="text-5xl font-mono font-bold text-white tracking-[0.2em] relative z-10 text-shadow-glow">
                          1TKV 53
                      </h1>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
                   </div>
                </div>
             </div>
         </div>
      )}
    </div>
  );
};

const MainView: React.FC<MainViewProps> = ({ cameras, selectedCameraId, onSelectCamera, layout, setLayout }) => {
  // Store manual overrides for slot positions: { [slotIndex]: cameraId }
  const [overriddenSlots, setOverriddenSlots] = useState<Record<number, string>>({});
  
  // State for the event drawer
  const [activeDrawerCameraId, setActiveDrawerCameraId] = useState<string | null>(null);

  const resolveCamera = (index: number) => {
    if (index === 0) {
      return cameras.find(c => c.id === selectedCameraId);
    }

    if (overriddenSlots[index]) {
      return cameras.find(c => c.id === overriddenSlots[index]);
    }

    const others = cameras.filter(c => c.id !== selectedCameraId);
    return others[index - 1]; 
  };

  const handleCameraDrop = (index: number, cameraId: string) => {
    if (index === 0) {
      onSelectCamera(cameraId);
    } else {
      setOverriddenSlots(prev => ({
        ...prev,
        [index]: cameraId
      }));
    }
  };

  // When a video cell is clicked
  const handleCellClick = (camera?: Camera) => {
    if (camera) {
      setActiveDrawerCameraId(camera.id);
    }
  };

  const renderCell = (index: number, className: string = "", isMainOverride: boolean = false, showDetails: boolean = true) => {
    const camera = resolveCamera(index);
    return (
      <VideoCell 
        camera={camera} 
        className={className} 
        isMain={index === 0 || isMainOverride} 
        showDetails={showDetails}
        onDropCamera={(id) => handleCameraDrop(index, id)}
        onClick={() => handleCellClick(camera)}
      />
    );
  };

  const renderLayout = () => {
    switch (layout) {
      case 'Single':
        return (
          <div className="w-full h-full">
            {renderCell(0, "w-full h-full", true, true)}
          </div>
        );
      
      case 'Split 2':
        return (
          <div className="grid grid-cols-2 w-full h-full gap-1 bg-slate-900 p-0.5">
            {renderCell(0, "", true, false)}
            {renderCell(1, "", false, false)}
          </div>
        );

      case 'Split 4':
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 bg-slate-900 p-0.5">
            {renderCell(0, "", false, false)}
            {renderCell(1, "", false, false)}
            {renderCell(2, "", false, false)}
            {renderCell(3, "", false, false)}
          </div>
        );

      case 'Split 2 PIP':
        return (
          <div className="flex w-full h-full gap-1 bg-slate-900 p-0.5">
             <div className="w-3/4 h-full relative">
                {renderCell(0, "w-full h-full", true, true)}
             </div>
             <div className="w-1/4 h-full flex flex-col gap-1">
                {renderCell(1, "h-1/3 w-full", false, false)}
                <div className="flex-1 bg-slate-950/50 flex items-center justify-center text-slate-700 text-xs">NO SIGNAL</div>
                <div className="flex-1 bg-slate-950/50 flex items-center justify-center text-slate-700 text-xs">NO SIGNAL</div>
             </div>
          </div>
        );

      case 'L1R2':
        return (
          <div className="flex w-full h-full gap-1 bg-slate-900 p-0.5">
             <div className="w-2/3 h-full">
                {renderCell(0, "w-full h-full", true, true)}
             </div>
             <div className="w-1/3 h-full flex flex-col gap-1">
                {renderCell(1, "h-1/2 w-full", false, false)}
                {renderCell(2, "h-1/2 w-full", false, false)}
             </div>
          </div>
        );

      case 'L1R3':
        return (
          <div className="flex w-full h-full gap-1 bg-slate-900 p-0.5">
             <div className="w-2/3 h-full">
                {renderCell(0, "w-full h-full", true, true)}
             </div>
             <div className="w-1/3 h-full flex flex-col gap-1">
                {renderCell(1, "h-1/3 w-full", false, false)}
                {renderCell(2, "h-1/3 w-full", false, false)}
                {renderCell(3, "h-1/3 w-full", false, false)}
             </div>
          </div>
        );

      case 'Big4':
        return (
          <div className="flex flex-col w-full h-full gap-1 bg-slate-900 p-0.5">
             <div className="h-2/3 w-full">
                {renderCell(0, "w-full h-full", true, true)}
             </div>
             <div className="h-1/3 w-full flex gap-1">
                {renderCell(1, "w-1/3 h-full", false, false)}
                {renderCell(2, "w-1/3 h-full", false, false)}
                {renderCell(3, "w-1/3 h-full", false, false)}
             </div>
          </div>
        );

      case 'PIP LT':
      case 'PIP LB':
      case 'PIP RT':
      case 'PIP RB':
      case 'PIP RB2':
        // Determine position based on type
        let posClass = "";
        if (layout === 'PIP LT') posClass = "top-4 left-4";
        if (layout === 'PIP LB') posClass = "bottom-20 left-4"; 
        if (layout === 'PIP RT') posClass = "top-20 right-4";
        if (layout === 'PIP RB' || layout === 'PIP RB2') posClass = "bottom-32 right-6";

        return (
          <div className="w-full h-full relative">
             {renderCell(0, "w-full h-full", true, true)}
             <div className={`absolute ${posClass} w-1/4 h-1/4 border-2 border-slate-700 shadow-2xl z-40`}>
                {renderCell(1, "w-full h-full", false, false)}
             </div>
          </div>
        );

      default:
        return (
           <div className="w-full h-full">
            {renderCell(0, "w-full h-full", true, true)}
          </div>
        );
    }
  };

  const activeDrawerCamera = cameras.find(c => c.id === activeDrawerCameraId) || null;

  return (
    <main className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
      {renderLayout()}
      
      {/* Event Drawer */}
      <EventDrawer 
        isOpen={!!activeDrawerCameraId} 
        onClose={() => setActiveDrawerCameraId(null)}
        camera={activeDrawerCamera}
      />

      {/* Floating Controls Layer */}
      <LayoutSelector currentLayout={layout} onLayoutChange={setLayout} />
      
      <style>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(34,211,238,0.3);
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .writing-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </main>
  );
};

export default MainView;