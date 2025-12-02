import React from 'react';
import { X, ArrowDown, Car, Search } from 'lucide-react';
import { Camera, EventLog } from '../types';
import { MOCK_EVENTS } from '../constants';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  camera: Camera | null;
}

const EventDrawer: React.FC<EventDrawerProps> = ({ isOpen, onClose, camera }) => {
  const latestEvent = MOCK_EVENTS[0];
  
  // Use the camera's thumbnail if available to sync with the clicked screen
  const displayImage = camera?.thumbnailUrl || latestEvent.carImage;

  return (
    <div 
      className={`
        fixed inset-y-0 right-0 w-[90vw] md:w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-out z-[90]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {camera?.name || 'Camera Events'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Last Event Card */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Last event:</h3>
            
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              {/* Event Info Header */}
              <div className="bg-slate-100 p-3 flex items-center justify-between border-b border-slate-700">
                 <div className="flex items-center gap-4">
                   <span className="font-mono text-slate-900 font-bold">{latestEvent.dateTime.split(' ')[1]}</span>
                   <div className="bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm">
                      <span className="font-mono font-bold text-lg text-slate-900">{latestEvent.plateNumber}</span>
                   </div>
                   <div className="w-16 h-6 bg-slate-300 rounded overflow-hidden relative">
                      {/* Fake Plate Image */}
                      <img src={latestEvent.plateImage} alt="plate" className="w-full h-full object-cover opacity-80" />
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <Car size={16} className="text-slate-500" />
                    <span className="text-slate-700 font-bold">{latestEvent.brand}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-white border border-slate-300"></div>
                      <span className="text-xs font-bold text-slate-600">{latestEvent.color}</span>
                    </div>
                 </div>
              </div>
              
              {/* Car Image */}
              <div className="aspect-video w-full bg-black relative group">
                <img 
                  src={displayImage} 
                  alt="Vehicle" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Events Table Section */}
          <div className="space-y-2">
            {/* Tabs */}
            <div className="flex border-b border-slate-700">
               <button className="px-4 py-2 text-sm font-medium text-blue-400 border-b-2 border-blue-400 bg-slate-800/50">Events</button>
               <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Search</button>
               <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Integration</button>
               <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">Settings</button>
            </div>

            {/* Table Header */}
            <div className="bg-slate-950 border border-slate-800 rounded-t-lg overflow-hidden">
               <div className="grid grid-cols-12 gap-2 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider items-center border-b border-slate-800">
                  <div className="col-span-3">Date/Time</div>
                  <div className="col-span-2 text-center">Zone</div>
                  <div className="col-span-2">Plate</div>
                  <div className="col-span-2">Brand</div>
                  <div className="col-span-2">Model</div>
                  <div className="col-span-1">Color</div>
               </div>
               
               {/* Table Rows */}
               <div className="divide-y divide-slate-800 bg-slate-900">
                 {MOCK_EVENTS.map((evt, idx) => (
                   <div key={evt.id} className="grid grid-cols-12 gap-2 p-2 items-center hover:bg-slate-800 transition-colors group">
                      <div className="col-span-3 text-xs text-slate-300 font-mono">{evt.dateTime}</div>
                      
                      <div className="col-span-2 flex justify-center items-center gap-1 text-slate-400">
                         <span>{evt.zone}</span>
                         <ArrowDown size={12} className="text-green-500" />
                      </div>
                      
                      <div className="col-span-2 flex flex-col gap-1">
                         <span className="text-xs font-mono font-bold text-white">{evt.plateNumber}</span>
                         {idx === 0 && (
                            <div className="h-4 w-16 bg-slate-700 rounded overflow-hidden border border-slate-600">
                               <img src={evt.plateImage} className="w-full h-full object-cover" />
                            </div>
                         )}
                      </div>
                      
                      <div className="col-span-2 flex items-center gap-2">
                         <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] text-white">
                            {evt.brand.substring(0,1)}
                         </div>
                         <span className="text-xs text-slate-300 truncate">{evt.brand}</span>
                      </div>
                      
                      <div className="col-span-2 text-xs text-slate-400 truncate">{evt.model}</div>
                      
                      <div className="col-span-1 flex items-center gap-1">
                         <div 
                           className={`w-3 h-3 rounded-full border border-slate-600 ${
                              evt.color === 'WHITE' ? 'bg-white' : 
                              evt.color === 'BLACK' ? 'bg-black' : 
                              evt.color === 'GRAY' ? 'bg-gray-400' : 'bg-slate-500'
                           }`} 
                         />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDrawer;