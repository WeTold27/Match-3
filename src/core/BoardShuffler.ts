import Phaser from "phaser";
import Board from "./Board";

export default class BoardShuffler {
    private board: Board;
    private scene: Phaser.Scene;

    constructor(board: Board, scene: Phaser.Scene) {
        this.board = board;
        this.scene = scene;
    }

    // Проверяет, есть ли хотя бы один возможный ход
    hasPossibleMoves(): boolean {
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.getGem(row, col);
                if (!gem) continue;

                const neighbors: [number, number][] = [
                    [row, col + 1],
                    [row + 1, col]
                ];

                for (const [nRow, nCol] of neighbors) {
                    const neighbor = this.board.getGem(nRow, nCol);
                    if (!neighbor) continue;

                    this.board.swapGemPositions(gem, neighbor);
                    const matches = this.board.findMatches();
                    this.board.swapGemPositions(gem, neighbor);

                    if (matches.length > 0) return true;
                }
            }
        }
        return false;
    }

    // Перемешиваем фишки случайным образом
    shuffle() {
        const gems: any[] = [];

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.getGem(row, col);
                if (gem) gems.push(gem);
            }
        }

        Phaser.Utils.Array.Shuffle(gems);

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const gem = gems.pop()!;
                gem.row = row;
                gem.col = col;
                this.board.grid[row][col] = gem;

                this.scene.tweens.add({
                    targets: gem,
                    x: this.board.getX(col),
                    y: this.board.getY(row),
                    duration: 300
                });
            }
        }
    }
}
