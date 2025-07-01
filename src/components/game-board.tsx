'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createInitialState, makeMove, type GameState } from '@/lib/game-state';

const EMOJIS = { X: '❌', O: '⭕' };
const COLORS = { X: 'text-pink-500', O: 'text-blue-500' };

export function GameBoard() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [animateWin, setAnimateWin] = useState(false);

  const handleCellClick = (position: number) => {
    if (gameState.winner) return;
    const nextState = makeMove(gameState, position);
    if (nextState.winner && !gameState.winner) {
      setTimeout(() => setAnimateWin(true), 100); // trigger win animation
      setTimeout(() => setAnimateWin(false), 1200);
      setScore(prev => {
        if (nextState.winner === 'draw') return { ...prev, draw: prev.draw + 1 };
        if (nextState.winner === 'X' || nextState.winner === 'O') {
          return { ...prev, [nextState.winner]: prev[nextState.winner] + 1 };
        }
        return prev;
      });
    }
    setGameState(nextState);
  };

  const resetGame = () => {
    setGameState(createInitialState());
    setAnimateWin(false);
  };

  const renderStatus = () => {
    if (gameState.winner === 'draw') {
      return <span className="text-yellow-500 animate-bounce">It&apos;s a draw! 🤝</span>;
    }
    if (gameState.winner) {
      return (
        <span className={`font-extrabold text-3xl animate-bounce ${COLORS[gameState.winner as 'X' | 'O']}`}>Player {EMOJIS[gameState.winner as 'X' | 'O']} wins! 🎉</span>
      );
    }
    return (
      <span className={`font-bold text-2xl ${COLORS[gameState.currentPlayer]}`}>Current player: {EMOJIS[gameState.currentPlayer]}</span>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 rounded-3xl shadow-2xl border-4 border-pink-200">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-8 mb-2 text-lg font-bold">
          <span className="flex flex-col items-center">
            <span className="text-pink-500 text-3xl">❌</span>
            <span className="text-pink-600">{score.X}</span>
          </span>
          <span className="flex flex-col items-center">
            <span className="text-blue-500 text-3xl">⭕</span>
            <span className="text-blue-600">{score.O}</span>
          </span>
          <span className="flex flex-col items-center">
            <span className="text-yellow-500 text-3xl">🤝</span>
            <span className="text-yellow-600">{score.draw}</span>
          </span>
        </div>
        <div className="text-center mb-2">{renderStatus()}</div>
        <div className="grid grid-cols-3 gap-3">
          {gameState.board.map((cell, index) => (
            <Button
              key={index}
              variant={cell ? 'default' : 'outline'}
              className={`w-24 h-24 text-5xl font-extrabold rounded-full shadow-lg transition-all duration-200 ease-in-out bg-white/80 border-4 border-dashed border-blue-200 hover:scale-110 hover:bg-yellow-100 ${cell ? COLORS[cell] : ''} ${animateWin && gameState.winner && (cell === gameState.winner) ? 'animate-pulse bg-green-200 border-green-400' : ''}`}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!gameState.winner}
              style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}
            >
              {cell ? EMOJIS[cell] : ''}
            </Button>
          ))}
        </div>
        {gameState.winner && (
          <Button
            variant="default"
            onClick={resetGame}
            className="mt-4 bg-gradient-to-r from-pink-400 to-blue-400 text-white text-xl font-bold shadow-lg animate-bounce"
            style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}
          >
            Play Again
          </Button>
        )}
      </div>
    </Card>
  );
}
