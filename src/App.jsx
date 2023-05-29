import confetti from 'canvas-confetti'
import { useState } from 'react'

import { Square } from './components/Square.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { TURNS } from './constants.js'
import { checkEndGame, checkWinnerFrom } from './logic/board.js'
import { resetGameStorage, saveGameToStorage } from './logic/storage/index.js'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X

    newBoard[index] = turn

    setBoard(newBoard)
    setTurn(newTurn)
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>

      <p className='text'>Turno de: {turn}</p>

      <button onClick={resetGame}>Reset del juego</button>

      <section className='game'>
        {board.map((square, index) => {
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
            >
              {square}
            </Square>
          )
        })}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal
        resetGame={resetGame}
        winner={winner}
      />
    </main>
  )
}

export default App
