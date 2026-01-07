import { Cell } from './cell'

const PROXIMITY = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export class Board {
    cells: Cell[][] = []
    remainingCells = 0;
    mineCount = 0;
    result: string | null = null;

    constructor(rows: number, cols: number, mines: number) {
        // Rows
        for (let row = 0; row < rows; row++) {
            this.cells[row] = [];

            // Cols
            for (let col = 0; col < cols; col++) {
                this.cells[row][col] = new Cell(row, col);
            }
        }

        // Assign Mines
        for (let i = 0; i < mines; i++) {
            this.getRandomCell().mine = true;
        }

        // Count mines
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let adjacentMines = 0;

                for (let prox of PROXIMITY) {
                    if (
                        this.cells[row + prox[0]] &&
                        this.cells[row + prox[0]][col + prox[1]] &&
                        this.cells[row + prox[0]][col + prox[1]].mine
                    ) {
                        adjacentMines++
                    }
                }
                this.cells[row][col].proximityMines = adjacentMines;

                if (this.cells[row][col].mine) {
                    this.mineCount++;
                }
            }
        }
        this.remainingCells = (rows * cols) - this.mineCount;
    }

    getRandomCell(): Cell {
        const row = Math.floor(Math.random() * this.cells.length);
        const col = Math.floor(Math.random() * this.cells[row].length);
        return this.cells[row][col]
    }

    checkCell(cell: Cell): string | null {
        // console.log(cell);
        let condition = '';

        if (cell.status !== "open") {
            //condition = null;
            return null;
        } else if (cell.mine) {
            this.revealAll();
            condition = 'gameover';
        } else {
            cell.status = "clear";

            if(cell.proximityMines === 0) {
                for (let prox of PROXIMITY) {
                    if (
                        this.cells[cell.row + prox[0]] &&
                        this.cells[cell.row + prox[0]][cell.column + prox[1]]
                    ) {
                        this.checkCell(this.cells[cell.row + prox[0]][cell.column + prox[1]])
                    }
                }
            }

            if(this.remainingCells-- <= 1) {
                condition = 'win';
            }
        }

        if (condition !== '') {
            this.revealAll();
            return condition;
        }

        return null;
    }

    revealAll() {
        for (const row of this.cells) {
            for (const cell of row) {
                // if (cell.status === 'open') {
                //     cell.status = 'clear';
                // }
                if (cell.mine) {
                    cell.status = 'clear';
                }
            }
        }
    }
}