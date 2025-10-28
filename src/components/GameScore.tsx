
import React from 'react';

interface GameScoreProps {
  score: number;
  highScore: number;
}

const GameScore = ({ score, highScore }: GameScoreProps) => {
  return (
    <>
      {/* Score */}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
        Score: {score}
      </div>

      {/* High Score */}
      <div className="absolute top-4 right-4 text-white text-lg font-semibold drop-shadow-lg">
        Best: {highScore}
      </div>
    </>
  );
};

export default GameScore;