import React from 'react';
import { ChevronDown, Video, History, Home, Settings, LogOut, Power } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = [
    { id: 'realtime', label: '即時影像', icon: Video },
    { id: 'query', label: '查詢', icon: History },
    { id: 'resident', label: '住戶查詢', icon: Home },
    { id: 'settings', label: '設置', icon: Settings },
  ];

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 select-none shrink-0 z-20">
      {/* Left Section: Branding */}
      <div className="flex items-center gap-4">
        <img 
          src="https://drive.google.com/thumbnail?id=1teQiVb-k6OOYd-Ygj2Gxgm61av49waCz&sz=w800" 
          alt="EZ Ai" 
          className="h-10 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <button className="p-1 hover:bg-slate-800 rounded text-slate-400">
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Center Section: Navigation Tabs */}
      <nav className="flex h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center px-4 sm:px-6 h-full transition-all border-b-2 gap-1
                ${isActive 
                  ? 'border-cyan-400 text-white bg-gradient-to-t from-slate-800 to-transparent' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
              `}
            >
              <tab.icon size={18} className={isActive ? 'text-cyan-400' : ''} />
              <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Section: System Info & Actions */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end hidden md:flex">
          <span className="text-sm text-slate-300 font-medium">定泰建設小檜溪 - 富櫻物業中心</span>
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 mt-0.5">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
             <span className="text-[10px] text-slate-400">A棟1樓物業室_abc</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
          <button 
            onClick={onLogout}
            className="flex flex-col items-center text-slate-400 hover:text-white transition-colors gap-0.5 group"
          >
            <LogOut size={18} className="group-hover:text-red-400" />
            <span className="text-[10px]">登出</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-white transition-colors gap-0.5 group">
            <Power size={18} className="group-hover:text-red-500" />
            <span className="text-[10px]">关机</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
