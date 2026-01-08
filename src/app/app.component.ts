import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Board } from './game/board'
import { Cell } from './game/cell';

import { GameStartComponent } from './game-start/game-start.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, ButtonModule, DialogModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Dialog
  visible: boolean = false;

  showDialog() {
    console.log('Dialog open attempt')
    this.visible = true;
  }

  // Debug Variables
  isDebug = false;
  numbers = [1,2,3,4,5,6,7,8];
  specialChars = ['`', '*', "\u{1F60E}", "\u{1F62E}", "\u{1F635}", "\u{1F642}"];

  title = 'Minesweeper';
  board = new Board(9, 9, 10);
  resultMessage = 'New Game';
  boardVariables = [0, 0, 0]

  // Variáveis de UI - Emoji Face
  startIcon = "\u{1F642}";
  playIcon = "\u{1F62E}";
  winIcon = "\u{1F60E}";
  loseIcon = "\u{1F635}";

  gameStateIcon = this.startIcon;

  // TODO Difficulties:
  // 10 on Beginner (9x9 grid), 40 on Intermediate (16x16 grid), and 99 on Expert (30x16 grid) & Custom (max 30, any bombs)

  /**
   * Verifica a célula, e determina o estado do jogo.
   * @param cell Célula a ser verificada
   */
  checkCell(cell: Cell) {
    this.gameStateIcon = this.playIcon;

    if (this.board.result === 'ongoing') {
      this.board.result = this.board.checkCell(cell);
      console.log(this.board.result)
      
      if (this.board.result === 'gameover') {
        this.resultMessage = 'You lose!';
        this.gameStateIcon = this.loseIcon;
      } else if (this.board.result === 'win') {
        this.resultMessage = 'You win!';
        this.gameStateIcon = this.winIcon;
      } else {
        this.gameStateIcon = this.startIcon;
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

  checkGameState(result : string | null) {
    console.log(result);
    if (result === 'gameover' || result == 'win') {
      this.reset();
    } else if (result === 'start') {
      // Open GameStartComponent
    }
  }

  /**
   * Reset ao tabuleiro. Começa um novo jogo
   */
  reset() {
    this.board = new Board(5, 5, 5);
    this.resultMessage = '';
    this.gameStateIcon = this.startIcon;
  }
}
