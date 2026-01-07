import { Component } from '@angular/core';
import { Board } from './game/board'
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Cell } from './game/cell';
import { GameOverComponent } from "./game-over/game-over.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, GameOverComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Debug Variables
  isDebug = false;
  numbers = [1,2,3,4,5,6,7,8];
  specialChars = ['`', '*', "\u{1F60E}", "\u{1F62E}", "\u{1F635}", "\u{1F642}"];

  title = 'Minesweeper';
  board = new Board(30, 30, 200);
  boardResult = '';

  // TODO Difficulties:
  // 10 on Beginner (9x9 grid), 40 on Intermediate (16x16 grid), and 99 on Expert (30x16 grid) & Custom (max 30, any bombs)

  checkCell(cell: Cell) {
    if (this.board.result === null) {
      this.board.result = this.board.checkCell(cell);
      // console.log(this.result)
      
      if (this.board.result === 'gameover') {
        this.boardResult = 'You lose!';
      } else if (this.board.result === 'win') {
        this.boardResult = 'You win!';
      }
    }
  }

  flag(cell: Cell) {
    if (this.board.result === null) {
      if(cell.status === 'flag') {
        cell.status = 'open';
      } else if (cell.status !== 'clear') {
        cell.status = 'flag';
      }
    }
  }

  reset() {
    this.board = new Board(5, 5, 5);
    this.boardResult = '';
  }
}
