import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'

interface Difficulty {
  name: string;
  col: number;
  row: number;
  mine: number;
}

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [ButtonModule, DialogModule, SelectModule, FormsModule, InputNumberModule],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss'
})

export class GameStartComponent {
  @Input() visible: boolean = false;
  difficulties: Difficulty[] | undefined;
  selectedDifficulty: Difficulty | undefined;
  
  // Vars to control UI
  userInput: boolean = false;

  // Temp variables for binding
  colValue: number | null = null;
  rowValue: number | null = null;
  mineValue: number | null = null;

  ngOnInit() {
    this.difficulties = [
      { name: "Beginner", col: 9, row: 9, mine: 10 },
      { name: "Intermediate", col: 16, row: 16, mine: 40 },
      { name: "Expert", col: 30, row: 16, mine: 99 },
      { name: "Custom", col: 0, row: 0, mine: 0 },
    ]
  }

  onValueChange(difficulty: Difficulty) {
    this.selectedDifficulty = difficulty;

    if (difficulty.name !== 'Custom') {
      this.colValue = difficulty.col;
      this.rowValue = difficulty.row;
      this.mineValue = difficulty.mine;
      this.userInput = false;
    } else {
      this.colValue = null;
      this.rowValue = null;
      this.mineValue = null;
      this.userInput = true;
    }
  }

  get canStart(): boolean {
    return (
      this.colValue !== null &&
      this.rowValue !== null &&
      this.mineValue !== null
    );
  }

  //
  startGame() {
    console.log("Let the game begin!")
  }
}
