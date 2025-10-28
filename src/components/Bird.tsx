
import React from 'react';

interface BirdProps {
  x: number;
  y: number;
  velocity: number;
  size: number;
}

const Bird = ({ x, y, velocity, size }: BirdProps) => {
  return (
    <div
      className="absolute transition-transform duration-100 ease-out"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `rotate(${Math.min(velocity * 3, 45)}deg)`,
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-orange-600 shadow-lg relative">
        {/* Wing */}
        <div className="absolute top-2 left-1 w-4 h-3 bg-orange-400 rounded-full animate-pulse"></div>
        {/* Eye */}
        <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full">
          <div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5"></div>
        </div>
        {/* Beak */}
        <div className="absolute top-3 -right-1 w-0 h-0 border-l-4 border-l-orange-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
      </div>
    </div>
  );
};

export default Bird;