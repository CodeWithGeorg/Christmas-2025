
import React from 'react';

const ChristmasTree: React.FC = () => {
  return (
    <div className="relative w-64 h-80 flex flex-col items-center justify-end mb-8">
      {/* Star on top */}
      <div className="absolute top-0 animate-pulse text-yellow-300 text-5xl z-10 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]">
        <i className="fas fa-star"></i>
      </div>

      {/* Tree Tiers */}
      <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-transparent border-b-green-800 -mb-4 relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex space-x-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75"></div>
          </div>
      </div>
      <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[80px] border-transparent border-b-green-700 -mb-6 relative">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex space-x-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping delay-100"></div>
          </div>
      </div>
      <div className="w-0 h-0 border-l-[90px] border-r-[90px] border-b-[110px] border-transparent border-b-green-600 relative">
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex space-x-8">
              <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce delay-300"></div>
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-500"></div>
              <div className="w-3 h-3 rounded-full bg-red-400 animate-ping delay-200"></div>
          </div>
      </div>
      
      {/* Trunk */}
      <div className="w-12 h-14 bg-amber-900 rounded-b-md shadow-2xl"></div>

      {/* Presents at the base */}
      <div className="absolute -bottom-2 flex space-x-4">
          <div className="w-10 h-10 bg-red-600 rounded-sm relative shadow-lg transform -rotate-12 border-2 border-yellow-400">
              <div className="absolute top-0 left-1/2 h-full w-2 bg-yellow-400 -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-full h-2 bg-yellow-400 -translate-y-1/2"></div>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-sm relative shadow-lg transform rotate-6 border-2 border-white">
              <div className="absolute top-0 left-1/2 h-full w-2 bg-white -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-full h-2 bg-white -translate-y-1/2"></div>
          </div>
      </div>
    </div>
  );
};

export default ChristmasTree;
