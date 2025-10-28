
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play } from 'lucide-react';

interface GameOverlayProps {
  gameState: 'waiting' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  onStartGame: () => void;
  onResetGame: () => void;
}

const GameOverlay = ({ gameState, score, highScore, onStartGame, onResetGame }: GameOverlayProps) => {
  if (gameState === 'waiting') {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Flappy Bird</h1>
          <p className="text-xl mb-6">Click or press SPACE to start!</p>
          <Button 
            onClick={onStartGame}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4 text-red-400 drop-shadow-lg">Game Over!</h2>
          <p className="text-xl mb-2">Final Score: {score}</p>
          <p className="text-lg mb-6">High Score: {highScore}</p>
          <Button 
            onClick={onResetGame}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            <RefreshCw className="w-6 h-6 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm drop-shadow-lg text-center">
        Click or press SPACE to flap • Avoid pipes and balls!
      </div>
    );
  }

  return null;
};

export default GameOverlay;