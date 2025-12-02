
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CameraList from './components/CameraList';
import MainView from './components/MainView';
import LoginPage from './components/LoginPage';
import { CAMERAS } from './constants';
import { LayoutType } from './types';
import { X, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedCameraId, setSelectedCameraId] = useState(CAMERAS[0].id);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('Single');
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // State to track if the sidebar is docked in its original position
  const [sidebarDocked, setSidebarDocked] = useState(true);

  // State for the welcome hint
  const [showHint, setShowHint] = useState(false);
  const [isHintExiting, setIsHintExiting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Show hint when entering the main app
      setShowHint(true);
      setIsHintExiting(false);
      
      // Animation Timeline:
      // 0s - 1s: Slide In Animation
      // 1s - 6s: Linger (5 seconds)
      // 6s: Start Fade Out
      // 7s: Unmount
      
      const exitTimer = setTimeout(() => {
        setIsHintExiting(true);
      }, 6000); // 1s enter + 5s linger

      const removeTimer = setTimeout(() => {
        setShowHint(false);
      }, 7000); // +1s exit duration

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-white overflow-hidden font-sans relative animate-in fade-in zoom-in-95 duration-1000">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={() => setIsAuthenticated(false)}
      />
      
      {/* Welcome Hint Toast */}
      {showHint && (
        <div className={`fixed top-24 left-1/2 z-[100] w-[90%] max-w-lg origin-center
           ${isHintExiting 
             ? 'animate-[toast-fade-out_1s_forwards]' 
             : 'animate-[toast-slide-in-down_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
           }`}
        >
           <div className="bg-slate-900/95 border border-blue-500/50 backdrop-blur-xl rounded-xl p-4 flex gap-4 items-start relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group cursor-default animate-[pulse-border_3s_ease-in-out_infinite] shadow-2xl">
              
              {/* Shimmer effect - runs automatically to catch eye */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent z-0 pointer-events-none"></div>

              {/* Glowing accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
              
              <div className="bg-blue-500/20 p-2 rounded-lg shrink-0 relative z-10 animate-[bounce-slight_2s_infinite]">
                <Info className="text-blue-400" size={24} />
              </div>
              
              <div className="flex-1 pt-0.5 relative z-10">
                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                  Interactive Interface
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  您可以拖曳相右側 The Camera List 的標題將其取消停靠，也可以任意將單一 Camera 直接拖曳到左側主視圖區域。
                </p>
              </div>
              
              <button 
                onClick={() => setShowHint(false)} 
                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full relative z-10"
              >
                <X size={20} />
              </button>
           </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar / Floating Camera List */}
        <CameraList 
          cameras={CAMERAS}
          selectedCameraId={selectedCameraId}
          onSelectCamera={setSelectedCameraId}
          isDocked={sidebarDocked}
          setDocked={setSidebarDocked}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
          {activeTab === 'realtime' ? (
            <MainView 
              cameras={CAMERAS}
              selectedCameraId={selectedCameraId}
              onSelectCamera={setSelectedCameraId}
              layout={currentLayout}
              setLayout={setCurrentLayout}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-900/50">
               <div className="text-center text-slate-500">
                  <h2 className="text-2xl font-bold mb-2">Module: {activeTab}</h2>
                  <p>Content placeholder for {activeTab} view.</p>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes toast-slide-in-down {
          0% {
            opacity: 0;
            transform: translate3d(-50%, -200%, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes toast-fade-out {
          0% {
            opacity: 1;
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            opacity: 0;
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          40% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 30px rgba(59,130,246,0.2); }
          50% { border-color: rgba(59, 130, 246, 0.8); box-shadow: 0 0 45px rgba(59,130,246,0.4); }
        }
        @keyframes bounce-slight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default App;
