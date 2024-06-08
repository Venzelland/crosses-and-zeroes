import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');

  const findBestMove = (squares, player, level) => {
    let bestMove;
    if (level === 'easy') {
      bestMove = findRandomMove(squares);
    } else if (level === 'medium') {
      bestMove = findRandomMove(squares);
      if (player === 'O') {
        const defensiveMove = findWinningMove(squares, 'X');
        if (defensiveMove !== null) {
          bestMove = defensiveMove;
        }
      }
    } else if (level === 'hard') {
      const { move } = minimax(squares, player, 0, true);
      bestMove = move;
    }
    return bestMove;
  };

  const findRandomMove = (squares) => {
    const availableMoves = [];
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        availableMoves.push(i);
      }
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const findWinningMove = (squares, player) => {
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newBoard = squares.slice();
        newBoard[i] = player;
        if (calculateWinner(newBoard) === player) {
          return i;
        }
      }
    }
    return null;
  };

  const minimax = (squares, player, depth, isMaximizing) => {
    const winner = calculateWinner(squares);
    if (winner) {
      return winner === 'X' ? { score: -10 + depth } : { score: 10 - depth };
    }
    if (isBoardFull()) {
      return { score: 0 };
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          let { score } = minimax(squares, player, depth + 1, false);
          squares[i] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          let { score } = minimax(squares, player, depth + 1, true);
          squares[i] = null;
          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    }
  };

  useEffect(() => {
    if (!isXNext) {
      const winner = calculateWinner(board);
      if (!winner && !isBoardFull()) {
        const index = findBestMove(board, 'O', difficulty);
        handleClick(index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isXNext, difficulty]);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = () => {
    return board.every((cell) => cell !== null);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner
      ? `Победитель: ${winner}`
      : isBoardFull()
          ? "Это ничья!"
          : `Следующий игрок: ${isXNext ? 'X' : 'O'}`;

  return (
      <div className="game">
        <div className="status">{status}</div>
        <div className="difficulty">
          <div>Сложность:</div>
          <div className="button">
            <button
                onClick={() => handleDifficultyChange('easy')}
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
            >
              Легко
            </button>
            <button
                onClick={() => handleDifficultyChange('medium')}
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
            >
              Средний
            </button>
            <button
                onClick={() => handleDifficultyChange('hard')}
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
            >
              Трудный
            </button>
          </div>

        </div>
        <div className="board">
          {board.map((cell, index) => (
              <div
                  key={index}
                  className="cell"
                  onClick={() => handleClick(index)}
              >
                {cell}
              </div>
          ))}
        </div>
        <button onClick={handleRestart} className="restart-btn">Перезапустить</button>
      </div>
  );
};

export default App;
