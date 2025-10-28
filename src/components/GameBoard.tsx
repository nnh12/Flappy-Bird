
import React from 'react';

interface GameBoardProps {
  width: number;
  height: number;
  children: React.ReactNode;
  onClick: () => void;
}

const GameBoard = ({ width, height, children, onClick }: GameBoardProps) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-sky-300 to-green-300 cursor-pointer select-none"
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Background clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-16 h-8 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-12 h-6 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-40 w-20 h-10 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {children}
    </div>
  );
};

export default GameBoard;