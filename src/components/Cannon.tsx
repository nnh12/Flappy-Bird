
import React from 'react';

interface CannonProps {
  x: number;
  y: number;
  direction: 'left' | 'right';
  birdX: number;
  birdY: number;
}

const Cannon = ({ x, y, direction, birdX, birdY }: CannonProps) => {
  // Calculate angle from cannon to bird
  const cannonCenterX = x + 20;
  const cannonCenterY = y + 12.5;
  const angle = Math.atan2(birdY - cannonCenterY, birdX - cannonCenterX) * (180 / Math.PI);

  return (
    <div
      className="absolute z-10"
      style={{
        left: x,
        top: y,
        width: 40,
        height: 25,
      }}
    >
      {/* Cannon base */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-gray-900 rounded-lg">
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* Rotating turret */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
        style={{
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          transformOrigin: 'center'
        }}
      >
        {/* Turret barrel */}
        <div className="w-8 h-2 bg-gray-900 rounded-r-full border border-gray-950 shadow-lg"></div>
      </div>
      
      {/* Turret base pivot */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full border border-red-800 shadow-md z-10"></div>
    </div>
  );
};

export default Cannon;