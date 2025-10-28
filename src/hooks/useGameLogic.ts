
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  velocityX: number;
  velocityY: number;
}

const useGameLogic = () => {
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

  const cannonIdRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);

  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_SPEED = 2;
  const FIRE_SPEED = 4;
  const CANNON_SHOOT_INTERVAL = 2000;
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

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyBirdHighScore', score.toString());
      toast({
        title: "New High Score! 🎉",
        description: `Amazing! You scored ${score} points!`,
      });
    }
  }, [score, highScore, toast]);

  return {
    gameState,
    bird,
    pipes,
    cannons,
    ballProjectiles,
    score,
    highScore,
    setBird,
    setPipes,
    setCannons,
    setBallProjectiles,
    setScore,
    resetGame,
    startGame,
    jump,
    checkCollision,
    handleGameOver,
    cannonIdRef,
    projectileIdRef,
    constants: {
      BIRD_SIZE,
      PIPE_WIDTH,
      PIPE_GAP,
      GRAVITY,
      JUMP_FORCE,
      PIPE_SPEED,
      FIRE_SPEED,
      CANNON_SHOOT_INTERVAL,
      GAME_WIDTH,
      GAME_HEIGHT,
    },
  };
};

export default useGameLogic;