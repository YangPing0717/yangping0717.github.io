import React from 'react';
import { LayoutType } from '../types';

interface LayoutIconProps {
  type: LayoutType;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const LayoutIcon: React.FC<LayoutIconProps> = ({ type, isActive, onClick, label }) => {
  // Base style for the outer box
  const boxClass = `w-14 h-9 border flex flex-wrap transition-colors cursor-pointer relative ${
    isActive ? 'border-blue-400 bg-blue-900/30' : 'border-blue-300/50 hover:border-blue-400/80'
  }`;

  // Inner cell style
  const cellClass = "bg-blue-500/80 border-slate-900 border-[1px]";
  const cellEmpty = "bg-transparent";

  const renderGrid = () => {
    switch (type) {
      case 'Single':
        return <div className={`${cellClass} w-full h-full`} />;
      case 'Split 2':
        return (
          <>
            <div className={`${cellClass} w-1/2 h-full`} />
            <div className={`${cellClass} w-1/2 h-full`} />
          </>
        );
      case 'Split 4':
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2">
             <div className={cellClass} />
             <div className={cellClass} />
             <div className={cellClass} />
             <div className={cellClass} />
          </div>
        );
      case 'Split 2 PIP':
        return (
          <div className="w-full h-full relative">
             <div className={`${cellClass} w-3/4 h-full absolute left-0 top-0`} />
             <div className={`${cellClass} w-1/4 h-1/3 absolute right-0 top-0`} />
          </div>
        );
      case 'PIP LT': // Left Top
        return (
          <div className={`${cellClass} w-full h-full relative`}>
            <div className={`${cellClass} w-1/3 h-1/2 absolute left-0 top-0 bg-blue-300 border-2 border-blue-600 z-10`} />
          </div>
        );
      case 'PIP LB': // Left Bottom
        return (
          <div className={`${cellClass} w-full h-full relative`}>
             <div className={`${cellClass} w-1/3 h-1/2 absolute left-0 bottom-0 bg-blue-300 border-2 border-blue-600 z-10`} />
          </div>
        );
      case 'PIP RT': // Right Top
        return (
           <div className={`${cellClass} w-full h-full relative`}>
             <div className={`${cellClass} w-1/3 h-1/2 absolute right-0 top-0 bg-blue-300 border-2 border-blue-600 z-10`} />
          </div>
        );
      case 'PIP RB': // Right Bottom
        return (
           <div className={`${cellClass} w-full h-full relative`}>
             <div className={`${cellClass} w-1/3 h-1/2 absolute right-0 bottom-0 bg-blue-300 border-2 border-blue-600 z-10`} />
          </div>
        );
      case 'L1R2':
        return (
          <div className="w-full h-full flex">
            <div className={`${cellClass} w-2/3 h-full`} />
            <div className="w-1/3 h-full flex flex-col">
              <div className={`${cellClass} h-1/2 w-full`} />
              <div className={`${cellClass} h-1/2 w-full`} />
            </div>
          </div>
        );
       case 'L1R3':
        return (
          <div className="w-full h-full flex">
            <div className={`${cellClass} w-2/3 h-full`} />
            <div className="w-1/3 h-full flex flex-col">
              <div className={`${cellClass} h-1/3 w-full`} />
              <div className={`${cellClass} h-1/3 w-full`} />
              <div className={`${cellClass} h-1/3 w-full`} />
            </div>
          </div>
        );
      case 'Big4': // Actually looks like 1 big top, 3 small bottom
        return (
           <div className="w-full h-full flex flex-col">
            <div className={`${cellClass} h-2/3 w-full`} />
            <div className="h-1/3 w-full flex">
              <div className={`${cellClass} w-1/3 h-full`} />
              <div className={`${cellClass} w-1/3 h-full`} />
              <div className={`${cellClass} w-1/3 h-full`} />
            </div>
          </div>
        );
       case 'PIP RB2': // Variant
        return (
           <div className={`${cellClass} w-full h-full relative`}>
             <div className={`${cellClass} w-1/3 h-1/3 absolute right-0 bottom-0 border border-white z-10`} />
          </div>
        );
      default:
        return <div className={`${cellClass} w-full h-full`} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1" onClick={onClick}>
      <div className={boxClass}>
        {renderGrid()}
      </div>
      <span className="text-[10px] text-gray-300 font-sans tracking-tight">{label}</span>
    </div>
  );
};

export default LayoutIcon;