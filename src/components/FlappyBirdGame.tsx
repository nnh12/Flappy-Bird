import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Cannon from './Cannon';
import BallProjectile from './BallProjectile';
import PipeFire from './PipeFire';

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  height: number;
  gap: number;
  passed: boolean;
}

interface CannonEntity {
  id: number;
  x: number;
  y: number;
  direction: 'left' | 'right';
  lastShot: number;
}

interface BallProjectileEntity {
  id: number;
  x: number;
  y: number;
  velocity: number;
  direction: 'left' | 'right';
}

const FlappyBirdGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [cannons, setCannons] = useState<CannonEntity[]>([]);
  const [ballProjectiles, setBallProjectiles] = useState<BallProjectileEntity[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyBirdHighScore');
    return saved ? parseInt(saved) : 0;
  });
  
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const cannonIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);

  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_SPEED = 2;
  const FIRE_SPEED = 4;
  const CANNON_SHOOT_INTERVAL = 2000; // 2 seconds
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 500;

  const resetGame = useCallback(() => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([]);
    setCannons([]);
    setBallProjectiles([]);
    setScore(0);
    setGameState('waiting');
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    } else if (gameState === 'waiting') {
      startGame();
    }
  }, [gameState, startGame]);

  const checkCollision = useCallback((birdY: number, pipes: Pipe[], ballProjectiles: BallProjectileEntity[]) => {
    // Check ground and ceiling collision
    if (birdY > GAME_HEIGHT - BIRD_SIZE || birdY < 0) {
      return true;
    }

    // Check pipe collision
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.height || birdY + BIRD_SIZE > pipe.height + PIPE_GAP)
      ) {
        return true;
      }
    }

    // Check ball projectile collision
    for (const projectile of ballProjectiles) {
      if (
        bird.x + BIRD_SIZE > projectile.x &&
        bird.x < projectile.x + 20 &&
        birdY + BIRD_SIZE > projectile.y &&
        birdY < projectile.y + 20
      ) {
        return true;
      }
    }

    return false;
  }, [bird.x]);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (gameState !== 'playing') return;

    setBird(prev => {
      const newVelocity = prev.velocity + GRAVITY;
      const newY = prev.y + newVelocity;
      
      if (checkCollision(newY, pipes, ballProjectiles)) {
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('flappyBirdHighScore', score.toString());
          toast({
            title: "New High Score! 🎉",
            description: `Amazing! You scored ${score} points!`,
          });
        }
        return prev;
      }

      return {
        ...prev,
        y: newY,
        velocity: newVelocity
      };
    });

    // Update pipes
    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      // Add new pipe
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 300) {
        newPipes.push({
          x: GAME_WIDTH,
          height: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
          gap: PIPE_GAP,
          passed: false
        });
      }

      // Check for score
      newPipes.forEach(pipe => {
        if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      return newPipes;
    });

    // Update cannons
    setCannons(prev => {
      let newCannons = prev.map(cannon => ({ ...cannon, x: cannon.x - PIPE_SPEED }))
        .filter(cannon => cannon.x > -50);

      // Add new cannon occasionally
      if (Math.random() < 0.003 && (newCannons.length === 0 || newCannons[newCannons.length - 1].x < GAME_WIDTH - 200)) {
        const direction = Math.random() > 0.5 ? 'left' : 'right';
        newCannons.push({
          id: cannonIdRef.current++,
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - 100) + 50,
          direction,
          lastShot: currentTime
        });
      }

      // Check if cannons should shoot
      newCannons.forEach(cannon => {
        if (currentTime - cannon.lastShot > CANNON_SHOOT_INTERVAL) {
          cannon.lastShot = currentTime;
          setBallProjectiles(prev => [...prev, {
            id: projectileIdRef.current++,
            x: cannon.direction === 'right' ? cannon.x + 40 : cannon.x - 20,
            y: cannon.y + 10,
            velocity: cannon.direction === 'right' ? FIRE_SPEED : -FIRE_SPEED,
            direction: cannon.direction
          }]);
        }
      });

      return newCannons;
    });

    // Update ball projectiles
    setBallProjectiles(prev => 
      prev.map(projectile => ({
        ...projectile,
        x: projectile.x + projectile.velocity
      })).filter(projectile => projectile.x > -30 && projectile.x < GAME_WIDTH + 30)
    );

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, pipes, ballProjectiles, score, highScore, checkCollision, toast, bird.x]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="relative overflow-hidden shadow-2xl">
        <div 
          className="relative bg-gradient-to-b from-sky-300 to-green-300 cursor-pointer select-none"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onClick={jump}
        >
          {/* Background clouds */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-16 h-8 bg-white rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-40 right-32 w-12 h-6 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-60 left-40 w-20 h-10 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top pipe */}
              <div
                className="absolute bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-800 rounded-b-lg"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.height,
                }}
              />
              {/* Bottom pipe */}
              <div
                className="absolute bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-800 rounded-t-lg"
                style={{
                  left: pipe.x,
                  top: pipe.height + PIPE_GAP,
                  width: PIPE_WIDTH,
                  height: GAME_HEIGHT - pipe.height - PIPE_GAP,
                }}
              />
              {/* Fire effects */}
              <PipeFire
                x={pipe.x}
                y={pipe.height}
                position="top"
              />
              <PipeFire
                x={pipe.x}
                y={pipe.height + PIPE_GAP}
                position="bottom"
              />
            </div>
          ))}

          {/* Cannons */}
          {cannons.map((cannon) => (
            <Cannon
              key={cannon.id}
              x={cannon.x}
              y={cannon.y}
              direction={cannon.direction}
            />
          ))}

          {/* Ball Projectiles */}
          {ballProjectiles.map((projectile) => (
            <BallProjectile
              key={projectile.id}
              x={projectile.x}
              y={projectile.y}
            />
          ))}

          {/* Bird */}
          <div
            className="absolute transition-transform duration-100 ease-out"
            style={{
              left: bird.x,
              top: bird.y,
              width: BIRD_SIZE,
              height: BIRD_SIZE,
              transform: `rotate(${Math.min(bird.velocity * 3, 45)}deg)`,
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

          {/* Score */}
          <div className="absolute top-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
            Score: {score}
          </div>

          {/* High Score */}
          <div className="absolute top-4 right-4 text-white text-lg font-semibold drop-shadow-lg">
            Best: {highScore}
          </div>

          {/* Game State Overlays */}
          {gameState === 'waiting' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Flappy Bird</h1>
                <p className="text-xl mb-6">Click or press SPACE to start!</p>
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4 text-red-400 drop-shadow-lg">Game Over!</h2>
                <p className="text-xl mb-2">Final Score: {score}</p>
                <p className="text-lg mb-6">High Score: {highScore}</p>
                <Button 
                  onClick={resetGame}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold"
                >
                  <RefreshCw className="w-6 h-6 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {gameState === 'playing' && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm drop-shadow-lg text-center">
              Click or press SPACE to flap • Avoid pipes and balls!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FlappyBirdGame;
