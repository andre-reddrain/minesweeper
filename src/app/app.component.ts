import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Board } from './game/board'
import { Cell } from './game/cell';
import { BoardSettings } from './game/boardSettings';

import { GameSettingsComponent } from './game-settings/game-settings.component';

type GameState = 'idle' | 'pressed' | 'lost' | 'won';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, ButtonModule, DialogModule, FormsModule, GameSettingsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Dialog
  visible: boolean = false;

  // BoardSettings
  currentBoardSettings: BoardSettings | undefined;

  // Debug Variables
  isDebug = false;
  numbers = [1,2,3,4,5,6,7,8];
  specialChars = ['`', '*', "\u{1F60E}", "\u{1F62E}", "\u{1F635}", "\u{1F642}"];

  title = 'Minesweeper';
  board = new Board();

  // Variáveis de UI - Emoji Face
  gameState: GameState = 'idle';

  // Variáveis de timer
  seconds = 0;
  private intervalId: any;

  get formattedSeconds(): string {
    return this.seconds.toString().padStart(3, '0');
  }

  /**
   * Define as definições do tabuleiro iniciais, e cria um tabuleiro com elas.
   */
  ngOnInit() {
    this.currentBoardSettings = {
      cols: 9,
      rows: 9,
      mines: 10,
      timer: 999
    }

    this.board = new Board(
      this.currentBoardSettings.cols,
      this.currentBoardSettings.rows,
      this.currentBoardSettings.mines,
      this.currentBoardSettings.timer
    );
  }

  /**
   * Verifica a célula, e determina o estado do jogo.
   * @param cell Célula a ser verificada
   */
  checkCell(cell: Cell) {
    console.log(this.board.result)

    if (this.board.result === 'ongoing' || this.board.result === 'start') {
      if (this.board.result === 'start') {
        this.board.result = 'ongoing';

        this.startTimer();
      }

      this.board.result = this.board.checkCell(cell);
      console.log(this.board.result)
      
      if (this.board.result === 'gameover') {
        this.gameState = 'lost';
        this.stopTimer();
      } else if (this.board.result === 'win') {
        this.gameState = 'won';
        this.stopTimer();
      } else {
        this.gameState = 'idle';
      }
    }
  }

  /**
   * Transforma uma célula numa flag
   * @param cell Célula a ser transformada numa flag
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
   * Verifica o estado do jogo.
   * @param result Resultado do Jogo
   */
  checkGameState(result : string | null) {
    // console.log(result);
    if (result === 'gameover' || result == 'win') {
      this.reset();
    }
  }

  /**
   * Começa o timer. Vai aplicar regras, dependendo do valor do timer.
   * Se o timer for 999, incrementa de 0 até 999
   * Se o timer for diferente de 999, decrementa do valor até 0
   */
  startTimer() {
    this.stopTimer();

    const timer = this.currentBoardSettings?.timer;

    if (timer !== undefined && timer !== 999) {
      this.seconds = timer;
      this.intervalId = setInterval(() => {
        this.seconds--;

        if (this.seconds === 0) {
          this.setGameOver();
        }
      }, 1000)
    } else {
      this.seconds = 0;

      this.intervalId = setInterval(() => {
        this.seconds++;

        if (this.seconds === 999) {
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
   * Altera o estado do jogo para corresponder ao icon de jogada.
   * Prevente que esta alteração seja feita pelo Right Click.
   * @param event MouseEvent
   * @returns n/A
   */
  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;

    if (this.board.result === 'ongoing') {
      this.gameState = 'pressed';
    }
  }

  /**
   * Reset ao tabuleiro. Começa um novo jogo
   */
  reset() {
    // Se não existir definições de tabuleiro, não faz nada
    if (!this.currentBoardSettings) {
      return
    }

    this.createBoard(this.currentBoardSettings)
    this.gameState = 'idle';
  }

  /**
   * Mostra a Dialog
   */
  showDialog() {
    this.visible = !this.visible;
  }

  /**
   * Recolhe as definições do tabuleiro definidas na modal, e guarda-as no componente.
   * @param settings Definições do tabuleiro
   */
  onBoardSettings(settings: BoardSettings) {
    this.currentBoardSettings = settings;
    this.createBoard(settings);
    this.stopTimer();
  }

  /**
   * Cria o tabuleiro, com as definições corretas
   * @param settings Definições do tabuleiro
   */
  createBoard(settings: BoardSettings) {
    this.board = new Board(
      settings.cols,
      settings.rows,
      settings.mines,
      settings.timer
    )
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
