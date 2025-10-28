
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import useGameLogic from '../hooks/useGameLogic';
import useGameLoop from '../hooks/useGameLoop';
import GameBoard from './GameBoard';
import Bird from './Bird';
import Pipe from './Pipe';
import GameScore from './GameScore';
import GameOverlay from './GameOverlay';
import Cannon from './Cannon';
import BallProjectile from './BallProjectile';

const FlappyBirdGame = () => {
  const gameLogic = useGameLogic();
  
  useGameLoop(gameLogic);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        gameLogic.jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameLogic.jump]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="relative overflow-hidden shadow-2xl">
        <GameBoard 
          width={gameLogic.constants.GAME_WIDTH} 
          height={gameLogic.constants.GAME_HEIGHT}
          onClick={gameLogic.jump}
        >
          {/* Pipes */}
          {gameLogic.pipes.map((pipe, index) => (
            <Pipe
              key={index}
              x={pipe.x}
              height={pipe.height}
              gap={pipe.gap}
              pipeWidth={gameLogic.constants.PIPE_WIDTH}
              gameHeight={gameLogic.constants.GAME_HEIGHT}
            />
          ))}

          {/* Cannons */}
          {gameLogic.cannons.map((cannon) => (
            <Cannon
              key={cannon.id}
              x={cannon.x}
              y={cannon.y}
              direction={cannon.direction}
              birdX={gameLogic.bird.x}
              birdY={gameLogic.bird.y}
            />
          ))}

          {/* Ball Projectiles */}
          {gameLogic.ballProjectiles.map((projectile) => (
            <BallProjectile
              key={projectile.id}
              x={projectile.x}
              y={projectile.y}
            />
          ))}

          {/* Bird */}
          <Bird
            x={gameLogic.bird.x}
            y={gameLogic.bird.y}
            velocity={gameLogic.bird.velocity}
            size={gameLogic.constants.BIRD_SIZE}
          />

          {/* Score */}
          <GameScore score={gameLogic.score} highScore={gameLogic.highScore} />

          {/* Game State Overlays */}
          <GameOverlay
            gameState={gameLogic.gameState}
            score={gameLogic.score}
            highScore={gameLogic.highScore}
            onStartGame={gameLogic.startGame}
            onResetGame={gameLogic.resetGame}
          />
        </GameBoard>
      </Card>
    </div>
  );
};

export default FlappyBirdGame;