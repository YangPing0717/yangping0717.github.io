import React, { useState, useRef, useEffect } from 'react';
import { Camera } from '../types';
import { Circle, Activity, Signal, GripVertical, ArrowLeftFromLine } from 'lucide-react';

interface CameraListProps {
  cameras: Camera[];
  selectedCameraId: string;
  onSelectCamera: (id: string) => void;
  isDocked: boolean;
  setDocked: (docked: boolean) => void;
}

const CameraList: React.FC<CameraListProps> = ({ 
  cameras, 
  selectedCameraId, 
  onSelectCamera,
  isDocked,
  setDocked
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if clicking the header/grip area
    isDragging.current = true;
    
    if (isDocked) {
      // If undocking, set initial position to roughly where the mouse is, 
      // but offset so the header is under the cursor
      setDocked(false);
      // We need to calculate where the mouse is relative to the screen to set absolute pos
      // Since we are switching from relative to absolute immediately, 
      // let's set it to a fixed offset from the mouse
      setPosition({ x: e.clientX - 128, y: e.clientY - 20 }); // Center horiz, top vert
    } else {
      // If already floating, calculate offset
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        dragStart.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      // If we are dragging (and thus undocked), update position
      if (!isDocked) {
         // Calculate new position based on mouse minus offset
         // If we just undocked, dragStart might not be set perfectly, 
         // but the logic below works for established drag
         const newX = e.clientX - (dragStart.current.x || 128);
         const newY = e.clientY - (dragStart.current.y || 20);
         
         setPosition({
           x: Math.max(0, Math.min(window.innerWidth - 250, newX)),
           y: Math.max(0, Math.min(window.innerHeight - 100, newY))
         });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      // Reset drag start
      dragStart.current = { x: 0, y: 0 };
    };

    if (!isDocked || isDragging.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDocked]);

  const handleDragStart = (e: React.DragEvent, cameraId: string) => {
    e.dataTransfer.setData('text/plain', cameraId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Styles based on state
  const containerStyle: React.CSSProperties = isDocked 
    ? {} // Default flex styles
    : {
        position: 'absolute',
        left: position.x,
        top: position.y,
        height: '600px', // Fixed height when floating
        zIndex: 50,
      };

  const containerClasses = isDocked
    ? "w-64 bg-slate-900 border-r border-slate-700 flex flex-col overflow-hidden shrink-0 z-10"
    : "w-64 bg-slate-900/95 backdrop-blur-md border border-slate-600 flex flex-col overflow-hidden rounded-xl shadow-2xl";

  return (
    <aside 
      ref={panelRef}
      style={containerStyle}
      className={containerClasses}
    >
      {/* Draggable Header */}
      <div 
        onMouseDown={handleMouseDown}
        className={`
          h-10 border-b border-slate-700 flex items-center justify-between px-3
          ${isDocked ? 'bg-slate-900 cursor-grab active:cursor-grabbing' : 'bg-slate-800 cursor-move'}
          select-none
        `}
      >
        <div className="flex items-center gap-2 text-slate-400">
          <GripVertical size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Camera List</span>
        </div>
        {!isDocked && (
          <button 
            onClick={() => setDocked(true)}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
            title="Dock to sidebar"
          >
            <ArrowLeftFromLine size={16} />
          </button>
        )}
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {cameras.map((camera) => {
          const isSelected = selectedCameraId === camera.id;
          
          return (
            <div 
              key={camera.id}
              onClick={() => onSelectCamera(camera.id)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, camera.id)}
              className={`
                relative p-2 border-b border-slate-700 cursor-pointer group transition-colors
                ${isSelected ? 'bg-blue-900/20' : 'hover:bg-slate-800'}
              `}
            >
              {/* Header Line */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                    {camera.name}
                  </span>
                  {camera.status === 'recording' && (
                    <Circle size={10} className="fill-red-500 text-red-500 animate-pulse" />
                  )}
                  {camera.status === 'idle' && (
                    <Circle size={10} className="fill-green-500 text-green-500" />
                  )}
                  {camera.status === 'offline' && (
                    <Circle size={10} className="fill-gray-500 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden border border-slate-700 group-hover:border-slate-500 transition-colors">
                <img 
                  src={camera.thumbnailUrl} 
                  alt={camera.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[80%] contrast-125"
                />
                
                {/* Fake overlays for realism */}
                <div className="absolute top-1 right-1 flex gap-1">
                  {camera.id === 'cam-003' && <Activity size={12} className="text-green-400" />}
                  {camera.id === 'cam-002' && <Signal size={12} className="text-blue-400" />}
                </div>

                {/* Selection Border (Always visible if selected) */}
                {isSelected && (
                   <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
                )}

                {/* Text Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/60 px-2 py-4 text-center backdrop-blur-sm w-full">
                      <p className="text-white text-[11.5px] font-bold leading-tight tracking-wider">點擊畫面<br/>影像放大於右方</p>
                    </div>
                </div>

                {/* Triangle indicator for selected */}
                {isSelected && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-0 h-0 
                        border-t-[8px] border-t-transparent
                        border-l-[10px] border-l-blue-500
                        border-b-[8px] border-b-transparent">
                      </div>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CameraList;