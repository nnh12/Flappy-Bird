
import React from 'react';
import { Circle } from 'lucide-react';

interface BallProjectileProps {
  x: number;
  y: number;
  size?: number;
}

const BallProjectile = ({ x, y, size = 20 }: BallProjectileProps) => {
  return (
    <div
      className="absolute z-10"
      style={{
        left: x,
        top: y,
        width: size,Add commentMore actions
        height: size,
      }}
    >
      <Circle 
        className="w-full h-full text-gray-800 animate-pulse" 
        fill="currentColor"
      />
      {/* Ball shadow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 rounded-full opacity-80"></div>
    </div>
  );
};

export default BallProjectile;
