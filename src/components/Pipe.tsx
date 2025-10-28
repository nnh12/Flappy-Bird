
import React from 'react';
import PipeFire from './PipeFire';

interface PipeProps {
  x: number;
  height: number;
  gap: number;
  pipeWidth: number;
  gameHeight: number;
}

const Pipe = ({ x, height, gap, pipeWidth, gameHeight }: PipeProps) => {
  return (
    <div>
      {/* Top pipe */}
      <div
        className="absolute bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-800 rounded-b-lg"
        style={{
          left: x,
          top: 0,
          width: pipeWidth,
          height: height,
        }}
      />
      {/* Bottom pipe */}
      <div
        className="absolute bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-800 rounded-t-lg"
        style={{
          left: x,
          top: height + gap,
          width: pipeWidth,
          height: gameHeight - height - gap,
        }}
      />
      {/* Fire effects */}
      <PipeFire
        x={x}
        y={height}
        position="top"
      />
      <PipeFire
        x={x}
        y={height + gap}
        position="bottom"
      />
    </div>
  );
};

export default Pipe;