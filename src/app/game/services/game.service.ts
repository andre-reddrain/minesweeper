import { Injectable } from '@angular/core';
import { Board } from '../models/board';
import { BoardSettings } from '../models/boardSettings';
import { Cell } from '../models/cell';

type GameState = 'idle' | 'pressed' | 'lost' | 'won';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor() {
    // Default board settings
    this.currentBoardSettings = {
      cols: 9,
      rows: 9,
      mines: 10,
      timer: 999
    };

    this.start(this.currentBoardSettings)
  }

  board!: Board;
  gameState: GameState = 'idle';
  firstPlay: Boolean = true;

  // BoardSettings
  currentBoardSettings: BoardSettings | undefined;

  // Variáveis de timer
  timer = 0;
  private intervalId: any;

  /**
   * Cria um novo jogo
   * @param settings Board Settings do novo board
   */
  start(settings: BoardSettings) {
    this.board = new Board(
      settings.rows,
      settings.cols,
      settings.mines
    );
    this.gameState = 'idle';
    this.firstPlay = true;
  }

  /**
   * Começa o timer. Vai aplicar regras, dependendo do valor do timer.
   * Se o timer for 999, incrementa de 0 até 999
   * Se o timer for diferente de 999, decrementa do valor até 0
   */
  startTimer() {
    this.stopTimer();

    const timer = this.currentBoardSettings?.timer;

    // Caso o timer seja definido pelo utilizador
    if (timer !== undefined && timer !== 999) {
      this.timer = timer;
      this.intervalId = setInterval(() => {
        this.timer--;

        // Se o timer chegou a 0, game over!
        if (this.timer === 0) {
          this.setGameOver();
        }
      }, 1000)
    } else {
      this.timer = 0;

      this.intervalId = setInterval(() => {
        this.timer++;

        // Se o timer chegou aos 999, game over!
        if (this.timer === 999) {
          this.setGameOver();
        }
      }, 1000)
    }
  }

  /**
   * Para o timer.
   */
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Verifica o estado do jogo.
   * @param result Resultado do Jogo.
   */
  checkGameState(result : string | null) {
    if (result === 'gameover' || result == 'win') {
      this.reset();
    }
  }

  /**
   * Transforma uma célula numa flag.
   * @param cell Célula a ser transformada numa flag.
   */
  flag(cell: Cell) {
    // Vai criar flags se o jogo ainda não acabou
    if (this.board.result === 'ongoing') {
      // Se já tiver uma flag, reverte-a
      if(cell.status === 'flag') {
        cell.status = 'open';
      } else if (cell.status !== 'clear') {
        cell.status = 'flag';
      }
    }
  }

  /**
   * Verifica o click na célula, e determina o estado do jogo.
   * @param cell Célula a ser verificada.
   * @returns Nada, caso o jogo já tenha acabado.
   */
  handleCheckClick(cell: Cell) {
    // Caso o jogo já tenha acabado, não vai fazer nada
    if (this.board.result !== 'ongoing' && this.board.result !== 'start') {
      return;
    }

    // Verifica se a 1ª casa é uma mina, e recria o tabuleiro até não ser uma mina
    if (this.firstPlay && cell.mine) {
      this.stopTimer()
      cell = this.recreateBoard(cell)
    }

    // Começa o jogo depois do primeiro click válido
    if (this.board.result === 'start') {
      this.board.result = 'ongoing';
      this.startTimer();
    }

    this.board.result = this.board.checkCell(cell);

    // Verificações de estado do jogo
    if (this.board.result === 'gameover') {
      this.firstPlay = false;
      this.gameState = 'lost';
      this.stopTimer();
    } else if (this.board.result === 'win') {
      this.firstPlay = false;
      this.gameState = 'won';
      this.stopTimer();
    } else {
      this.firstPlay = false;
      this.gameState = 'idle';
    }
  }

  /**
   * Recria o tabuleiro, até a célula que o utilizador clicou não ter uma mina.
   * @param cell Célula com a mina.
   * @returns Nova célula, sem mina.
   */
  recreateBoard(cell: Cell): Cell {
    let newCell: Cell

    do {
      this.start(this.currentBoardSettings!)
      newCell = this.board.cells[cell.row][cell.column]
    } while (newCell.mine)

    return newCell;
  }

  /**
   * Reset ao tabuleiro. Começa um novo jogo.
   * @returns Nada, caso não existam definições de tabuleiro.
   */
  reset() {
    // Se não existir definições de tabuleiro, não faz nada
    if (!this.currentBoardSettings) {
      return;
    }

    this.start(this.currentBoardSettings)
  }

  /**
   * Acaba o jogo.
   */
  setGameOver() {
    this.board.result = 'gameover';
    this.gameState = 'lost';
    this.stopTimer();
    this.board.revealAll();
  }
}
