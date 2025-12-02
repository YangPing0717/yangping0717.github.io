
import React, { useState, useRef, useEffect } from 'react';
import { LayoutType } from '../types';
import { LAYOUTS } from '../constants';
import LayoutIcon from './LayoutIcon';
import { Grip, Video, ArrowRight, X, Move } from 'lucide-react';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ currentLayout, onLayoutChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // State for position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize position to reasonable bottom-right on mount
  useEffect(() => {
     setPosition({ x: window.innerWidth - 340, y: window.innerHeight - 100 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      dragStart.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault(); 
      
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      // Removed strict bounds checking to allow dragging out of viewport
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        
        // Snap back logic
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          
          // Check if overflowing (any part of the menu is outside the viewport)
          const isOverflowing = 
            rect.left < 0 || 
            rect.top < 0 || 
            rect.right > vw || 
            rect.bottom > vh;
            
          if (isOverflowing) {
            // Snap to bottom-right corner with some padding
            const padding = 24; 
            const targetX = vw - rect.width - padding;
            const targetY = vh - rect.height - padding;
            
            setPosition({ x: targetX, y: targetY });
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('mouseup', handleMouseUp);
    }
  }, []); 

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', // Use fixed to ensure it snaps relative to viewport even if scrolled
        left: position.x,
        top: position.y,
        // Disable transition during drag for instant feedback, enable springy transition for snap back
        transition: isDragging.current ? 'none' : 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
      }}
      className="flex flex-col items-end gap-4 z-[100] pointer-events-auto select-none"
    >
      
      {/* Layout Panel - floats above buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 min-w-[300px]">
          <div 
            onMouseDown={handleMouseDown}
            className="flex items-center justify-between mb-3 text-slate-400 border-b border-slate-700 pb-2 cursor-move active:text-white transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Layouts</span>
            {/* Grip Handle Visual Indicator */}
            <div 
               className="p-1 hover:text-white hover:bg-slate-800 rounded"
               title="Drag Menu"
            >
              <Move size={14} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-4">
            {LAYOUTS.map((layout) => (
              <LayoutIcon
                key={layout.id}
                type={layout.type}
                label={layout.label}
                isActive={currentLayout === layout.type}
                onClick={() => onLayoutChange(layout.type)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3">
        {/* Toggle Panel Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-slate-800/80 border border-blue-500/50 hover:bg-blue-600 hover:border-blue-400 text-blue-200 hover:text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
        >
          {isOpen ? <X size={20} /> : <Grip size={20} />}
        </button>

         {/* Handle for moving when closed */}
         {!isOpen && (
           <button 
              onMouseDown={handleMouseDown}
              className="w-8 h-8 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 cursor-move flex items-center justify-center"
              title="Drag Controls"
           >
              <Move size={14} />
           </button>
         )}

         {/* Add Camera / Action Button */}
         <button className="w-12 h-12 rounded-full bg-slate-800/80 border border-blue-500/50 hover:bg-blue-600 hover:border-blue-400 text-blue-200 hover:text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-sm">
          <Video size={20} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">+</div>
        </button>

        {/* Primary CTA: Open Gate */}
        <button className="h-12 px-6 rounded-full bg-gradient-to-r from-slate-800 to-slate-700 border border-blue-500/50 hover:border-blue-400 text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 group">
          <span className="text-lg font-bold tracking-widest group-hover:text-blue-200">開閘</span>
          <div className="bg-white/10 rounded-full p-1 group-hover:translate-x-1 transition-transform">
             <ArrowRight size={18} />
          </div>
        </button>
      </div>

    </div>
  );
};

export default LayoutSelector;
