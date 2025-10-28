
import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopProps {
  gameState: 'waiting' | 'playing' | 'gameOver';
  bird: any;
  pipes: any[];
  cannons: any[];
  ballProjectiles: any[];
  score: number;
  setBird: (fn: (prev: any) => any) => void;
  setPipes: (fn: (prev: any[]) => any[]) => void;
  setCannons: (fn: (prev: any[]) => any[]) => void;
  setBallProjectiles: (fn: (prev: any[]) => any[]) => void;
  setScore: (fn: (prev: number) => number) => void;
  checkCollision: (birdY: number, pipes: any[], ballProjectiles: any[]) => boolean;
  handleGameOver: () => void;
  cannonIdRef: React.MutableRefObject<number>;
  projectileIdRef: React.MutableRefObject<number>;
  constants: {
    BIRD_SIZE: number;
    PIPE_WIDTH: number;
    PIPE_GAP: number;
    GRAVITY: number;
    PIPE_SPEED: number;
    FIRE_SPEED: number;
    CANNON_SHOOT_INTERVAL: number;
    GAME_WIDTH: number;
    GAME_HEIGHT: number;
  };
}

const useGameLoop = ({
  gameState,
  bird,
  pipes,
  cannons,
  ballProjectiles,
  score,
  setBird,
  setPipes,
  setCannons,
  setBallProjectiles,
  setScore,
  checkCollision,
  handleGameOver,
  cannonIdRef,
  projectileIdRef,
  constants,
}: UseGameLoopProps) => {
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (gameState !== 'playing') return;

    setBird(prev => {
      const newVelocity = prev.velocity + constants.GRAVITY;
      const newY = prev.y + newVelocity;
      
      if (checkCollision(newY, pipes, ballProjectiles)) {
        handleGameOver();
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
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - constants.PIPE_SPEED }))
        .filter(pipe => pipe.x > -constants.PIPE_WIDTH);

      // Add new pipe
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < constants.GAME_WIDTH - 300) {
        newPipes.push({
          x: constants.GAME_WIDTH,
          height: Math.random() * (constants.GAME_HEIGHT - constants.PIPE_GAP - 100) + 50,
          gap: constants.PIPE_GAP,
          passed: false
        });
      }

      // Check for score
      newPipes.forEach(pipe => {
        if (!pipe.passed && bird.x > pipe.x + constants.PIPE_WIDTH) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      return newPipes;
    });

    // Update cannons
    setCannons(prev => {
      let newCannons = prev.map(cannon => ({ ...cannon, x: cannon.x - constants.PIPE_SPEED }))
        .filter(cannon => cannon.x > -50);

      // Add new cannon occasionally
      if (Math.random() < 0.003 && (newCannons.length === 0 || newCannons[newCannons.length - 1].x < constants.GAME_WIDTH - 200)) {
        const direction = Math.random() > 0.5 ? 'left' : 'right';
        newCannons.push({
          id: cannonIdRef.current++,
          x: constants.GAME_WIDTH,
          y: Math.random() * (constants.GAME_HEIGHT - 100) + 50,
          direction,
          lastShot: currentTime
        });
      }

      // Check if cannons should shoot
      newCannons.forEach(cannon => {
        if (currentTime - cannon.lastShot > constants.CANNON_SHOOT_INTERVAL) {
          cannon.lastShot = currentTime;
          
          // Calculate angle and velocity components toward bird
          const cannonCenterX = cannon.x + 20;
          const cannonCenterY = cannon.y + 12.5;
          const dx = bird.x - cannonCenterX;
          const dy = bird.y - cannonCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Normalize and multiply by fire speed
          const velocityX = (dx / distance) * constants.FIRE_SPEED;
          const velocityY = (dy / distance) * constants.FIRE_SPEED;
          
          setBallProjectiles(prev => [...prev, {
            id: projectileIdRef.current++,
            x: cannonCenterX,
            y: cannonCenterY,
            velocityX,
            velocityY
          }]);
        }
      });

      return newCannons;
    });

    // Update ball projectiles
    setBallProjectiles(prev => 
      prev.map(projectile => ({
        ...projectile,
        x: projectile.x + projectile.velocityX,
        y: projectile.y + projectile.velocityY
      })).filter(projectile => 
        projectile.x > -30 && 
        projectile.x < constants.GAME_WIDTH + 30 &&
        projectile.y > -30 && 
        projectile.y < constants.GAME_HEIGHT + 30
      )
    );

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, pipes, ballProjectiles, bird.x, checkCollision, handleGameOver, constants, setBird, setPipes, setCannons, setBallProjectiles, setScore, cannonIdRef, projectileIdRef]);

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
};

export default useGameLoop;