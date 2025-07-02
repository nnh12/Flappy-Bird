
import React from 'react';
import { Flame } from 'lucide-react';

interface PipeFireProps {
  x: number;
  y: number;
  position: 'top' | 'bottom';
}

const PipeFire = ({ x, y, position }: PipeFireProps) => {
  return (
    <div
      className="absolute z-20"
      style={{
        left: x + 10,
        top: position === 'top' ? y - 15 : y - 5,
        width: 40,
        height: 20,
      }}
    >
      <Flame 
        className={`w-full h-full text-orange-500 animate-pulse ${
          position === 'top' ? 'rotate-180' : ''
        }`}
        fill="currentColor"
      />
      {/* Fire glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-400 rounded-full opacity-60 blur-sm animate-pulse"></div>
      {/* Additional smaller flames */}
      <div className="absolute -left-2 top-1">
        <Flame 
          className={`w-3 h-3 text-red-500 animate-pulse ${
            position === 'top' ? 'rotate-180' : ''
          }`}
          fill="currentColor"
          style={{ animationDelay: '0.3s' }}
        />
      </div>
      <div className="absolute -right-2 top-1">
        <Flame 
          className={`w-3 h-3 text-yellow-500 animate-pulse ${
            position === 'top' ? 'rotate-180' : ''
          }`}
          fill="currentColor"
          style={{ animationDelay: '0.6s' }}
        />
      </div>
    </div>
  );
};

export default PipeFire;
