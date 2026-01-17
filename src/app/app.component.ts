import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { GameHeaderComponent } from "./game-header/game-header.component";
import { GameBoardComponent } from "./game-board/game-board.component";

import { GameService } from './game/services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ButtonModule, DialogModule, FormsModule, GameHeaderComponent, GameBoardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(public game: GameService) {}

  // Debug Variables
  isDebug = false;
  numbers = [1,2,3,4,5,6,7,8];
  specialChars = ['`', '*', "\u{1F60E}", "\u{1F62E}", "\u{1F635}", "\u{1F642}"];

  title = 'Minesweeper';
}
