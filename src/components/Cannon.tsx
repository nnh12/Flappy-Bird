import React from 'react';
import BallProjectile from './BallProjectile';

interface CannonProps {
  x: number;
  y: number;
  size?: number;     // overall scale
  angle?: number;    // barrel angle (degrees)
  showProjectile?: boolean;
}

export default function Cannon({
  x,
  y,
  size = 48,
  angle = 0,
  showProjectile = false,
}: CannonProps) {
  // Barrel and turret geometry
  const barrelLength = Math.round(size * 1.2);
  const projectileOffset = barrelLength + 8;
  const rotate = `rotate(${angle}deg)`;

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: size * 2,
        height: size * 2,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Turret base */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-700 shadow-inner"
        style={{
          width: size * 1.4,
          height: size * 1.4,
        }}
      >
        {/* Rotating barrel */}
        <div
          className="absolute left-1/2 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full shadow-md"
          style={{
            width: barrelLength,
            height: Math.max(8, size * 0.25),
            transformOrigin: '0% 50%',
            transform: `${rotate} translateY(-50%) translateX(${size * -0.1}px)`,
          }}
        >
          {/* Muzzle ring */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-600 rounded-full"
            style={{
              width: Math.max(8, size * 0.3),
              height: Math.max(8, size * 0.3),
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
            }}
          />
        </div>
      </div>

      {/* Optional projectile fired from barrel tip */}
      {showProjectile && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `${rotate} translateX(${projectileOffset}px) translateY(-50%)`,
          }}
        >
          <BallProjectile x={0} y={0} size={Math.max(10, size * 0.3)} />
        </div>
      )}
    </div>
  );
}
