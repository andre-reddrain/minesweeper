import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'
import { NgClass } from '@angular/common';

import { BoardSettings } from '../game/boardSettings';

/**
 * Interface Difficulty.
 */
interface Difficulty {
  name: string;
  col: number;
  row: number;
  mine: number;
  timer: number;
}

@Component({
  selector: 'app-game-settings',
  standalone: true,
  imports: [NgClass, ButtonModule, DialogModule, SelectModule, FormsModule, InputNumberModule],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss'
})

export class GameSettingsComponent {
  // Difficulties
  difficulties: Difficulty[] | undefined;
  selectedDifficulty: Difficulty | undefined;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() boardSettings = new EventEmitter<BoardSettings>();

  // Variáveis para controlar a UI
  userInput: boolean = false;

  // Variáveis temporárias para binding
  colValue: number | null = null;
  rowValue: number | null = null;
  mineValue: number | null = null;
  timerValue: number | null = null;

  // Variáveis para controlo de inputs
  MIN_ROWS = 5;
  MIN_COLS = 5;
  MAX_ROWS = 30;
  MAX_COLS = 30;
  MIN_MINES = 1;
  MAX_TIMER = 999;
  MIN_TIMER = 1;

  /**
   * Quando é inicializado, vai popular as difficuldades.
   */
  ngOnInit() {
    this.difficulties = [
      { name: "Beginner", col: 9, row: 9, mine: 10, timer: 999 },
      { name: "Intermediate", col: 16, row: 16, mine: 40, timer: 999 },
      { name: "Expert", col: 30, row: 16, mine: 99, timer: 999 },
      { name: "Custom", col: 0, row: 0, mine: 0, timer: 0 },
    ]
  }

  /**
   * Dependente da dificuldade selecionada, vai atualizar as várias variáveis de binding e elementos de UI.
   * @param difficulty Difficuldade selecionada
   */
  onValueChange(difficulty: Difficulty) {
    this.selectedDifficulty = difficulty;

    if (difficulty.name !== 'Custom') {
      this.colValue = difficulty.col;
      this.rowValue = difficulty.row;
      this.mineValue = difficulty.mine;
      this.timerValue = difficulty.timer;
      this.userInput = false;
    } else {
      this.colValue = null;
      this.rowValue = null;
      this.mineValue = null;
      this.timerValue = null;
      this.userInput = true;
    }
  }

  /**
   * Boolean composto por 4 outros booleans.
   * Só é true quando os valores das colunas, linhas, minas e timer forem diferentes de null.
   */
  get canStart(): boolean {
    return (
      (this.colValue !== null && !this.isColsInvalid) &&
      (this.rowValue !== null && !this.isRowsInvalid) &&
      (this.mineValue !== null && !this.isMinesInvalid) &&
      (this.timerValue !== null && !this.isTimerInvalid)
    );
  }

  // Wip
  startGame() {
    if (this.isRowsInvalid || this.isColsInvalid || this.isMinesInvalid || this.isTimerInvalid) {
      
    } else {
      // Vai começar o jogo
      this.visible = false;
      this.boardSettings.emit({
        rows: this.rowValue!,
        cols: this.colValue!,
        mines: this.mineValue!,
        timer: this.timerValue!
      });
    }
  }

  /**
   * Fecha a Dialog.
   * É corrido cada vez que a p-dialog se esconde (onHide).
   */
  close() {
    // Devolve para o componente-pai a variável como false
    this.visibleChange.emit(false);
  }

  /**
   * Boolean para controlar o input - Rows
   */
  get isRowsInvalid(): boolean {
    if (this.rowValue === null) {
      return false;
    }
    return this.rowValue < this.MIN_ROWS || this.rowValue > this.MAX_ROWS;
  }

  /**
   * Boolean para controlar o input - Cols
   */
  get isColsInvalid(): boolean {
    if (this.colValue === null) {
      return false;
    }
    return this.colValue < this.MIN_COLS || this.colValue > this.MAX_COLS;
  }

  /**
   * Boolean para controlar o input - Mines
   */
  get isMinesInvalid(): boolean {
    if (this.mineValue === null) {
      return false;
    }
    return this.mineValue < this.MIN_MINES;
  } 

  /**
   * Boolean para controlar o input - Timer
   */
  get isTimerInvalid(): boolean {
    if (this.timerValue === null) {
      return false;
    }
    return this.timerValue < this.MIN_TIMER || this.timerValue > this.MAX_TIMER;
  } 
}
